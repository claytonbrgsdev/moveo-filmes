'use client'

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Navbar from '../components/Navbar';
import { LocationInfo } from '../components/LocationInfo';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Content translations
const content = {
  pt: {
    heroTitle: 'Sobre',
    heroSubtitle: 'Moveo Filmes, fundada em 2018 em Brasília, dedica-se a filmes de arte para o mercado internacional, com foco em promissores cineastas brasileiros.',
    aboutTitle: 'Sobre',
    aboutText1: 'Moveo Filmes, fundada em 2018 em Brasília, dedica-se a filmes de arte para o mercado internacional, com foco em promissores cineastas brasileiros. A empresa construiu um histórico sólido, colaborando com talentos emergentes como Rafaela Camelo, que dirigiu o primeiro',
    aboutText2: 'longa-metragem internacional da Moveo, "A Natureza das Coisas Invisíveis" (2025). Este filme teve sua estreia mundial na Berlinale e foi financiado pelo FAC-DF, FSA/Ancine, Fundo de Coprodução Minoritária Chileno, e desenvolvimento pela Nouvelle-Aquitaine, França.',
    teamTitle: 'Equipe',
    teamBio1: 'Daniela Marinho é produtora de cinema, formada em Direito e com mestrado em Comunicação Social. Atualmente, atua como Produtora Executiva e Programadora de Cinema no Cine Brasília, uma sala de cinema pública inaugurada em 1960.',
    teamBio2: 'Entre seus créditos de produção cinematográfica estão os curtas O Mistério da Carne, de Rafaela Camelo, exibido no Festival de Sundance em 2019, e O Véu de Amani, de Renata Diniz, vencedor de melhor roteiro no Festival de Gramado em 2019.',
  },
  en: {
    heroTitle: 'About',
    heroSubtitle: 'Moveo Filmes, founded in 2018 in Brasília, focuses on arthouse films for the international market, with an emphasis on promising Brazilian filmmakers.',
    aboutTitle: 'About',
    aboutText1: 'Moveo Filmes, founded in 2018 in Brasília, focuses on arthouse films for the international market, with an emphasis on promising Brazilian filmmakers. The company has built a strong track record, collaborating with emerging talents like Rafaela Camelo, who directed',
    aboutText2: 'Moveo\'s first international feature, "A Natureza das Coisas Invisíveis" (2025). This film had its world premiere at Berlinale, and it was funded by FAC-DF, FSA/Ancine, the Chilean Minor Coproduction Fund, and development by Nouvelle-Aquitaine, France.',
    teamTitle: 'Team',
    teamBio1: 'Daniela Marinho is a film producer with a degree in Law and a master\'s degree in Social Communication. She currently serves as Executive Producer and Film Programmer at Cine Brasília, a public movie theater built in 1960.',
    teamBio2: 'Among her film production credits are the short films O Mistério da Carne, by Rafaela Camelo, showcased at Sundance in 2019, and O Véu de Amani, by Renata Diniz, winner of best screenplay at the Gramado Festival in 2019.',
  },
};

export default function SobrePage() {
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
      const heroSubtitle = heroSectionRef.current?.querySelector('[data-hero-subtitle]');
      const heroLogo = heroSectionRef.current?.querySelector('[data-hero-logo]');
      const heroImage = heroSectionRef.current?.querySelector('[data-hero-image]');

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

      if (heroSubtitle) {
        tl.from(heroSubtitle, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.4');
      }

      if (heroImage) {
        tl.from(heroImage, {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.5');
      }

      if (heroLogo) {
        tl.from(heroLogo, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.6');
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // Content section animations
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!contentSectionRef.current) return;

    const ctx = gsap.context(() => {
      const aboutTitle = contentSectionRef.current?.querySelector('[data-about-title]');
      const teamTitle = contentSectionRef.current?.querySelector('[data-team-title]');
      const aboutBlocks = Array.from(contentSectionRef.current?.querySelectorAll('[data-about-block]') || []);
      const teamBlocks = Array.from(contentSectionRef.current?.querySelectorAll('[data-team-block]') || []);

      if (aboutTitle) {
        gsap.fromTo(aboutTitle,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutTitle,
              start: 'top 80%',
            },
          }
        );
      }

      if (aboutBlocks.length) {
        gsap.fromTo(aboutBlocks,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutBlocks[0],
              start: 'top 80%',
            },
          }
        );
      }

      if (teamTitle) {
        gsap.fromTo(teamTitle,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: teamTitle,
              start: 'top 80%',
            },
          }
        );
      }

      if (teamBlocks.length) {
        gsap.fromTo(teamBlocks,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: teamBlocks[0],
              start: 'top 80%',
            },
          }
        );
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
            data-hero-title
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
            data-hero-subtitle
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
            <div className="mt-auto" data-hero-logo>
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
            data-hero-image
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width: 'clamp(220px, 22vw, 350px)',
              height: 'clamp(180px, 20vw, 280px)',
            }}
          >
            <Image
              src="/imagens/secao2home/Rectangle 10.png"
              alt="Moveo Filmes"
              fill
              sizes="(max-width: 768px) 220px, 350px"
              className="object-cover"
            />
          </div>
          </div>
        </section>

      {/* ============================================
          SECTION 2: CONTENT (About + Team)
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

        {/* Content Grid */}
        <div 
          className="relative z-10"
          style={{ 
            padding: '0 50px 0 150px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">
            {/* Left Column - Sobre */}
            <div>
              {/* Sobre Title */}
              <h2 
                data-about-title
                className="text-white mb-10"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  fontWeight: 700,
                }}
              >
                {t.aboutTitle}
          </h2>

              {/* Sobre Content Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Text Column 1 */}
                <div data-about-block style={{ maxWidth: '220px' }}>
                  <p 
                    className="text-neutral-400 leading-snug"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.aboutText1}
            </p>
          </div>

                {/* Image */}
                <div 
                  data-about-block
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '1',
                    maxWidth: '200px',
                  }}
                >
                  <Image
                    src="/imagens/secao2home/Rectangle 9.png"
                    alt="Sobre"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
          </div>

                {/* Empty cell */}
                <div />

                {/* Text Column 2 */}
                <div data-about-block style={{ maxWidth: '220px' }}>
                  <p 
                    className="text-neutral-400 leading-snug"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.aboutText2}
            </p>
          </div>
              </div>
            </div>

            {/* Right Column - Equipe */}
            <div>
              {/* Equipe Title */}
              <h2 
                data-team-title
                className="text-white mb-10"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  fontWeight: 700,
                }}
              >
                {t.teamTitle}
              </h2>

              {/* Team Content Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Text Column 1 */}
                <div data-team-block style={{ maxWidth: '220px' }}>
                  <p 
                    className="text-neutral-400 leading-snug"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.teamBio1}
                  </p>
                </div>

                {/* Text Column 2 */}
                <div data-team-block style={{ maxWidth: '220px' }}>
                  <p 
                    className="text-neutral-400 leading-snug"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1.1vw, 16px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.teamBio2}
                  </p>
            </div>

                {/* Team Member Photo */}
                <div 
                  data-team-block
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '3/4',
                    maxWidth: '160px',
                  }}
                >
                  <Image
                    src="/imagens/secao2home/Rectangle 11.png"
                    alt="Daniela Marinho"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
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
