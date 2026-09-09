'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSortablePanel } from './useSortablePanel'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"

interface Pessoa { id: string; nome: string; nome_exibicao: string | null }
interface Empresa { id: string; nome: string }
interface Credito {
  id: string; cargo: string; nome_exibicao: string | null; ordem: number | null
  pessoa_id: string | null; pessoas?: Pessoa | null
  empresa_id: string | null; empresas?: Empresa | null
}
interface AddForm { cargo: string; pessoa_id: string; empresa_id: string; nome_exibicao: string }
const EMPTY: AddForm = { cargo: '', pessoa_id: '', empresa_id: '', nome_exibicao: '' }

/**
 * Crédito aponta para uma pessoa OU para uma empresa, nunca para as duas.
 * Não é regra do banco — as duas colunas são anuláveis e independentes — mas é
 * o que os dados sempre fizeram (dos 57 créditos, 27 têm pessoa, 30 têm
 * empresa, zero têm as duas) e é o que a página pública assume: quando há
 * pessoa, o nome da empresa nunca chega a ser renderizado. Escolher um lado
 * limpa o outro para que ninguém grave um vínculo que o site jamais mostraria.
 */
function escolherPessoa(f: AddForm, pessoa_id: string): AddForm {
  return { ...f, pessoa_id, empresa_id: pessoa_id ? '' : f.empresa_id }
}
function escolherEmpresa(f: AddForm, empresa_id: string): AddForm {
  return { ...f, empresa_id, pessoa_id: empresa_id ? '' : f.pessoa_id }
}

/** O select de vínculo, igual na linha de edição e no formulário de adicionar. */
function VinculoFields({ form, setForm, pessoas, empresas }: {
  form: AddForm
  setForm: (f: AddForm) => void
  pessoas: Pessoa[]
  empresas: Empresa[]
}) {
  const selectStyle: React.CSSProperties = {
    fontFamily: FONT_BODY, borderBottom: '1px solid rgba(255,255,255,0.15)',
    outline: 'none', paddingBottom: '4px',
  }
  return (
    <>
      <div>
        <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Pessoa</p>
        <select value={form.pessoa_id} onChange={e => setForm(escolherPessoa(form, e.target.value))}
          className="bg-black text-white text-xs w-full" style={selectStyle}>
          <option value="">— selecionar pessoa —</option>
          {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome_exibicao || p.nome}</option>)}
        </select>
      </div>
      <div>
        <p className="text-white/30 text-xs mb-1" style={{ fontFamily: FONT_BODY }}>Empresa</p>
        <select value={form.empresa_id} onChange={e => setForm(escolherEmpresa(form, e.target.value))}
          className="bg-black text-white text-xs w-full" style={selectStyle}>
          <option value="">— selecionar empresa —</option>
          {empresas.map(em => <option key={em.id} value={em.id}>{em.nome}</option>)}
        </select>
      </div>
    </>
  )
}

