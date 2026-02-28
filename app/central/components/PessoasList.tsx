'use client'

import { useState } from 'react'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

export interface PessoaListItem {
  id: string
  nome: string
  nome_exibicao: string | null
  slug: string | null
  areas_atuacao: string[] | null
  foto_url: string | null
  visibilidade: string | null
  updated_at: string
}

interface PessoasListProps {
  pessoas: PessoaListItem[]
  onEdit: (id: string) => void
  onDeleted: () => void
  loading: boolean
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `${days}d atrás`
  if (days < 365) return `${Math.floor(days / 30)}m atrás`
  return `${Math.floor(days / 365)}a atrás`
}

export function PessoasList({ pessoas, onEdit, onDeleted, loading }: PessoasListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/pessoas/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      setConfirmId(null)
      onDeleted()
    } catch {
      setDeleteError('Erro ao excluir pessoa')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Carregando…</p>
  }

  if (pessoas.length === 0) {
    return <p className="text-white/20 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Nenhuma pessoa cadastrada ainda.</p>
  }

  return (
    <div>
      {deleteError && (
        <p className="text-red-400 text-xs mb-4" style={{ fontFamily: FONT_BODY }}>{deleteError}</p>
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {pessoas.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Avatar */}
            <div className="w-8 h-8 flex-shrink-0 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {p.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.foto_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-white/20 text-xs" style={{ fontFamily: FONT_HEADING }}>
                    {p.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name + areas */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate" style={{ fontFamily: FONT_BODY }}>
                {p.nome_exibicao || p.nome}
              </p>
              {p.areas_atuacao && p.areas_atuacao.length > 0 && (
                <p className="text-white/30 text-xs truncate" style={{ fontFamily: FONT_BODY }}>
                  {p.areas_atuacao.join(', ')}
                </p>
              )}
            </div>

            {/* Visibility */}
            <span
              className="text-xs px-2 py-0.5 flex-shrink-0 hidden md:block"
              style={{
                fontFamily: FONT_BODY,
                color: p.visibilidade === 'publico' ? 'white' : p.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.8)' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${p.visibilidade === 'publico' ? 'rgba(255,255,255,0.3)' : p.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {p.visibilidade ?? '—'}
            </span>

            {/* Updated */}
            <span className="text-white/25 text-xs flex-shrink-0 hidden lg:block" style={{ fontFamily: FONT_BODY, minWidth: 70 }}>
              {relativeDate(p.updated_at)}
            </span>

            {/* Actions */}
            {confirmId === p.id ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/50 text-xs" style={{ fontFamily: FONT_BODY }}>Confirmar?</span>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  style={{ fontFamily: FONT_BODY }}
                >
                  {deletingId === p.id ? '…' : 'Sim'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  style={{ fontFamily: FONT_BODY }}
                >
                  Não
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(p.id)}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                  style={{ fontFamily: FONT_BODY }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(p.id)}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors"
                  style={{ fontFamily: FONT_BODY }}
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
