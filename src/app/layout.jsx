'use client'
import './globals.css'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Reports & Pricing', href: '/reports' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <html lang="en">
      <body className="bg-[#1F2225] text-white min-h-screen flex flex-col">
        {/* HEADER */}
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

        <main className="flex-1 pt-20">{children}</main>

        {/* FOOTER */}
        <footer className="bg-[#1F2225] border-t border-[#3E8EFF]/20 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-xl font-bold mb-4">intelQA™</h3>
              <p className="text-[#C7CCD6]">Calibration Intelligence™ for Revenue Teams</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-[#C7CCD6]">
                <li><Link href="/reports" className="hover:text-[#23E0D8]">Reports & Pricing</Link></li>
                <li><Link href="/about" className="hover:text-[#23E0D8]">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[#C7CCD6]">
                <li><Link href="/about" className="hover:text-[#23E0D8]">About</Link></li>
                <li><Link href="/contact" className="hover:text-[#23E0D8]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-[#C7CCD6]">
                <li><Link href="/privacy" className="hover:text-[#23E0D8]">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-[#23E0D8]">Terms</Link></li>
              </ul>
            </div>
          </div>
          <p className="text-center text-[#C7CCD6] mt-10 text-sm">
            © 2025 intelQA™ — All rights reserved
          </p>
        </footer>
      </body>
    </html>
  )
}