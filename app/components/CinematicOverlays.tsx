'use client'

import { FilmGrain } from './FilmGrain'

/**
 * Global cinematic overlays — renders FilmGrain canvas.
 * Place once per page at the top level.
 */
export function CinematicOverlays() {
  return <FilmGrain />
}

/**
 * Hero-tier image overlay: vignette + scan-lines + L-brackets + warm noir tint.
 * Place inside a position:relative container alongside the <Image>.
 */
export function HeroImageOverlay() {
  return (
    <>
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      {/* Scan-lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
          opacity: 0.25,
        }}
      />
      {/* L-bracket — top-left */}
      <div className="absolute pointer-events-none" style={{ top: 12, left: 12, zIndex: 5 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 1, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
      </div>
      {/* L-bracket — bottom-right */}
      <div className="absolute pointer-events-none" style={{ bottom: 12, right: 12, zIndex: 5 }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 1, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
      </div>
      {/* Warm noir tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background: 'linear-gradient(135deg, rgba(180,100,50,0.04) 0%, transparent 40%, transparent 60%, rgba(80,40,20,0.05) 100%)',
          mixBlendMode: 'overlay' as const,
        }}
      />
    </>
  )
}

/**
 * Secondary-tier image overlay: light vignette only.
 * For content images, gallery items, about page photos, post covers.
 */
export function SecondaryImageOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 2,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)',
      }}
    />
  )
}
