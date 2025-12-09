'use client'
import UploadBox from '@/components/UploadBox'   // ← your existing uploader (SmartScore + Calibration + voice)

export default function SmartScorePage() {
  return (
    <main className="pt-32 px-6 py-24 min-h-screen bg-gradient-to-b from-[#1F2225] to-black">
      <div className="max-w-5xl mx-auto text-center">

        {/* Hero */}
        <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] bg-clip-text text-transparent leading-tight">
          SmartScore™<br />
          <span className="text-5xl md:text-6xl text-white">+ Team Calibration</span>
        </h1>

        <p className="text-3xl font-bold text-white mb-6">
          $9 – $29 one-time
        </p>
        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Drag your scorecards + voice recordings<br />
          Get your SmartScore™ + full calibration drift report in 30 seconds
        </p>

        {/* BIG UPLOAD BOX — exactly like your current one */}
        <div className="bg-[#2F3136]/90 backdrop-blur-xl rounded-3xl p-12 border-4 border-[#23E0D8]/60 shadow-2xl">
          <UploadBox tier="smartscore" />   {/* ← this tells your backend to run the $9–$29 flow */}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          <div className="bg-[#2F3136] rounded-xl p-6 ring-1 ring-[#23E0D8]">
            <p className="text-2xl font-black text-[#23E0D8]">$9</p>
            <p className="text-gray-300">Individual SmartScore™</p>
          </div>
          <div className="bg-[#2F3136] rounded-xl p-6 ring-1 ring-[#23E0D8]">
            <p className="text-3xl font-black text-[#23E0D8]">$19</p>
            <p className="text-gray-300">Team Calibration (up to 30 evals)</p>
          </div>
          <div className="bg-[#2F3136] rounded-xl p-6 ring-1 ring-[#23E0D8]">
            <p className="text-2xl font-black text-[#23E0D8]">$29</p>
            <p className="text-gray-300">With voice analysis</p>
          </div>
        </div>

        <p className="text-gray-400 mt-12 text-lg">
          Voice files fully supported • No login • Instant PDF
        </p>

        <a href="/reports" className="inline-block mt-12 text-[#23E0D8] text-2xl underline font-bold hover:text-white transition">
          Need 500–5,000 evaluations? → Harmony Intelligence Report™ ($997+)
        </a>
      </div>
    </main>
  )
}