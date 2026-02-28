'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FilmeListItem } from './page'
import type { PessoaListItem } from './components/PessoasList'
import type { PostListItem } from './components/PostsList'
import { FilmesList } from './components/FilmesList'
import { FilmeForm } from './components/FilmeForm'
import { PessoasList } from './components/PessoasList'
import { PessoaForm } from './components/PessoaForm'
import { PostsList } from './components/PostsList'
import { PostForm } from './components/PostForm'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

type Section = 'filmes' | 'pessoas' | 'posts'
type View = 'list' | 'create' | 'edit'

interface CentralClientProps {
  initialFilmes: FilmeListItem[]
  initialPessoas: PessoaListItem[]
  initialPosts: PostListItem[]
  userEmail: string
}

export default function CentralClient({
  initialFilmes,
  initialPessoas,
  initialPosts,
  userEmail,
}: CentralClientProps) {
  const router = useRouter()

  const [section, setSection] = useState<Section>('filmes')

  const [filmesView, setFilmesView] = useState<View>('list')
  const [filmesEditingId, setFilmesEditingId] = useState<string | null>(null)
  const [pessoasView, setPessoasView] = useState<View>('list')
  const [pessoasEditingId, setPessoasEditingId] = useState<string | null>(null)
  const [postsView, setPostsView] = useState<View>('list')
  const [postsEditingId, setPostsEditingId] = useState<string | null>(null)

  const [filmes, setFilmes] = useState<FilmeListItem[]>(initialFilmes)
  const [pessoas, setPessoas] = useState<PessoaListItem[]>(initialPessoas)
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts)
  const [refreshing, setRefreshing] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const refreshFilmes = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/filmes')
      if (res.ok) setFilmes(await res.json())
    } finally { setRefreshing(false) }
  }, [])

  const refreshPessoas = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/pessoas')
      if (res.ok) setPessoas(await res.json())
    } finally { setRefreshing(false) }
  }, [])

  const refreshPosts = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/posts')
      if (res.ok) setPosts(await res.json())
    } finally { setRefreshing(false) }
  }, [])

  const handleFilmeEdit = useCallback((id: string) => { setFilmesEditingId(id); setFilmesView('edit') }, [])
  const handleFilmeSaved = useCallback(async () => { await refreshFilmes(); setFilmesView('list'); setFilmesEditingId(null) }, [refreshFilmes])
  const handleFilmeCancel = useCallback(() => { setFilmesView('list'); setFilmesEditingId(null) }, [])

  const handlePessoaEdit = useCallback((id: string) => { setPessoasEditingId(id); setPessoasView('edit') }, [])
  const handlePessoaSaved = useCallback(async () => { await refreshPessoas(); setPessoasView('list'); setPessoasEditingId(null) }, [refreshPessoas])
  const handlePessoaCancel = useCallback(() => { setPessoasView('list'); setPessoasEditingId(null) }, [])

  const handlePostEdit = useCallback((id: string) => { setPostsEditingId(id); setPostsView('edit') }, [])
  const handlePostSaved = useCallback(async () => { await refreshPosts(); setPostsView('list'); setPostsEditingId(null) }, [refreshPosts])
  const handlePostCancel = useCallback(() => { setPostsView('list'); setPostsEditingId(null) }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const sectionLabel = (s: Section) => {
    if (s === 'filmes') return `Filmes${refreshing && section === 'filmes' ? ' …' : ` (${filmes.length})`}`
    if (s === 'pessoas') return `Pessoas${refreshing && section === 'pessoas' ? ' …' : ` (${pessoas.length})`}`
    return `Posts${refreshing && section === 'posts' ? ' …' : ` (${posts.length})`}`
  }

  const pessoasForForm = pessoas.map(p => ({ id: p.id, nome: p.nome, nome_exibicao: p.nome_exibicao }))
  const filmesForForm = filmes.map(f => ({ id: f.id, titulo_pt: f.titulo_pt }))

  return (
    <div className="relative min-h-screen bg-black text-white" style={{ fontFamily: FONT_BODY }}>
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ top: '50px' }} />
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ bottom: '50px' }} />

      <div className="relative" style={{ margin: '50px', minHeight: 'calc(100vh - 100px)', paddingTop: '24px', paddingBottom: '24px' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <div>
            <h1 className="text-white mb-1"
              style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
              Admin
            </h1>
            <p className="text-white/40" style={{ fontFamily: FONT_BODY, fontSize: '12px' }}>
              Moveo Filmes — Painel de Controle
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-xs px-3 py-1.5"
              style={{ fontFamily: FONT_BODY, border: '1px solid rgba(255,255,255,0.15)' }}>
              {userEmail}
            </span>
            <button onClick={handleLogout} disabled={loggingOut}
              className="text-white/50 hover:text-white transition-colors text-xs px-3 py-1.5"
              style={{ fontFamily: FONT_BODY, border: '1px solid rgba(255,255,255,0.15)' }}>
              {loggingOut ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        </div>

        {/* Section switcher */}
        <div className="flex items-center gap-0 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          {(['filmes', 'pessoas', 'posts'] as Section[]).map(s => (
            <button key={s} onClick={() => setSection(s)}
              className="transition-colors pb-3 pr-6 text-sm"
              style={{
                fontFamily: FONT_BODY,
                color: section === s ? 'white' : 'rgba(255,255,255,0.35)',
                borderBottom: section === s ? '1px solid white' : '1px solid transparent',
                marginBottom: '-1px',
                textTransform: 'capitalize',
              }}>
              {sectionLabel(s)}
            </button>
          ))}
        </div>

        {/* Sub-tab bar */}
        {section === 'filmes' && (
          <div className="flex items-center gap-0 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => { setFilmesView('list'); setFilmesEditingId(null) }}
              className="transition-colors pb-2 pr-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: filmesView === 'list' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: filmesView === 'list' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              Lista
            </button>
            <button onClick={() => { setFilmesView('create'); setFilmesEditingId(null) }}
              className="transition-colors pb-2 px-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: filmesView === 'create' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: filmesView === 'create' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              + Novo Filme
            </button>
            {filmesView === 'edit' && (
              <span className="pb-2 px-6 text-xs" style={{ fontFamily: FONT_BODY, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.4)', marginBottom: '-1px' }}>
                Editando
              </span>
            )}
          </div>
        )}

        {section === 'pessoas' && (
          <div className="flex items-center gap-0 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => { setPessoasView('list'); setPessoasEditingId(null) }}
              className="transition-colors pb-2 pr-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: pessoasView === 'list' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: pessoasView === 'list' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              Lista
            </button>
            <button onClick={() => { setPessoasView('create'); setPessoasEditingId(null) }}
              className="transition-colors pb-2 px-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: pessoasView === 'create' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: pessoasView === 'create' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              + Nova Pessoa
            </button>
            {pessoasView === 'edit' && (
              <span className="pb-2 px-6 text-xs" style={{ fontFamily: FONT_BODY, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.4)', marginBottom: '-1px' }}>
                Editando
              </span>
            )}
          </div>
        )}

        {section === 'posts' && (
          <div className="flex items-center gap-0 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => { setPostsView('list'); setPostsEditingId(null) }}
              className="transition-colors pb-2 pr-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: postsView === 'list' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: postsView === 'list' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              Lista
            </button>
            <button onClick={() => { setPostsView('create'); setPostsEditingId(null) }}
              className="transition-colors pb-2 px-6 text-xs"
              style={{ fontFamily: FONT_BODY, color: postsView === 'create' ? 'white' : 'rgba(255,255,255,0.3)', borderBottom: postsView === 'create' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent', marginBottom: '-1px' }}>
              + Novo Post
            </button>
            {postsView === 'edit' && (
              <span className="pb-2 px-6 text-xs" style={{ fontFamily: FONT_BODY, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.4)', marginBottom: '-1px' }}>
                Editando
              </span>
            )}
          </div>
        )}

        {/* Filmes section */}
        {section === 'filmes' && filmesView === 'list' && (
          <FilmesList filmes={filmes} onEdit={handleFilmeEdit} onDeleted={refreshFilmes} loading={refreshing} />
        )}
        {section === 'filmes' && (filmesView === 'create' || filmesView === 'edit') && (
          <FilmeForm
            filmeId={filmesView === 'edit' ? filmesEditingId ?? undefined : undefined}
            onSave={handleFilmeSaved}
            onCancel={handleFilmeCancel}
            pessoas={pessoasForForm}
          />
        )}

        {/* Pessoas section */}
        {section === 'pessoas' && pessoasView === 'list' && (
          <PessoasList pessoas={pessoas} onEdit={handlePessoaEdit} onDeleted={refreshPessoas} loading={refreshing} />
        )}
        {section === 'pessoas' && (pessoasView === 'create' || pessoasView === 'edit') && (
          <PessoaForm
            pessoaId={pessoasView === 'edit' ? pessoasEditingId ?? undefined : undefined}
            onSave={handlePessoaSaved}
            onCancel={handlePessoaCancel}
          />
        )}

        {/* Posts section */}
        {section === 'posts' && postsView === 'list' && (
          <PostsList posts={posts} onEdit={handlePostEdit} onDeleted={refreshPosts} loading={refreshing} />
        )}
        {section === 'posts' && (postsView === 'create' || postsView === 'edit') && (
          <PostForm
            postId={postsView === 'edit' ? postsEditingId ?? undefined : undefined}
            filmes={filmesForForm}
            onSave={handlePostSaved}
            onCancel={handlePostCancel}
          />
        )}
      </div>
    </div>
  )
}