const inp = (val: string, onChange: (v: string) => void, ph?: string) => (
  <input type="text" value={val} onChange={e => onChange(e.target.value)} placeholder={ph}
    className="placeholder-white/20 w-full"
    style={{ fontFamily: FONT_BODY, fontSize: '13px', background: 'transparent', color: 'white', outline: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px' }} />
)

/**
 * Mesma precedência que `FilmeContent` usa no site: pessoa vence, depois
 * empresa, e o `nome_exibicao` do crédito só entra quando não há vínculo
 * nenhum. Espelhar isso aqui é o ponto — se o painel escolhesse outra ordem,
 * mostraria um nome que o visitante nunca vê.
 */
function rotuloCredito(r: Credito): string | null {
  if (r.pessoa_id && r.pessoas) return r.pessoas.nome_exibicao || r.pessoas.nome
  if (r.empresa_id && r.empresas) return r.empresas.nome
  return r.nome_exibicao || null
}

function SortableRow({
  r, deletingId, onDelete, onEdit, isEditing, editForm, setEditForm, onSave, onCancel, saving, editError, pessoas, empresas,
}: {
  r: Credito
  deletingId: string | null
  onDelete: (id: string) => void
  onEdit: (r: Credito) => void
  isEditing: boolean
  editForm: AddForm
  setEditForm: (f: AddForm) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  editError: string | null
  pessoas: Pessoa[]
  empresas: Empresa[]
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
              {r.cargo}
              {rotuloCredito(r) && (
                <span className="text-white/50">
                  {' — '}{rotuloCredito(r)}
                  {r.empresa_id && r.empresas && (
                    <span className="text-white/25" style={{ fontStyle: 'italic' }}> (empresa)</span>
                  )}
                </span>
              )}
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
            <div>{inp(editForm.cargo, v => setEditForm({ ...editForm, cargo: v }), 'Cargo (ex: Direção) *')}</div>
            <div />
            <VinculoFields form={editForm} setForm={setEditForm} pessoas={pessoas} empresas={empresas} />
            <div className="col-span-2">{inp(editForm.nome_exibicao, v => setEditForm({ ...editForm, nome_exibicao: v }), 'Nome de exibição (sobrescreve)')}</div>
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

export function CreditosPanel({ filmeId, pessoas, empresas }: { filmeId: string; pessoas: Pessoa[]; empresas: Empresa[] }) {
  const [rows, setRows] = useState<Credito[]>([])
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

  const { sensors, handleDragEnd, isSaving } = useSortablePanel(rows, setRows, { filmeId, endpoint: 'creditos' })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/filmes/${filmeId}/creditos`)
    if (res.ok) setRows(await res.json())
    setLoading(false)
  }, [filmeId])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.cargo.trim()) { setError('Cargo é obrigatório'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/filmes/${filmeId}/creditos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cargo: form.cargo,
          pessoa_id: form.pessoa_id || null,
          empresa_id: form.empresa_id || null,
          nome_exibicao: form.nome_exibicao || null,
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
    await fetch(`/api/admin/filmes/${filmeId}/creditos/${id}`, { method: 'DELETE' })
    setDeletingId(null); await load()
  }

  const handleEditStart = (r: Credito) => {
    setEditingId(r.id)
    setEditError(null)
    setEditForm({
      cargo: r.cargo,
      pessoa_id: r.pessoa_id ?? '',
      empresa_id: r.empresa_id ?? '',
      nome_exibicao: r.nome_exibicao ?? '',
    })
    setAdding(false)
  }

  const handleEditSave = async () => {
    if (!editForm.cargo.trim()) { setEditError('Cargo é obrigatório'); return }
    setEditSaving(true); setEditError(null)
    try {
      const payload = {
        cargo: editForm.cargo,
        pessoa_id: editForm.pessoa_id || null,
        empresa_id: editForm.empresa_id || null,
        nome_exibicao: editForm.nome_exibicao || null,
      }
      const res = await fetch(`/api/admin/filmes/${filmeId}/creditos/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro ao salvar')
      setEditingId(null)
      // Recarrega em vez de fundir localmente: trocar de pessoa para empresa
      // (ou vice-versa) muda o objeto aninhado que a linha exibe, e o merge
      // otimista deixaria o nome antigo na tela.
      await load()
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
          Créditos ({rows.length}){isSaving && <span className="ml-2 opacity-40"> salvando…</span>}
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
          {rows.length === 0 && <p className="text-white/20 text-xs py-2" style={{ fontFamily: FONT_BODY }}>Nenhum crédito ainda.</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map(r => (
                <SortableRow
                  key={r.id} r={r} deletingId={deletingId} onDelete={handleDelete}
                  onEdit={handleEditStart} isEditing={editingId === r.id}
                  editForm={editForm} setEditForm={setEditForm}
                  onSave={handleEditSave} onCancel={handleEditCancel}
                  saving={editSaving} editError={editError} pessoas={pessoas} empresas={empresas}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {adding && (
        <div className="p-4 mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>{inp(form.cargo, v => setForm(f => ({ ...f, cargo: v })), 'Cargo (ex: Direção) *')}</div>
            <div />
            <VinculoFields form={form} setForm={setForm} pessoas={pessoas} empresas={empresas} />
            <div className="col-span-2">{inp(form.nome_exibicao, v => setForm(f => ({ ...f, nome_exibicao: v })), 'Nome de exibição (sobrescreve)')}</div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3" style={{ fontFamily: FONT_BODY }}>{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving}
              className="text-xs px-4 py-1.5 transition-colors" style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.3)' : 'white' }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.3)' : 'white' }}>
              {saving ? 'Salvando…' : 'Adicionar crédito'}
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
