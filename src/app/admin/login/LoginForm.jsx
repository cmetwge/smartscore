// src/app/admin/login/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();               // ← NEW

  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'demo123';

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== CORRECT_PASSWORD) {
      alert('Wrong password');
      setIsLoading(false);
      return;
    }

    // Set the demo cookie
    document.cookie = 'admin-auth=true; path=/; max-age=86400; SameSite=Lax';

    // ──────────────── THIS IS THE IMPROVEMENT ────────────────
    // Reads ?redirect=/demo-score or whatever was passed
    const redirectTo = searchParams.get('redirect') || '/demo';
    // ────────────────────────────────────────────────────────

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoFocus
        className="w-full px-6 py-4 bg-[#1F2225] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3E8EFF] focus:ring-offset-2 focus:ring-offset-[#2F3136]"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-5 bg-gradient-to-r from-[#3E8EFF] to-[#23E0D8] rounded-xl font-bold text-white uppercase tracking-wider hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Checking…' : 'Enter Demo Mode'}
      </button>
    </form>
  );
}