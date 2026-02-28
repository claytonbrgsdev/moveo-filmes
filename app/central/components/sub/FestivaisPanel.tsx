'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSortablePanel } from './useSortablePanel'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface Festival {
  id: string; nome: string; ano: number | null; cidade: string | null
  pais: string | null; secao: string | null; tipo_estreia: string | null; tipo_evento: string | null
  ordem: number | null
}
interface AddForm {
  nome: string; ano: string; cidade: string; pais: string; secao: string
  tipo_evento: string; tipo_estreia: string; edicao: string; observacoes: string
}
const EMPTY: AddForm = {
  nome: '', ano: '', cidade: '', pais: '', secao: '', tipo_evento: '', tipo_estreia: '', edicao: '', observacoes: '',
}

const inp = (val: string, onChange: (v: string) => void, ph?: string) => (
  <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
    className="placeholder-white/20 w-full"
    style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px' }} />
)

function SortableRow({
  r, deletingId, onDelete, onEdit, isEditing, editForm, setEditForm, onSave, onCancel, saving, editError,
}: {
  r: Festival
  deletingId: string | null
  onDelete: (id: string) => void
  onEdit: (r: Festival) => void
  isEditing: boolean
  editForm: AddForm
  setEditForm: (f: AddForm) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  editError: string | null
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: r.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: isDragging ? 0.5 : 1, background: isDragging ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
      {!isEditing ? (
        <div className="flex items-center gap-3 py-2">
          <button type="button" {...attributes} {...listeners} title="Arrastar para reordenar"
            style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab', fontSize: '14px', lineHeight: 1, flexShrink: 0, padding: '2px', border: 'none', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>⠿</button>
          <div className="flex-1 min-w-0">
            <span className="text-white text-xs" style={{ fontFamily: FONT_BODY }}>{r.nome}</span>
            <span className="text-white/30 text-xs ml-2" style={{ fontFamily: FONT_BODY }}>
              {[r.ano, r.cidade, r.pais, r.secao].filter(Boolean).join(' · ')}
            </span>
          </div>
          <button type="button" onClick={() => onEdit(r)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: FONT_BODY }}>
            editar
          </button>
          <button type="button" onClick={() => onDelete(r.id)} disabled={deletingId === r.id}
            className="text-xs text-white/20 hover:text-red-400 transition-colors" style={{ fontFamily: FONT_BODY }}>
            {deletingId === r.id ? '…' : 'remover'}
          </button>
        </div>
      ) : (
        <div className="py-3 px-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">{inp(editForm.nome, v => setEditForm({ ...editForm, nome: v }), 'Nome do festival *')}</div>
            <div>{inp(editForm.ano, v => setEditForm({ ...editForm, ano: v }), 'Ano')}</div>
            <div>{inp(editForm.edicao, v => setEditForm({ ...editForm, edicao: v }), 'Edição')}</div>
            <div>{inp(editForm.cidade, v => setEditForm({ ...editForm, cidade: v }), 'Cidade')}</div>
            <div>{inp(editForm.pais, v => setEditForm({ ...editForm, pais: v }), 'País')}</div>
            <div>{inp(editForm.secao, v => setEditForm({ ...editForm, secao: v }), 'Seção')}</div>
            <div>{inp(editForm.tipo_evento, v => setEditForm({ ...editForm, tipo_evento: v }), 'Tipo de evento')}</div>
            <div>{inp(editForm.tipo_estreia, v => setEditForm({ ...editForm, tipo_estreia: v }), 'Tipo de estreia')}</div>
            <div className="col-span-2">{inp(editForm.observacoes, v => setEditForm({ ...editForm, observacoes: v }), 'Observações')}</div>
          </div>
          {editError && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{editError}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onSave} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Salvar alterações'}
            </button>
            <button type="button" onClick={onCancel}
              className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: FONT_BODY }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function FestivaisPanel({ filmeId }: { filmeId: string }) {
  const [rows, setRows] = useState<Festival[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<AddForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<AddForm>(EMPTY)
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const { sensors, handleDragEnd, isSaving } = useSortablePanel(rows, setRows, { filmeId, endpoint: 'festivais' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/filmes/${filmeId}/festivais`)
    if (res.ok) setRows(await res.json())
    setLoading(false)
  }, [filmeId])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.nome.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}/festivais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          ano: form.ano ? parseInt(form.ano) : null,
          cidade: form.cidade || null,
          pais: form.pais || null,
          secao: form.secao || null,
          tipo_evento: form.tipo_evento || null,
          tipo_estreia: form.tipo_estreia || null,
          edicao: form.edicao || null,
          observacoes: form.observacoes || null,
          ordem: rows.length + 1,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setForm(EMPTY); setAdding(false); await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await fetch(`/api/admin/filmes/${filmeId}/festivais/${id}`, { method: 'DELETE' })
    setDeletingId(null); await load()
  }

  const handleEditStart = (r: Festival) => {
    setEditingId(r.id)
    setEditError(null)
    setEditForm({
      nome: r.nome,
      ano: r.ano?.toString() ?? '',
      cidade: r.cidade ?? '',
      pais: r.pais ?? '',
      secao: r.secao ?? '',
      tipo_evento: r.tipo_evento ?? '',
      tipo_estreia: r.tipo_estreia ?? '',
      edicao: '',
      observacoes: '',
    })
    setAdding(false)
  }

  const handleEditSave = async () => {
    if (!editForm.nome.trim()) { setEditError('Nome é obrigatório'); return }
    setEditSaving(true); setEditError(null)
    try {
      const payload = {
        nome: editForm.nome,
        ano: editForm.ano ? parseInt(editForm.ano) : null,
        cidade: editForm.cidade || null,
        pais: editForm.pais || null,
        secao: editForm.secao || null,
        tipo_evento: editForm.tipo_evento || null,
        tipo_estreia: editForm.tipo_estreia || null,
        edicao: editForm.edicao || null,
        observacoes: editForm.observacoes || null,
      }
      const res = await fetch(`/api/admin/filmes/${filmeId}/festivais/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro ao salvar')
      setRows(prev => prev.map(r => r.id === editingId ? { ...r, ...payload } : r))
      setEditingId(null)
    } catch (e) { setEditError(e instanceof Error ? e.message : 'Erro') }
    finally { setEditSaving(false) }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditForm(EMPTY)
    setEditError(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ fontFamily: FONT_HEADING, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Festivais &amp; Mostras ({rows.length}){isSaving && <span className="ml-2 opacity-40"> salvando…</span>}
        </h4>
        {!adding && !editingId && (
          <button type="button" onClick={() => setAdding(true)}
            className="text-xs transition-colors" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.2)', padding: '3px 10px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            + Adicionar
          </button>
        )}
      </div>

      {loading ? <p className="text-white/30 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Carregando…</p> : (
        <div className="mb-4">
          {rows.length === 0 && <p className="text-white/20 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Nenhum festival ainda.</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map(r => (
                <SortableRow
                  key={r.id} r={r} deletingId={deletingId} onDelete={handleDelete}
                  onEdit={handleEditStart} isEditing={editingId === r.id}
                  editForm={editForm} setEditForm={setEditForm}
                  onSave={handleEditSave} onCancel={handleEditCancel}
                  saving={editSaving} editError={editError}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {adding && (
        <div className="p-4 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">{inp(form.nome, v => setForm(f => ({ ...f, nome: v })), 'Nome do festival *')}</div>
            <div>{inp(form.ano, v => setForm(f => ({ ...f, ano: v })), 'Ano')}</div>
            <div>{inp(form.edicao, v => setForm(f => ({ ...f, edicao: v })), 'Edição')}</div>
            <div>{inp(form.cidade, v => setForm(f => ({ ...f, cidade: v })), 'Cidade')}</div>
            <div>{inp(form.pais, v => setForm(f => ({ ...f, pais: v })), 'País')}</div>
            <div>{inp(form.secao, v => setForm(f => ({ ...f, secao: v })), 'Seção')}</div>
            <div>{inp(form.tipo_evento, v => setForm(f => ({ ...f, tipo_evento: v })), 'Tipo de evento')}</div>
            <div>{inp(form.tipo_estreia, v => setForm(f => ({ ...f, tipo_estreia: v })), 'Tipo de estreia')}</div>
            <div className="col-span-2">{inp(form.observacoes, v => setForm(f => ({ ...f, observacoes: v })), 'Observações')}</div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Adicionar festival'}
            </button>
            <button type="button" onClick={() => { setAdding(false); setError(null); setForm(EMPTY) }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: FONT_BODY }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
