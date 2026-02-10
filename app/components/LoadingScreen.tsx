'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLoading } from '@/lib/contexts/LoadingContext';

export default function LoadingScreen() {
  const { isLoading, progress } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate once when loading completes
    if (!isLoading && !hasAnimated && containerRef.current) {
      setHasAnimated(true);

      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        },
      });

      // Fade out logo first
      tl.to(logoRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in',
      })
        // Split curtains apart
        .to(
          leftCurtainRef.current,
          {
            xPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
          },
          '-=0.2'
        )
        .to(
          rightCurtainRef.current,
          {
            xPercent: 100,
            duration: 0.8,
            ease: 'power3.inOut',
          },
          '<'
        )
        // Fade out container
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
        });
    }
  }, [isLoading, hasAnimated]);

  // Don't render if already completed animation
  if (hasAnimated && !isLoading) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Left curtain */}
      <div
        ref={leftCurtainRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#0a0a0a]"
        style={{
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      />

      {/* Right curtain */}
      <div
        ref={rightCurtainRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0a]"
        style={{
          borderLeft: '1px solid rgba(255,255,255,0.05)',
        }}
      />

      {/* Logo and progress */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* MOVEO FILMES branding */}
        <div
          className="text-white/90 text-2xl tracking-[0.3em] font-light mb-8"
          style={{
            fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
          }}
        >
          MOVEO FILMES
        </div>

        {/* Minimal progress bar */}
        <div className="w-32 h-[1px] bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white/40 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
