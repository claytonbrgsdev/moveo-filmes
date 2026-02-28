'use client'

import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/utils/gsap'
import { useLanguage } from '@/lib/hooks/useLanguage'
import Navbar from '../components/Navbar'
import { LocationInfo } from '../components/LocationInfo'
import { FilmGrain } from '../components/FilmGrain'
import { getMarkerPosition } from '@/lib/utils/gridCoordinates'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEAD = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_COND = "'Helvetica Neue LT Pro Condensed', Arial, Helvetica, sans-serif"

// ─────────────────────────────────────────────
// Copy
// ─────────────────────────────────────────────
const content = {
  pt: {
    heroLabel: 'Pipeline de produção',
    heroTitle: 'Catálogo',
    heroSub: 'Descubra o acervo de histórias das quais a Moveo faz parte — dos projetos em desenvolvimento aos títulos em distribuição.',
    totalLabel: 'títulos',
    cinemaTitle: 'Cinema',
    cinemaLabel: 'Filmes de longa-metragem',
    outrosTitle: 'Mostras',
    outrosLabel: 'Exposições e projetos especiais',
    pipeline: [
      { n: '01', title: 'Desenvolvimento', label: 'Projetos em criação', href: '/catalogo/desenvolvimento' },
      { n: '02', title: 'Pré-produção',    label: 'Em preparação',      href: '/catalogo/pre-producao' },
      { n: '03', title: 'Pós-produção',   label: 'Finalizando',         href: '/catalogo/pos-producao' },
      { n: '04', title: 'Distribuição',   label: 'Nos cinemas',         href: '/catalogo/distribuicao' },
    ],
    cinemaHref: '/catalogo/cinema',
    outrosHref: '/catalogo/mostras-e-exposicoes',
  },
  en: {
    heroLabel: 'Production pipeline',
    heroTitle: 'Catalog',
    heroSub: 'Discover the collection of stories in which Moveo plays a part — from projects in development to titles in distribution.',
    totalLabel: 'titles',
    cinemaTitle: 'Cinema',
    cinemaLabel: 'Feature films',
    outrosTitle: 'Showcase',
    outrosLabel: 'Exhibitions & special projects',
    pipeline: [
      { n: '01', title: 'Development',    label: 'Projects in creation', href: '/catalogo/desenvolvimento' },
      { n: '02', title: 'Pre-production', label: 'In preparation',       href: '/catalogo/pre-producao' },
      { n: '03', title: 'Post-production',label: 'Finalizing',           href: '/catalogo/pos-producao' },
      { n: '04', title: 'Distribution',  label: 'In theaters',          href: '/catalogo/distribuicao' },
    ],
    cinemaHref: '/catalogo/cinema',
    outrosHref: '/catalogo/mostras-e-exposicoes',
  },
}

// ─────────────────────────────────────────────
// DB href → categoria_site
// ─────────────────────────────────────────────
const HREF_TO_CAT: Record<string, string> = {
  '/catalogo/cinema':                'cinema',
  '/catalogo/mostras-e-exposicoes':  'mostra',
  '/catalogo/desenvolvimento':       'desenvolvimento',
  '/catalogo/pre-producao':          'pre-producao',
  '/catalogo/pos-producao':          'pos-producao',
  '/catalogo/distribuicao':          'distribuicao',
}

