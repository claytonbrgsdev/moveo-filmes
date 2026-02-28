'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { FilmeListItem } from '../page'
import { DeleteConfirm } from './DeleteConfirm'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface FilmesListProps {
  filmes: FilmeListItem[]
  onEdit: (id: string) => void
  onDeleted: () => void
  loading: boolean
}

const CATEGORIA_LABELS: Record<string, string> = {
  cinema: 'Cinema',
  mostra: 'Mostras',
  desenvolvimento: 'Desenvolvimento',
  'pre-producao': 'Pré-produção',
  'pos-producao': 'Pós-produção',
  distribuicao: 'Distribuição',
}

function VisibilidadeBadge({ value }: { value: string | null }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    publico: { label: 'Público', color: 'rgba(255,255,255,0.9)', bg: 'rgba(255,255,255,0.12)' },
    rascunho: { label: 'Rascunho', color: 'rgba(234,179,8,0.9)', bg: 'rgba(234,179,8,0.12)' },
    privado: { label: 'Privado', color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.06)' },
  }
  const v = value ?? 'privado'
  const style = map[v] ?? map.privado
  return (
    <span
      className="text-xs px-2 py-0.5"
      style={{
        fontFamily: FONT_BODY,
        color: style.color,
        background: style.bg,
        letterSpacing: '0.05em',
      }}
    >
      {style.label}
    </span>
  )
}

function CategoriaBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-white/25" style={{ fontFamily: FONT_BODY, fontSize: '12px' }}>—</span>
  return (
    <span
      className="text-xs text-white/60"
      style={{ fontFamily: FONT_BODY }}
    >
      {CATEGORIA_LABELS[value] ?? value}
    </span>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 30) return `${diffDays}d atrás`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}m atrás`
  return `${Math.floor(diffDays / 365)}a atrás`
}

export function FilmesList({ filmes, onEdit, onDeleted, loading }: FilmesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? filmes.filter(f =>
        [f.titulo_pt, f.titulo_en, f.slug, f.categoria_site, f.visibilidade]
          .some(v => v?.toLowerCase().includes(search.toLowerCase()))
      )
    : filmes

  if (loading) {
    return (
      <div className="text-white/30 text-sm" style={{ fontFamily: FONT_BODY }}>
        Carregando…
      </div>
    )
  }

  if (filmes.length === 0) {
    return (
      <div
        className="py-16 text-center"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-white/40 mb-4"
          style={{ fontFamily: FONT_BODY, fontSize: '16px' }}
        >
          Nenhum filme cadastrado
        </p>
        <p className="text-white/25" style={{ fontFamily: FONT_BODY, fontSize: '13px' }}>
          Clique em "+ Novo Filme" para adicionar o primeiro filme.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Search + count bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/35 text-xs" style={{ fontFamily: FONT_BODY }}>
          {filtered.length}{search.trim() ? ` de ${filmes.length}` : ''} filme{filmes.length !== 1 ? 's' : ''}
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar filmes…"
          className="placeholder-white/20"
          style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', width: '200px' }}
        />
      </div>
      {filtered.length === 0 && search.trim() && (
        <p className="text-white/20 text-sm py-4" style={{ fontFamily: FONT_BODY }}>Nenhum resultado para "{search}".</p>
      )}
      {/* Table header */}
      <div
        className="grid gap-4 pb-3 mb-1"
        style={{
          gridTemplateColumns: '1fr 130px 100px 60px 80px 160px',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {['Título', 'Categoria', 'Visibilidade', 'Ano', 'Atualizado', 'Ações'].map((h) => (
          <span
            key={h}
            className="text-white/35 text-xs uppercase tracking-widest"
            style={{ fontFamily: FONT_BODY }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {filtered.map((filme) => (
        <div key={filme.id}>
          <div
            className="grid gap-4 items-center py-4"
            style={{
              gridTemplateColumns: '1fr 130px 100px 60px 80px 160px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Título */}
            <div className="min-w-0">
              <Link
                href={`/catalogo/cinema/${filme.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors truncate block"
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white',
                  maxWidth: '100%',
                }}
              >
                {filme.titulo_pt ?? '(sem título)'}
              </Link>
              {filme.titulo_en && (
                <span className="text-white/30 text-xs truncate block" style={{ fontFamily: FONT_BODY }}>
                  {filme.titulo_en}
                </span>
              )}
            </div>

            {/* Categoria */}
            <div><CategoriaBadge value={filme.categoria_site} /></div>

            {/* Visibilidade */}
            <div><VisibilidadeBadge value={filme.visibilidade} /></div>

            {/* Ano */}
            <div>
              <span className="text-white/50 text-sm" style={{ fontFamily: FONT_BODY }}>
                {filme.ano ?? '—'}
              </span>
            </div>

            {/* Atualizado */}
            <div>
              <span className="text-white/35 text-xs" style={{ fontFamily: FONT_BODY }}>
                {formatDate(filme.updated_at)}
              </span>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(filme.id)}
                className="text-white/60 hover:text-white transition-colors text-xs px-3 py-1.5"
                style={{
                  fontFamily: FONT_BODY,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => setDeletingId(deletingId === filme.id ? null : filme.id)}
                className="text-red-400/70 hover:text-red-400 transition-colors text-xs px-3 py-1.5"
                style={{
                  fontFamily: FONT_BODY,
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                Excluir
              </button>
            </div>
          </div>

          {/* Inline delete confirmation */}
          {deletingId === filme.id && (
            <div
              className="py-4 px-4 mb-1"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderTop: 'none' }}
            >
              <DeleteConfirm
                filmeId={filme.id}
                filmeTitulo={filme.titulo_pt ?? '(sem título)'}
                onConfirmed={async () => {
                  setDeletingId(null)
                  await onDeleted()
                }}
                onCancel={() => setDeletingId(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
