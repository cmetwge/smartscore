// src/app/demo-lite/page.jsx
'use client'
import UploadBox from '@/components/UploadBox'

export default function DemoLite() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1114] to-black pt-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] bg-clip-text text-transparent mb-8">
          Try It Free – Instant Result
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Upload one call → get AI score + transcript + top 3 fixes in seconds.
        </p>
        <UploadBox tier="smartscore" bypassPayment={true} />
      </div>
    </div>
  )
}