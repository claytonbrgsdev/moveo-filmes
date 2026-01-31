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

const content = {
  pt: {
    heroTitle: 'Catálogo',
    cinemaTitle: 'Cinema',
    cinemaText: 'Descubra o acervo de histórias das quais a Moveo faz parte — dos projetos em desenvolvimento aos títulos em distribuição.',
    outrosTitle: 'Outros',
    outrosText: 'Mostras, exposições e projetos especiais.',
    categories: [
      { title: 'Cinema', href: '/catalogo/cinema', label: 'Filmes de longa-metragem', count: '8' },
      { title: 'Mostras', href: '/catalogo/mostras-e-exposicoes', label: 'Exposições especiais', count: '4' },
      { title: 'Desenvolvimento', href: '/catalogo/desenvolvimento', label: 'Projetos em criação', count: '3' },
      { title: 'Pré-produção', href: '/catalogo/pre-producao', label: 'Em preparação', count: '2' },
      { title: 'Pós-produção', href: '/catalogo/pos-producao', label: 'Finalizando', count: '1' },
      { title: 'Distribuição', href: '/catalogo/distribuicao', label: 'Nos cinemas', count: '5' },
    ],
  },
  en: {
    heroTitle: 'Catalog',
    cinemaTitle: 'Cinema',
    cinemaText: 'Discover the collection of stories in which Moveo plays a part — from projects in development to titles in distribution.',
    outrosTitle: 'Others',
    outrosText: 'Exhibitions and special projects.',
    categories: [
      { title: 'Cinema', href: '/catalogo/cinema', label: 'Feature films', count: '8' },
      { title: 'Showcase', href: '/catalogo/mostras-e-exposicoes', label: 'Special exhibitions', count: '4' },
      { title: 'Development', href: '/catalogo/desenvolvimento', label: 'Projects in creation', count: '3' },
      { title: 'Pre-production', href: '/catalogo/pre-producao', label: 'In preparation', count: '2' },
      { title: 'Post-production', href: '/catalogo/pos-producao', label: 'Finalizing', count: '1' },
      { title: 'Distribution', href: '/catalogo/distribuicao', label: 'In theaters', count: '5' },
    ],
  },
};

