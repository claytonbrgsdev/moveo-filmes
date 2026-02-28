'use client'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface UnsavedChangesPromptProps {
  onDiscard: () => void
  onContinue: () => void
}

export function UnsavedChangesPrompt({ onDiscard, onContinue }: UnsavedChangesPromptProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'black',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        minWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
      }}
    >
      <p style={{
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: 'rgba(255,255,255,0.7)',
        flex: 1,
        margin: 0,
      }}>
        Você tem alterações não salvas. Deseja descartá-las?
      </p>

      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onContinue}
          style={{
            fontFamily: FONT_HEADING,
            fontSize: '11px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            border: '1px solid white',
            color: 'white',
            background: 'transparent',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = 'black'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'white'
          }}
        >
          Continuar editando
        </button>

        <button
          type="button"
          onClick={onDiscard}
          style={{
            fontFamily: FONT_BODY,
            fontSize: '12px',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.4)',
            background: 'transparent',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(239,68,68,0.8)'
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
        >
          Descartar alterações
        </button>
      </div>
    </div>
  )
}
