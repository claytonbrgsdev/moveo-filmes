'use client'

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Navbar from '../components/Navbar';
import { LocationInfo } from '../components/LocationInfo';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Content translations with posts data
const content = {
  pt: {
    heroTitle: 'Notícias',
    heroSubtitle: 'Acompanhe as últimas novidades, festivais e prêmios dos nossos projetos cinematográficos e parcerias internacionais.',
    newsTitle: 'Últimas',
    newsSubtitle: 'Notícias',
    posts: [
      {
        id: '1',
        slug: 'natureza-coisas-invisiveis-berlinale',
        title: 'A Natureza das Coisas Invisíveis estreia na Berlinale 2025',
        date: '14 de fevereiro de 2025',
        excerpt: 'Primeiro longa-metragem internacional da Moveo Filmes tem estreia mundial no Festival de Berlim.',
        category: 'Festivais',
      },
      {
        id: '2',
        slug: 'musica-secular-pos-producao',
        title: 'Música Secular em fase final de pós-produção',
        date: '19 de janeiro de 2025',
        excerpt: 'Novo curta-metragem de Emanuel Lavor está em fase final de pós-produção.',
        category: 'Produção',
      },
      {
        id: '3',
        slug: 'as-micangas-berlinale-shorts',
        title: 'As Miçangas selecionado para Berlinale Shorts 2023',
        date: '9 de fevereiro de 2023',
        excerpt: 'Curta-metragem de Rafaela Camelo e Emanuel Lavor foi selecionado para a competição.',
        category: 'Festivais',
      },
      {
        id: '4',
        slug: 'misterio-carne-sundance',
        title: 'O Mistério da Carne em Sundance',
        date: '28 de janeiro de 2019',
        excerpt: 'Curta-metragem de Rafaela Camelo foi exibido no Festival de Sundance.',
        category: 'Festivais',
      },
    ],
  },
  en: {
    heroTitle: 'News',
    heroSubtitle: 'Follow the latest news, festivals and awards from our film projects and international partnerships.',
    newsTitle: 'Latest',
    newsSubtitle: 'News',
    posts: [
    {
      id: '1',
      slug: 'natureza-coisas-invisiveis-berlinale',
        title: 'A Natureza das Coisas Invisíveis premieres at Berlinale 2025',
        date: 'February 14, 2025',
        excerpt: "Moveo Filmes' first international feature film has its world premiere at the Berlin Film Festival.",
        category: 'Festivals',
    },
    {
      id: '2',
        slug: 'musica-secular-pos-producao',
        title: 'Música Secular in final post-production phase',
        date: 'January 19, 2025',
        excerpt: 'New short film by Emanuel Lavor is in final post-production phase.',
        category: 'Production',
    },
    {
      id: '3',
      slug: 'as-micangas-berlinale-shorts',
        title: 'As Miçangas selected for Berlinale Shorts 2023',
        date: 'February 9, 2023',
        excerpt: 'Short film by Rafaela Camelo and Emanuel Lavor was selected for the competition.',
        category: 'Festivals',
      },
      {
        id: '4',
        slug: 'misterio-carne-sundance',
        title: 'O Mistério da Carne at Sundance',
        date: 'January 28, 2019',
        excerpt: "Rafaela Camelo's short film was screened at the Sundance Film Festival.",
        category: 'Festivals',
      },
    ],
  },
};

