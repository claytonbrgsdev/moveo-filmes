'use client'

import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/utils/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/lib/hooks/useLanguage'
import Navbar from '../components/Navbar'
import { LocationInfo } from '../components/LocationInfo'
import { CinematicOverlays } from '../components/CinematicOverlays'
import { getMarkerPosition } from '@/lib/utils/gridCoordinates'

const FONT_BODY = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
const FONT_HEAD = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif"
const FONT_COND = "'Helvetica Neue LT Pro Condensed', Arial, Helvetica, sans-serif"
const FONT_THIN = "'Helvetica Neue LT Pro Thin Extended', Arial, Helvetica, sans-serif"

// ─────────────────────────────────────────────
// Copy
// ─────────────────────────────────────────────
const content = {
  pt: {
    heroLabel: 'Pipeline de produção',
    heroTitle: 'CATÁLOGO',
    heroSub: 'Descubra o acervo de histórias das quais a Moveo faz parte — dos projetos em desenvolvimento aos títulos em distribuição.',
    totalLabel: 'títulos no acervo',
    cinemaTitle: 'Cinema',
    cinemaLabel: 'Filmes de longa-metragem',
    outrosTitle: 'Mostras',
    outrosLabel: 'Exposições e projetos especiais',
    pipeline: [
      { n: '01', title: 'Desenvolvimento', label: 'Projetos em criação',  href: '/catalogo/desenvolvimento' },
      { n: '02', title: 'Pré-produção',    label: 'Em preparação',        href: '/catalogo/pre-producao' },
      { n: '03', title: 'Pós-produção',   label: 'Finalizando',           href: '/catalogo/pos-producao' },
      { n: '04', title: 'Distribuição',   label: 'Nos cinemas',           href: '/catalogo/distribuicao' },
    ],
    cinemaHref:  '/catalogo/cinema',
    outrosHref:  '/catalogo/mostras-e-exposicoes',
    scrollHint:  'Role para explorar',
  },
  en: {
    heroLabel: 'Production pipeline',
    heroTitle: 'CATALOG',
    heroSub: 'Discover the collection of stories in which Moveo plays a part — from projects in development to titles in distribution.',
    totalLabel: 'titles in the archive',
    cinemaTitle: 'Cinema',
    cinemaLabel: 'Feature films',
    outrosTitle: 'Showcase',
    outrosLabel: 'Exhibitions & special projects',
    pipeline: [
      { n: '01', title: 'Development',     label: 'Projects in creation', href: '/catalogo/desenvolvimento' },
      { n: '02', title: 'Pre-production',  label: 'In preparation',       href: '/catalogo/pre-producao' },
      { n: '03', title: 'Post-production', label: 'Finalizing',           href: '/catalogo/pos-producao' },
      { n: '04', title: 'Distribution',   label: 'In theaters',           href: '/catalogo/distribuicao' },
    ],
    cinemaHref:  '/catalogo/cinema',
    outrosHref:  '/catalogo/mostras-e-exposicoes',
    scrollHint:  'Scroll to explore',
  },
}

const HREF_TO_CAT: Record<string, string> = {
  '/catalogo/cinema':               'cinema',
  '/catalogo/mostras-e-exposicoes': 'mostra',
  '/catalogo/desenvolvimento':      'desenvolvimento',
  '/catalogo/pre-producao':         'pre-producao',
  '/catalogo/pos-producao':         'pos-producao',
  '/catalogo/distribuicao':         'distribuicao',
}

const VIDEOS = [
  '/videos/micangas.mp4',
  '/videos/misterio.mp4',
  '/videos/natureza.mp4',
]

