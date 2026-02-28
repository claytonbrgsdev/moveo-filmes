'use client'

import { useState, useRef } from 'react'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface StorageUploadProps {
  /** Storage path — e.g. `filmes/abc123/poster.jpg` */
  storagePath: string
  /** Called with the public URL after a successful upload */
  onUploaded: (url: string) => void
  /** Existing URL to show as preview */
  existingUrl?: string
  /** Accept string for the file input (default: image/*,video/*) */
  accept?: string
  label?: string
}

export function StorageUpload({
  storagePath,
  onUploaded,
  existingUrl,
  accept = 'image/*,video/*',
  label = 'Arquivo',
}: StorageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)

    // Generate a unique filename to avoid collisions
    const ext = file.name.split('.').pop() ?? 'bin'
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const basePath = storagePath.endsWith('/') ? storagePath : storagePath + '/'
    const fullPath = basePath + uniqueName

    const fd = new FormData()
    fd.append('file', file)
    fd.append('path', fullPath)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? `Erro ${res.status}`)
      }
      const { url } = await res.json()
      setPreview(url)
      onUploaded(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      {/* Preview */}
      {preview && preview.match(/\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i) && (
        <div className="mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="max-h-32 object-contain"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      )}
      {preview && !preview.match(/\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i) && (
        <p className="text-white/40 text-xs mb-2 truncate" style={{ maxWidth: 320 }}>
          {preview}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="text-xs px-3 py-1.5 transition-colors"
          style={{
            fontFamily: FONT_BODY,
            border: '1px solid rgba(255,255,255,0.3)',
            color: uploading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
        >
          {uploading ? 'Enviando…' : `↑ ${label}`}
        </button>

        {preview && (
          <button
            type="button"
            onClick={() => { setPreview(null); onUploaded('') }}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
            style={{ fontFamily: FONT_BODY }}
          >
            ✕ remover
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {error && (
        <p className="text-red-400 text-xs mt-2" style={{ fontFamily: FONT_BODY }}>
          {error}
        </p>
      )}
    </div>
  )
}
