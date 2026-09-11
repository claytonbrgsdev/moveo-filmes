'use client'

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/utils/gsap';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Navbar from '../components/Navbar';
import { LocationInfo } from '../components/LocationInfo';
import { CinematicOverlays, SecondaryImageOverlay } from '../components/CinematicOverlays';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

// Content translations
const content = {
  pt: {
    heroTitle: 'Sobre',
    heroSubtitle: 'Moveo Filmes, fundada em 2018 em Brasília, dedica-se a filmes de arte para o mercado internacional, com foco em promissores cineastas brasileiros.',
    aboutTitle: 'Sobre',
    aboutText1: 'Sediada em Brasília desde 2018 e dirigida por sua sócia-fundadora, Daniela Marinho, a Moveo Filmes é uma produtora independente de cinema com foco em projetos de identidade autoral e atuação voltada ao mercado internacional. A empresa construiu um histórico expressivo em vitrines de prestígio internacional e nacional, incluindo Berlinale, Sundance, FICCI (Cartagena) e Gramado.',
    aboutText2: 'Em 2025, a Moveo lançou seu primeiro longa-metragem como produtora principal, “A Natureza das Coisas Invisíveis” (coprodução Brasil-Chile), que estreou na Berlinale, conquistou mais de 20 prêmios internacionais e venceu o Prêmio Grande Otelo de Melhor Primeira Direção. Atualmente, a produtora desenvolve os projetos “O Jardim das Delícias”, “Alto Paraíso” e “La Nube de Basura”.',
    teamTitle: 'Equipe',
    teamBio1: 'Daniela Marinho é uma produtora de cinema nascida em Brasília em 1985, com mais de 15 anos de experiência na indústria audiovisual. Sua formação abrange Direito e Comunicação, e profissionalmente já contribuiu para a realização de mais de 10 longas-metragens e uma centena de mostras de cinema.',
    teamBio2: 'Atualmente, é Produtora Executiva e Supervisora de Atividades Formativas e de Mercado na Gestão Compartilhada do Cine Brasília. Participou de laboratórios como EAVE Puentes (2025), BrLab (2020, 2022) e First Cut Lab (2024), é membro da Rede de Talentos Paradiso e foi destaque na 75ª Berlinale como uma das cinco produtoras latino-americanas pela LatAm Cinema.',
    producoesTitle: 'Produções',
  },
  en: {
    heroTitle: 'About',
    heroSubtitle: 'Moveo Filmes, founded in 2018 in Brasília, focuses on arthouse films for the international market, with an emphasis on promising Brazilian filmmakers.',
    aboutTitle: 'About',
    aboutText1: 'Based in Brasília since 2018 and led by its founding partner, Daniela Marinho, Moveo Filmes is an independent film production company focused on auteur-driven projects and the international market. The company has built a strong track record at prestigious international and Brazilian showcases, including the Berlinale, Sundance, FICCI (Cartagena) and Gramado.',
    aboutText2: 'In 2025, Moveo released its first feature film as lead producer, “A Natureza das Coisas Invisíveis” (a Brazil-Chile co-production), which premiered at the Berlinale, won more than 20 international awards and received the Grande Otelo Award for Best First Feature Direction. The company is currently developing “O Jardim das Delícias”, “Alto Paraíso” and “La Nube de Basura”.',
    teamTitle: 'Team',
    teamBio1: 'Daniela Marinho is a film producer born in Brasília in 1985, with more than 15 years of experience in the audiovisual industry. Her background spans Law and Communication, and she has contributed to more than 10 feature films and a hundred film showcases.',
    teamBio2: 'She is currently Executive Producer and Supervisor of Training and Market Activities at Cine Brasília. She has taken part in labs such as EAVE Puentes (2025), BrLab (2020, 2022) and First Cut Lab (2024), is a member of the Paradiso Talent Network and was featured at the 75th Berlinale by LatAm Cinema as one of five Latin American producers.',
    producoesTitle: 'Productions',
  },
};