export default function PostsPage() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];
  
  const heroSectionRef = useRef<HTMLElement>(null);
  const contentSectionRef = useRef<HTMLElement>(null);

  // Hero section entrance animations (on page load)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      const heroTitle = heroSectionRef.current?.querySelector('[data-hero-title]');
      const heroLine = heroSectionRef.current?.querySelector('[data-hero-line]');
      const heroSubtitle = heroSectionRef.current?.querySelector('[data-hero-subtitle]');
      const heroImage = heroSectionRef.current?.querySelector('[data-hero-image]');
      const heroCircle = heroSectionRef.current?.querySelector('[data-hero-circle]');
      const heroLogo = heroSectionRef.current?.querySelector('[data-hero-logo]');

      // Animate elements in sequence
      const tl = gsap.timeline();
      
      if (heroTitle) {
        tl.from(heroTitle, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (heroLine) {
        tl.from(heroLine, {
          scaleY: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4');
      }

      if (heroSubtitle) {
        tl.from(heroSubtitle, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.5');
      }

      if (heroImage) {
        tl.from(heroImage, {
          opacity: 0,
          scale: 0.95,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          duration: 1,
          ease: 'power2.out',
        }, '-=0.4');
      }

      if (heroCircle) {
        tl.from(heroCircle, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, '-=0.6');
      }

      if (heroLogo) {
        tl.from(heroLogo, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.5');
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // Content section animations
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!contentSectionRef.current) return;

    const ctx = gsap.context(() => {
      const titles = Array.from(contentSectionRef.current?.querySelectorAll('[data-section-title]') || []);
      const newsCards = Array.from(contentSectionRef.current?.querySelectorAll('[data-news-card]') || []);

      if (titles.length) {
        gsap.fromTo(titles,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: titles[0],
              start: 'top 80%',
            },
          }
        );
      }

      if (newsCards.length) {
        newsCards.forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          );
        });
      }
    }, contentSectionRef);

    return () => ctx.revert();
  }, []);

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
          SECTION 1: HERO - VARIATION: ASYMMETRIC WITH IMAGE
          ============================================ */}
      <section 
        ref={heroSectionRef}
        className="relative"
        style={{ 
          minHeight: '100vh',
          paddingTop: '50px',
          paddingBottom: '50px',
        }}
      >
        <div 
          className="relative h-full flex items-center"
          style={{ 
            minHeight: 'calc(100vh - 100px)',
            padding: '0 50px',
          }}
        >
          {/* Left Side - Title and Text */}
          <div 
            className="relative z-10"
            style={{ 
              maxWidth: '55%',
              paddingRight: '60px',
            }}
          >
            {/* Title - Stacked */}
            <h1 
              data-hero-title
              className="leading-none mb-8"
              style={{
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', 'Helvetica Neue LT Pro', Arial, sans-serif",
                fontSize: 'clamp(80px, 14vw, 180px)',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              {t.heroTitle}
            </h1>

            {/* Vertical Line Accent */}
            <div 
              data-hero-line
              className="mb-8"
              style={{
                width: '2px',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              }}
            />

            {/* Subtitle */}
            <p 
              data-hero-subtitle
              className="text-neutral-400 leading-relaxed"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                fontWeight: 400,
                maxWidth: '500px',
              }}
            >
              {t.heroSubtitle}
            </p>

            {/* Logo - Bottom Left */}
            <div className="mt-12" data-hero-logo>
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

          {/* Right Side - Large Image */}
          <div 
            data-hero-image
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: '45%',
              right: '50px',
            }}
          >
            <div 
              className="relative h-full"
              style={{
                minHeight: '500px',
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 9.png"
                alt="Moveo Filmes"
                fill
                sizes="45vw"
                className="object-cover"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)',
                }}
              />
            </div>
          </div>

          {/* Decorative Circle - Bottom Right */}
          <div 
            data-hero-circle
            className="absolute pointer-events-none"
            style={{
              right: '100px',
              bottom: '60px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
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
              data-section-title
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
              data-section-title
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
            {t.posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                data-news-card
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
                    src={`/imagens/secao2home/Rectangle ${9 + (index % 3)}.png`}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-3">
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
                    {post.category}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span 
                    className="text-neutral-500"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(10px, 0.9vw, 12px)',
                      fontWeight: 400,
                    }}
                  >
                    {post.date}
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
              </Link>
            ))}
          </div>
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
