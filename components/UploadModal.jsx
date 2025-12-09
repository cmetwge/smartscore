'use client'
import { X } from 'lucide-react'
import UploadBox from './UploadBox'

export default function UploadModal({ isOpen, onClose, tier }) {
  if (!isOpen) return null

  const tierNames = {
    smartscore: 'SmartScore™ ($9)',
    calibration: 'Team Calibration ($29)',
    pilot: 'Harmony Pilot ($497)',
    pro: 'Harmony Pro ($1,497)',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-[#1F2225] rounded-3xl shadow-2xl border border-[#23E0D8]/50">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <X size={32} />
        </button>

        <div className="p-12 text-center">
          <h2 className="text-5xl font-black mb-4">
            {tierNames[tier] || 'Upload Your Files'}
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Drag scorecards + voice recordings below
          </p>

          <div className="bg-[#2F3136] rounded-2xl p-8 border-2 border-solid border-[#23E0D8]/50">
            <UploadBox tier={tier} onSuccess={onClose} />
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Your report will be generated instantly after upload
          </p>
        </div>
      </div>
    </div>
  )
}