// Textos de Sobre e Equipe e a lista de produções vêm dos currículos que a cliente
// mandou em set/2026 (empresa e Daniela Marinho, versão em português). Os de inglês
// não abriram: o inglês desta página é tradução nossa. Anos e durações seguem o
// currículo — o banco diverge em O Véu de Amani e O Mistério da Carne.
const PRODUCOES = [
  {
    pt: 'Produções e coproduções',
    en: 'Productions and co-productions',
    filmes: [
      { titulo: 'Música Secular', ano: 2026, duracao: '19 min', direcao: ['Emanuel Lavor'] },
      { titulo: 'A Natureza das Coisas Invisíveis', ano: 2025, duracao: '90 min', direcao: ['Rafaela Camelo'] },
      { titulo: 'Três', ano: 2024, duracao: '20 min', direcao: ['Lila Foster'] },
      { titulo: 'As Miçangas', ano: 2023, duracao: '18 min', direcao: ['Rafaela Camelo', 'Emanuel Lavor'] },
      { titulo: 'Lubrina', ano: 2023, duracao: '17 min', direcao: ['Leonardo Hecht', 'Vinícius Fernandes'] },
      { titulo: 'O Mistério da Carne', ano: 2018, duracao: '18 min', direcao: ['Rafaela Camelo'] },
    ],
  },
  {
    pt: 'Produções associadas',
    en: 'Associate productions',
    filmes: [
      { titulo: 'Não Há Magia', ano: 2026, duracao: '15 min', direcao: ['Lucas Milhomem'] },
      { titulo: 'O Pacto da Viola', ano: 2024, duracao: '99 min', direcao: ['Guilherme Bacalhao'] },
      { titulo: 'O Véu de Amani', ano: 2019, duracao: '14 min', direcao: ['Renata Diniz'] },
    ],
  },
  {
    pt: 'Serviços audiovisuais',
    en: 'Production services',
    filmes: [
      { titulo: 'O Vazio de Domingo à Tarde', ano: 2023, duracao: '94 min', direcao: ['Gustavo Galvão'] },
      { titulo: 'Ainda Temos a Imensidão da Noite', ano: 2019, duracao: '98 min', direcao: ['Gustavo Galvão'] },
      { titulo: 'Maria Luiza', ano: 2019, duracao: '80 min', direcao: ['Marcelo Díaz'] },
    ],
  },
];

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
      {/* Global cinematic grain overlay */}
      <CinematicOverlays />

      {/* Top border line */}
      <div
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ top: 'var(--frame-pad)' }}
      />
      
      {/* Bottom border line */}
      <div 
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ bottom: 'var(--frame-pad)' }}
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
          paddingTop: 'var(--frame-pad)',
          paddingBottom: 'var(--frame-pad)',
        }}
      >
        {/* TOP HALF - Title only */}
        <div 
          className="relative flex items-end"
          style={{ 
            height: 'calc(50vh - var(--frame-pad))',
            padding: '0 var(--frame-pad)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <h1 
            data-hero-title
            className="leading-none"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', 'Helvetica Neue LT Pro', Arial, sans-serif",
              fontSize: 'clamp(48px, 22vw, 320px)',
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
          className="relative flex flex-col sm:flex-row items-start justify-between"
          style={{
            minHeight: 'calc(50vh - var(--frame-pad))',
            padding: '24px var(--frame-pad) 60px var(--frame-pad)',
          }}
        >
          {/* Left side - Paragraph + Logo */}
          <div
            data-hero-subtitle
            className="flex flex-col sm:h-full"
            style={{
              maxWidth: '550px',
              paddingRight: '0px',
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
            className="relative overflow-hidden flex-shrink-0 hidden sm:block"
            style={{
              width: 'clamp(220px, 22vw, 350px)',
              height: 'clamp(180px, 20vw, 280px)',
            }}
          >
            <Image
              src="/imagens/capahome-natureza.jpg"
              alt="A Natureza das Coisas Invisíveis"
              fill
              sizes="(max-width: 768px) 220px, 350px"
              className="object-cover"
              style={{ filter: 'grayscale(100%) brightness(0.4) contrast(1.1)' }}
            />
            <SecondaryImageOverlay />
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
          className="absolute pointer-events-none hidden sm:block"
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
            padding: '0 var(--frame-pad) 0 var(--circle-offset)',
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
                    src="/imagens/destaques/tres-familia.jpg"
                    alt="Três"
                    fill
                    sizes="200px"
                    className="object-cover"
                    style={{ filter: 'grayscale(80%) brightness(0.5) contrast(1.05)' }}
                  />
                  <SecondaryImageOverlay />
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
                    src="/imagens/sobre/daniela-marinho.jpg"
                    alt="Daniela Marinho"
                    fill
                    sizes="160px"
                    className="object-cover"
                    style={{ filter: 'grayscale(100%) brightness(0.85) contrast(1.05)' }}
                  />
                  <SecondaryImageOverlay />
                  <span
                    className="absolute left-2 bottom-2 z-10"
                    style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif", fontSize: 9, letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {language === 'pt' ? 'Foto' : 'Photo'}: Paula Carrubba
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produções — lista do currículo da empresa (ver PRODUCOES) */}
        <div
          className="relative z-10"
          style={{ padding: '96px var(--frame-pad) 0 var(--circle-offset)' }}
        >
          <h2
            className="text-white mb-10"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
              fontSize: 'clamp(40px, 5vw, 72px)',
              fontWeight: 700,
            }}
          >
            {t.producoesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            {PRODUCOES.map((grupo) => (
              <div key={grupo.pt}>
                <h3
                  className="mb-5 uppercase"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(11px, 0.9vw, 13px)',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {language === 'pt' ? grupo.pt : grupo.en}
                </h3>
                <ul className="space-y-4">
                  {grupo.filmes.map((filme) => (
                    <li key={filme.titulo}>
                      <div
                        className="text-white"
                        style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif", fontSize: 'clamp(15px, 1.2vw, 18px)', fontWeight: 500 }}
                      >
                        {filme.titulo}
                      </div>
                      <div
                        className="text-neutral-400"
                        style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif", fontSize: 'clamp(12px, 0.95vw, 14px)' }}
                      >
                        {filme.ano} · {filme.duracao} · {filme.direcao.join(language === 'pt' ? ' e ' : ' and ')}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Dragonfly Logo - Bottom Left */}
        <div 
          className="absolute"
          style={{
            bottom: '80px',
            left: 'var(--frame-pad)',
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
          top: 'calc(100vh - var(--frame-pad) + 2px)',
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
