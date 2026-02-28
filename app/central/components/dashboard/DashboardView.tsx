'use client'

import type { FilmeListItem } from '../../page'
import type { PessoaListItem } from '../PessoasList'
import type { PostListItem } from '../PostsList'
import { StatCard } from './StatCard'
import { RecentlyAddedSection } from './RecentlyAddedSection'
import { RecentActivityTable, type DashboardActivityItem } from './RecentActivityTable'

const FONT_HEADING = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

interface DashboardViewProps {
  filmes: FilmeListItem[]
  pessoas: PessoaListItem[]
  posts: PostListItem[]
}

export function DashboardView({ filmes, pessoas, posts }: DashboardViewProps) {
  // ── Stat breakdowns ──────────────────────────────────────────────────────────
  const filmesPublicos  = filmes.filter(f => f.visibilidade === 'publico').length
  const filmesRascunho  = filmes.filter(f => f.visibilidade === 'rascunho').length
  const filmesPrivados  = filmes.filter(f => f.visibilidade === 'privado' || !f.visibilidade).length

  const postsPublicos   = posts.filter(p => p.visibilidade === 'publico').length
  const postsRascunho   = posts.filter(p => p.visibilidade === 'rascunho').length
  const postsPrivados   = posts.filter(p => p.visibilidade === 'privado' || !p.visibilidade).length

  // ── Recently added (last 3 each, arrays already ordered desc by updated_at) ──
  const recentFilmes = filmes.slice(0, 3)
  const recentPosts  = posts.slice(0, 3)

  // ── Activity feed: top 10 across all tables ───────────────────────────────
  const activity: DashboardActivityItem[] = [
    ...filmes.map(f => ({
      entityType: 'Filme' as const,
      title: f.titulo_pt ?? '(sem título)',
      updated_at: f.updated_at,
    })),
    ...pessoas.map(p => ({
      entityType: 'Pessoa' as const,
      title: p.nome_exibicao ?? p.nome,
      updated_at: p.updated_at,
    })),
    ...posts.map(p => ({
      entityType: 'Post' as const,
      title: p.titulo_pt,
      updated_at: p.updated_at,
    })),
  ]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10)

  return (
    <div className="w-full">
      {/* Welcome line */}
      <p className="mb-8" style={{ fontFamily: FONT_BODY, fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
        Visão geral do catálogo
      </p>

      {/* Stat cards row */}
      <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="Filmes"
          total={filmes.length}
          breakdown={[
            { label: 'Público',  count: filmesPublicos, color: 'rgba(255,255,255,0.85)' },
            { label: 'Rascunho', count: filmesRascunho, color: 'rgba(234,179,8,0.85)'   },
            { label: 'Privado',  count: filmesPrivados, color: 'rgba(255,255,255,0.3)'  },
          ]}
        />
        <StatCard
          label="Pessoas"
          total={pessoas.length}
        />
        <StatCard
          label="Posts"
          total={posts.length}
          breakdown={[
            { label: 'Público',  count: postsPublicos, color: 'rgba(255,255,255,0.85)' },
            { label: 'Rascunho', count: postsRascunho, color: 'rgba(234,179,8,0.85)'   },
            { label: 'Privado',  count: postsPrivados, color: 'rgba(255,255,255,0.3)'  },
          ]}
        />
      </div>

      {/* Two-column section */}
      <div className="grid gap-10" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <RecentlyAddedSection filmes={recentFilmes} posts={recentPosts} />
        <RecentActivityTable items={activity} />
      </div>
    </div>
  )
}
