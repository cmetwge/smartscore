// src/app/admin/demo/page.jsx
'use client';
import UploadBox from '@/components/UploadBox'
import { redirect } from 'next/navigation'

export default function Demo() {
  // Check if logged in
  if (typeof window !== 'undefined' && localStorage.getItem('intelqa_demo_auth') !== 'true') {
    redirect('/admin/login')
  }

  return (
    <main className="pt-32 px-6 min-h-screen bg-gradient-to-br from-[#1F2225] to-black">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-7xl font-black mb-8 text-[#23E0D8]">
          intelQA™ — Unlimited Demo Mode
        </h1>
        <p className="text-3xl text-gray-300 mb-12">
          Run as many full Harmony Pro reports as you want — 100% free
        </p>

        <div className="bg-[#2F3136]/90 backdrop-blur-xl rounded-3xl p-12 border-4 border-[#23E0D8]/60 shadow-2xl">
          <UploadBox tier="pro" bypassPayment={true} />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('intelqa_demo_auth')
            window.location.href = '/admin/login'
          }}
          className="mt-8 text-red-400 hover:text-red-300 font-bold"
        >
          Logout
        </button>
      </div>
    </main>
  )
}