'use client'

import { useState, useRef } from 'react'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

const MAX_MB = 10

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
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)

    // Client-side file size guard
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${MAX_MB}MB`)
      return
    }

    // Generate a unique filename to avoid collisions
    const ext = file.name.split('.').pop() ?? 'bin'
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const basePath = storagePath.endsWith('/') ? storagePath : storagePath + '/'
    const fullPath = basePath + uniqueName

    const fd = new FormData()
    fd.append('file', file)
    fd.append('path', fullPath)

    setUploading(true)
    setProgress(0)

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      setUploading(false)
      setProgress(null)
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const { url } = JSON.parse(xhr.responseText)
          setPreview(url)
          onUploaded(url)
        } catch {
          setError('Resposta inválida do servidor')
        }
      } else {
        try {
          const d = JSON.parse(xhr.responseText)
          setError(d.error ?? `Erro ${xhr.status}`)
        } catch {
          setError(`Erro ${xhr.status}`)
        }
      }
    }

    xhr.onerror = () => {
      setUploading(false)
      setProgress(null)
      setError('Erro de rede no upload')
    }

    xhr.open('POST', '/api/admin/upload')
    xhr.send(fd)
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
          {uploading ? `Enviando… ${progress ?? 0}%` : `↑ ${label}`}
        </button>

        {preview && !uploading && (
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

      {/* Progress bar */}
      {uploading && progress !== null && (
        <div className="mt-2" style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
      )}

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
