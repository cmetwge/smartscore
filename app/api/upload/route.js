import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

export const runtime = "nodejs"; // Required for file handling
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const form = formidable({ multiples: true });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req.body, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const email = fields.email?.[0];
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const uploadedFiles = [];
    for (const fileKey in files) {
      const file = files[fileKey][0];
      const filePath = file.filepath;
      const fileName = `${Date.now()}_${file.originalFilename}`;

      const { data, error } = await supabase.storage
        .from("uploads") // make sure you created a bucket named “uploads” in Supabase
        .upload(fileName, fs.createReadStream(filePath), {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) throw error;

      uploadedFiles.push(data.path);
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
