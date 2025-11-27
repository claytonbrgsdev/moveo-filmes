'use client'

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      duration: 1.2,
      autoRaf: false,
      syncTouch: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    const updateScroll = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafRef.current = requestAnimationFrame(updateScroll);
    };

    rafRef.current = requestAnimationFrame(updateScroll);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      pinType: 'transform',
    });

    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.defaults({ scroller: document.body });
    
    // Garantir que comece do topo
    requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      ScrollTrigger.killAll();
      ScrollTrigger.clearMatchMedia();
    };
  }, []);

  return <>{children}</>;
}
