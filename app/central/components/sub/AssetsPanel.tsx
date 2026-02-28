'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { StorageUpload } from '../StorageUpload'
import { useSortablePanel } from './useSortablePanel'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface Asset {
  id: string
  url: string
  tipo: string
  titulo_pt: string | null
  alt_pt: string | null
  is_principal: boolean | null
  ordem: number | null
  credito: string | null
  visibilidade: string | null
}

interface AddForm {
  url: string
  tipo: string
  titulo_pt: string
  alt_pt: string
  is_principal: boolean
  credito: string
}

const EMPTY_ADD: AddForm = {
  url: '', tipo: 'imagem', titulo_pt: '', alt_pt: '', is_principal: false, credito: '',
}

function SortableRow({
  r, deletingId, onDelete,
}: { r: Asset; deletingId: string | null; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: r.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: isDragging ? 0.5 : 1, background: isDragging ? 'rgba(255,255,255,0.03)' : 'transparent' }}
      className="flex items-center gap-3 py-2">
      <button type="button" {...attributes} {...listeners} title="Arrastar para reordenar"
        style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab', fontSize: '14px', lineHeight: 1, flexShrink: 0, padding: '2px', border: 'none', background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>⠿</button>
      {r.url.match(/\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.url} alt="" className="w-12 h-8 object-cover flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs truncate" style={{ fontFamily: FONT_BODY }}>{r.titulo_pt || r.url}</p>
        <p className="text-white/30 text-xs" style={{ fontFamily: FONT_BODY }}>{r.tipo}{r.is_principal ? ' · principal' : ''}</p>
      </div>
      <button type="button" onClick={() => onDelete(r.id)} disabled={deletingId === r.id}
        className="text-xs text-white/20 hover:text-red-400 transition-colors flex-shrink-0" style={{ fontFamily: FONT_BODY }}>
        {deletingId === r.id ? '…' : 'remover'}
      </button>
    </div>
  )
}

export function AssetsPanel({ filmeId }: { filmeId: string }) {
  const [rows, setRows] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<AddForm>(EMPTY_ADD)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { sensors, handleDragEnd, isSaving } = useSortablePanel(rows, setRows, { filmeId, endpoint: 'assets' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/filmes/${filmeId}/assets`)
    if (res.ok) setRows(await res.json())
    setLoading(false)
  }, [filmeId])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.url && !form.tipo) { setError('URL e tipo são obrigatórios'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: form.url, tipo: form.tipo, titulo_pt: form.titulo_pt || null,
          alt_pt: form.alt_pt || null, is_principal: form.is_principal,
          credito: form.credito || null, visibilidade: 'publico', ordem: rows.length + 1,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setForm(EMPTY_ADD); setAdding(false); await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await fetch(`/api/admin/filmes/${filmeId}/assets/${id}`, { method: 'DELETE' })
    setDeletingId(null); await load()
  }

  const inp = (val: string, onChange: (v: string) => void, ph?: string) => (
    <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
      className="placeholder-white/20 w-full"
      style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px' }} />
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ fontFamily: FONT_HEADING, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Assets ({rows.length}){isSaving && <span className="ml-2 opacity-40"> salvando…</span>}
        </h4>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)}
            className="text-xs transition-colors" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.2)', padding: '3px 10px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            + Adicionar
          </button>
        )}
      </div>

      {loading ? <p className="text-white/30 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Carregando…</p> : (
        <div className="mb-4">
          {rows.length === 0 && <p className="text-white/20 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Nenhum asset ainda.</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map(r => <SortableRow key={r.id} r={r} deletingId={deletingId} onDelete={handleDelete} />)}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {adding && (
        <div className="p-4 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>URL / Upload</p>
              <StorageUpload storagePath={`filmes/${filmeId}`} onUploaded={url => setForm(f => ({ ...f, url }))}
                existingUrl={form.url} accept="image/*,video/*" label="Enviar arquivo" />
              <div className="mt-2">{inp(form.url, v => setForm(f => ({ ...f, url: v })), 'https://… (ou cole URL)')}</div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Tipo</p>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="bg-black text-white text-xs w-full" style={{ fontFamily: FONT_BODY, borderBottom: '1px solid rgba(255,255,255,0.15)', outline: 'none', paddingBottom: '4px' }}>
                  <option value="imagem">Imagem</option>
                  <option value="video">Vídeo</option>
                  <option value="trailer">Trailer</option>
                  <option value="poster">Poster</option>
                  <option value="still">Still</option>
                  <option value="bts">BTS</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>{inp(form.titulo_pt, v => setForm(f => ({ ...f, titulo_pt: v })), 'Título (PT)')}</div>
              <div>{inp(form.alt_pt, v => setForm(f => ({ ...f, alt_pt: v })), 'Alt text (PT)')}</div>
              <div>{inp(form.credito, v => setForm(f => ({ ...f, credito: v })), 'Crédito/Autor')}</div>
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.5)' }}>
                <input type="checkbox" checked={form.is_principal} onChange={e => setForm(f => ({ ...f, is_principal: e.target.checked }))} className="accent-white" />
                Asset principal
              </label>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Adicionar asset'}
            </button>
            <button type="button" onClick={() => { setAdding(false); setError(null); setForm(EMPTY_ADD) }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: FONT_BODY }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
