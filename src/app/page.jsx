// src/app/page.tsx
import { default as Link } from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* HERO */}
      <section className="pt-32 pb-24 text-center">
        <div className="inline-block bg-[#23E0D8]/10 px-6 py-2 rounded-full text-[#23E0D8] font-bold mb-8">
          WORLD’S FIRST CALIBRATION INTELLIGENCE™ PLATFORM
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          intelQA™<br />
          <span className="text-[#3E8EFF]">Calibration Intelligence</span>™
        </h1>
        <p className="text-2xl mt-8 text-[#C7CCD6] max-w-4xl mx-auto">
          The only AI that reveals <span className="font-bold text-[#23E0D8]">why</span> your evaluators disagree on emotion, compliance, and standards — turning QA chaos into harmony.
        </p>
        <Link href="/reports" className="inline-block mt-12 px-16 py-8 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-xl text-3xl font-black hover:scale-105 transition">
          Get Your Harmony Intelligence Report™
        </Link>
      </section>

      {/* WHY IT MATTERS — PROOF + EDUCATION */}
      <section className="py-20 bg-[#2F3136]/30 rounded-3xl">
        <h2 className="text-4xl font-black text-center mb-12">Your QA Team Is Misaligned (And It’s Costing You)</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
            <p className="text-5xl font-black text-red-400">41%</p>
            <p className="mt-4 text-[#C7CCD6]">average scoring drift in contact centers (Observe.AI 2024)</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-8">
            <p className="text-5xl font-black text-orange-400">68%</p>
            <p className="mt-4 text-[#C7CCD6]">of failing calls mis-scored due to emotional tone</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-8">
            <p className="text-5xl font-black text-purple-400">$0</p>
            <p className="mt-4 text-[#C7CCD6]">tools today fix evaluator alignment at scale</p>
          </div>
        </div>
        <p className="text-center mt-12 text-xl text-[#C7CCD6] max-w-4xl mx-auto">
          CX leaders know something’s wrong — scores vary, compliance slips, tone gets ignored. But no one can prove it.<br />
          intelQA™ gives you the data + the fix in one report.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <h2 className="text-5xl font-black text-center mb-16">How intelQA™ Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#3E8EFF] to-[#23E0D8] rounded-full flex items-center justify-center text-5xl font-black">1</div>
            <h3 className="text-2xl font-bold">Upload Your Data</h3>
            <p className="mt-4 text-[#C7CCD6]">Scorecards, transcripts, recordings — any format.</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#23E0D8] to-[#3E8EFF] rounded-full flex items-center justify-center text-5xl font-black">2</div>
            <h3 className="text-2xl font-bold">AI Analyzes Everything</h3>
            <p className="mt-4 text-[#C7CCD6]">Emotion, compliance, bias, drift — in 30 seconds.</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#3E8EFF] to-[#23E0D8] rounded-full flex items-center justify-center text-5xl font-black">3</div>
            <h3 className="text-2xl font-bold">Get Executive Insight</h3>
            <p className="mt-4 text-[#C7CCD6]">10-page Harmony Intelligence Report™ with heatmaps, risks, and 30-day plan.</p>
          </div>
        </div>
      </section>
    </div>
  )
}