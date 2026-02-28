'use client'

import { useState, useEffect, useCallback } from 'react'
import { StorageUpload } from './StorageUpload'
import { RichTextEditor } from './RichTextEditor'
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload'
import { useSlugCheck } from '@/lib/hooks/useSlugCheck'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

const inputStyle: React.CSSProperties = {
  fontFamily: FONT_BODY, fontSize: '14px', background: 'transparent',
  color: 'white', outline: 'none', width: '100%',
  borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px',
}
const labelStyle: React.CSSProperties = {
  fontFamily: FONT_BODY, fontSize: '11px', letterSpacing: '0.08em',
  textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)',
  display: 'block', marginBottom: '6px',
}
const sectionTitleStyle: React.CSSProperties = {
  fontFamily: FONT_HEADING, fontSize: '13px', fontWeight: 700,
  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.5)', paddingBottom: '12px',
  marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
}

function generateSlug(nome: string): string {
  return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface PessoaFormProps { pessoaId?: string; onSave: () => void; onCancel: () => void; onDirtyChange?: (isDirty: boolean) => void }

interface FormData {
  nome: string; nome_exibicao: string; slug: string
  areas_atuacao: string; bio_pt: string; bio_en: string
  links: string; visibilidade: string; foto_url: string
}

const EMPTY: FormData = {
  nome: '', nome_exibicao: '', slug: '', areas_atuacao: '',
  bio_pt: '', bio_en: '', links: '', visibilidade: 'rascunho', foto_url: '',
}

export function PessoaForm({ pessoaId, onSave, onCancel, onDirtyChange }: PessoaFormProps) {
  const isEdit = !!pessoaId
  const [form, setForm] = useState<FormData>(EMPTY)
  const [initialForm, setInitialForm] = useState<FormData>(EMPTY)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm)
  useBeforeUnload(isDirty)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const { slugStatus, checkSlug } = useSlugCheck(form.slug, 'pessoas', pessoaId)

  useEffect(() => {
    if (!pessoaId) return
    setLoadingData(true)
    fetch(`/api/admin/pessoas/${pessoaId}`)
      .then(r => r.json())
      .then(d => {
        const loaded: FormData = {
          nome: d.nome ?? '',
          nome_exibicao: d.nome_exibicao ?? '',
          slug: d.slug ?? '',
          areas_atuacao: (d.areas_atuacao ?? []).join(', '),
          bio_pt: d.bio_pt ?? '',
          bio_en: d.bio_en ?? '',
          links: (d.links ?? []).join(', '),
          visibilidade: d.visibilidade ?? 'rascunho',
          foto_url: d.foto_url ?? '',
        }
        setForm(loaded)
        setInitialForm(loaded)
        setSlugTouched(true)
        setLoadingData(false)
      })
      .catch(() => { setError('Erro ao carregar dados'); setLoadingData(false) })
  }, [pessoaId])

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  const handleNomeChange = useCallback((v: string) => {
    set('nome', v)
    if (!isEdit && !slugTouched) set('slug', generateSlug(v))
  }, [isEdit, slugTouched, set])

  const toArr = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null)
    if (!form.nome.trim()) { setError('Nome é obrigatório'); return }
    if (slugStatus === 'taken') { setError('Este slug já está em uso. Escolha outro.'); return }
    setSaving(true)
    try {
      const payload = {
        nome: form.nome,
        nome_exibicao: form.nome_exibicao || null,
        slug: form.slug || generateSlug(form.nome),
        areas_atuacao: toArr(form.areas_atuacao).length > 0 ? toArr(form.areas_atuacao) : null,
        bio_pt: form.bio_pt || null,
        bio_en: form.bio_en || null,
        links: toArr(form.links).length > 0 ? toArr(form.links) : null,
        visibilidade: form.visibilidade || null,
        foto_url: form.foto_url || null,
      }
      const url = isEdit ? `/api/admin/pessoas/${pessoaId}` : '/api/admin/pessoas'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Erro ${res.status}`)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSaving(false)
    }
  }

  if (loadingData) {
    return <div className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Carregando…</div>
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <h2 className="text-white mb-8"
        style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        {isEdit ? 'Editar Pessoa' : 'Nova Pessoa'}
      </h2>

      {/* Identificação */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Identificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Nome <span style={{ color: 'rgba(239,68,68,0.7)' }}>*</span></label>
            <input type="text" value={form.nome} onChange={e => handleNomeChange(e.target.value)}
              placeholder="Nome completo" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nome de Exibição</label>
            <input type="text" value={form.nome_exibicao} onChange={e => set('nome_exibicao', e.target.value)}
              placeholder="Como aparece no site" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input type="text" value={form.slug} onChange={e => { setSlugTouched(true); set('slug', e.target.value) }}
              onBlur={() => checkSlug()}
              placeholder="nome-da-pessoa" className="placeholder-white/20" style={inputStyle} />
            {slugStatus === 'checking' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.35)' }}>⟳ verificando…</p>}
            {slugStatus === 'available' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(134,239,172,0.8)' }}>✓ disponível</p>}
            {slugStatus === 'taken' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(248,113,113,0.9)' }}>✗ já em uso</p>}
          </div>
          <div>
            <label style={labelStyle}>Visibilidade</label>
            <select value={form.visibilidade} onChange={e => set('visibilidade', e.target.value)}
              className="bg-black" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="rascunho">Rascunho</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Áreas de Atuação (separadas por vírgula)</label>
            <input type="text" value={form.areas_atuacao} onChange={e => set('areas_atuacao', e.target.value)}
              placeholder="Direção, Roteiro, Montagem" className="placeholder-white/20" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Foto */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Foto de Perfil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Upload de foto</label>
            <StorageUpload
              storagePath={`pessoas/${pessoaId ?? 'new'}`}
              onUploaded={url => set('foto_url', url)}
              existingUrl={form.foto_url}
              accept="image/*"
              label="Enviar foto"
            />
          </div>
          <div>
            <label style={labelStyle}>URL da foto (alternativa)</label>
            <input type="text" value={form.foto_url} onChange={e => set('foto_url', e.target.value)}
              placeholder="https://…/foto.jpg" className="placeholder-white/20" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Biografia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Bio (PT)</label>
            <RichTextEditor
              value={form.bio_pt}
              onChange={v => set('bio_pt', v)}
              placeholder="Biografia em português…"
              minHeight="144px"
            />
          </div>
          <div>
            <label style={labelStyle}>Bio (EN)</label>
            <RichTextEditor
              value={form.bio_en}
              onChange={v => set('bio_en', v)}
              placeholder="Biography in English…"
              minHeight="144px"
            />
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Links</h3>
        <div>
          <label style={labelStyle}>Links externos (separados por vírgula)</label>
          <input type="text" value={form.links} onChange={e => set('links', e.target.value)}
            placeholder="https://instagram.com/…, https://imdb.com/…" className="placeholder-white/20" style={inputStyle} />
        </div>
      </section>

      {error && (
        <div className="mb-6 px-4 py-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-red-400 text-sm" style={{ fontFamily: FONT_BODY }}>{error}</p>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button type="submit" disabled={saving}
          className="text-sm px-6 py-3 transition-colors"
          style={{ fontFamily: FONT_BODY, border: '1px solid white', color: saving ? 'rgba(255,255,255,0.4)' : 'white', cursor: saving ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.4)' : 'white' }}>
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar pessoa'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="text-sm transition-colors"
          style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.4)', cursor: saving ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