// ─────────────────────────────────────────────
// Reusable hover-underline row link
// ─────────────────────────────────────────────
function CategoryRow({
  href,
  title,
  label,
  count,
  large = false,
  index,
}: {
  href: string
  title: string
  label: string
  count: string
  large?: boolean
  index: number
}) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)

  const handleEnter = () => {
    if (lineRef.current)  gsap.to(lineRef.current,  { scaleX: 1,   duration: 0.55, ease: 'power3.out', transformOrigin: 'left' })
    if (arrowRef.current) gsap.to(arrowRef.current, { opacity: 1, x: 6, duration: 0.35, ease: 'power2.out' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-title]'), { color: 'rgba(255,255,255,0.65)', duration: 0.3, ease: 'power1.out' })
      gsap.to(rowRef.current.querySelector('[data-cnt]'),   { color: 'rgba(255,255,255,0.55)', duration: 0.3, ease: 'power1.out' })
    }
  }

  const handleLeave = () => {
    if (lineRef.current)  gsap.to(lineRef.current,  { scaleX: 0,   duration: 0.45, ease: 'power3.in', transformOrigin: 'left' })
    if (arrowRef.current) gsap.to(arrowRef.current, { opacity: 0, x: 0, duration: 0.3, ease: 'power2.in' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-title]'), { color: 'rgba(255,255,255,1)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-cnt]'),   { color: 'rgba(255,255,255,0.15)', duration: 0.3 })
    }
  }

  return (
    <Link
      ref={rowRef}
      href={href}
      data-row={index}
      className="group block relative"
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className="relative py-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-end justify-between gap-6">
          {/* Left: title + label */}
          <div className="flex-1 min-w-0">
            <p
              className="mb-1 uppercase"
              style={{
                fontFamily: FONT_BODY,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {label}
            </p>
            <h2
              data-title
              style={{
                fontFamily: FONT_HEAD,
                fontSize: large ? 'clamp(48px, 5.5vw, 96px)' : 'clamp(22px, 2vw, 36px)',
                lineHeight: 0.95,
                letterSpacing: large ? '-0.03em' : '-0.02em',
                color: 'white',
                transition: 'none',
              }}
            >
              {title.toUpperCase()}
            </h2>
          </div>

          {/* Right: count + arrow */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              data-cnt
              style={{
                fontFamily: FONT_HEAD,
                fontSize: large ? 'clamp(48px, 5.5vw, 96px)' : 'clamp(22px, 2vw, 36px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.15)',
                transition: 'none',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {count}
            </span>
            <span
              ref={arrowRef}
              style={{
                fontFamily: FONT_BODY,
                fontSize: large ? 'clamp(24px, 2.5vw, 40px)' : 'clamp(16px, 1.4vw, 22px)',
                color: 'white',
                opacity: 0,
                display: 'inline-block',
              }}
            >
              →
            </span>
          </div>
        </div>

        {/* Hover underline */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'white',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────
// Pipeline compact row (numbered)
// ─────────────────────────────────────────────
function PipelineRow({
  n,
  title,
  label,
  count,
  href,
  index,
}: {
  n: string
  title: string
  label: string
  count: string
  href: string
  index: number
}) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (lineRef.current) gsap.to(lineRef.current, { scaleX: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-ptitle]'), { color: 'rgba(255,255,255,0.6)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pcnt]'),   { color: 'rgba(255,255,255,0.5)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pn]'),     { color: 'rgba(255,255,255,0.5)', duration: 0.3 })
    }
  }

  const handleLeave = () => {
    if (lineRef.current) gsap.to(lineRef.current, { scaleX: 0, duration: 0.4, ease: 'power3.in', transformOrigin: 'left' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-ptitle]'), { color: 'rgba(255,255,255,0.85)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pcnt]'),   { color: 'rgba(255,255,255,0.12)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pn]'),     { color: 'rgba(255,255,255,0.18)', duration: 0.3 })
    }
  }

  return (
    <Link
      ref={rowRef}
      href={href}
      data-pipeline={index}
      className="block relative"
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className="relative py-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-5">
          {/* Number */}
          <span
            data-pn
            style={{
              fontFamily: FONT_COND,
              fontSize: 'clamp(10px, 0.75vw, 12px)',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.18)',
              flexShrink: 0,
              width: '20px',
              transition: 'none',
            }}
          >
            {n}
          </span>

          {/* Title + label */}
          <div className="flex-1 min-w-0">
            <p
              data-ptitle
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 'clamp(14px, 1.3vw, 20px)',
                letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1,
                marginBottom: '3px',
                transition: 'none',
              }}
            >
              {title.toUpperCase()}
            </p>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 'clamp(10px, 0.75vw, 12px)',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </p>
          </div>

          {/* Count */}
          <span
            data-pcnt
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 'clamp(18px, 1.6vw, 26px)',
              color: 'rgba(255,255,255,0.12)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              transition: 'none',
            }}
          >
            {count}
          </span>
        </div>

        {/* Hover underline */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255,255,255,0.4)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CatalogoPage() {
  const { language, setLanguage } = useLanguage()
  const t = content[language]

  const containerRef = useRef<HTMLDivElement>(null)
  const heroLabelRef = useRef<HTMLParagraphElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef   = useRef<HTMLParagraphElement>(null)
  const totalRef     = useRef<HTMLDivElement>(null)
  const dividerRef   = useRef<HTMLDivElement>(null)

  // Live counts from DB
  const [counts, setCounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.keys(HREF_TO_CAT).map((h) => [h, '–']))
  )
  const [totalCount, setTotalCount] = useState('–')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const entries = await Promise.all(
        Object.entries(HREF_TO_CAT).map(async ([href, cat]) => {
          const { count } = await supabase
            .from('filmes')
            .select('*', { count: 'exact', head: true })
            .eq('categoria_site', cat)
            .eq('visibilidade', 'publico')
          return [href, String(count ?? 0)] as [string, string]
        })
      )
      if (cancelled) return
      const map = Object.fromEntries(entries)
      setCounts(map)
      const sum = Object.values(map).reduce((a, v) => a + parseInt(v || '0'), 0)
      setTotalCount(String(sum))
    })()
    return () => { cancelled = true }
  }, [])

  // ── Single entrance animation ──
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Hero label
      if (heroLabelRef.current) {
        tl.from(heroLabelRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.1)
      }

      // Hero title — clip-path reveal from bottom
      if (heroTitleRef.current) {
        tl.fromTo(
          heroTitleRef.current,
          { clipPath: 'inset(0 0 100% 0)', y: 20 },
          { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.85, ease: 'power4.out' },
          0.15
        )
      }

      // Sub-text
      if (heroSubRef.current) {
        tl.from(heroSubRef.current, { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out' }, 0.55)
      }

      // Total count
      if (totalRef.current) {
        tl.from(totalRef.current, { opacity: 0, y: 10, duration: 0.5 }, 0.7)
      }

      // Divider line — width expand
      if (dividerRef.current) {
        tl.from(dividerRef.current, { scaleX: 0, transformOrigin: 'left', duration: 0.9, ease: 'power3.out' }, 0.5)
      }

      // Row items stagger via scrollTrigger
      const rows = Array.from(document.querySelectorAll('[data-row], [data-pipeline]'))
      rows.forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: 'power2.out',
          delay: i * 0.06,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black" style={{ overflowX: 'hidden' }}>

      {/* Film grain overlay */}
      <FilmGrain />

      {/* Frame lines */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ top: '50px' }} />
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ bottom: '50px' }} />

      {/* Navbar */}
      <Navbar />

      {/* ────────────────────────────────────
          HERO
      ──────────────────────────────────── */}
      <section
        className="relative"
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          paddingLeft: '50px',
          paddingRight: '50px',
          minHeight: '65vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Thin vertical rule — decorative, right column */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '80px',
            bottom: '0',
            right: '25%',
            width: '1px',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        {/* Label */}
        <p
          ref={heroLabelRef}
          className="uppercase mb-6"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 'clamp(10px, 0.75vw, 12px)',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          {t.heroLabel}
        </p>

        {/* Title */}
        <h1
          ref={heroTitleRef}
          style={{
            fontFamily: FONT_HEAD,
            fontSize: 'clamp(72px, 9.5vw, 160px)',
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: '-0.035em',
            color: 'white',
            marginBottom: '40px',
          }}
        >
          {t.heroTitle.toUpperCase()}
        </h1>

        {/* Sub-text + total counter */}
        <div
          className="flex items-end justify-between gap-12"
          style={{ maxWidth: '1200px' }}
        >
          <p
            ref={heroSubRef}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 'clamp(13px, 1.1vw, 17px)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '560px',
            }}
          >
            {t.heroSub}
          </p>

          {/* Total count pill */}
          <div
            ref={totalRef}
            className="flex-shrink-0 text-right"
            style={{ paddingBottom: '4px' }}
          >
            <p
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 'clamp(40px, 4.5vw, 72px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.12)',
              }}
            >
              {totalCount}
            </p>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 'clamp(9px, 0.7vw, 11px)',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {t.totalLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        ref={dividerRef}
        style={{
          margin: '0 50px',
          height: '1px',
          background: 'rgba(255,255,255,0.12)',
        }}
      />

      {/* ────────────────────────────────────
          CATEGORIES
      ──────────────────────────────────── */}
      <section
        style={{
          paddingLeft: '50px',
          paddingRight: '50px',
          paddingBottom: '160px',
          paddingTop: '0',
        }}
      >
        {/* ── CINEMA (large row) ── */}
        <CategoryRow
          href={t.cinemaHref}
          title={t.cinemaTitle}
          label={t.cinemaLabel}
          count={counts[t.cinemaHref]}
          large
          index={0}
        />

        {/* ── PIPELINE (4 compact rows, indented) ── */}
        <div
          style={{
            paddingLeft: '48px',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            marginBottom: '0',
          }}
        >
          {t.pipeline.map((p, i) => (
            <PipelineRow
              key={p.href}
              n={p.n}
              title={p.title}
              label={p.label}
              count={counts[p.href]}
              href={p.href}
              index={i + 1}
            />
          ))}
        </div>

        {/* ── MOSTRAS (large row) ── */}
        <CategoryRow
          href={t.outrosHref}
          title={t.outrosTitle}
          label={t.outrosLabel}
          count={counts[t.outrosHref]}
          large
          index={5}
        />
      </section>

      {/* Location Info */}
      <LocationInfo />

      {/* Language switch */}
      <div
        className="fixed z-40 cursor-pointer"
        style={{
          left: getMarkerPosition(13),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: FONT_BODY,
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div
          className="flex items-center gap-2 text-white text-xs hover:opacity-70 transition-opacity"
        >
          <span suppressHydrationWarning style={{ fontWeight: language === 'pt' ? 700 : 400, opacity: language === 'pt' ? 1 : 0.4 }}>PT</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span suppressHydrationWarning style={{ fontWeight: language === 'en' ? 700 : 400, opacity: language === 'en' ? 1 : 0.4 }}>EN</span>
        </div>
      </div>
    </div>
  )
}
