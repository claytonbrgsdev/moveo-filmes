'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.refresh()
      return { data, error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      router.refresh()
      router.push('/')
      return { error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading,
  }
}

