'use client'

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import Image from 'next/image'
import { CinematicOverlays } from '@/app/components/CinematicOverlays'
import { LocationInfo } from '@/app/components/LocationInfo'
import { LoadingContext } from '@/lib/contexts/LoadingContext'
import { useLanguage } from '@/lib/hooks/useLanguage'
import {
  getHeightBetweenLines,
  getHorizontalLinePosition,
  getMarkerPosition,
  getWidthBetweenMarkers,
} from '@/lib/utils/gridCoordinates'

/**
 * Landing "em obras" — réplica estática do frame 01 da home.
 *
 * Independente de propósito: não busca nada do Supabase e não usa GSAP nem
 * ScrollTrigger, para continuar de pé mesmo com o banco pausado. A tipografia,
 * o grid e o tratamento do vídeo são os mesmos da home (app/page.tsx), então
 * mudanças de design lá precisam ser espelhadas aqui enquanto o gate existir.
 */

const INSTAGRAM_URL = 'https://instagram.com/moveofilmes'
const CONTACT_EMAIL = 'contato@moveofilmes.com'

const FONT_LARGE = 'clamp(24px, 2.3vw, 40px)'
const FONT_COND = 'clamp(9px, 0.75vw, 12px)'

/**
 * Abaixo deste ponto a composição do hero da home não cabe: o subtítulo quebra
 * em quatro linhas e colide com o wordmark, e as media queries de `.moveo-title`
 * puxam o MOVEO 45px para cima. A landing usa um empilhamento próprio no mobile
 * — mesma linguagem visual, medidas que cabem.
 */
const MOBILE_QUERY = '(max-width: 767px)'

function subscribeToMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/**
 * A data só pode ser calculada no cliente (o servidor renderiza vazio) senão a
 * hidratação acusa divergência. Fica em cache de módulo para o snapshot ser
 * estável entre renders.
 */
let cachedDate: string | null = null
function getBrasiliaDate(): string {
  if (cachedDate === null) {
    const parts = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date())
    const year = parts.find((p) => p.type === 'year')?.value || ''
    const month = parts.find((p) => p.type === 'month')?.value || ''
    const day = parts.find((p) => p.type === 'day')?.value || ''
    cachedDate = `${year}.${month}.${day}`
  }
  return cachedDate
}

const neverChanges = () => () => {}

/** Espessura da linha preta entre os quadros — separação de fotograma. */
const FRAME_GAP = 2

/* Ícones inline: a navbar tem só dois: não vale trazer biblioteca, e SVG local
   herda a cor e o mix-blend-difference da barra sem esforço. */

function IconeEmail({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.2 6.6 8.8 5.9 8.8-5.9" />
    </svg>
  )
}

function IconeInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Um quadro do mosaico de vídeo.
 *
 * `destaque` clareia e dessatura menos: é assim que o corte de A Natureza das
 * Coisas Invisíveis puxa o olho sem precisar de legenda por cima — o pedido era
 * dar destaque e, ao mesmo tempo, não ter palavra nenhuma sobre a imagem.
 */
