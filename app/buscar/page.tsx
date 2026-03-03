'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '@/app/components/MainLayout';

interface FilmeResult {
  id: string;
  slug: string;
  titulo_pt: string | null;
  titulo_en: string | null;
  thumbnail_card_url: string | null;
  ano: number | null;
}

interface PostResult {
  id: string;
  slug: string;
  titulo_pt: string | null;
  titulo_en: string | null;
  imagem_capa_url: string | null;
  publicado_em: string | null;
}

const FONT_LARGE = 'clamp(32px, 4vw, 72px)';
const FONT_MEDIUM = 'clamp(14px, 1.3vw, 18px)';
const FONT_SMALL = 'clamp(11px, 0.9vw, 13px)';

export default function BuscarPage() {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [filmes, setFilmes] = useState<FilmeResult[]>([]);
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setFilmes([]);
      setPosts([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const term = q.trim();

    const [filmesResult, postsResult] = await Promise.all([
      supabase
        .from('filmes')
        .select('id, slug, titulo_pt, titulo_en, thumbnail_card_url, ano')
        .or(`titulo_pt.ilike.%${term}%,titulo_en.ilike.%${term}%`)
        .eq('visibilidade', 'publico')
        .limit(8),
      supabase
        .from('posts')
        .select('id, slug, titulo_pt, titulo_en, imagem_capa_url, publicado_em')
        .or(`titulo_pt.ilike.%${term}%,titulo_en.ilike.%${term}%`)
        .eq('visibilidade', 'publico')
        .limit(8),
    ]);

    setFilmes(filmesResult.data ?? []);
    setPosts(postsResult.data ?? []);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasResults = filmes.length > 0 || posts.length > 0;
  const ui = {
    pt: {
      title: 'Buscar',
      placeholder: 'Pesquisar filmes, notícias…',
      filmes: 'Filmes',
      noticias: 'Notícias',
      noResults: `Nenhum resultado para "${query}"`,
      hint: 'Digite ao menos 2 caracteres para buscar',
    },
    en: {
      title: 'Search',
      placeholder: 'Search films, news…',
      filmes: 'Films',
      noticias: 'News',
      noResults: `No results for "${query}"`,
      hint: 'Type at least 2 characters to search',
    },
  }[language];

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto">
        <div className="w-full max-w-4xl">

          {/* Title */}
          <h1
            className="text-white mb-10"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
              fontSize: FONT_LARGE,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {ui.title}
          </h1>

          {/* Search input */}
          <div
            className="w-full mb-12"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.placeholder}
              className="w-full bg-transparent text-white outline-none pb-4 placeholder-white/30"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(20px, 2.5vw, 40px)',
                fontWeight: 400,
              }}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div
              className="text-white/40"
              style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_SMALL }}
            >
              {language === 'pt' ? 'Buscando…' : 'Searching…'}
            </div>
          )}

          {/* Hint (no query or too short) */}
          {!loading && !hasSearched && (
            <p
              className="text-white/30"
              style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_MEDIUM }}
            >
              {ui.hint}
            </p>
          )}

          {/* No results */}
          {!loading && hasSearched && !hasResults && (
            <p
              className="text-white/50"
              style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_MEDIUM }}
            >
              {ui.noResults}
            </p>
          )}

          {/* Results */}
          {!loading && hasResults && (
            <div className="flex flex-col gap-12">

              {/* Films */}
              {filmes.length > 0 && (
                <section>
                  <h2
                    className="text-white/50 mb-6"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {ui.filmes} ({filmes.length})
                  </h2>
                  <ul className="flex flex-col gap-0">
                    {filmes.map((filme) => {
                      const title = language === 'pt' ? filme.titulo_pt : (filme.titulo_en || filme.titulo_pt);
                      return (
                        <li key={filme.id}>
                          <Link
                            href={`/catalogo/cinema/${filme.slug}`}
                            className="flex items-center gap-5 py-4 hover:bg-white/5 transition-colors px-2 -mx-2"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <div className="relative flex-shrink-0 overflow-hidden bg-white/10" style={{ width: 60, height: 40 }}>
                              {filme.thumbnail_card_url ? (
                                <Image
                                  src={filme.thumbnail_card_url}
                                  alt={title ?? ''}
                                  fill
                                  className="object-cover"
                                  sizes="60px"
                                  style={{ filter: 'grayscale(100%) brightness(0.5) contrast(1.05)' }}
                                />
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <span
                                className="text-white truncate"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_MEDIUM,
                                  fontWeight: 700,
                                }}
                              >
                                {title}
                              </span>
                              {filme.ano && (
                                <span
                                  className="text-white/40"
                                  style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_SMALL }}
                                >
                                  {filme.ano}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Posts */}
              {posts.length > 0 && (
                <section>
                  <h2
                    className="text-white/50 mb-6"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {ui.noticias} ({posts.length})
                  </h2>
                  <ul className="flex flex-col gap-0">
                    {posts.map((post) => {
                      const title = language === 'pt' ? post.titulo_pt : (post.titulo_en || post.titulo_pt);
                      const date = post.publicado_em
                        ? new Date(post.publicado_em).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : null;
                      return (
                        <li key={post.id}>
                          <Link
                            href={`/post/${post.slug}`}
                            className="flex items-center gap-5 py-4 hover:bg-white/5 transition-colors px-2 -mx-2"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <div className="relative flex-shrink-0 overflow-hidden bg-white/10" style={{ width: 60, height: 40 }}>
                              {post.imagem_capa_url ? (
                                <Image
                                  src={post.imagem_capa_url}
                                  alt={title ?? ''}
                                  fill
                                  className="object-cover"
                                  sizes="60px"
                                  style={{ filter: 'grayscale(100%) brightness(0.5) contrast(1.05)' }}
                                />
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <span
                                className="text-white truncate"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_MEDIUM,
                                  fontWeight: 700,
                                }}
                              >
                                {title}
                              </span>
                              {date && (
                                <span
                                  className="text-white/40"
                                  style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_SMALL }}
                                >
                                  {date}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