export default function CatalogoPage() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Hero section entrance animations (on page load)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const heroTitle = heroRef.current?.querySelector('h1');
      const descText = heroRef.current?.querySelector('[data-desc-text]');

      // Animate elements in sequence
      const tl = gsap.timeline();
      
      if (heroTitle) {
        tl.from(heroTitle, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      if (descText) {
        tl.from(descText, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: 'power2.out',
        }, '-=0.5');
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Advanced animations
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Hero title and text
      const heroTitle = heroRef.current?.querySelector('h1');
      if (heroTitle) {
        gsap.from(heroTitle, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
        });
      }

      const descText = heroRef.current?.querySelector('[data-desc-text]');
      if (descText) {
        gsap.from(descText, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3,
        });
      }

      // Category items stagger reveal
      const categoryItems = Array.from(document.querySelectorAll('[data-category-item]'));
      categoryItems.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
          },
          delay: i * 0.08,
        });
      });

      // Decorative circles
      const decorCircles = Array.from(document.querySelectorAll('[data-decor-circle]'));
      decorCircles.forEach((circle, i) => {
        gsap.from(circle, {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.5 + i * 0.15,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);


  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
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

      {/* Decorative animated circles */}
      <div 
        data-decor-circle
        className="fixed pointer-events-none"
        style={{
          right: '8%',
          top: '12%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid white',
          mixBlendMode: 'difference',
        }}
      />
      <div 
        data-decor-circle
        className="fixed pointer-events-none"
        style={{
          left: '3%',
          bottom: '20%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          backgroundColor: 'white',
          opacity: 0.05,
        }}
      />
      <div 
        data-decor-circle
        className="fixed pointer-events-none"
        style={{
          right: '30%',
          bottom: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative"
        style={{ 
          minHeight: '60vh',
          paddingTop: '120px',
          paddingBottom: '80px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div 
          className="relative z-10 w-full"
          style={{ 
            padding: '0 50px',
          }}
        >
          <h1 
            className="text-white"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
              fontSize: 'clamp(64px, 8vw, 128px)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            {t.heroTitle.toUpperCase()}
          </h1>
          
          <p 
            data-desc-text
            className="text-neutral-400 leading-relaxed mt-8"
            style={{
              fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
              fontSize: 'clamp(14px, 1.3vw, 19px)',
              fontWeight: 400,
              maxWidth: '600px',
            }}
          >
            {t.cinemaText}
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section 
        className="relative"
        style={{ 
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '150px',
        }}
      >
        <div 
          className="relative"
          style={{ 
            padding: '0 50px',
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          {/* Cinema - Main Category with Pipeline */}
          <div className="mb-20">
            {/* Cinema Header */}
            <Link
              href={t.categories[0].href}
              data-category-item
              className="group block relative mb-8"
            >
              <div className="relative overflow-hidden py-12 border-t border-white/10">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(40px, 4.5vw, 72px)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {t.categories[0].title}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(14px, 1.3vw, 18px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.categories[0].label}
                    </p>
                  </div>
                  <div 
                    data-count
                    className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                      fontSize: 'clamp(48px, 5.5vw, 88px)',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {t.categories[0].count}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-500"
                  style={{ fontSize: 'clamp(28px, 3vw, 48px)', color: 'white' }}
                >
                  →
                </div>
              </div>
            </Link>

            {/* Cinema Pipeline Stages */}
            <div className="pl-8 border-l border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-1">
              {/* Desenvolvimento */}
              <Link
                href={t.categories[2].href}
                data-category-item
                className="group block relative"
              >
                <div className="relative overflow-hidden py-8 border-t border-white/5">
                  <div className="mb-4">
                    <div 
                      className="text-white/30 mb-2 text-xs"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        letterSpacing: '0.1em',
                      }}
                    >
                      01
                    </div>
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(20px, 1.8vw, 28px)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t.categories[2].title}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500 mb-3"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(11px, 0.95vw, 13px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.categories[2].label}
                    </p>
                    <div 
                      data-count
                      className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(24px, 2.5vw, 36px)',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {t.categories[2].count} →
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                </div>
              </Link>

              {/* Pré-produção */}
              <Link
                href={t.categories[3].href}
                data-category-item
                className="group block relative"
              >
                <div className="relative overflow-hidden py-8 border-t border-white/5">
                  <div className="mb-4">
                    <div 
                      className="text-white/30 mb-2 text-xs"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        letterSpacing: '0.1em',
                      }}
                    >
                      02
                    </div>
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(20px, 1.8vw, 28px)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t.categories[3].title}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500 mb-3"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(11px, 0.95vw, 13px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.categories[3].label}
                    </p>
                    <div 
                      data-count
                      className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(24px, 2.5vw, 36px)',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {t.categories[3].count} →
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                </div>
              </Link>

              {/* Pós-produção */}
              <Link
                href={t.categories[4].href}
                data-category-item
                className="group block relative"
              >
                <div className="relative overflow-hidden py-8 border-t border-white/5">
                  <div className="mb-4">
                    <div 
                      className="text-white/30 mb-2 text-xs"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        letterSpacing: '0.1em',
                      }}
                    >
                      03
                    </div>
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(20px, 1.8vw, 28px)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t.categories[4].title}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500 mb-3"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(11px, 0.95vw, 13px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.categories[4].label}
                    </p>
                    <div 
                      data-count
                      className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(24px, 2.5vw, 36px)',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {t.categories[4].count} →
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                </div>
              </Link>

              {/* Distribuição */}
              <Link
                href={t.categories[5].href}
                data-category-item
                className="group block relative"
              >
                <div className="relative overflow-hidden py-8 border-t border-white/5">
                  <div className="mb-4">
                    <div 
                      className="text-white/30 mb-2 text-xs"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        letterSpacing: '0.1em',
                      }}
                    >
                      04
                    </div>
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(20px, 1.8vw, 28px)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t.categories[5].title}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500 mb-3"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(11px, 0.95vw, 13px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.categories[5].label}
                    </p>
                    <div 
                      data-count
                      className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(24px, 2.5vw, 36px)',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {t.categories[5].count}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                </div>
              </Link>
            </div>
            </div>
          </div>

          {/* Outros - Second Main Category */}
          <div>
            <Link
              href={t.categories[1].href}
              data-category-item
              className="group block relative"
            >
              <div className="relative overflow-hidden py-12 border-t border-white/10">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3 
                      className="text-white mb-2 group-hover:text-neutral-300 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                        fontSize: 'clamp(40px, 4.5vw, 72px)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {t.outrosTitle}
                    </h3>
                    <p 
                      className="text-neutral-500 group-hover:text-neutral-400 transition-colors duration-500"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                        fontSize: 'clamp(14px, 1.3vw, 18px)',
                        fontWeight: 400,
                      }}
                    >
                      {t.outrosText}
                    </p>
                  </div>
                  <div 
                    data-count
                    className="text-white/20 group-hover:text-white/40 transition-colors duration-500"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                      fontSize: 'clamp(48px, 5.5vw, 88px)',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {t.categories[1].count}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-px bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-500"
                  style={{ fontSize: 'clamp(28px, 3vw, 48px)', color: 'white' }}
                >
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Dragonfly Logo */}
        <div 
          className="absolute"
          style={{
            bottom: '100px',
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

      {/* Location Info */}
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
