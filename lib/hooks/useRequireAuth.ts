'use client'

import { useUser } from '@/lib/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook para proteger rotas administrativas
 * Redireciona para /login se o usuário não estiver autenticado
 */
export function useRequireAuth() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  return { user, loading, isAuthenticated: !!user }
}

