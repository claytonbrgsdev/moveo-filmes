'use client'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

export interface DashboardActivityItem {
  entityType: 'Filme' | 'Pessoa' | 'Post'
  title: string
  updated_at: string
}

interface RecentActivityTableProps {
  items: DashboardActivityItem[]
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

const ENTITY_COLORS: Record<string, string> = {
  Filme: 'rgba(255,255,255,0.55)',
  Pessoa: 'rgba(167,139,250,0.7)',
  Post: 'rgba(94,234,212,0.6)',
}

export function RecentActivityTable({ items }: RecentActivityTableProps) {
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
        Atividade Recente
      </h2>

      {items.length === 0 ? (
        <p className="text-sm py-4" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.2)' }}>
          Nenhuma atividade ainda.
        </p>
      ) : (
        <div>
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Entity type badge */}
              <span
                className="flex-shrink-0 text-xs"
                style={{
                  fontFamily: FONT_BODY,
                  color: ENTITY_COLORS[item.entityType] ?? 'rgba(255,255,255,0.4)',
                  minWidth: '46px',
                  letterSpacing: '0.04em',
                }}
              >
                {item.entityType}
              </span>

              {/* Title */}
              <span
                className="flex-1 min-w-0 text-sm truncate"
                style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.8)' }}
              >
                {item.title}
              </span>

              {/* Date */}
              <span
                className="flex-shrink-0 text-xs"
                style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.25)', minWidth: '28px', textAlign: 'right' }}
              >
                {relativeDate(item.updated_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