function Frame({
  src,
  destaque = false,
  flex = 1,
  legenda,
}: {
  src: string
  destaque?: boolean
  flex?: number
  legenda?: string
}) {
  return (
    <div style={{ position: 'relative', flex, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        // O quadro de destaque carrega na frente; os outros só o cabeçalho.
        preload={destaque ? 'auto' : 'metadata'}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          // Os quadros menores ficam nas bordas, onde a vinheta já escurece —
          // por isso o brilho deles não pode ser tão baixo quanto parece.
          filter: destaque
            ? 'brightness(0.52) grayscale(12%) contrast(1.06)'
            : 'brightness(0.42) grayscale(38%) contrast(1.12)',
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {legenda && (
        <>
          {/* Degradê só no pé do quadro: a legenda precisa se sustentar sobre
              qualquer plano do loop, inclusive os mais claros. */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 0,
              right: 0,
              bottom: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute flex items-center pointer-events-none"
            style={{ left: 18, bottom: 14, gap: 8 }}
          >
            <div style={{ width: 18, height: 1, background: 'rgba(255,255,255,0.45)' }} />
            <span
              suppressHydrationWarning
              style={{
                fontFamily: FONT_STACK,
                fontSize: FONT_COND,
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {legenda}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

/** Tracking do wordmark MOVEO (em) — idêntico ao da home. */
const MOVEO_TRACKING_EM = -0.04

const FONT_STACK = "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"

/**
 * Mede a "tinta" (ink bounds) de MOVEO a 100px via canvas TextMetrics.
 * Diferente de offsetWidth (que usa advance widths), desconta os side bearings
 * do M inicial e do O final — permitindo dimensionar o bloco para que a tinta
 * fique exatamente rente às duas bordas do container.
 */
function measureMoveoInk(): { inkWidth: number; lsb: number } | null {
  if (typeof document === 'undefined') return null
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return null
  ctx.font = "100px 'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif"
  const chars = 'MOVEO'.split('')
  const advances = chars.map((c) => ctx.measureText(c).width)
  const totalAdvance = advances.reduce((a, b) => a + b, 0)
  const first = ctx.measureText(chars[0])
  const last = ctx.measureText(chars[chars.length - 1])
  if (typeof first.actualBoundingBoxLeft !== 'number' || typeof last.actualBoundingBoxRight !== 'number') {
    return null
  }
  const lsb = -first.actualBoundingBoxLeft
  const rsb = advances[advances.length - 1] - last.actualBoundingBoxRight
  const trackingPx = MOVEO_TRACKING_EM * 100
  const inkWidth = totalAdvance + trackingPx * (chars.length - 1) - lsb - rsb
  return { inkWidth, lsb }
}

const COPY = {
  pt: {
    subtitle: 'Produtora boutique\nde filmes independentes',
    soon: 'Novo site em breve',
    filme: 'A Natureza das Coisas Invisíveis',
    copiarEmail: 'Copiar e-mail',
    emailCopiado: 'E-mail copiado',
    abrirInstagram: 'Instagram da Moveo Filmes',
  },
  en: {
    subtitle: 'Boutique production company\nfor independent films',
    soon: 'New site coming soon',
    filme: 'The Nature of Invisible Things',
    copiarEmail: 'Copy email',
    emailCopiado: 'Email copied',
    abrirInstagram: 'Moveo Filmes on Instagram',
  },
} as const

export function EmBreveClient() {
  const { language, setLanguage } = useLanguage()
  const loading = useContext(LoadingContext)

  const measureRef = useRef<HTMLDivElement>(null)
  const [dynamicFontSize, setDynamicFontSize] = useState<number>(100)
  const [moveoLeftOffset, setMoveoLeftOffset] = useState<number>(-20)
  const currentDate = useSyncExternalStore(neverChanges, getBrasiliaDate, () => '')
  // O wordmark só tem tamanho depois da medição no cliente. Segurar a composição
  // até lá evita o salto de 100px para o tamanho final na abertura.
  const [ready, setReady] = useState(false)

  // 'ok' quando o e-mail foi para a área de transferência; 'falha' quando o
  // navegador barrou o acesso — aí o tooltip mostra o endereço para copiar na
  // mão, em vez de deixar o clique sem resposta nenhuma.
  const [copia, setCopia] = useState<'idle' | 'ok' | 'falha'>('idle')

  // No servidor assume desktop; a hidratação corrige. A composição só aparece
  // depois de `ready`, então a troca não fica visível.
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )

  const copy = COPY[language === 'en' ? 'en' : 'pt']

  // A landing não carrega GSAP nem vídeos via useVideoLazyLoad, então libera a
  // LoadingScreen na hora em vez de esperar o fallback de 3s. O contexto pode
  // não existir (rotas /auth reescritas para cá) — daí o optional chaining.
  useEffect(() => {
    loading?.setVideosReady()
    loading?.setGsapReady()
  }, [loading])

  /** Mesma curva de dimensionamento da home, para o wordmark bater pixel a pixel. */
  const calculateDynamicFontSize = useCallback(() => {
    if (!measureRef.current || typeof window === 'undefined') return
    const targetWidth = measureRef.current.offsetWidth
    if (targetWidth === 0) return

    const height = window.innerHeight
    const width = window.innerWidth

    const referenceWidth = 1336
    const referenceHeight = 698
    const minHeight = 400

    const ink = measureMoveoInk()
    let baseWidth: number
    if (ink) {
      baseWidth = ink.inkWidth
    } else {
      const measureElement = document.createElement('div')
      measureElement.style.position = 'absolute'
      measureElement.style.visibility = 'hidden'
      measureElement.style.whiteSpace = 'nowrap'
      measureElement.style.fontFamily =
        "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif"
      measureElement.style.letterSpacing = `${MOVEO_TRACKING_EM}em`
      measureElement.style.fontSize = '100px'
      measureElement.textContent = 'MOVEO'
      document.body.appendChild(measureElement)
      baseWidth = measureElement.offsetWidth - MOVEO_TRACKING_EM * 100
      document.body.removeChild(measureElement)
    }

    let calculatedFontSize = (targetWidth / baseWidth) * 100

    if (height < referenceHeight) {
      const heightRatio = Math.max(height / referenceHeight, minHeight / referenceHeight)
      calculatedFontSize = calculatedFontSize * Math.pow(heightRatio, 0.75)
    }

    if (width >= referenceWidth && height < referenceHeight) {
      const aspectRatio = width / height
      const referenceAspectRatio = referenceWidth / referenceHeight
      if (aspectRatio > referenceAspectRatio) {
        calculatedFontSize = calculatedFontSize * Math.min(1, referenceAspectRatio / aspectRatio)
      }
    }

    if (height < 500) {
      calculatedFontSize = calculatedFontSize * (height / 500)
    }

    const finalSize = Math.max(calculatedFontSize, 30)
    setDynamicFontSize(finalSize)
    if (ink) {
      setMoveoLeftOffset(-(ink.lsb * finalSize) / 100)
    }
    setReady(true)
  }, [])

  const copiarEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopia('ok')
    } catch {
      setCopia('falha')
    }
  }, [])

  // O aviso some sozinho; sem isso ele ficaria na tela para sempre.
  useEffect(() => {
    if (copia === 'idle') return
    const t = setTimeout(() => setCopia('idle'), 2400)
    return () => clearTimeout(t)
  }, [copia])

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    // O ResizeObserver dispara uma vez assim que passa a observar — é ele que
    // faz a medição inicial, sem precisar de chamada síncrona aqui.
    const observer = new ResizeObserver(() => calculateDynamicFontSize())
    observer.observe(el)

    // O canvas mede com o fallback (Arial) antes da webfont chegar
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => calculateDynamicFontSize())
    }

    window.addEventListener('resize', calculateDynamicFontSize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', calculateDynamicFontSize)
    }
  }, [calculateDynamicFontSize])

  const centerTop = `calc(${getHorizontalLinePosition('E')} + (${getHorizontalLinePosition(
    'F'
  )} - ${getHorizontalLinePosition('E')}) / 2)`

  return (
    <div className="relative bg-black" style={{ height: '100vh', overflow: 'hidden' }}>
      <CinematicOverlays />

      {/* Linha horizontal superior — Linha A */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ top: 'var(--frame-pad)' }} />

      {/* Linha horizontal inferior — Linha J */}
      <div className="fixed left-0 right-0 h-px bg-white z-40" style={{ bottom: 'var(--frame-pad)' }} />

      {/* Barra superior — igual à Navbar, porém sem MENU e sem logo clicável:
          nada aqui pode levar ao site em obras. */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        style={{ height: 'var(--frame-pad)', mixBlendMode: 'difference' }}
      >
        <div className="relative w-full h-full flex items-center">
          <div
            className="absolute flex items-center text-white text-xs"
            style={{ left: getMarkerPosition(1), bottom: '0px', fontFamily: FONT_STACK }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '-12px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#ff3333',
                  borderRadius: '50%',
                  animation: 'pulse-rec 2s ease-in-out infinite',
                  marginRight: '6px',
                  flexShrink: 0,
                }}
              />
              <span style={{ letterSpacing: '0.1em' }}>REC</span>
            </span>
          </div>

          <div className="absolute flex items-center" style={{ left: getMarkerPosition(3), bottom: '0px' }}>
            <Image
              src="/imagens/logomarca.png"
              alt="Moveo Filmes"
              width={64}
              height={64}
              className="object-contain"
              style={{
                mixBlendMode: 'difference',
                filter: 'brightness(0) invert(1)',
                height: '1.125rem',
                width: 'auto',
              }}
            />
          </div>

          <div
            className="absolute text-white text-xs hidden sm:block"
            suppressHydrationWarning
            style={{
              left: getMarkerPosition(11),
              bottom: '0px',
              fontFamily: FONT_STACK,
              letterSpacing: '0.05em',
            }}
          >
            {currentDate}
          </div>

          {/* Contato — alinhado à borda direita do frame, mesma coluna do
              wordmark e do aviso de "em breve". */}
          {/* No mobile a barra tem só 16px de altura — um ícone de 15px a
              preencheria inteira e pesaria mais que o "REC" ao lado. */}
          <div
            className="absolute flex items-center"
            style={{ right: 'var(--frame-pad)', bottom: '1px', gap: isMobile ? 12 : 14 }}
          >
            <button
              type="button"
              onClick={copiarEmail}
              aria-label={`${copy.copiarEmail}: ${CONTACT_EMAIL}`}
              title={CONTACT_EMAIL}
              className="text-white transition-opacity hover:opacity-100 cursor-pointer"
              style={{ opacity: 0.75, background: 'none', border: 0, padding: 0, lineHeight: 0 }}
            >
              <IconeEmail size={isMobile ? 12 : 15} />
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={copy.abrirInstagram}
              title={copy.abrirInstagram}
              className="text-white transition-opacity hover:opacity-100"
              style={{ opacity: 0.75, lineHeight: 0 }}
            >
              <IconeInstagram size={isMobile ? 12 : 15} />
            </a>
          </div>
        </div>
      </nav>

      {/* Aviso do clique no e-mail. Fica fora do <nav> de propósito: lá dentro o
          mix-blend-difference inverteria as cores da tarja. */}
      <div
        className="fixed z-50 pointer-events-none transition-opacity duration-200"
        style={{
          top: 'calc(var(--frame-pad) + 10px)',
          right: 'var(--frame-pad)',
          opacity: copia === 'idle' ? 0 : 1,
        }}
        role="status"
        aria-live="polite"
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: FONT_STACK,
            fontSize: FONT_COND,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '6px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          {copia === 'falha' ? CONTACT_EMAIL : copy.emailCopiado}
        </span>
      </div>

      <main
        className="relative bg-black"
        style={{ margin: 'var(--frame-pad)', height: 'calc(100vh - var(--frame-pad) * 2)' }}
      >
        <section
          className="relative"
          style={{
            width: 'calc(100vw - var(--frame-pad) * 2)',
            height: 'calc(100vh - var(--frame-pad) * 2)',
            opacity: ready ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
        >
          {/* Régua invisível: largura de referência para dimensionar o MOVEO */}
          <div
            ref={measureRef}
            className="absolute invisible"
            style={{ left: 0, right: 0, top: 0, height: '1px' }}
          />

          {/* Wordmark. No desktop herda `.moveo-title` (as media queries de
              globals.css ajustam a altura); no mobile fica sob controle local. */}
          <div
            className={`absolute text-white uppercase z-30 mix-blend-difference${
              isMobile ? '' : ' moveo-title'
            }`}
            style={{
              left: `${moveoLeftOffset}px`,
              top: isMobile ? 78 : 'var(--moveo-top)',
              bottom: isMobile
                ? undefined
                : `calc(100% - ${getHorizontalLinePosition('F')} + 40px)`,
              fontFamily: "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif",
              fontSize: `${dynamicFontSize}px`,
              lineHeight: '77.3%',
              letterSpacing: `${MOVEO_TRACKING_EM}em`,
              whiteSpace: 'nowrap',
              margin: 0,
              padding: 0,
            }}
          >
            MOVEO
          </div>

          {/* Subtítulo */}
          <div
            className="absolute z-30"
            style={{
              left: 0,
              width: isMobile ? '100%' : getWidthBetweenMarkers(1, 10),
              top: 0,
              height: isMobile ? 'auto' : getHeightBetweenLines('A', 'C'),
            }}
          >
            <div
              className={`absolute text-white mix-blend-difference${
                isMobile ? '' : ' produtora-subtitle'
              }`}
              suppressHydrationWarning
              style={{
                left: '0',
                top: isMobile ? 18 : '25%',
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? 'clamp(16px, 4.8vw, 21px)' : FONT_LARGE,
                lineHeight: '90%',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {copy.subtitle.split('\n').map((line, i, all) => (
                <React.Fragment key={i}>
                  {line}
                  {i < all.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Aviso + contato.
              Desktop: o bloco espelha o subtítulo — mesmo container A→C, mesmo
              deslocamento de 25%. Assim os dois pousam na mesma linha óptica em
              vez de o canto ficar espremido contra a borda de cima.
              Mobile: logo abaixo do wordmark, alinhado à esquerda. */}
          <div
            className="absolute z-30"
            style={{
              right: isMobile ? undefined : 0,
              left: isMobile ? 0 : undefined,
              top: isMobile ? 152 : 0,
              height: isMobile ? 'auto' : getHeightBetweenLines('A', 'C'),
            }}
          >
            <div
              className={`flex flex-col ${isMobile ? 'items-start' : 'items-end'}`}
              style={{
                position: isMobile ? 'static' : 'absolute',
                right: isMobile ? undefined : 0,
                top: isMobile ? undefined : '25%',
                textAlign: isMobile ? 'left' : 'right',
                whiteSpace: 'nowrap',
              }}
            >
              <div className="flex items-center" style={{ gap: 8 }}>
                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.22)' }} />
                <span
                  suppressHydrationWarning
                  style={{
                    fontFamily: FONT_STACK,
                    fontSize: FONT_COND,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {copy.soon}
                </span>
              </div>

            </div>
          </div>

          {/* Quadro de vídeo — sem os textos de metadado da home */}
          <div
            className="absolute z-30 overflow-hidden"
            style={{
              left: 0,
              right: 0,
              // Mobile: começa logo abaixo do bloco de contato e desce até a
              // borda. A fórmula do desktop deixaria um vão morto no meio.
              top: isMobile ? '30%' : `calc(${centerTop} - var(--frame-pad) + var(--video-offset))`,
              bottom: 0,
            }}
          >
            {/* Mosaico de fotogramas. O quadro grande é A Natureza das Coisas
                Invisíveis; os outros dois ficam ao lado, menores e mais
                escuros. As linhas pretas entre eles imitam a separação de
                fotograma da película. */}
            <div
              className="absolute inset-0 flex"
              style={{
                zIndex: 0,
                gap: FRAME_GAP,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              {/* Só o quadro de destaque leva o nome do filme — os outros dois
                  ficam sem palavra nenhuma sobre a imagem. */}
              <Frame
                src="/videos/invisiveis-ceu.mp4"
                destaque
                flex={isMobile ? 1.7 : 2.1}
                legenda={copy.filme}
              />
              <div
                className="flex"
                style={{ flex: 1, gap: FRAME_GAP, flexDirection: isMobile ? 'row' : 'column' }}
              >
                <Frame src="/videos/invisiveis-casa.mp4" />
                <Frame src="/videos/misterio.mp4" />
              </div>
            </div>

            {/* A home mistura aqui uma foto estática (capahome.png) em blend
                screen. Sobre um vídeo só, virava textura; esticada sobre três
                quadros ela não acompanha nenhum deles e lê como borrão parado.
                A granulação do FilmGrain e as scan lines já dão a textura. */}

            {/* Vinheta */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                // Mais suave que a original: com o mosaico, a vinheta antiga
                // apagava os dois quadros da direita.
                background:
                  'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)',
              }}
            />

            {/* Scan lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 3,
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
                opacity: 0.4,
              }}
            />

            {/* Viewfinder — superior esquerdo */}
            <div className="absolute pointer-events-none" style={{ zIndex: 20, top: 20, left: 20 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 1, background: 'rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, background: 'rgba(255,255,255,0.5)' }} />
            </div>

            {/* Viewfinder — inferior direito */}
            <div className="absolute pointer-events-none" style={{ zIndex: 20, bottom: 20, right: 20 }}>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 1, background: 'rgba(255,255,255,0.5)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 24, background: 'rgba(255,255,255,0.5)' }} />
            </div>
          </div>

          {/* Linhas decorativas */}
          <div
            className="absolute z-20"
            style={{
              left: 0,
              bottom: '40%',
              width: '25%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
          <div
            className="absolute z-20"
            style={{
              left: 0,
              bottom: '35%',
              width: '15%',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
        </section>
      </main>

      <LocationInfo />

      {/* Switch PT/EN na posição J13. No mobile o marcador 13 joga metade do
          bloco para fora da tela, então ancora pela direita. */}
      <div
        className="fixed text-white text-xs z-40 cursor-pointer hover:opacity-70 transition-opacity"
        style={{
          left: isMobile ? undefined : getMarkerPosition(13),
          right: isMobile ? 'var(--frame-pad)' : undefined,
          top: 'calc(100vh - var(--frame-pad) + 2px)',
          fontFamily: FONT_STACK,
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div className="flex items-center gap-2">
          <span suppressHydrationWarning className={language === 'pt' ? 'font-bold' : 'opacity-50'}>
            PT
          </span>
          <span className="opacity-50">|</span>
          <span suppressHydrationWarning className={language === 'en' ? 'font-bold' : 'opacity-50'}>
            EN
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-rec {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        a:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  )
}
