'use client'
import { useState } from 'react'
import UploadModal from '@/components/UploadModal'

export default function Reports() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState('')

  const openModal = (tier) => {
    setSelectedTier(tier)
    setModalOpen(true)
  }

  const tiers = [
    {
      name: 'SmartScore™',
      price: '$9',
      limit: '1 call',
      desc: 'Instant AI score + transcript',
      tierKey: 'smartscore',
      voice: true,
    },
    {
      name: 'Team Calibration',
      price: '$29',
      limit: 'Up to 30 evals',
      desc: 'Drift map + top 3 fixes',
      tierKey: 'calibration',
      voice: true,
      popular: true,
    },
    {
      name: 'Harmony Pilot',
      price: '$497',
      limit: 'Up to 100 evals',
      desc: 'Full 10-page report',
      tierKey: 'pilot',
      voice: true,
    },
    {
      name: 'Harmony Pro',
      price: '$1,497',
      limit: 'Up to 1,000 evals',
      desc: 'White-label + priority',
      tierKey: 'pro',
      voice: true,
    },
    {
      name: 'Harmony Enterprise',
      price: 'From $4,500',
      limit: '5,000+ · Unlimited',
      desc: 'Analyst + API + SLA',
      tierKey: 'enterprise',
      voice: true,
      cta: 'Book Demo',
      link: '/contact',
    },
  ]

  return (
    <main className="pt-32 px-6 py-24 min-h-screen bg-gradient-to-b from-[#0f1114] to-black">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] bg-clip-text text-transparent">
          Choose Your Report
        </h1>
        <p className="text-2xl text-gray-400 mb-16">
          One drag-and-drop. Zero setup. Works with scorecards + voice recordings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-[#1F2225]/90 backdrop-blur-xl rounded-3xl p-10 border ${
                tier.popular
                  ? 'ring-2 ring-[#23E0D8] scale-105 shadow-2xl shadow-[#23E0D8]/20'
                  : 'border-gray-800'
              } transition-all hover:scale-105`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#23E0D8] text-black px-8 py-2 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-black mb-4">{tier.name}</h3>
              <p className="text-5xl font-black text-[#23E0D8] mb-2">{tier.price}</p>
              <p className="text-gray-400 mb-4">{tier.limit}</p>
              <p className="text-sm text-gray-500 mb-8">{tier.desc}</p>
              {tier.voice && (
                <p className="text-xs text-[#23E0D8] font-bold mb-6">✓ Voice files supported</p>
              )}

              {tier.cta ? (
                <a
                  href={tier.link}
                  className="block w-full py-5 bg-white text-black rounded-xl font-bold text-center hover:bg-gray-200 transition"
                >
                  {tier.cta}
                </a>
              ) : (
                <button
                  onClick={() => openModal(tier.tierKey)}
                  className="w-full py-5 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-xl font-black text-xl hover:shadow-lg hover:shadow-[#23E0D8]/50 transition"
                >
                  Get {tier.price}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-gray-500 mt-20 text-lg">
          Over 5,000 evaluations? <a href="/contact" className="text-[#23E0D8] underline">Contact us for custom pricing</a>
        </p>
      </div>

      <UploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={selectedTier}
      />
    </main>
  )
}