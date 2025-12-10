'use client'
import { default as Link } from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Reports & Pricing', href: '/reports' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1F2225]/90 backdrop-blur-md border-b border-[#3E8EFF]/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3E8EFF] to-[#23E0D8] rounded-lg" />
          <span className="text-2xl font-black">intelQA™</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map(item => (
            <Link key={item.name} href={item.href} className="text-[#C7CCD6] hover:text-[#23E0D8] font-medium transition">
              {item.name}
            </Link>
          ))}
          <Link href="/reports" className="px-6 py-3 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-lg font-bold hover:scale-105 transition">
            Get Started
          </Link>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#1F2225]/95 backdrop-blur-md border-t border-[#3E8EFF]/20">
          <div className="px-6 py-8 space-y-6">
            {nav.map(item => (
              <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className="block text-xl text-[#C7CCD6] hover:text-[#23E0D8]">
                {item.name}
              </Link>
            ))}
            <Link href="/reports" className="block text-center py-4 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-lg font-bold text-xl">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
