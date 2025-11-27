import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * User Management Utilities
 * Conforme documentação do Supabase Auth API
 */

/**
 * Get the JSON object for the logged in user
 * Documentação: https://supabase.com/docs/reference/javascript/auth-getuser
 */
export async function getUser(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
    return { user: null, error: errorMessage }
  }
}

/**
 * Update the user with a new email or password
 * Documentação: https://supabase.com/docs/reference/javascript/auth-updateuser
 */
export async function updateUser(params: {
  email?: string
  password?: string
  data?: Record<string, unknown>
}): Promise<{ user: User | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.updateUser(params)
    
    if (error) {
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
    return { user: null, error: errorMessage }
  }
}

/**
 * Log out the current user
 * After calling log out, all interactions using the Supabase JS client will be "anonymous"
 * Documentação: https://supabase.com/docs/reference/javascript/auth-signout
 */
export async function logout(): Promise<{ error: Error | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    return { error }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error : new Error('Erro desconhecido');
    return { error: errorMessage }
  }
}

