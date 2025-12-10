import './globals.css'
import NavBar from '../components/NavBar'
import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1F2225] text-white min-h-screen flex flex-col">
        
        <NavBar />

        <main className="flex-1 pt-20">{children}</main>

        {/* FOOTER (server component) */}
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
