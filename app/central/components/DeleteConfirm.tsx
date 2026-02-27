'use client'

import { useState } from 'react'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface DeleteConfirmProps {
  filmeId: string
  filmeTitulo: string
  onConfirmed: () => Promise<void>
  onCancel: () => void
}

export function DeleteConfirm({ filmeId, filmeTitulo, onConfirmed, onCancel }: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Erro ${res.status}`)
      }
      await onConfirmed()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-red-400 text-sm"
        style={{ fontFamily: FONT_BODY }}
      >
        Tem certeza que deseja excluir <strong>&ldquo;{filmeTitulo}&rdquo;</strong>?
        <br />
        <span className="text-red-400/70 text-xs">Esta ação não pode ser desfeita.</span>
      </p>

      {error && (
        <p className="text-red-400 text-xs" style={{ fontFamily: FONT_BODY }}>
          Erro: {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-4 py-2 transition-colors"
          style={{
            fontFamily: FONT_BODY,
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.5)',
            color: loading ? 'rgba(239,68,68,0.4)' : 'rgb(239,68,68)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Excluindo…' : 'Confirmar exclusão'}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="text-white/40 hover:text-white/70 transition-colors text-xs"
          style={{ fontFamily: FONT_BODY }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
