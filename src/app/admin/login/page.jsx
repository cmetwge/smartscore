// src/app/admin/login/page.jsx
'use client';
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1C1F]">
      <div className="w-full max-w-md p-8 bg-[#2F3136] rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Admin / Demo Access</h1>

        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}