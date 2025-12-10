import { default as Link } from 'next/link'

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center">
      <h1 className="text-5xl font-black mb-12">Contact Us</h1>
      <p className="text-2xl text-[#C7CCD6] mb-12">
        Ready for enterprise calibration intelligence?<br />
        Email: <a href="mailto:sales@intelqa.ai" className="text-[#23E0D8]">sales@intelqa.ai</a>
      </p>
      <Link href="/reports" className="inline-block px-16 py-8 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-xl text-3xl font-black">
        Get Your Report
      </Link>
    </div>
  )
}