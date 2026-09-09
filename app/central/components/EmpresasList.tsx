'use client'

import { useState } from 'react'
import { nextVisibilidade } from '@/lib/utils/visibilidade'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

export interface EmpresaListItem {
  id: string
  nome: string
  slug: string | null
  tipo: string | null
  pais: string | null
  logo_url: string | null
  visibilidade: string | null
  updated_at: string
  /** Vem do embed `filmes_creditos(count)` do PostgREST: sempre um array de um item. */
  filmes_creditos?: { count: number }[] | null
}

interface EmpresasListProps {
  empresas: EmpresaListItem[]
  onEdit: (id: string) => void
  onDeleted: () => void
  onVisibilidadeChanged: (id: string, v: string) => void
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

export function creditosCount(e: EmpresaListItem): number {
  return e.filmes_creditos?.[0]?.count ?? 0
}

export function EmpresasList({ empresas, onEdit, onDeleted, onVisibilidadeChanged, loading }: EmpresasListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? empresas.filter(e =>
        [e.nome, e.slug, e.tipo, e.pais, e.visibilidade]
          .some(v => v?.toLowerCase().includes(search.toLowerCase()))
      )
    : empresas

  /** Nomes repetidos são marcados na lista — a tabela chegou com duplicatas. */
  const nomesRepetidos = new Set(
    empresas
      .map(e => e.nome.trim().toLowerCase())
      .filter((nome, i, todos) => todos.indexOf(nome) !== i)
  )

  const handleToggleVisibilidade = async (empresa: EmpresaListItem) => {
    if (togglingId) return
    const next = nextVisibilidade(empresa.visibilidade)
    const original = empresa.visibilidade
    setTogglingId(empresa.id)
    onVisibilidadeChanged(empresa.id, next)
    try {
      const res = await fetch(`/api/admin/empresas/${empresa.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibilidade: next }),
      })
      if (!res.ok) onVisibilidadeChanged(empresa.id, original ?? 'rascunho')
    } catch {
      onVisibilidadeChanged(empresa.id, original ?? 'rascunho')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/empresas/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        // A rota devolve 409 com uma explicação quando a empresa ainda está em
        // créditos de filme. Mostrar esse texto é o ponto — o editor precisa
        // saber que existe crédito apontando para cá.
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Erro ao excluir')
      }
      setConfirmId(null)
      onDeleted()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir empresa')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <p className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Carregando…</p>
  }

  if (empresas.length === 0) {
    return <p className="text-white/20 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Nenhuma empresa cadastrada ainda.</p>
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-4 px-4 py-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-red-400 text-xs" style={{ fontFamily: FONT_BODY }}>{deleteError}</p>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/35 text-xs" style={{ fontFamily: FONT_BODY }}>
          {filtered.length}{search.trim() ? ` de ${empresas.length}` : ''} empresa{empresas.length !== 1 ? 's' : ''}
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar empresas…"
          className="placeholder-white/20"
          style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', width: '200px' }}
        />
      </div>
      {filtered.length === 0 && search.trim() && (
        <p className="text-white/20 text-sm py-4" style={{ fontFamily: FONT_BODY }}>Nenhum resultado para &quot;{search}&quot;.</p>
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {filtered.map((e) => {
          const usos = creditosCount(e)
          const duplicada = nomesRepetidos.has(e.nome.trim().toLowerCase())
          return (
            <div
              key={e.id}
              className="flex items-center gap-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Logo */}
              <div className="w-8 h-8 flex-shrink-0 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {e.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.logo_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <span className="text-white/20 text-xs" style={{ fontFamily: FONT_HEADING }}>
                      {e.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Nome + tipo/país */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate" style={{ fontFamily: FONT_BODY }}>
                  {e.nome}
                  {duplicada && (
                    <span
                      title="Existe outra empresa com este mesmo nome"
                      className="ml-2 text-xs"
                      style={{ color: 'rgba(234,179,8,0.8)' }}
                    >
                      nome repetido
                    </span>
                  )}
                </p>
                {(e.tipo || e.pais) && (
                  <p className="text-white/30 text-xs truncate" style={{ fontFamily: FONT_BODY }}>
                    {[e.tipo, e.pais].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              {/* Uso em créditos */}
              <span
                title={usos === 0
                  ? 'Nenhum crédito de filme aponta para esta empresa'
                  : `Aparece em ${usos} crédito${usos > 1 ? 's' : ''} de filme`}
                className="text-xs px-2 py-0.5 flex-shrink-0 hidden md:block"
                style={{
                  fontFamily: FONT_BODY,
                  color: usos === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.55)',
                  border: `1px solid ${usos === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'}`,
                }}
              >
                {usos} crédito{usos !== 1 ? 's' : ''}
              </span>

              {/* Visibilidade */}
              <button
                type="button"
                onClick={() => handleToggleVisibilidade(e)}
                disabled={togglingId === e.id}
                title="Clique para alterar visibilidade"
                className="text-xs px-2 py-0.5 flex-shrink-0 hidden md:block transition-opacity"
                style={{
                  fontFamily: FONT_BODY,
                  color: togglingId === e.id ? 'rgba(255,255,255,0.3)' : e.visibilidade === 'publico' ? 'white' : e.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.8)' : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${e.visibilidade === 'publico' ? 'rgba(255,255,255,0.3)' : e.visibilidade === 'rascunho' ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  cursor: togglingId === e.id ? 'wait' : 'pointer',
                  background: 'transparent',
                  opacity: togglingId === e.id ? 0.6 : 1,
                }}
              >
                {togglingId === e.id ? '…' : (e.visibilidade ?? '—')}
              </button>

              {/* Atualizado */}
              <span className="text-white/25 text-xs flex-shrink-0 hidden lg:block" style={{ fontFamily: FONT_BODY, minWidth: 70 }}>
                {relativeDate(e.updated_at)}
              </span>

              {/* Ações */}
              {confirmId === e.id ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white/50 text-xs" style={{ fontFamily: FONT_BODY }}>Confirmar?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    {deletingId === e.id ? '…' : 'Sim'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmId(null); setDeleteError(null) }}
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
                    onClick={() => onEdit(e.id)}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmId(e.id); setDeleteError(null) }}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors"
                    style={{ fontFamily: FONT_BODY }}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
