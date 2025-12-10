// src/app/demo-login/page.jsx
import { default as Link } from 'next/link'

export default function DemoLogin() {
  return (
    <main className="pt-32 px-6 text-center">
      <h1 className="text-5xl font-black mb-8">intelQA™ Demo Access</h1>
      <p className="text-xl text-gray-400">
        This area is private. Add <code>?pass=intelqa2025</code> to the URL to enter.
      </p>
      <Link href="/" className="mt-8 inline-block text-[#23E0D8]">← Back to main site</Link>
    </main>
  )
}