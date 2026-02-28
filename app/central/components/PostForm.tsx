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

function generateSlug(titulo: string): string {
  return titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface PostFormProps {
  postId?: string
  filmes: { id: string; titulo_pt: string }[]
  onSave: () => void
  onCancel: () => void
  onDirtyChange?: (isDirty: boolean) => void
}

interface FormData {
  titulo_pt: string; titulo_en: string; slug: string; tipo: string
  visibilidade: string; publicado_em: string; resumo_pt: string; resumo_en: string
  conteudo_pt: string; conteudo_en: string; imagem_capa_url: string
  url_externa: string; filmes_ids: string[]
}

const EMPTY: FormData = {
  titulo_pt: '', titulo_en: '', slug: '', tipo: 'noticia',
  visibilidade: 'rascunho', publicado_em: '', resumo_pt: '', resumo_en: '',
  conteudo_pt: '', conteudo_en: '', imagem_capa_url: '', url_externa: '', filmes_ids: [],
}

export function PostForm({ postId, filmes, onSave, onCancel, onDirtyChange }: PostFormProps) {
  const isEdit = !!postId
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

  const { slugStatus, checkSlug } = useSlugCheck(form.slug, 'posts', postId)

  useEffect(() => {
    if (!postId) return
    setLoadingData(true)
    fetch(`/api/admin/posts/${postId}`)
      .then(r => r.json())
      .then(d => {
        const loaded: FormData = {
          titulo_pt: d.titulo_pt ?? '', titulo_en: d.titulo_en ?? '',
          slug: d.slug ?? '', tipo: d.tipo ?? 'noticia',
          visibilidade: d.visibilidade ?? 'rascunho',
          publicado_em: d.publicado_em ? d.publicado_em.slice(0, 10) : '',
          resumo_pt: d.resumo_pt ?? '', resumo_en: d.resumo_en ?? '',
          conteudo_pt: d.conteudo_pt ?? '', conteudo_en: d.conteudo_en ?? '',
          imagem_capa_url: d.imagem_capa_url ?? '', url_externa: d.url_externa ?? '',
          filmes_ids: d.filmes_ids ?? [],
        }
        setForm(loaded)
        setInitialForm(loaded)
        setSlugTouched(true)
        setLoadingData(false)
      })
      .catch(() => { setError('Erro ao carregar dados'); setLoadingData(false) })
  }, [postId])

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  const handleTituloChange = useCallback((v: string) => {
    set('titulo_pt', v)
    if (!isEdit && !slugTouched) set('slug', generateSlug(v))
  }, [isEdit, slugTouched, set])

  const toggleFilme = (id: string) => {
    setForm(prev => ({
      ...prev,
      filmes_ids: prev.filmes_ids.includes(id)
        ? prev.filmes_ids.filter(x => x !== id)
        : [...prev.filmes_ids, id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null)
    if (!form.titulo_pt.trim()) { setError('Título (PT) é obrigatório'); return }
    if (!form.slug.trim()) { setError('Slug é obrigatório'); return }
    if (slugStatus === 'taken') { setError('Este slug já está em uso. Escolha outro.'); return }
    setSaving(true)
    try {
      const payload = {
        titulo_pt: form.titulo_pt, titulo_en: form.titulo_en || null,
        slug: form.slug, tipo: form.tipo || null,
        visibilidade: form.visibilidade || null,
        publicado_em: form.publicado_em || null,
        resumo_pt: form.resumo_pt || null, resumo_en: form.resumo_en || null,
        conteudo_pt: form.conteudo_pt || null, conteudo_en: form.conteudo_en || null,
        imagem_capa_url: form.imagem_capa_url || null,
        url_externa: form.url_externa || null,
        filmes_ids: form.filmes_ids.length > 0 ? form.filmes_ids : null,
      }
      const url = isEdit ? `/api/admin/posts/${postId}` : '/api/admin/posts'
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

  if (loadingData) return <div className="text-white/30 text-sm py-8" style={{ fontFamily: FONT_BODY }}>Carregando…</div>

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <h2 className="text-white mb-8"
        style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        {isEdit ? 'Editar Post' : 'Novo Post'}
      </h2>

      {/* Identificação */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Identificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Título (PT) <span style={{ color: 'rgba(239,68,68,0.7)' }}>*</span></label>
            <input type="text" value={form.titulo_pt} onChange={e => handleTituloChange(e.target.value)}
              placeholder="Título do post" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Título (EN)</label>
            <input type="text" value={form.titulo_en} onChange={e => set('titulo_en', e.target.value)}
              placeholder="Post title in English" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug <span style={{ color: 'rgba(239,68,68,0.7)' }}>*</span></label>
            <input type="text" value={form.slug} onChange={e => { setSlugTouched(true); set('slug', e.target.value) }}
              onBlur={() => checkSlug()}
              placeholder="meu-post" className="placeholder-white/20" style={inputStyle} />
            {slugStatus === 'checking' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.35)' }}>⟳ verificando…</p>}
            {slugStatus === 'available' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(134,239,172,0.8)' }}>✓ disponível</p>}
            {slugStatus === 'taken' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(248,113,113,0.9)' }}>✗ já em uso</p>}
          </div>
          <div>
            <label style={labelStyle}>Tipo</label>
            <select value={form.tipo} onChange={e => set('tipo', e.target.value)}
              className="bg-black" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="noticia">Notícia</option>
              <option value="press">Press</option>
              <option value="entrevista">Entrevista</option>
              <option value="critica">Crítica</option>
              <option value="evento">Evento</option>
              <option value="outro">Outro</option>
            </select>
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
          <div>
            <label style={labelStyle}>Data de Publicação</label>
            <input type="date" value={form.publicado_em} onChange={e => set('publicado_em', e.target.value)}
              className="placeholder-white/20"
              style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>
        </div>
      </section>

      {/* Imagem de capa */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Imagem de Capa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Upload</label>
            <StorageUpload
              storagePath={`posts/${postId ?? 'new'}`}
              onUploaded={url => set('imagem_capa_url', url)}
              existingUrl={form.imagem_capa_url}
              accept="image/*"
              label="Enviar imagem de capa"
            />
          </div>
          <div>
            <label style={labelStyle}>URL da imagem (alternativa)</label>
            <input type="text" value={form.imagem_capa_url} onChange={e => set('imagem_capa_url', e.target.value)}
              placeholder="https://…/capa.jpg" className="placeholder-white/20" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Resumos */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Resumos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Resumo (PT)</label>
            <textarea value={form.resumo_pt} onChange={e => set('resumo_pt', e.target.value)}
              rows={3} placeholder="Resumo curto para listagem…" className="placeholder-white/20 resize-y"
              style={{ ...inputStyle, borderBottom: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', minHeight: '80px' }} />
          </div>
          <div>
            <label style={labelStyle}>Resumo (EN)</label>
            <textarea value={form.resumo_en} onChange={e => set('resumo_en', e.target.value)}
              rows={3} placeholder="Short summary for listing…" className="placeholder-white/20 resize-y"
              style={{ ...inputStyle, borderBottom: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', minHeight: '80px' }} />
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Conteúdo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Conteúdo (PT)</label>
            <RichTextEditor
              value={form.conteudo_pt}
              onChange={v => set('conteudo_pt', v)}
              placeholder="Conteúdo completo do post…"
              minHeight="280px"
            />
          </div>
          <div>
            <label style={labelStyle}>Conteúdo (EN)</label>
            <RichTextEditor
              value={form.conteudo_en}
              onChange={v => set('conteudo_en', v)}
              placeholder="Full post content in English…"
              minHeight="280px"
            />
          </div>
        </div>
      </section>

      {/* Metadados */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Metadados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>URL Externa</label>
            <input type="text" value={form.url_externa} onChange={e => set('url_externa', e.target.value)}
              placeholder="https://… (link externo se aplicável)" className="placeholder-white/20" style={inputStyle} />
          </div>
          {filmes.length > 0 && (
            <div className="md:col-span-2">
              <label style={labelStyle}>Filmes relacionados</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {filmes.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFilme(f.id)}
                    className="text-xs px-3 py-1 transition-colors"
                    style={{
                      fontFamily: FONT_BODY,
                      border: form.filmes_ids.includes(f.id) ? '1px solid white' : '1px solid rgba(255,255,255,0.2)',
                      color: form.filmes_ids.includes(f.id) ? 'white' : 'rgba(255,255,255,0.4)',
                      background: form.filmes_ids.includes(f.id) ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >
                    {f.titulo_pt}
                  </button>
                ))}
              </div>
            </div>
          )}
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
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar post'}
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
