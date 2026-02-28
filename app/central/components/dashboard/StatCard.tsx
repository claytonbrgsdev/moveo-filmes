'use client'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface BreakdownItem {
  label: string
  count: number
  color: string
}

interface StatCardProps {
  label: string
  total: number
  breakdown?: BreakdownItem[]
}

export function StatCard({ label, total, breakdown = [] }: StatCardProps) {
  return (
    <div
      className="flex flex-col justify-between"
      style={{
        border: '1px solid rgba(255,255,255,0.10)',
        padding: '24px',
        minHeight: '140px',
      }}
    >
      {/* Total */}
      <div>
        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {total}
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: FONT_BODY,
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          {label}
        </p>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {breakdown.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <span style={{ fontFamily: FONT_BODY, fontSize: '11px', color: item.color }}>
                {item.count} {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
