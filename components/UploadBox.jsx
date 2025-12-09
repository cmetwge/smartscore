// components/UploadBox.jsx
'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'

export default function UploadBox({ tier = "pro" }) {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [email, setEmail] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!email || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('tier', tier)
    files.forEach(file => formData.append('files', file))

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        if (onSuccess) onSuccess()
        window.location.href = data.url // or trigger download
      }
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all
          ${dragging ? 'border-[#23E0D8] bg-[#23E0D8]/10' : 'border-gray-600 bg-[#2F3136]'}`}
      >
        <Upload size={64} className="mx-auto mb-6 text-[#23E0D8]" />
        <p className="text-3xl font-bold mb-4">Drop your scorecards here</p>
        <p className="text-xl text-gray-400 mb-8">
          or <span className="text-[#23E0D8] underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse files</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-8 bg-[#2F3136] rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">{files.length} file(s) selected</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-[#1F2225] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-[#23E0D8]" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email + Submit */}
      {files.length > 0 && (
        <div className="mt-8 space-y-6">
          <input
            type="email"
            placeholder="Your work email (required)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-[#2F3136] rounded-xl text-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#23E0D8]"
          />
          <button
            onClick={handleSubmit}
            disabled={uploading || !email}
            className="w-full py-6 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-xl text-2xl font-black disabled:opacity-50"
          >
            {uploading ? 'Generating Report...' : 'Generate Harmony Report™ → Free First Run'}
          </button>
        </div>
      )}
    </div>
  )
}