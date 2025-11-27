'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useUser } from '@/lib/hooks/useUser'
import { useState, useEffect } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { signIn } = useAuth()
  const { user, loading: userLoading } = useUser()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!userLoading && user && !redirecting) {
      window.location.href = '/central'
    }
  }, [user, userLoading, redirecting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Login bem-sucedido, redirecionar para /central
      setRedirecting(true)
      window.location.href = '/central'
    }
  }

  // Mostrar loading enquanto verifica autenticação ou se está redirecionando
  if (userLoading || redirecting || (user && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-black">
        <div className="text-center">
          <p className="text-lg text-white">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">Acesso Administrativo</h1>
          <p className="text-sm text-gray-400">
            Faça login para acessar o painel administrativo
          </p>
        </div>
        
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
              placeholder="admin@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-white">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 px-4 rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
