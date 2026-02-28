'use client'

import { useState } from 'react'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

export interface PostListItem {
  id: string
  slug: string
  titulo_pt: string
  titulo_en: string | null
  tipo: string | null
  visibilidade: string | null
  publicado_em: string | null
  updated_at: string
}

interface PostsListProps {
  posts: PostListItem[]
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

export function PostsList({ posts, onEdit, onDeleted, loading }: PostsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? posts.filter(p =>
        [p.titulo_pt, p.titulo_en, p.slug, p.tipo, p.visibilidade]
          .some(v => v?.toLowerCase().includes(search.toLowerCase()))
      )
    : posts

  const handleDelete = async (id: string) => {
    setDeletingId(id); setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      setConfirmId(null); onDeleted()
    } catch { setDeleteError('Erro ao excluir post') }
    finally { setDeletingId(null) }
  }

  if (loading) return <p className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Carregando…</p>
  if (posts.length === 0) return <p className="text-white/20 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Nenhum post ainda.</p>

  return (
    <div>
      {deleteError && <p className="text-red-400 text-xs mb-4" style={{ fontFamily: FONT_BODY }}>{deleteError}</p>}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/35 text-xs" style={{ fontFamily: FONT_BODY }}>
          {filtered.length}{search.trim() ? ` de ${posts.length}` : ''} post{posts.length !== 1 ? 's' : ''}
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar posts…"
          className="placeholder-white/20"
          style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', width: '200px' }}
        />
      </div>
      {filtered.length === 0 && search.trim() && (
        <p className="text-white/20 text-sm py-4" style={{ fontFamily: FONT_BODY }}>Nenhum resultado para "{search}".</p>
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {filtered.map(p => (
          <div key={p.id} className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate" style={{ fontFamily: FONT_BODY }}>{p.titulo_pt}</p>
              <p className="text-white/30 text-xs" style={{ fontFamily: FONT_BODY }}>{p.slug}</p>
            </div>

            {/* Tipo */}
            {p.tipo && (
              <span className="text-xs px-2 py-0.5 flex-shrink-0 hidden md:block text-white/40"
                style={{ fontFamily: FONT_BODY, border: '1px solid rgba(255,255,255,0.1)' }}>
                {p.tipo}
              </span>
            )}

            {/* Visibility */}
            <span className="text-xs px-2 py-0.5 flex-shrink-0 hidden md:block"
              style={{
                fontFamily: FONT_BODY,
                color: p.visibilidade === 'publico' ? 'white' : p.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.8)' : 'rgba(255,255,255,0.3)',
                border: `1px solid ${p.visibilidade === 'publico' ? 'rgba(255,255,255,0.3)' : p.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.1)'}`,
              }}>
              {p.visibilidade ?? '—'}
            </span>

            {/* Updated */}
            <span className="text-white/25 text-xs flex-shrink-0 hidden lg:block" style={{ fontFamily: FONT_BODY, minWidth: 70 }}>
              {relativeDate(p.updated_at)}
            </span>

            {confirmId === p.id ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/50 text-xs" style={{ fontFamily: FONT_BODY }}>Confirmar?</span>
                <button type="button" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors" style={{ fontFamily: FONT_BODY }}>
                  {deletingId === p.id ? '…' : 'Sim'}
                </button>
                <button type="button" onClick={() => setConfirmId(null)}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: FONT_BODY }}>
                  Não
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-shrink-0">
                <button type="button" onClick={() => onEdit(p.id)}
                  className="text-xs text-white/40 hover:text-white transition-colors" style={{ fontFamily: FONT_BODY }}>
                  Editar
                </button>
                <button type="button" onClick={() => setConfirmId(p.id)}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors" style={{ fontFamily: FONT_BODY }}>
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
