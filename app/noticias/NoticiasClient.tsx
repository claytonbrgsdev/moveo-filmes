'use client'

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Navbar from '../components/Navbar';
import { LocationInfo } from '../components/LocationInfo';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';
import type { PostRow } from '@/lib/supabase/types';
import { formatPostForLanguage } from '@/lib/supabase/posts';

// Content translations (UI only)
const uiContent = {
  pt: {
    heroTitle: 'Notícias',
    heroSubtitle: 'Acompanhe as últimas novidades, festivais e prêmios dos nossos projetos cinematográficos e parcerias internacionais.',
    newsTitle: 'Últimas',
    newsSubtitle: 'Notícias',
  },
  en: {
    heroTitle: 'News',
    heroSubtitle: 'Follow the latest news, festivals and awards from our film projects and international partnerships.',
    newsTitle: 'Latest',
    newsSubtitle: 'News',
  },
};

interface NoticiasClientProps {
  posts: PostRow[];
}

export default function NoticiasClient({ posts }: NoticiasClientProps) {
  const { language, setLanguage } = useLanguage();
  const t = uiContent[language];

  const heroSectionRef = useRef<HTMLElement>(null);
  const contentSectionRef = useRef<HTMLElement>(null);

  // Format posts for current language
  const formattedPosts = posts.map(post => formatPostForLanguage(post, language));

  // Format date based on language
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Top border line */}
      <div
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ top: '50px' }}
      />

      {/* Bottom border line */}
      <div
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ bottom: '50px' }}
      />

      {/* Navbar */}
      <Navbar />

      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section
        ref={heroSectionRef}
        className="relative flex flex-col"
        style={{
          minHeight: '100vh',
          paddingTop: '50px',
          paddingBottom: '50px',
        }}
      >
        {/* TOP HALF - Title only */}
        <div
          className="relative flex items-end"
          style={{
            height: 'calc(50vh - 50px)',
            padding: '0 50px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <h1
            className="leading-none"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', 'Helvetica Neue LT Pro', Arial, sans-serif",
              fontSize: 'clamp(120px, 22vw, 320px)',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '-0.02em',
              marginBottom: '-0.1em',
            }}
          >
            {t.heroTitle}
          </h1>
        </div>

        {/* BOTTOM HALF - Paragraph + Image */}
        <div
          className="relative flex items-start justify-between"
          style={{
            height: 'calc(50vh - 50px)',
            padding: '40px 50px 60px 50px',
          }}
        >
          {/* Left side - Paragraph + Logo */}
          <div
            className="flex flex-col h-full"
            style={{
              maxWidth: '550px',
              paddingRight: '40px',
            }}
          >
            <p
              className="text-white leading-relaxed"
              style={{
                fontFamily: "'Helvetica Neue LT Pro Light Extended', 'Helvetica Neue LT Pro', Arial, sans-serif",
                fontSize: 'clamp(20px, 2.2vw, 30px)',
                fontWeight: 300,
              }}
            >
              {t.heroSubtitle}
            </p>

            {/* Dragonfly Logo - At bottom */}
            <div className="mt-auto">
              <Image
                src="/imagens/logomarca.png"
                alt="Moveo Logo"
                width={50}
                height={50}
                className="object-contain"
                style={{ filter: 'brightness(0.6) sepia(0.3)', width: 'auto', height: 'auto' }}
              />
            </div>
          </div>

          {/* Right side - Image */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width: 'clamp(220px, 22vw, 350px)',
              height: 'clamp(180px, 20vw, 280px)',
            }}
          >
            <Image
              src="/imagens/secao2home/Rectangle 9.png"
              alt="Moveo Filmes"
              fill
              sizes="(max-width: 768px) 220px, 350px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: NEWS GRID
          ============================================ */}
      <section
        ref={contentSectionRef}
        className="relative"
        style={{
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '120px',
        }}
      >
        {/* Decorative Circle - Left Edge */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '-100px',
            top: '30%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        />

        {/* Content */}
        <div
          className="relative z-10"
          style={{
            padding: '0 50px 0 150px',
          }}
        >
          {/* Section Title */}
          <div className="mb-16">
            <h2
              className="text-white mb-2"
              style={{
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: 700,
                lineHeight: 0.9,
              }}
            >
              {t.newsTitle}
            </h2>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: 700,
                lineHeight: 0.9,
              }}
            >
              {t.newsSubtitle}
            </h2>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
            {formattedPosts.map((post, index) => (
              <Link
                key={post.id}
                href={post.externalUrl || `/post/${post.slug}`}
                target={post.externalUrl ? '_blank' : undefined}
                rel={post.externalUrl ? 'noopener noreferrer' : undefined}
                className="group cursor-pointer block"
              >
                {/* News Image */}
                <div
                  className="relative overflow-hidden mb-5"
                  style={{
                    aspectRatio: '16/10',
                    maxWidth: '100%',
                  }}
                >
                  <Image
                    src={post.imageUrl || `/imagens/secao2home/Rectangle ${9 + (index % 3)}.png`}
                    alt={post.imageAlt || post.title || 'Post image'}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-3">
                  {post.category && (
                    <>
                      <span
                        className="text-white"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                          fontSize: 'clamp(10px, 0.9vw, 12px)',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {post.category === 'instagram' ? 'Instagram' : post.category}
                      </span>
                      <span className="text-neutral-600">•</span>
                    </>
                  )}
                  <span
                    className="text-neutral-500"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(10px, 0.9vw, 12px)',
                      fontWeight: 400,
                    }}
                  >
                    {formatDate(post.date)}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-white mb-3 group-hover:text-neutral-300 transition-colors"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                    fontSize: 'clamp(18px, 1.8vw, 26px)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    className="text-neutral-400 leading-snug"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      fontWeight: 500,
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {formattedPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500" style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif" }}>
                {language === 'pt' ? 'Nenhuma notícia disponível no momento.' : 'No news available at the moment.'}
              </p>
            </div>
          )}
        </div>

        {/* Dragonfly Logo - Bottom Left */}
        <div
          className="absolute"
          style={{
            bottom: '80px',
            left: '50px',
          }}
        >
          <Image
            src="/imagens/logomarca.png"
            alt="Moveo Logo"
            width={50}
            height={50}
            className="object-contain"
            style={{ filter: 'brightness(0.6) sepia(0.3)', width: 'auto', height: 'auto' }}
          />
        </div>
      </section>

      {/* Location Info - Fixed bottom */}
      <LocationInfo />

      {/* Language Switch */}
      <div
        className="fixed text-white text-xs z-40 cursor-pointer hover:opacity-70 transition-opacity"
        style={{
          left: getMarkerPosition(13),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div className="flex items-center gap-2">
          <span suppressHydrationWarning className={language === 'pt' ? 'font-bold' : 'opacity-50'}>PT</span>
          <span className="opacity-50">/</span>
          <span suppressHydrationWarning className={language === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
        </div>
      </div>
    </div>
  );
}
