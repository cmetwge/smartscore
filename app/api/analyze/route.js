import OpenAI from "openai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import PDFDocument from "pdfkit";
// Note: Removed unused imports 'fetch' from 'node-fetch' and 'fs'.

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = "nodejs";

// Helper function to check for audio file extensions
function isAudio(fileName) {
  const audioExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.ogg', '.webm'];
  return audioExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

// Helper function to check for files that need Vision/OCR processing
function requiresVision(fileName) {
  const visionExtensions = ['.pdf', '.jpeg', '.jpg', '.png'];
  return visionExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

// Helper function to convert Buffer to Base64 string for Vision API
function bufferToBase64(buffer, mimeType) {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function POST(req) {
  try {
    const { email, files } = await req.json();

    if (!email || !files?.length) {
      return NextResponse.json({ error: "Missing email or files" }, { status: 400 });
    }

    let combinedText = "";

    // Loop through all uploaded files
    for (const path of files) {
      const { data, error } = await supabase.storage.from("uploads").download(path);
      if (error) {
        console.error(`Error downloading ${path}:`, error);
        continue;
      }
      
      const fileName = path.split('/').pop();
      
      // Convert the Supabase Blob/Buffer to a standard Buffer for all file handling
      const fileBuffer = await data.arrayBuffer(); 
      const fileBufferConverted = Buffer.from(fileBuffer);
      const mimeType = data.type || 'application/octet-stream';

      if (isAudio(fileName)) {
        // ---- WHISPER TRANSCRIPTION LOGIC (Audio) ----
        
        const audioBlob = new Blob([fileBufferConverted], { type: mimeType });
        const audioFile = new File([audioBlob], fileName, { type: mimeType });

        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
        });
        
        combinedText += transcription.text + "\n";
        console.log(`Successfully transcribed ${fileName}`);

      } else if (requiresVision(fileName)) {
        // ---- VISION/OCR LOGIC (PDFs, JPEGs, PNGs) ----
        
        const base64File = bufferToBase64(fileBufferConverted, mimeType);
        
        const visionPrompt = [
            {
                type: "image_url",
                image_url: { url: base64File },
            },
            {
                type: "text",
                text: "Extract all conversational text from this document/image for quality assurance analysis. Do not include any headers, footers, or non-conversational text.",
            }
        ];
        
        const visionResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: visionPrompt }],
            max_tokens: 4096,
        });

        combinedText += visionResponse.choices[0].message.content + "\n";
        console.log(`Successfully extracted text from ${fileName} using Vision.`);
        
      } else {
        // ---- FALLBACK: Simple Text File Handler (.txt) ----
        const text = fileBufferConverted.toString('utf8');
        combinedText += text + "\n";
      }
    }
    
    // Check if any text was processed before analysis
    if (combinedText.trim() === "") {
        return NextResponse.json({ success: false, message: "No text or audio could be processed for analysis." }, { status: 400 });
    }

    // Ask OpenAI to analyze and score
    const prompt = `
      Analyze the following call/chat/email transcript and provide:
      - Overall QA SmartScore (0–100)
      - Summary of agent tone, professionalism, and compliance
      - Suggestions for improvement
      
      Transcript:
      ${combinedText}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0].message.content;

    // Create PDF report
    const doc = new PDFDocument();
    doc.text(`SmartScore QA Snapshot\n\n${analysis}`);
    doc.end();

    const pdfBuffer = Buffer.concat(await new Promise((resolve) => {
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(buffers));
    }));

    const fileName = `${Date.now()}_QA_Report.pdf`;
    const { data: pdfUpload, error: pdfError } = await supabase.storage
      .from("uploads")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
      });
      
    if (pdfError) {
        console.error("PDF upload error:", pdfError);
        throw new Error("Failed to upload PDF report.");
    }

    return NextResponse.json({
      success: true,
      pdfPath: pdfUpload.path,
      analysis,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}