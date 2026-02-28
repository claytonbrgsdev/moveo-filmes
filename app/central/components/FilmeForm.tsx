'use client'

import { useState, useEffect, useCallback } from 'react'
import { StorageUpload } from './StorageUpload'
import { RichTextEditor } from './RichTextEditor'
import { useBeforeUnload } from '@/lib/hooks/useBeforeUnload'
import { useSlugCheck } from '@/lib/hooks/useSlugCheck'
import { AssetsPanel } from './sub/AssetsPanel'
import { CreditosPanel } from './sub/CreditosPanel'
import { ElencoPanel } from './sub/ElencoPanel'
import { FestivaisPanel } from './sub/FestivaisPanel'
import { PremiacoesPanel } from './sub/PremiacoesPanel'
import { FinanciamentosPanel } from './sub/FinanciamentosPanel'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

// ─── Styling helpers ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: '14px',
  background: 'transparent',
  color: 'white',
  outline: 'none',
  width: '100%',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  paddingBottom: '8px',
}

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.35)',
  display: 'block',
  marginBottom: '6px',
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: FONT_HEADING,
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.5)',
  paddingBottom: '12px',
  marginBottom: '20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  // Identificação
  titulo_pt: string
  titulo_en: string
  slug: string
  categoria_site: string
  tipo_obra: string
  visibilidade: string
  ano: string
  ano_previsto: string
  status_interno_pt: string
  status_interno_en: string
  // Conteúdo
  logline_pt: string
  logline_en: string
  sinopse_pt: string
  sinopse_en: string
  resumo_curto_pt: string
  resumo_curto_en: string
  // Imagens
  poster_principal_url: string
  thumbnail_card_url: string
  imagem_og_url: string
  // Metadados
  generos: string
  tags: string
  duracao_min: string
  paises_producao: string
  classificacao_indicativa: string
  ordem_exibicao: string
  // SEO
  titulo_seo_pt: string
  titulo_seo_en: string
  descricao_seo_pt: string
  descricao_seo_en: string
}

const EMPTY_FORM: FormData = {
  titulo_pt: '', titulo_en: '', slug: '',
  categoria_site: 'desenvolvimento', tipo_obra: '', visibilidade: 'rascunho',
  ano: '', ano_previsto: '', status_interno_pt: '', status_interno_en: '',
  logline_pt: '', logline_en: '', sinopse_pt: '', sinopse_en: '',
  resumo_curto_pt: '', resumo_curto_en: '',
  poster_principal_url: '', thumbnail_card_url: '', imagem_og_url: '',
  generos: '', tags: '', duracao_min: '', paises_producao: '',
  classificacao_indicativa: '', ordem_exibicao: '',
  titulo_seo_pt: '', titulo_seo_en: '', descricao_seo_pt: '', descricao_seo_en: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function arrayFieldToString(val: string[] | null | undefined): string {
  return (val ?? []).join(', ')
}

function stringToArray(val: string): string[] | null {
  const arr = val.split(',').map((s) => s.trim()).filter(Boolean)
  return arr.length > 0 ? arr : null
}

// Convert FormData to the payload shape for the API
function formToPayload(form: FormData, isCreate: boolean) {
  const payload: Record<string, unknown> = {
    titulo_pt: form.titulo_pt || null,
    titulo_en: form.titulo_en || null,
    slug: form.slug,
    categoria_site: form.categoria_site || null,
    tipo_obra: form.tipo_obra || null,
    visibilidade: form.visibilidade || null,
    ano: form.ano ? parseInt(form.ano, 10) : null,
    ano_previsto: form.ano_previsto ? parseInt(form.ano_previsto, 10) : null,
    status_interno_pt: form.status_interno_pt || null,
    status_interno_en: form.status_interno_en || null,
    logline_pt: form.logline_pt || null,
    logline_en: form.logline_en || null,
    sinopse_pt: form.sinopse_pt || null,
    sinopse_en: form.sinopse_en || null,
    resumo_curto_pt: form.resumo_curto_pt || null,
    resumo_curto_en: form.resumo_curto_en || null,
    poster_principal_url: form.poster_principal_url || null,
    thumbnail_card_url: form.thumbnail_card_url || null,
    imagem_og_url: form.imagem_og_url || null,
    generos: stringToArray(form.generos),
    tags: stringToArray(form.tags),
    duracao_min: form.duracao_min ? parseInt(form.duracao_min, 10) : null,
    paises_producao: stringToArray(form.paises_producao),
    classificacao_indicativa: form.classificacao_indicativa || null,
    ordem_exibicao: form.ordem_exibicao ? parseInt(form.ordem_exibicao, 10) : null,
    titulo_seo_pt: form.titulo_seo_pt || null,
    titulo_seo_en: form.titulo_seo_en || null,
    descricao_seo_pt: form.descricao_seo_pt || null,
    descricao_seo_en: form.descricao_seo_en || null,
  }
  if (!isCreate) {
    payload.updated_at = new Date().toISOString()
  }
  return payload
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'rgba(239,68,68,0.7)' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value, onChange, placeholder, disabled,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="placeholder-white/20"
      style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }}
    />
  )
}

function NumberInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="placeholder-white/20"
      style={inputStyle}
    />
  )
}

function TextArea({
  value, onChange, placeholder, rows = 3,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="placeholder-white/20 resize-y"
      style={{
        ...inputStyle,
        borderBottom: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '10px',
        minHeight: `${rows * 24}px`,
      }}
    />
  )
}

function SelectInput({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...inputStyle,
        cursor: 'pointer',
        appearance: 'none' as const,
      }}
      className="bg-black"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ background: '#000' }}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

interface FilmeFormProps {
  filmeId?: string
  onSave: () => void
  onCancel: () => void
  pessoas?: { id: string; nome: string; nome_exibicao: string | null }[]
  onDirtyChange?: (isDirty: boolean) => void
}

export function FilmeForm({ filmeId, onSave, onCancel, pessoas = [], onDirtyChange }: FilmeFormProps) {
  const isEdit = !!filmeId
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [initialForm, setInitialForm] = useState<FormData>(EMPTY_FORM)
  const [loadingData, setLoadingData] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm)
  useBeforeUnload(isDirty)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const { slugStatus, checkSlug } = useSlugCheck(form.slug, 'filmes', filmeId)

  // Load existing film data in edit mode
  useEffect(() => {
    if (!filmeId) return
    setLoadingData(true)
    fetch(`/api/admin/filmes/${filmeId}`)
      .then((r) => r.json())
      .then((data) => {
        const loaded: FormData = {
          titulo_pt: data.titulo_pt ?? '',
          titulo_en: data.titulo_en ?? '',
          slug: data.slug ?? '',
          categoria_site: data.categoria_site ?? 'desenvolvimento',
          tipo_obra: data.tipo_obra ?? '',
          visibilidade: data.visibilidade ?? 'rascunho',
          ano: data.ano != null ? String(data.ano) : '',
          ano_previsto: data.ano_previsto != null ? String(data.ano_previsto) : '',
          status_interno_pt: data.status_interno_pt ?? '',
          status_interno_en: data.status_interno_en ?? '',
          logline_pt: data.logline_pt ?? '',
          logline_en: data.logline_en ?? '',
          sinopse_pt: data.sinopse_pt ?? '',
          sinopse_en: data.sinopse_en ?? '',
          resumo_curto_pt: data.resumo_curto_pt ?? '',
          resumo_curto_en: data.resumo_curto_en ?? '',
          poster_principal_url: data.poster_principal_url ?? '',
          thumbnail_card_url: data.thumbnail_card_url ?? '',
          imagem_og_url: data.imagem_og_url ?? '',
          generos: arrayFieldToString(data.generos),
          tags: arrayFieldToString(data.tags),
          duracao_min: data.duracao_min != null ? String(data.duracao_min) : '',
          paises_producao: arrayFieldToString(data.paises_producao),
          classificacao_indicativa: data.classificacao_indicativa ?? '',
          ordem_exibicao: data.ordem_exibicao != null ? String(data.ordem_exibicao) : '',
          titulo_seo_pt: data.titulo_seo_pt ?? '',
          titulo_seo_en: data.titulo_seo_en ?? '',
          descricao_seo_pt: data.descricao_seo_pt ?? '',
          descricao_seo_en: data.descricao_seo_en ?? '',
        }
        setForm(loaded)
        setInitialForm(loaded)
        setSlugTouched(true) // In edit mode, don't auto-generate slug
        setLoadingData(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados do filme')
        setLoadingData(false)
      })
  }, [filmeId])

  const setField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Auto-generate slug from titulo_pt in create mode
  const handleTituloPtChange = useCallback((value: string) => {
    setField('titulo_pt', value)
    if (!isEdit && !slugTouched) {
      setField('slug', generateSlug(value))
    }
  }, [isEdit, slugTouched, setField])

  const handleSlugChange = useCallback((value: string) => {
    setSlugTouched(true)
    setField('slug', value)
  }, [setField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.titulo_pt.trim()) {
      setError('Título (PT) é obrigatório')
      return
    }
    if (!form.slug.trim()) {
      setError('Slug é obrigatório')
      return
    }
    if (slugStatus === 'taken') {
      setError('Este slug já está em uso. Escolha outro.')
      return
    }

    setSaving(true)
    try {
      const payload = formToPayload(form, !isEdit)
      const url = isEdit ? `/api/admin/filmes/${filmeId}` : '/api/admin/filmes'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Erro ${res.status}`)
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSaving(false)
    }
  }

  if (loadingData) {
    return (
      <div className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>
        Carregando filme…
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">

      {/* Form title */}
      <h2
        className="text-white mb-8"
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 'clamp(20px, 2.5vw, 32px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {isEdit ? 'Editar Filme' : 'Novo Filme'}
      </h2>

      {/* ── Identificação ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Identificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Título (PT)" required>
            <TextInput value={form.titulo_pt} onChange={handleTituloPtChange} placeholder="O título em português" />
          </Field>
          <Field label="Título (EN)">
            <TextInput value={form.titulo_en} onChange={(v) => setField('titulo_en', v)} placeholder="The English title" />
          </Field>
          <Field label="Slug (URL)" required>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              onBlur={() => checkSlug()}
              placeholder="meu-filme"
              className="placeholder-white/20"
              style={inputStyle}
            />
            {slugStatus === 'checking' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.35)' }}>⟳ verificando…</p>}
            {slugStatus === 'available' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(134,239,172,0.8)' }}>✓ disponível</p>}
            {slugStatus === 'taken' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(248,113,113,0.9)' }}>✗ já em uso</p>}
          </Field>
          <Field label="Categoria no Site">
            <SelectInput
              value={form.categoria_site}
              onChange={(v) => setField('categoria_site', v)}
              options={[
                { value: 'cinema', label: 'Cinema' },
                { value: 'mostra', label: 'Mostras e Exposições' },
                { value: 'desenvolvimento', label: 'Desenvolvimento' },
                { value: 'pre-producao', label: 'Pré-produção' },
                { value: 'pos-producao', label: 'Pós-produção' },
                { value: 'distribuicao', label: 'Distribuição' },
              ]}
            />
          </Field>
          <Field label="Tipo de Obra">
            <TextInput value={form.tipo_obra} onChange={(v) => setField('tipo_obra', v)} placeholder="Longa-metragem" />
          </Field>
          <Field label="Visibilidade">
            <SelectInput
              value={form.visibilidade}
              onChange={(v) => setField('visibilidade', v)}
              options={[
                { value: 'rascunho', label: 'Rascunho (invisível no site)' },
                { value: 'publico', label: 'Público (visível no site)' },
                { value: 'privado', label: 'Privado' },
              ]}
            />
          </Field>
          <Field label="Ano">
            <NumberInput value={form.ano} onChange={(v) => setField('ano', v)} placeholder="2025" />
          </Field>
          <Field label="Ano Previsto">
            <NumberInput value={form.ano_previsto} onChange={(v) => setField('ano_previsto', v)} placeholder="2026" />
          </Field>
          <Field label="Status Interno (PT)">
            <TextInput value={form.status_interno_pt} onChange={(v) => setField('status_interno_pt', v)} placeholder="Em desenvolvimento" />
          </Field>
          <Field label="Status Interno (EN)">
            <TextInput value={form.status_interno_en} onChange={(v) => setField('status_interno_en', v)} placeholder="In development" />
          </Field>
        </div>
      </section>

      {/* ── Conteúdo ──────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Conteúdo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Logline (PT)">
            <TextArea value={form.logline_pt} onChange={(v) => setField('logline_pt', v)} placeholder="Uma frase que resume o filme" rows={3} />
          </Field>
          <Field label="Logline (EN)">
            <TextArea value={form.logline_en} onChange={(v) => setField('logline_en', v)} placeholder="One sentence that summarizes the film" rows={3} />
          </Field>
          <Field label="Sinopse (PT)">
            <RichTextEditor
              value={form.sinopse_pt}
              onChange={(v) => setField('sinopse_pt', v)}
              placeholder="Sinopse completa em português…"
              minHeight="120px"
            />
          </Field>
          <Field label="Sinopse (EN)">
            <RichTextEditor
              value={form.sinopse_en}
              onChange={(v) => setField('sinopse_en', v)}
              placeholder="Full synopsis in English…"
              minHeight="120px"
            />
          </Field>
          <Field label="Resumo Curto (PT)">
            <TextArea value={form.resumo_curto_pt} onChange={(v) => setField('resumo_curto_pt', v)} placeholder="Versão curta para cards e listas" rows={2} />
          </Field>
          <Field label="Resumo Curto (EN)">
            <TextArea value={form.resumo_curto_en} onChange={(v) => setField('resumo_curto_en', v)} placeholder="Short version for cards and lists" rows={2} />
          </Field>
        </div>
      </section>

      {/* ── Imagens ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Imagens Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Field label="Poster Principal">
              <StorageUpload
                storagePath={`filmes/${filmeId ?? 'new'}/poster`}
                onUploaded={(url) => setField('poster_principal_url', url)}
                existingUrl={form.poster_principal_url}
                accept="image/*"
                label="Enviar poster"
              />
              <div className="mt-2">
                <TextInput value={form.poster_principal_url} onChange={(v) => setField('poster_principal_url', v)} placeholder="https://…/poster.jpg" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Thumbnail para Cards">
              <StorageUpload
                storagePath={`filmes/${filmeId ?? 'new'}/thumbnail`}
                onUploaded={(url) => setField('thumbnail_card_url', url)}
                existingUrl={form.thumbnail_card_url}
                accept="image/*"
                label="Enviar thumbnail"
              />
              <div className="mt-2">
                <TextInput value={form.thumbnail_card_url} onChange={(v) => setField('thumbnail_card_url', v)} placeholder="https://…/thumb.jpg" />
              </div>
            </Field>
          </div>
          <div>
            <Field label="Imagem Open Graph">
              <StorageUpload
                storagePath={`filmes/${filmeId ?? 'new'}/og`}
                onUploaded={(url) => setField('imagem_og_url', url)}
                existingUrl={form.imagem_og_url}
                accept="image/*"
                label="Enviar imagem OG"
              />
              <div className="mt-2">
                <TextInput value={form.imagem_og_url} onChange={(v) => setField('imagem_og_url', v)} placeholder="https://…/og.jpg" />
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* ── Metadados ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Metadados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Gêneros (separados por vírgula)">
            <TextInput value={form.generos} onChange={(v) => setField('generos', v)} placeholder="Drama, Romance, Thriller" />
          </Field>
          <Field label="Tags (separadas por vírgula)">
            <TextInput value={form.tags} onChange={(v) => setField('tags', v)} placeholder="família, sertão, memória" />
          </Field>
          <Field label="Duração (minutos)">
            <NumberInput value={form.duracao_min} onChange={(v) => setField('duracao_min', v)} placeholder="95" />
          </Field>
          <Field label="Países de Produção (separados por vírgula)">
            <TextInput value={form.paises_producao} onChange={(v) => setField('paises_producao', v)} placeholder="Brasil, França" />
          </Field>
          <Field label="Classificação Indicativa">
            <TextInput value={form.classificacao_indicativa} onChange={(v) => setField('classificacao_indicativa', v)} placeholder="16, L, 12" />
          </Field>
          <Field label="Ordem de Exibição">
            <NumberInput value={form.ordem_exibicao} onChange={(v) => setField('ordem_exibicao', v)} placeholder="1" />
          </Field>
        </div>
      </section>

      {/* ── SEO ───────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Título SEO (PT)">
            <TextInput value={form.titulo_seo_pt} onChange={(v) => setField('titulo_seo_pt', v)} placeholder="Título para mecanismos de busca" />
          </Field>
          <Field label="Título SEO (EN)">
            <TextInput value={form.titulo_seo_en} onChange={(v) => setField('titulo_seo_en', v)} placeholder="Title for search engines" />
          </Field>
          <Field label="Descrição SEO (PT)">
            <TextArea value={form.descricao_seo_pt} onChange={(v) => setField('descricao_seo_pt', v)} placeholder="Descrição para Google, max ~160 caracteres" rows={2} />
          </Field>
          <Field label="Descrição SEO (EN)">
            <TextArea value={form.descricao_seo_en} onChange={(v) => setField('descricao_seo_en', v)} placeholder="Description for Google, max ~160 chars" rows={2} />
          </Field>
        </div>
      </section>

      {/* ── Sub-tables (edit mode only) ───────────────────────────── */}
      {isEdit && filmeId && (
        <>
          <div className="mb-6 pt-2" style={{ borderTop: '2px solid rgba(255,255,255,0.06)' }}>
            <h2
              className="text-white mb-8 mt-6"
              style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              Conteúdo Associado
            </h2>
            <p className="text-white/30 text-xs mb-8" style={{ fontFamily: FONT_BODY }}>
              Gerencie assets, créditos, elenco, festivais, premiações e financiamentos deste filme.
            </p>
          </div>

          {/* Assets */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <AssetsPanel filmeId={filmeId} />
          </section>

          {/* Créditos */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <CreditosPanel filmeId={filmeId} pessoas={pessoas} />
          </section>

          {/* Elenco */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <ElencoPanel filmeId={filmeId} pessoas={pessoas} />
          </section>

          {/* Festivais */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <FestivaisPanel filmeId={filmeId} />
          </section>

          {/* Premiações */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <PremiacoesPanel filmeId={filmeId} />
          </section>

          {/* Financiamentos */}
          <section className="mb-8 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <FinanciamentosPanel filmeId={filmeId} />
          </section>
        </>
      )}

      {/* ── Error + Actions ───────────────────────────────────────── */}
      {error && (
        <div
          className="mb-6 px-4 py-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <p className="text-red-400 text-sm" style={{ fontFamily: FONT_BODY }}>
            {error}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          type="submit"
          disabled={saving}
          className="text-sm px-6 py-3 transition-colors"
          style={{
            fontFamily: FONT_BODY,
            border: '1px solid white',
            color: saving ? 'rgba(255,255,255,0.4)' : 'white',
            background: saving ? 'transparent' : 'transparent',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'black' } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saving ? 'rgba(255,255,255,0.4)' : 'white' }}
        >
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar filme'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="text-sm transition-colors"
          style={{
            fontFamily: FONT_BODY,
            color: 'rgba(255,255,255,0.4)',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
