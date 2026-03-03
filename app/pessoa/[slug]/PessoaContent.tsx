'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '@/app/components/MainLayout';
import { SecondaryImageOverlay } from '@/app/components/CinematicOverlays';

interface Pessoa {
  id: string;
  slug: string | null;
  nome: string;
  nome_exibicao: string | null;
  bio_pt: string | null;
  bio_en: string | null;
  foto_url: string | null;
  areas_atuacao: string[] | null;
  links: string[] | null;
  visibilidade: string | null;
}

interface Filmografia {
  id: string;
  titulo_pt: string;
  titulo_en: string | null;
  funcao: string | null;
  ano: number | null;
  tipo_obra: string | null;
  ordem: number | null;
  filme_id: string | null;
  filme_slug: string | null;
}

interface PessoaContentProps {
  pessoa: Pessoa;
  filmografias: Filmografia[];
}

const FONT_LARGE = 'clamp(40px, 5vw, 80px)';
const FONT_MEDIUM = 'clamp(16px, 1.5vw, 22px)';
const FONT_SMALL = 'clamp(11px, 0.9vw, 14px)';

export function PessoaContent({ pessoa, filmografias }: PessoaContentProps) {
  const { language } = useLanguage();

  const displayName = pessoa.nome_exibicao || pessoa.nome;
  const bio = language === 'pt' ? pessoa.bio_pt : (pessoa.bio_en || pessoa.bio_pt);

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto">
        <div className="w-full max-w-5xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
            {/* Photo */}
            <div className="flex-shrink-0">
              {pessoa.foto_url ? (
                <div
                  className="relative overflow-hidden"
                  style={{ width: 'clamp(120px, 15vw, 200px)', height: 'clamp(120px, 15vw, 200px)' }}
                >
                  <Image
                    src={pessoa.foto_url}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="200px"
                    style={{ filter: 'grayscale(100%) brightness(0.5) contrast(1.1)' }}
                  />
                  <SecondaryImageOverlay />
                </div>
              ) : (
                <div
                  className="flex items-center justify-center bg-white/10 text-white"
                  style={{
                    width: 'clamp(120px, 15vw, 200px)',
                    height: 'clamp(120px, 15vw, 200px)',
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(32px, 4vw, 60px)',
                    fontWeight: 700,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Areas + Bio */}
            <div className="flex flex-col justify-center gap-4">
              <h1
                className="text-white"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_LARGE,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {displayName}
              </h1>

              {pessoa.areas_atuacao && pessoa.areas_atuacao.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pessoa.areas_atuacao.map((area, i) => (
                    <span
                      key={i}
                      className="border border-white/30 text-white/70 px-3 py-1"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}

              {bio && (
                <p
                  className="text-white/70"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_MEDIUM,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '60ch',
                  }}
                >
                  {bio}
                </p>
              )}

              {pessoa.links && pessoa.links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {pessoa.links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white transition-colors underline"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                      }}
                    >
                      {new URL(link).hostname.replace('www.', '')}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filmography */}
          {filmografias.length > 0 && (
            <div>
              <h2
                className="text-white mb-8"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(20px, 2vw, 32px)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '16px',
                }}
              >
                {language === 'pt' ? 'Filmografia' : 'Filmography'}
              </h2>
              <ul className="flex flex-col gap-0">
                {filmografias.map((f) => {
                  const title = language === 'pt' ? f.titulo_pt : (f.titulo_en || f.titulo_pt);
                  const inner = (
                    <div
                      className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 py-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span
                        className="text-white/40 flex-shrink-0 tabular-nums"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          minWidth: '3ch',
                        }}
                      >
                        {f.ano ?? '—'}
                      </span>
                      <span
                        className="text-white flex-1"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(14px, 1.3vw, 18px)',
                          fontWeight: 700,
                        }}
                      >
                        {title}
                      </span>
                      <span
                        className="text-white/50 flex-shrink-0"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {f.funcao}
                      </span>
                    </div>
                  );

                  return (
                    <li key={f.id}>
                      {f.filme_slug ? (
                        <Link
                          href={`/catalogo/cinema/${f.filme_slug}`}
                          className="block hover:bg-white/5 transition-colors px-2 -mx-2"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="px-2 -mx-2">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
