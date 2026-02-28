'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSortablePanel } from './useSortablePanel'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface Pessoa { id: string; nome: string; nome_exibicao: string | null }
interface Elenco {
  id: string; personagem: string | null; ordem: number | null
  pessoa_id: string; pessoas?: Pessoa | null
}
interface AddForm { pessoa_id: string; personagem: string; descricao_curta_pt: string }
const EMPTY: AddForm = { pessoa_id: '', personagem: '', descricao_curta_pt: '' }

const inp = (val: string, onChange: (v: string) => void, ph?: string) => (
  <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
    className="placeholder-white/20 w-full"
    style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px' }} />
)

function SortableRow({
  r, deletingId, onDelete, onEdit, isEditing, editForm, setEditForm, onSave, onCancel, saving, editError, pessoas,
}: {
  r: Elenco
  deletingId: string | null
  onDelete: (id: string) => void
  onEdit: (r: Elenco) => void
  isEditing: boolean
  editForm: AddForm
  setEditForm: (f: AddForm) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  editError: string | null
  pessoas: Pessoa[]
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
            <span className="text-white text-xs" style={{ fontFamily: FONT_BODY }}>
              {r.pessoas?.nome_exibicao || r.pessoas?.nome || r.pessoa_id}
              {r.personagem && <span className="text-white/50"> como {r.personagem}</span>}
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
            <div>
              <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Pessoa *</p>
              <select value={editForm.pessoa_id} onChange={e => setEditForm({ ...editForm, pessoa_id: e.target.value })}
                className="bg-black text-white text-xs w-full" style={{ fontFamily: FONT_BODY, borderBottom: '1px solid rgba(255,255,255,0.15)', outline: 'none', paddingBottom: '4px' }}>
                <option value="">— selecionar pessoa —</option>
                {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome_exibicao || p.nome}</option>)}
              </select>
            </div>
            <div>{inp(editForm.personagem, v => setEditForm({ ...editForm, personagem: v }), 'Personagem')}</div>
            <div className="col-span-2">{inp(editForm.descricao_curta_pt, v => setEditForm({ ...editForm, descricao_curta_pt: v }), 'Descrição curta (PT)')}</div>
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

export function ElencoPanel({ filmeId, pessoas }: { filmeId: string; pessoas: Pessoa[] }) {
  const [rows, setRows] = useState<Elenco[]>([])
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

  const { sensors, handleDragEnd, isSaving } = useSortablePanel(rows, setRows, { filmeId, endpoint: 'elenco' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/filmes/${filmeId}/elenco`)
    if (res.ok) setRows(await res.json())
    setLoading(false)
  }, [filmeId])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.pessoa_id) { setError('Selecione uma pessoa'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}/elenco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pessoa_id: form.pessoa_id, personagem: form.personagem || null, descricao_curta_pt: form.descricao_curta_pt || null, ordem: rows.length + 1 }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setForm(EMPTY); setAdding(false); await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Erro') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await fetch(`/api/admin/filmes/${filmeId}/elenco/${id}`, { method: 'DELETE' })
    setDeletingId(null); await load()
  }

  const handleEditStart = (r: Elenco) => {
    setEditingId(r.id)
    setEditError(null)
    setEditForm({
      pessoa_id: r.pessoa_id,
      personagem: r.personagem ?? '',
      descricao_curta_pt: '',
    })
    setAdding(false)
  }

  const handleEditSave = async () => {
    if (!editForm.pessoa_id) { setEditError('Selecione uma pessoa'); return }
    setEditSaving(true); setEditError(null)
    try {
      const payload = {
        pessoa_id: editForm.pessoa_id,
        personagem: editForm.personagem || null,
        descricao_curta_pt: editForm.descricao_curta_pt || null,
      }
      const res = await fetch(`/api/admin/filmes/${filmeId}/elenco/${editingId}`, {
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
          Elenco ({rows.length}){isSaving && <span className="ml-2 opacity-40"> salvando…</span>}
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
          {rows.length === 0 && <p className="text-white/20 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Nenhum membro de elenco ainda.</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map(r => (
                <SortableRow
                  key={r.id} r={r} deletingId={deletingId} onDelete={handleDelete}
                  onEdit={handleEditStart} isEditing={editingId === r.id}
                  editForm={editForm} setEditForm={setEditForm}
                  onSave={handleEditSave} onCancel={handleEditCancel}
                  saving={editSaving} editError={editError} pessoas={pessoas}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {adding && (
        <div className="p-4 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Pessoa *</p>
              <select value={form.pessoa_id} onChange={e => setForm(f => ({ ...f, pessoa_id: e.target.value }))}
                className="bg-black text-white text-xs w-full" style={{ fontFamily: FONT_BODY, borderBottom: '1px solid rgba(255,255,255,0.15)', outline: 'none', paddingBottom: '4px' }}>
                <option value="">— selecionar pessoa —</option>
                {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome_exibicao || p.nome}</option>)}
              </select>
            </div>
            <div>{inp(form.personagem, v => setForm(f => ({ ...f, personagem: v })), 'Personagem')}</div>
            <div className="col-span-2">{inp(form.descricao_curta_pt, v => setForm(f => ({ ...f, descricao_curta_pt: v })), 'Descrição curta (PT)')}</div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Adicionar ao elenco'}
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