// ─────────────────────────────────────────────
// Ambient video strip — parallax per strip
// ─────────────────────────────────────────────
function VideoStrip({ src, index }: { src: string; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!wrapRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(wrapRef.current, {
        yPercent: index % 2 === 0 ? -12 : 10,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        willChange: 'transform',
      }}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '115%',
          objectFit: 'cover',
          display: 'block',
          filter: 'grayscale(100%) brightness(0.35) contrast(1.1)',
          transform: 'scale(1.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Category row — magnetic + video thumb tilt
// ─────────────────────────────────────────────
function CategoryRow({
  href, title, label, count, large = false, index, videoSrc,
}: {
  href: string; title: string; label: string; count: string
  large?: boolean; index: number; videoSrc?: string
}) {
  const rowRef   = useRef<HTMLAnchorElement>(null)
  const lineRef  = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const vidRef   = useRef<HTMLVideoElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)   // System 2: magnetic target

  // ── Existing hover logic ──
  const handleEnter = useCallback(() => {
    gsap.to(lineRef.current,  { scaleX: 1,   duration: 0.6, ease: 'power3.out', transformOrigin: 'left' })
    gsap.to(arrowRef.current, { opacity: 1, x: 8, duration: 0.35, ease: 'power2.out' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-title]'), { color: 'rgba(255,255,255,0.6)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-cnt]'),   { color: 'rgba(255,255,255,0.5)', duration: 0.3 })
    }
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      // System 5: allow pointer events on thumb so tilt handlers can fire
      thumbRef.current.style.pointerEvents = 'auto'
    }
    if (vidRef.current) vidRef.current.play().catch(() => {})
  }, [])

  const handleLeave = useCallback(() => {
    gsap.to(lineRef.current,  { scaleX: 0,   duration: 0.5, ease: 'power3.in', transformOrigin: 'left' })
    gsap.to(arrowRef.current, { opacity: 0, x: 0, duration: 0.3, ease: 'power2.in' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-title]'), { color: 'rgba(255,255,255,1)', duration: 0.35 })
      gsap.to(rowRef.current.querySelector('[data-cnt]'),   { color: 'rgba(255,255,255,0.1)', duration: 0.35 })
    }
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { opacity: 0, scale: 0.96, duration: 0.4, ease: 'power2.in' })
      // Reset tilt + disable pointer events
      gsap.to(thumbRef.current, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.in' })
      thumbRef.current.style.pointerEvents = 'none'
    }
    if (vidRef.current) vidRef.current.pause()
    // System 2: magnetic reset
    if (innerRef.current) {
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.5, ease: 'back.out(1.5)' })
    }
  }, [])

  // System 2: magnetic row
  const handleRowMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!rowRef.current || !innerRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5
    const offsetY = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(innerRef.current, {
      x: offsetX * 16,
      y: offsetY * 8,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  // System 5: 3D tilt on thumbnail
  const handleThumbMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbRef.current) return
    const rect = thumbRef.current.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5
    const offsetY = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(thumbRef.current, {
      rotateX: -(offsetY * 12),
      rotateY: offsetX * 16,
      transformPerspective: 600,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const handleThumbMouseLeave = useCallback(() => {
    if (!thumbRef.current) return
    gsap.to(thumbRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
    })
  }, [])

  // For System 7: split chars on large rows
  const titleChars = large ? title.toUpperCase().split('') : null

  return (
    <Link
      ref={rowRef}
      href={href}
      data-row={index}
      className="group block relative"
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleRowMouseMove}
    >
      <div
        className="relative"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: large ? '40px 0' : '28px 0',
        }}
      >
        {/* Video thumbnail — System 5 tilt */}
        {videoSrc && (
          <div
            ref={thumbRef}
            data-tilt-card
            onMouseMove={handleThumbMouseMove}
            onMouseLeave={handleThumbMouseLeave}
            style={{
              position: 'absolute',
              top: '50%',
              right: '180px',
              transform: 'translateY(-50%)',
              width: large ? '280px' : '180px',
              height: large ? '160px' : '110px',
              overflow: 'hidden',
              opacity: 0,
              scale: 0.96,
              pointerEvents: 'none',
              zIndex: 2,
              willChange: 'transform',
            }}
          >
            <video
              ref={vidRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(80%) brightness(0.65)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid rgba(255,255,255,0.12)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* System 2: innerRef wraps flex content (magnetic target) */}
        <div
          ref={innerRef}
          className="flex items-end justify-between gap-6"
          style={{ willChange: 'transform' }}
        >
          {/* Left: label + title */}
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 'clamp(9px, 0.7vw, 11px)',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {label}
            </p>

            {/* System 7: large rows render char spans; small rows plain text */}
            <h2
              data-title
              style={{
                fontFamily: FONT_HEAD,
                fontSize: large ? 'clamp(52px, 6vw, 104px)' : 'clamp(24px, 2.2vw, 40px)',
                lineHeight: 0.92,
                letterSpacing: large ? '-0.04em' : '-0.02em',
                color: 'white',
                transition: 'none',
                display: 'flex',
                flexWrap: 'nowrap',
                perspective: large ? '600px' : 'none',
                overflow: 'hidden',
              }}
            >
              {large && titleChars
                ? titleChars.map((char, i) => (
                    <span
                      key={i}
                      data-cat-char
                      style={{
                        display: 'inline-block',
                        backfaceVisibility: 'hidden',
                        willChange: 'transform, opacity',
                        whiteSpace: char === ' ' ? 'pre' : 'normal',
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))
                : title.toUpperCase()
              }
            </h2>
          </div>

          {/* Right: count + arrow */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span
              data-cnt
              style={{
                fontFamily: FONT_THIN,
                fontSize: large ? 'clamp(52px, 6vw, 104px)' : 'clamp(24px, 2.2vw, 40px)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.1)',
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
                fontSize: large ? 'clamp(22px, 2.2vw, 36px)' : 'clamp(14px, 1.2vw, 20px)',
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
// Pipeline compact row — magnetic
// ─────────────────────────────────────────────
function PipelineRow({
  n, title, label, count, href, index,
}: {
  n: string; title: string; label: string; count: string; href: string; index: number
}) {
  const rowRef   = useRef<HTMLAnchorElement>(null)
  const lineRef  = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)   // System 2: magnetic target

  const handleEnter = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-ptitle]'), { color: 'rgba(255,255,255,0.65)', duration: 0.25 })
      gsap.to(rowRef.current.querySelector('[data-pcnt]'),   { color: 'rgba(255,255,255,0.5)',  duration: 0.25 })
      gsap.to(rowRef.current.querySelector('[data-pn]'),     { color: 'rgba(255,255,255,0.5)',  duration: 0.25 })
    }
  }, [])

  const handleLeave = useCallback(() => {
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.4, ease: 'power3.in', transformOrigin: 'left' })
    if (rowRef.current) {
      gsap.to(rowRef.current.querySelector('[data-ptitle]'), { color: 'rgba(255,255,255,0.8)',  duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pcnt]'),   { color: 'rgba(255,255,255,0.12)', duration: 0.3 })
      gsap.to(rowRef.current.querySelector('[data-pn]'),     { color: 'rgba(255,255,255,0.18)', duration: 0.3 })
    }
    // System 2: magnetic reset
    if (innerRef.current) {
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.5, ease: 'back.out(1.5)' })
    }
  }, [])

  // System 2: magnetic pipeline row
  const handleRowMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!rowRef.current || !innerRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5
    const offsetY = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(innerRef.current, {
      x: offsetX * 12,
      y: offsetY * 5,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  return (
    <Link
      ref={rowRef}
      href={href}
      data-pipeline={index}
      className="block relative"
      style={{ textDecoration: 'none' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleRowMouseMove}
    >
      <div className="relative py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* System 2: innerRef wraps flex content */}
        <div
          ref={innerRef}
          className="flex items-center gap-5"
          style={{ willChange: 'transform' }}
        >
          <span
            data-pn
            style={{
              fontFamily: FONT_COND,
              fontSize: 'clamp(10px, 0.72vw, 11px)',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.18)',
              flexShrink: 0,
              width: '20px',
              transition: 'none',
            }}
          >
            {n}
          </span>
          <div className="flex-1 min-w-0">
            <p
              data-ptitle
              style={{
                fontFamily: FONT_HEAD,
                fontSize: 'clamp(13px, 1.2vw, 19px)',
                letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.8)',
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
                fontSize: 'clamp(9px, 0.7vw, 11px)',
                color: 'rgba(255,255,255,0.22)',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </p>
          </div>
          <span
            data-pcnt
            style={{
              fontFamily: FONT_THIN,
              fontSize: 'clamp(17px, 1.5vw, 24px)',
              color: 'rgba(255,255,255,0.12)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              transition: 'none',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count}
          </span>
        </div>

        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255,255,255,0.3)',
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

  // ── Refs ──
  const containerRef    = useRef<HTMLDivElement>(null)
  const heroSectionRef  = useRef<HTMLElement>(null)
  const videoBandRef    = useRef<HTMLDivElement>(null)
  const spotlightRef    = useRef<HTMLDivElement>(null)    // System 1
  const heroLabelRef    = useRef<HTMLParagraphElement>(null)
  const heroTitleRef    = useRef<HTMLHeadingElement>(null)
  const titleCharsRef   = useRef<HTMLSpanElement[]>([])
  const heroSubRef      = useRef<HTMLParagraphElement>(null)
  const totalRef        = useRef<HTMLDivElement>(null)
  const dividerRef      = useRef<HTMLDivElement>(null)
  const scrollHintRef   = useRef<HTMLDivElement>(null)
  const videoReelRef    = useRef<HTMLDivElement>(null)
  const scanLineRef     = useRef<HTMLDivElement>(null)    // System 3

  // Live counts
  const [counts, setCounts] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.keys(HREF_TO_CAT).map(h => [h, '–']))
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

  // ── System 1: Cursor spotlight handlers ──
  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!spotlightRef.current || !heroSectionRef.current) return
    const rect = heroSectionRef.current.getBoundingClientRect()
    gsap.to(spotlightRef.current, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const handleHeroMouseEnter = useCallback(() => {
    if (!spotlightRef.current) return
    gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  }, [])

  const handleHeroMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return
    gsap.to(spotlightRef.current, { opacity: 0, duration: 0.5 })
  }, [])

  // ── System 3: Film scan line handlers ──
  const handleReelMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!scanLineRef.current || !videoReelRef.current) return
    const rect = videoReelRef.current.getBoundingClientRect()
    gsap.to(scanLineRef.current, {
      y: e.clientY - rect.top,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: 'auto',
    })
  }, [])

  const handleReelEnter = useCallback(() => {
    if (!scanLineRef.current) return
    gsap.to(scanLineRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  }, [])

  const handleReelLeave = useCallback(() => {
    if (!scanLineRef.current) return
    gsap.to(scanLineRef.current, { opacity: 0, duration: 0.4 })
  }, [])

  // ── Master animation ──
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {

      // ════════════════════════════════════════════════
      // SYSTEM 6 — Scroll Progress Ticker
      // ════════════════════════════════════════════════
      gsap.set('[data-scroll-progress]', { scaleX: 0 })
      gsap.to('[data-scroll-progress]', {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ════════════════════════════════════════════════
      // SYSTEM 4 — Cinematic Letterbox
      // Bars grow 0 → 8vh as reel enters, shrink back as it leaves
      // ════════════════════════════════════════════════
      gsap.set('[data-letterbox-top], [data-letterbox-bottom]', { height: 0 })

      if (videoReelRef.current) {
        ScrollTrigger.create({
          trigger: videoReelRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress
            const pct = p <= 0.5 ? p * 2 : (1 - p) * 2
            const h = `${pct * 8}vh`
            gsap.set('[data-letterbox-top], [data-letterbox-bottom]', { height: h })
          },
        })
      }

      // ════════════════════════════════════════════════
      // Hero entrance timeline
      // ════════════════════════════════════════════════
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(heroLabelRef.current, { opacity: 0, y: 14, duration: 0.55 }, 0.1)

      if (titleCharsRef.current.length) {
        tl.from(
          titleCharsRef.current,
          { y: 90, rotationX: -80, opacity: 0, duration: 0.9, ease: 'back.out(1.2)', stagger: 0.045 },
          0.2
        )
      }

      tl.from(heroSubRef.current,    { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, 0.65)
      tl.from(totalRef.current,      { opacity: 0, y: 12, duration: 0.5 }, 0.8)
      tl.from(scrollHintRef.current, { opacity: 0, y: 8,  duration: 0.5 }, 1.0)
      tl.from(dividerRef.current,    { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'power3.out' }, 0.45)

      // Hero video band parallax
      if (videoBandRef.current) {
        gsap.to(videoBandRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        })
      }

      // Hero title scale-down on scroll
      if (heroTitleRef.current) {
        gsap.to(heroTitleRef.current, {
          scale: 0.92,
          opacity: 0.6,
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'center top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      // ════════════════════════════════════════════════
      // SYSTEM 7 — Character stagger on large category rows
      // Replaces old [data-row] opacity+y+clipPath block
      // ════════════════════════════════════════════════
      const largeRowEls = Array.from(
        document.querySelectorAll('[data-row="0"], [data-row="5"]')
      )
      largeRowEls.forEach((rowEl) => {
        const chars = Array.from(rowEl.querySelectorAll('[data-cat-char]'))
        if (chars.length) {
          gsap.fromTo(
            chars,
            { y: 60, rotationX: -60, opacity: 0 },
            {
              y: 0, rotationX: 0, opacity: 1,
              duration: 0.85,
              ease: 'back.out(1.15)',
              stagger: 0.04,
              scrollTrigger: {
                trigger: rowEl,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
        const cntEl = rowEl.querySelector('[data-cnt]')
        if (cntEl) {
          gsap.fromTo(
            cntEl,
            { y: -20, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              delay: 0.18,
              scrollTrigger: {
                trigger: rowEl,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })

      // Pipeline rows — slide from left + counter flip
      const pipelineRows = Array.from(document.querySelectorAll('[data-pipeline]'))
      pipelineRows.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: i * 0.07,
            scrollTrigger: {
              trigger: el,
              start: 'top 93%',
              toggleActions: 'play none none reverse',
            },
          }
        )
        const cntEl = el.querySelector('[data-pcnt]')
        if (cntEl) {
          gsap.fromTo(
            cntEl,
            { y: -20, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.5,
              ease: 'power3.out',
              delay: i * 0.07 + 0.12,
              scrollTrigger: {
                trigger: el,
                start: 'top 93%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })

      // Video reel strip staggered fade-in (exclude scan line)
      if (videoReelRef.current) {
        const strips = videoReelRef.current.querySelectorAll(':scope > *:not([data-scan-line])')
        gsap.fromTo(
          strips,
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1, scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: videoReelRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Count-up animation when DB result arrives
  const prevTotalRef = useRef('–')
  useEffect(() => {
    if (totalCount === '–' || totalCount === prevTotalRef.current) return
    prevTotalRef.current = totalCount
    if (!totalRef.current) return
    const numEl = totalRef.current.querySelector('[data-total-num]')
    if (!numEl) return
    const target = parseInt(totalCount)
    if (isNaN(target)) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate() {
        numEl.textContent = String(Math.round(obj.val))
      },
    })
  }, [totalCount])

  const titleChars = t.heroTitle.split('')

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black" style={{ overflowX: 'hidden' }}>

      {/* ── System 6: Scroll Progress Bar ── */}
      <div data-scroll-progress aria-hidden="true" />

      {/* ── System 4: Cinematic Letterbox ── */}
      <div
        data-letterbox-top
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'black',
          zIndex: 45,
          height: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        data-letterbox-bottom
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'black',
          zIndex: 45,
          height: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Film grain */}
      <CinematicOverlays />

      {/* Frame lines */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ top: 'var(--frame-pad)' }} />
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ bottom: 'var(--frame-pad)' }} />

      {/* Navbar */}
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — full-height cinematic opener
      ══════════════════════════════════════ */}
      <section
        ref={heroSectionRef}
        className="relative"
        style={{ height: '100vh', minHeight: '700px', overflow: 'hidden' }}
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={handleHeroMouseEnter}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Ambient video band */}
        <div
          ref={videoBandRef}
          style={{ position: 'absolute', inset: 0, zIndex: 0, willChange: 'transform' }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) brightness(0.18) contrast(1.15)',
              transform: 'scale(1.08)',
              transformOrigin: 'center',
            }}
          >
            <source src="/videos/natureza.mp4" type="video/mp4" />
          </video>
          {/* Vignettes */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 60%, transparent 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.96) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: 'linear-gradient(to top, transparent 0%, black 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── System 1: Cursor Spotlight ── */}
        <div
          ref={spotlightRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 35%, transparent 65%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform, opacity',
            top: 0,
            left: 0,
          }}
        />

        {/* Hero text — bottom aligned */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 var(--frame-pad) 90px',
          }}
        >
          {/* Label */}
          <p
            ref={heroLabelRef}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 'clamp(9px, 0.7vw, 11px)',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.32)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            {t.heroLabel}
          </p>

          {/* Title — character split */}
          <h1
            ref={heroTitleRef}
            aria-label={t.heroTitle}
            style={{
              fontFamily: FONT_HEAD,
              fontSize: 'clamp(36px, 11vw, 190px)',
              fontWeight: 700,
              lineHeight: 0.86,
              letterSpacing: '-0.04em',
              color: 'white',
              marginBottom: '44px',
              display: 'flex',
              flexWrap: 'nowrap',
              perspective: '800px',
              overflow: 'hidden',
            }}
          >
            {titleChars.map((char, i) => (
              <span
                key={i}
                ref={el => { if (el) titleCharsRef.current[i] = el }}
                style={{
                  display: 'inline-block',
                  backfaceVisibility: 'hidden',
                  whiteSpace: char === ' ' ? 'pre' : 'normal',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Sub-text + total counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '40px',
              maxWidth: '1400px',
            }}
          >
            <p
              ref={heroSubRef}
              style={{
                fontFamily: FONT_BODY,
                fontSize: 'clamp(12px, 1vw, 16px)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.4)',
                maxWidth: '520px',
              }}
            >
              {t.heroSub}
            </p>

            <div ref={totalRef} style={{ textAlign: 'right', flexShrink: 0 }}>
              <p
                data-total-num
                style={{
                  fontFamily: FONT_THIN,
                  fontSize: 'clamp(44px, 5vw, 80px)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  color: 'rgba(255,255,255,0.1)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {totalCount}
              </p>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 'clamp(8px, 0.65vw, 10px)',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.18)',
                  textTransform: 'uppercase',
                  marginTop: '5px',
                }}
              >
                {t.totalLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.22)',
              textTransform: 'uppercase',
            }}
          >
            {t.scrollHint}
          </span>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255,255,255,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '40%',
                background: 'white',
                animation: 'scrollLineDown 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Top-right corner info cluster */}
        <div
          style={{
            position: 'absolute',
            top: '62px',
            right: 'var(--frame-pad)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}
        >
          {/* Aspect ratio marker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: FONT_COND,
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
              }}
            >
              1.85 : 1
            </span>
          </div>

          {/* ── System 8: Ambient Audio Indicator (CSS only) ── */}
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
            }}
          >
            {(
              [
                { h: 4,  dur: '1.1s', delay: '0s'    },
                { h: 10, dur: '0.9s', delay: '0.18s' },
                { h: 6,  dur: '1.3s', delay: '0.34s' },
                { h: 12, dur: '1.0s', delay: '0.08s' },
              ] as const
            ).map((bar, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '2px',
                  height: `${bar.h}px`,
                  background: 'rgba(255,255,255,0.2)',
                  animation: `audioPulse ${bar.dur} ease-in-out ${bar.delay} infinite`,
                  willChange: 'transform',
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        ref={dividerRef}
        style={{
          margin: '0 var(--frame-pad)',
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
        }}
      />

      {/* ══════════════════════════════════════
          VIDEO REEL STRIP — System 3: scan line
      ══════════════════════════════════════ */}
      <div
        ref={videoReelRef}
        data-reel
        onMouseMove={handleReelMouseMove}
        onMouseEnter={handleReelEnter}
        onMouseLeave={handleReelLeave}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '2fr 1.2fr 1.8fr',
          gap: '2px',
          margin: '2px var(--frame-pad) 0',
          height: '260px',
          overflow: 'hidden',
        }}
      >
        {/* Film scan line */}
        <div
          ref={scanLineRef}
          data-scan-line
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 80%, transparent 100%)',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 10,
            willChange: 'transform, opacity',
            transform: 'translateY(0px)',
          }}
        />

        {VIDEOS.map((src, i) => (
          <VideoStrip key={src} src={src} index={i} />
        ))}
      </div>

      {/* ══════════════════════════════════════
          CATEGORIES LIST
      ══════════════════════════════════════ */}
      <section
        style={{
          paddingLeft: 'var(--frame-pad)',
          paddingRight: 'var(--frame-pad)',
          paddingBottom: '160px',
          paddingTop: '0',
        }}
      >
        {/* CINEMA */}
        <CategoryRow
          href={t.cinemaHref}
          title={t.cinemaTitle}
          label={t.cinemaLabel}
          count={counts[t.cinemaHref]}
          large
          index={0}
          videoSrc="/videos/micangas.mp4"
        />

        {/* Pipeline sub-rows */}
        <div
          style={{
            paddingLeft: '52px',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
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

        {/* MOSTRAS */}
        <CategoryRow
          href={t.outrosHref}
          title={t.outrosTitle}
          label={t.outrosLabel}
          count={counts[t.outrosHref]}
          large
          index={5}
          videoSrc="/videos/misterio.mp4"
        />
      </section>

      {/* Location Info */}
      <LocationInfo />

      {/* Language switch */}
      <div
        className="fixed z-40 cursor-pointer"
        style={{
          left: getMarkerPosition(13),
          top: 'calc(100vh - var(--frame-pad) + 2px)',
          fontFamily: FONT_BODY,
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div className="flex items-center gap-2 text-white text-xs hover:opacity-70 transition-opacity">
          <span
            suppressHydrationWarning
            style={{ fontWeight: language === 'pt' ? 700 : 400, opacity: language === 'pt' ? 1 : 0.4 }}
          >
            PT
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span
            suppressHydrationWarning
            style={{ fontWeight: language === 'en' ? 700 : 400, opacity: language === 'en' ? 1 : 0.4 }}
          >
            EN
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scrollLineDown {
          0%   { transform: translateY(-100%); opacity: 1; }
          50%  { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }

        @keyframes audioPulse {
          0%, 100% { transform: scaleY(1);   opacity: 0.2; }
          30%       { transform: scaleY(2.8); opacity: 0.55; }
          60%       { transform: scaleY(1.4); opacity: 0.35; }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-scroll-progress]  { display: none; }
          [data-letterbox-top],
          [data-letterbox-bottom] { display: none; }
        }
      `}</style>
    </div>
  )
}
