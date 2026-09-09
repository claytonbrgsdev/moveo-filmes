'use client'

import { useState, useEffect, useCallback } from 'react'
import { StorageUpload } from './StorageUpload'
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

/**
 * `empresas.tipo` não tem constraint no banco e não é exibido no site — serve
 * para a produção se organizar. Por isso é campo livre com sugestões, e não um
 * `<select>` fechado: fechar a lista aqui repetiria exatamente o erro que a
 * migração 002 teve de consertar em `filmes.categoria_site`, onde o formulário
 * oferecia valores que o banco recusava.
 */
const TIPOS_SUGERIDOS = ['produtora', 'coprodutora', 'distribuidora', 'agente-de-vendas']

interface EmpresaFormProps { empresaId?: string; onSave: () => void; onCancel: () => void; onDirtyChange?: (isDirty: boolean) => void }

interface FormData {
  nome: string; slug: string; tipo: string; pais: string
  site_oficial: string; email_contato: string; telefone: string
  descricao_curta: string; logo_url: string; visibilidade: string
}

const EMPTY: FormData = {
  nome: '', slug: '', tipo: '', pais: '', site_oficial: '',
  email_contato: '', telefone: '', descricao_curta: '', logo_url: '',
  visibilidade: 'publico',
}

export function EmpresaForm({ empresaId, onSave, onCancel, onDirtyChange }: EmpresaFormProps) {
  const isEdit = !!empresaId
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

  const { slugStatus, checkSlug } = useSlugCheck(form.slug, 'empresas', empresaId)

  useEffect(() => {
    if (!empresaId) return
    setLoadingData(true)
    fetch(`/api/admin/empresas/${empresaId}`)
      .then(r => r.json())
      .then(d => {
        const loaded: FormData = {
          nome: d.nome ?? '',
          slug: d.slug ?? '',
          tipo: d.tipo ?? '',
          pais: d.pais ?? '',
          site_oficial: d.site_oficial ?? '',
          email_contato: d.email_contato ?? '',
          telefone: d.telefone ?? '',
          descricao_curta: d.descricao_curta ?? '',
          logo_url: d.logo_url ?? '',
          visibilidade: d.visibilidade ?? 'publico',
        }
        setForm(loaded)
        setInitialForm(loaded)
        setSlugTouched(true)
        setLoadingData(false)
      })
      .catch(() => { setError('Erro ao carregar dados'); setLoadingData(false) })
  }, [empresaId])

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }, [])

  const handleNomeChange = useCallback((v: string) => {
    set('nome', v)
    if (!isEdit && !slugTouched) set('slug', generateSlug(v))
  }, [isEdit, slugTouched, set])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null)
    if (!form.nome.trim()) { setError('Nome é obrigatório'); return }
    if (slugStatus === 'taken') { setError('Este slug já está em uso. Escolha outro.'); return }
    setSaving(true)
    try {
      const payload = {
        nome: form.nome.trim(),
        // Slug fica nulo quando vazio, em vez de ser gerado à força como em
        // filmes e pessoas. Empresa ainda não tem página própria — a rota
        // /empresa/[slug] existe no build mas devolve null —, então o slug
        // aqui é opcional de verdade. E a coluna é UNIQUE: gerar
        // automaticamente faria duas empresas de mesmo nome colidirem sem que
        // ninguém tivesse pedido slug nenhum.
        slug: form.slug.trim() || null,
        tipo: form.tipo.trim() || null,
        pais: form.pais.trim() || null,
        site_oficial: form.site_oficial.trim() || null,
        email_contato: form.email_contato.trim() || null,
        telefone: form.telefone.trim() || null,
        descricao_curta: form.descricao_curta.trim() || null,
        logo_url: form.logo_url.trim() || null,
        visibilidade: form.visibilidade || null,
      }
      const url = isEdit ? `/api/admin/empresas/${empresaId}` : '/api/admin/empresas'
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
        {isEdit ? 'Editar Empresa' : 'Nova Empresa'}
      </h2>

      {/* Identificação */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Identificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Nome <span style={{ color: 'rgba(239,68,68,0.7)' }}>*</span></label>
            <input type="text" value={form.nome} onChange={e => handleNomeChange(e.target.value)}
              placeholder="Nome da empresa" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tipo</label>
            <input type="text" list="empresa-tipos" value={form.tipo} onChange={e => set('tipo', e.target.value)}
              placeholder="produtora, distribuidora…" className="placeholder-white/20" style={inputStyle} />
            <datalist id="empresa-tipos">
              {TIPOS_SUGERIDOS.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div>
            <label style={labelStyle}>Slug (opcional)</label>
            <input type="text" value={form.slug} onChange={e => { setSlugTouched(true); set('slug', e.target.value) }}
              onBlur={() => checkSlug()}
              placeholder="nome-da-empresa" className="placeholder-white/20" style={inputStyle} />
            {slugStatus === 'checking' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(255,255,255,0.35)' }}>⟳ verificando…</p>}
            {slugStatus === 'available' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(134,239,172,0.8)' }}>✓ disponível</p>}
            {slugStatus === 'taken' && <p className="text-xs mt-1" style={{ fontFamily: FONT_BODY, color: 'rgba(248,113,113,0.9)' }}>✗ já em uso</p>}
          </div>
          <div>
            <label style={labelStyle}>Visibilidade</label>
            <select value={form.visibilidade} onChange={e => set('visibilidade', e.target.value)}
              className="bg-black" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
              <option value="publico">Público</option>
              <option value="rascunho">Rascunho</option>
              <option value="privado">Privado</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>País</label>
            <input type="text" value={form.pais} onChange={e => set('pais', e.target.value)}
              placeholder="Brasil" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Site oficial</label>
            <input type="text" value={form.site_oficial} onChange={e => set('site_oficial', e.target.value)}
              placeholder="https://…" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <label style={labelStyle}>Descrição curta</label>
            <textarea value={form.descricao_curta} onChange={e => set('descricao_curta', e.target.value)}
              placeholder="Uma linha sobre a empresa" rows={2}
              className="placeholder-white/20" style={{ ...inputStyle, resize: 'vertical' as const }} />
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>E-mail</label>
            <input type="text" value={form.email_contato} onChange={e => set('email_contato', e.target.value)}
              placeholder="contato@empresa.com" className="placeholder-white/20" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Telefone</label>
            <input type="text" value={form.telefone} onChange={e => set('telefone', e.target.value)}
              placeholder="+55 11 …" className="placeholder-white/20" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="mb-10">
        <h3 style={sectionTitleStyle}>Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Upload do logo</label>
            <StorageUpload
              storagePath={`empresas/${empresaId ?? 'new'}`}
              onUploaded={url => set('logo_url', url)}
              existingUrl={form.logo_url}
              accept="image/*"
              label="Enviar logo"
            />
          </div>
          <div>
            <label style={labelStyle}>URL do logo (alternativa)</label>
            <input type="text" value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
              placeholder="https://…/logo.png" className="placeholder-white/20" style={inputStyle} />
          </div>
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
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar empresa'}
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
