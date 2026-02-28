'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSortablePanel } from './useSortablePanel'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface Financiamento {
  id: string; nome: string; tipo: string; resultado: string | null
  valor: number | null; moeda: string | null; ano: number | null; ordem: number | null
}
interface AddForm {
  nome: string; tipo: string; fase: string; resultado: string
  organizador: string; valor: string; moeda: string; ano: string; observacoes: string
}
const EMPTY: AddForm = {
  nome: '', tipo: 'edital', fase: '', resultado: '', organizador: '', valor: '', moeda: 'BRL', ano: '', observacoes: '',
}

function SortableRow({
  r, deletingId, onDelete,
}: { r: Financiamento; deletingId: string | null; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: r.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, borderBottom: '1px solid rgba(255,255,255,0.06)', opacity: isDragging ? 0.5 : 1, background: isDragging ? 'rgba(255,255,255,0.03)' : 'transparent' }}
      className="flex items-center gap-3 py-2">
      <button type="button" {...attributes} {...listeners} title="Arrastar para reordenar"
        style={{ color: 'rgba(255,255,255,0.2)', cursor: 'grab', fontSize: '14px', lineHeight: 1, flexShrink: 0, padding: '2px', border: 'none', background: 'transparent' }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>⠿</button>
      <div className="flex-1 min-w-0">
        <span className="text-white text-xs" style={{ fontFamily: FONT_BODY }}>{r.nome}</span>
        <span className="text-white/30 text-xs ml-2" style={{ fontFamily: FONT_BODY }}>
          {[r.tipo, r.resultado, r.valor != null ? `${r.moeda ?? ''} ${r.valor}`.trim() : null, r.ano].filter(Boolean).join(' · ')}
        </span>
      </div>
      <button type="button" onClick={() => onDelete(r.id)} disabled={deletingId === r.id}
        className="text-xs text-white/20 hover:text-red-400 transition-colors" style={{ fontFamily: FONT_BODY }}>
        {deletingId === r.id ? '…' : 'remover'}
      </button>
    </div>
  )
}

export function FinanciamentosPanel({ filmeId }: { filmeId: string }) {
  const [rows, setRows] = useState<Financiamento[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<AddForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { sensors, handleDragEnd, isSaving } = useSortablePanel(rows, setRows, { filmeId, endpoint: 'financiamentos' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/filmes/${filmeId}/financiamentos`)
    if (res.ok) setRows(await res.json())
    setLoading(false)
  }, [filmeId])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.nome.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}/financiamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          tipo: form.tipo,
          fase: form.fase || null,
          resultado: form.resultado || null,
          organizador: form.organizador || null,
          valor: form.valor ? parseFloat(form.valor) : null,
          moeda: form.moeda || null,
          ano: form.ano ? parseInt(form.ano) : null,
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
    await fetch(`/api/admin/filmes/${filmeId}/financiamentos/${id}`, { method: 'DELETE' })
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
          Financiamentos ({rows.length}){isSaving && <span className="ml-2 opacity-40"> salvando…</span>}
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
          {rows.length === 0 && <p className="text-white/20 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Nenhum financiamento ainda.</p>}
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
            <div className="col-span-2">{inp(form.nome, v => setForm(f => ({ ...f, nome: v })), 'Nome do edital / fundo *')}</div>
            <div>
              <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Tipo</p>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="bg-black text-white text-xs w-full" style={{ fontFamily: FONT_BODY, borderBottom: '1px solid rgba(255,255,255,0.15)', outline: 'none', paddingBottom: '4px' }}>
                <option value="edital">Edital</option>
                <option value="premio">Prêmio</option>
                <option value="coprodução">Coprodução</option>
                <option value="investimento">Investimento</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>{inp(form.resultado, v => setForm(f => ({ ...f, resultado: v })), 'Resultado (aprovado, reprovado…)')}</div>
            <div>{inp(form.organizador, v => setForm(f => ({ ...f, organizador: v })), 'Organizador / Órgão')}</div>
            <div>{inp(form.fase, v => setForm(f => ({ ...f, fase: v })), 'Fase')}</div>
            <div>{inp(form.valor, v => setForm(f => ({ ...f, valor: v })), 'Valor')}</div>
            <div>{inp(form.moeda, v => setForm(f => ({ ...f, moeda: v })), 'Moeda (BRL, EUR…)')}</div>
            <div>{inp(form.ano, v => setForm(f => ({ ...f, ano: v })), 'Ano')}</div>
            <div className="col-span-2">{inp(form.observacoes, v => setForm(f => ({ ...f, observacoes: v })), 'Observações')}</div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Adicionar financiamento'}
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
