'use client'

import type { FilmeListItem } from '../../page'
import type { PostListItem } from '../PostsList'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface RecentlyAddedSectionProps {
  filmes: FilmeListItem[]
  posts: PostListItem[]
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `${days}d`
  if (days < 365) return `${Math.floor(days / 30)}m`
  return `${Math.floor(days / 365)}a`
}

function RecentRow({ title, subtitle, date }: { title: string; subtitle?: string; date: string }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="min-w-0 mr-3">
        <p className="text-white text-sm truncate" style={{ fontFamily: FONT_BODY }}>{title}</p>
        {subtitle && (
          <p className="text-xs truncate" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.3)' }}>{subtitle}</p>
        )}
      </div>
      <span className="text-xs flex-shrink-0" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.25)' }}>
        {relativeDate(date)}
      </span>
    </div>
  )
}

export function RecentlyAddedSection({ filmes, posts }: RecentlyAddedSectionProps) {
  return (
    <div>
      <h2
        className="mb-5"
        style={{
          fontFamily: FONT_HEADING,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        Adicionado Recentemente
      </h2>

      {filmes.length > 0 && (
        <div className="mb-6">
          <p className="text-xs mb-2" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Filmes
          </p>
          {filmes.map(f => (
            <RecentRow
              key={f.id}
              title={f.titulo_pt ?? '(sem título)'}
              subtitle={f.titulo_en ?? undefined}
              date={f.updated_at}
            />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <p className="text-xs mb-2" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Posts
          </p>
          {posts.map(p => (
            <RecentRow
              key={p.id}
              title={p.titulo_pt}
              subtitle={p.slug}
              date={p.updated_at}
            />
          ))}
        </div>
      )}

      {filmes.length === 0 && posts.length === 0 && (
        <p className="text-sm py-4" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.2)' }}>
          Nenhum item ainda.
        </p>
      )}
    </div>
  )
}
