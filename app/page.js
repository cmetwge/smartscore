"use client";
import { useState } from "react";
import { Upload, FileText, Mail, Disc } from 'lucide-react'; // Ensure 'lucide-react' is installed: npm install lucide-react

// IMPORTANT: Replace this placeholder with your actual Supabase project reference
const SUPABASE_PROJECT_REF = "YOUR_PROJECT_REF"; 

// --- Component for the Three File Type Cards ---
function FileTypeCard({ icon, title, types, description, isActive }) {
    const baseClasses = "p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center text-center h-full cursor-pointer";
    const activeClasses = "border-blue-500 bg-blue-50 shadow-lg text-blue-700";
    const inactiveClasses = "border-gray-200 bg-white hover:border-blue-300 text-gray-700";
    
    return (
        <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <div className={`text-4xl mb-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-3">{description}</p>
            <p className="text-xs font-mono text-gray-400 mt-auto">{types}</p>
        </div>
    );
}

// --- Component for the 3-Step "How It Works" Section ---
function HowItWorksStep({ step, title, description }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold mb-3">
                {step}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

// --- Main Form and Page Content ---

export default function Home() {
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [reportLink, setReportLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setStatus("Please select at least one file to upload.");
      return;
    }
    
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("email", email);
    for (const file of files) formData.append("files", file);

    // Call the /api/upload endpoint
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      setStatus(`Upload failed: ${uploadData.error || 'Server error'}`);
      return;
    }

    setStatus("Analyzing files (this may take a minute for audio/PDFs)...");
    
    // Call the /api/analyze endpoint
    const analyzeRes = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        email,
        files: uploadData.files,
      }),
    });

    const result = await analyzeRes.json();

    if (result.success) {
      setStatus("Report generated successfully!");
      setReportLink(
        `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/${result.pdfPath}`
      );
    } else {
      setStatus(`Analysis failed: ${result.error || 'An unexpected error occurred during analysis.'}`);
    }
  };
  
  // Custom file selection for better UX
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setStatus(files.length > 0 ? "" : "Ready to analyze.");
    setReportLink("");
  };

  return (
    <div className="w-full pt-12 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header and Subtitle */}
        <header className="text-center pt-8 pb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                Upload Your Files
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload call recordings, chat transcripts, or email text files to generate comprehensive QA reports. No setup required, instant analysis.
            </p>
        </header>

        {/* File Type Cards and Upload Form */}
        <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
            <div className="space-y-10">
                <h2 className="text-center text-2xl font-semibold text-gray-800">Select File Type</h2>
                
                {/* Three Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FileTypeCard 
                        icon={<Disc className="w-8 h-8"/>}
                        title="Call Recording"
                        description="Upload audio files from customer calls."
                        types="MP3, WAV, M4A, FLAC, OGG"
                        isActive={true}
                    />
                    <FileTypeCard 
                        icon={<FileText className="w-8 h-8"/>}
                        title="Chat Transcript"
                        description="Upload chat logs and conversation transcripts."
                        // UPDATED: Now includes image files for chat screenshots
                        types="TXT, PDF, JPG, PNG" 
                        isActive={false}
                    />
                    <FileTypeCard 
                        icon={<Mail className="w-8 h-8"/>}
                        title="Email Text"
                        description="Upload email conversations and text files."
                        // Updated for consistency
                        types="TXT, PDF, JPG, PNG (screenshots)" 
                        isActive={false}
                    />
                </div>
                
                {/* Drag & Drop Area and Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-4 border-dashed border-gray-300 rounded-xl p-10 text-center relative hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-700">Drag & drop your file here</p>
                        <p className="text-sm text-gray-500 mb-4">or click to select a file from your computer</p>
                        
                        {/* Hidden file input that covers the whole drag area */}
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            // Functional 'accept' attribute already includes all required types
                            accept=".txt,.pdf,.mp3,.wav,.flac,.m4a,.jpeg,.jpg,.png"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">Maximum file size: 50MB (OpenAI limit)</p>
                    </div>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email for Report Delivery (Optional)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />

                    <button
                        type="submit"
                        disabled={files.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {files.length > 0 ? `Generate ${files.length} File Report →` : "Generate QA Snapshot"}
                    </button>
                    
                    <div className="text-center mt-4">
                        {status && <p className={`font-medium ${status.includes('failed') ? 'text-red-500' : 'text-gray-600'}`}>{status}</p>}
                        {reportLink && (
                            <a
                                href={reportLink}
                                target="_blank"
                                className="text-blue-600 underline font-medium block mt-4"
                            >
                                View My QA Report
                            </a>
                        )}
                    </div>
                </form>
            </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12">
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                <HowItWorksStep
                    step={1}
                    title="Upload File"
                    description="Select your audio or text files and input your delivery email."
                />
                <HowItWorksStep
                    step={2}
                    title="AI Analysis"
                    description="Our advanced AI transcribes audio and analyzes content for quality metrics."
                />
                <HowItWorksStep
                    step={3}
                    title="Get Report"
                    description="Receive detailed QA reports with actionable insights and recommendations."
                />
            </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
                <p className="text-lg font-bold mb-2">SmartScore QA</p>
                <p className="text-gray-400">
                    Professional QA report generation for call recordings, chat transcripts, and email communications. No setup required, no software installation needed.
                </p>
            </div>
            <div>
                <h4 className="text-md font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-1 text-gray-400">
                    <li><a href="#" className="hover:text-blue-400">Home</a></li>
                    <li><a href="#" className="hover:text-blue-400">Upload Files</a></li>
                    <li><a href="#" className="hover:text-blue-400">View Reports</a></li>
                    <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-md font-semibold mb-3">Legal & Social</h4>
                <ul className="space-y-1 text-gray-400">
                    <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-blue-400">Terms and Conditions</a></li>
                    {/* Placeholder for social icons */}
                    <li className="flex space-x-3 mt-2">
                        <span className="hover:text-blue-400">in</span>
                        <span className="hover:text-blue-400">t</span>
                    </li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-xs mt-8 pt-4 border-t border-gray-700">
            © 2025 SmartScore QA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}