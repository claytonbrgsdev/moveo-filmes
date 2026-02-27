'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FilmeListItem } from './page'
import { FilmesList } from './components/FilmesList'
import { FilmeForm } from './components/FilmeForm'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

type View = 'list' | 'create' | 'edit'

interface CentralClientProps {
  initialFilmes: FilmeListItem[]
  userEmail: string
}

export default function CentralClient({ initialFilmes, userEmail }: CentralClientProps) {
  const router = useRouter()
  const [view, setView] = useState<View>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filmes, setFilmes] = useState<FilmeListItem[]>(initialFilmes)
  const [refreshing, setRefreshing] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const refreshFilmes = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/filmes')
      if (res.ok) {
        const data = await res.json()
        setFilmes(data)
      }
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleEdit = useCallback((id: string) => {
    setEditingId(id)
    setView('edit')
  }, [])

  const handleSaved = useCallback(async () => {
    await refreshFilmes()
    setView('list')
    setEditingId(null)
  }, [refreshFilmes])

  const handleCancel = useCallback(() => {
    setView('list')
    setEditingId(null)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div
      className="relative min-h-screen bg-black text-white"
      style={{ fontFamily: FONT_BODY }}
    >
      {/* Top border line */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ top: '50px' }} />
      {/* Bottom border line */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ bottom: '50px' }} />

      {/* Main content area */}
      <div
        className="relative"
        style={{
          margin: '50px',
          minHeight: 'calc(100vh - 100px)',
          paddingTop: '24px',
          paddingBottom: '24px',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <h1
              className="text-white mb-1"
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 'clamp(28px, 3vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Admin
            </h1>
            <p className="text-white/40" style={{ fontFamily: FONT_BODY, fontSize: '12px' }}>
              Moveo Filmes — Painel de Controle
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* User email chip */}
            <span
              className="text-white/50 text-xs px-3 py-1.5"
              style={{
                fontFamily: FONT_BODY,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {userEmail}
            </span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-white/50 hover:text-white transition-colors text-xs px-3 py-1.5"
              style={{
                fontFamily: FONT_BODY,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {loggingOut ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <button
            onClick={() => { setView('list'); setEditingId(null) }}
            className="transition-colors pb-3 pr-6 text-sm"
            style={{
              fontFamily: FONT_BODY,
              color: view === 'list' ? 'white' : 'rgba(255,255,255,0.35)',
              borderBottom: view === 'list' ? '1px solid white' : '1px solid transparent',
              marginBottom: '-1px',
            }}
          >
            Filmes {refreshing ? '…' : `(${filmes.length})`}
          </button>

          <button
            onClick={() => { setView('create'); setEditingId(null) }}
            className="transition-colors pb-3 px-6 text-sm"
            style={{
              fontFamily: FONT_BODY,
              color: view === 'create' ? 'white' : 'rgba(255,255,255,0.35)',
              borderBottom: view === 'create' ? '1px solid white' : '1px solid transparent',
              marginBottom: '-1px',
            }}
          >
            + Novo Filme
          </button>

          {view === 'edit' && (
            <span
              className="pb-3 px-6 text-sm"
              style={{
                fontFamily: FONT_BODY,
                color: 'white',
                borderBottom: '1px solid white',
                marginBottom: '-1px',
              }}
            >
              Editando filme
            </span>
          )}
        </div>

        {/* Content */}
        {view === 'list' && (
          <FilmesList
            filmes={filmes}
            onEdit={handleEdit}
            onDeleted={refreshFilmes}
            loading={refreshing}
          />
        )}

        {(view === 'create' || view === 'edit') && (
          <FilmeForm
            filmeId={view === 'edit' ? editingId ?? undefined : undefined}
            onSave={handleSaved}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
