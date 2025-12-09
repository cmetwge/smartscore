// src/app/demo/page.jsx
'use client';

import UploadBox from '@/components/UploadBox';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1114] to-black pt-20 px-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-black bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] bg-clip-text text-transparent mb-8">
          Demo Mode – Full Pro Access Unlocked
        </h1>
        <p className="text-2xl text-gray-300 mb-12">
          Upload any call → get full calibration, drift map, SmartScore™, fixes, voice analysis — everything.
        </p>

        {/* THIS IS YOUR REAL UPLOAD BOX — FULLY UNLOCKED */}
        <UploadBox tier="smartscore" bypassPayment={true} />
      </div>
    </div>
  );
}