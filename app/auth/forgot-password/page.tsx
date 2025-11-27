'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { resetPassword, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-white">Recuperar Senha</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
              placeholder="seu@email.com"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 px-4 rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/login" className="text-white hover:underline">
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  )
}
