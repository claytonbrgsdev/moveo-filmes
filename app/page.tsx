'use client'

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from './components/MainLayout';
import { ScrollHint } from './components/ScrollHint';
import ContentTransition from './components/ContentTransition';
import { useGridGuides } from '@/lib/hooks/useGridGuides';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  getMarkerPosition,
  getHorizontalLinePosition,
  getWidthBetweenMarkers,
  getHeightBetweenLines,
} from '@/lib/utils/gridCoordinates';
import {
  useMagneticElements,
  use3DCardTilt,
  useFloatingElements,
  useScrollProgress,
} from './hooks/useSpectacularAnimations';


const newsImages = [
  '/imagens/secao2home/Rectangle 10.png',
  '/imagens/secao2home/Rectangle 8.png',
  '/imagens/secao2home/Rectangle 9.png',
];

const FONT_HUGE = 'clamp(60px, 4vw, 200px)';
const FONT_LARGE = 'clamp(24px, 2.3vw, 40px)';
const FONT_MEDIUM = 'clamp(16px, 1.5vw, 22px)';
const FONT_SMALL = 'clamp(10px, 0.85vw, 13px)';


export default function Home() {
  const { language, t } = useLanguage();
  
  // News highlights traduzidos baseados no idioma
  const newsHighlights = [
    {
      title: t('mostraInternacional2025'),
      summary: t('mostraInternacional2025Summary'),
      date: t('marco2025'),
      tag: t('festival'),
    },
    {
      title: t('residenciaCriativaDF'),
      summary: t('residenciaCriativaDFSummary'),
      date: t('junho2025'),
      tag: t('residencia'),
    },
    {
      title: t('coproducaoTransatlantica'),
      summary: t('coproducaoTransatlanticaSummary'),
      date: t('agosto2025'),
      tag: t('producaoTag'),
    },
  ];
  const isGuidesVisible = useGridGuides();
  const pathname = usePathname();
  const [dynamicFontSize, setDynamicFontSize] = useState<number>(100);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const produtoraTextRef = useRef<HTMLDivElement>(null);
  const produtoraContainerRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement | null>(null);
  const secondSectionRef = useRef<HTMLElement | null>(null);
  const thirdSectionRef = useRef<HTMLElement | null>(null);
  const horizontalSecondWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalSecondTrackRef = useRef<HTMLDivElement>(null);

  const verticalReverseWrapperRef = useRef<HTMLDivElement>(null);
  const verticalReverseContentRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselScrollDistRef = useRef<HTMLDivElement>(null);
  const [mainTrackReady, setMainTrackReady] = useState(false);
  const [secondTrackReady, setSecondTrackReady] = useState(false);
  const mainTrackTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const secondTrackTweenRef = useRef<gsap.core.Tween | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);
  const sobreMoveoContainerRef = useRef<HTMLDivElement>(null);
  const sobreMoveoTextRef = useRef<HTMLDivElement>(null);
  const [sobreMoveoFontSize, setSobreMoveoFontSize] = useState<number>(40);
  const dragonflySectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const dragonflyHeadingRef = useRef<HTMLDivElement>(null);
  const dragonflyPinRef = useRef<HTMLDivElement>(null);
  const cinemaSectionRef = useRef<HTMLElement | null>(null);
  const arquivoSectionRef = useRef<HTMLElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Activate spectacular animation hooks
  useMagneticElements();
  use3DCardTilt();
  useFloatingElements();
  useScrollProgress();

  // Cursor glow effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Adjust MOVEO title position for smaller screens to prevent overlap with image
  useEffect(() => {
    if (!textRef.current) return;

    const updateTitlePosition = () => {
      if (!textRef.current) return;
      
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      // Base reference: width 1336px, height 698px está ok
      const referenceWidth = 1336;
      const referenceHeight = 698;
      const baseOffset = 40; // Original offset (25px + 15px adjustment)
      
      // Calcular offset adicional baseado na altura quando width >= 1336px
      let additionalOffset = 0;
      
      // Para telas com width >= 1336px, ajustar baseado na altura
      if (width >= referenceWidth) {
        if (height < referenceHeight) {
          // Altura menor que referência, precisa de mais espaço
          const heightDiff = referenceHeight - height;
          // Aplicar offset proporcional: a cada 50px de altura perdida, adicionar ~15px de offset
          additionalOffset = Math.floor((heightDiff / 50) * 15);
          // Limitar offset máximo para evitar posicionamento extremo
          additionalOffset = Math.min(additionalOffset, 80);
        }
      }
      
      // For screens with width < 911px - need moderate adjustments
      if (width < 911) {
        // Add moderate offset for very narrow screens
        let widthOffset = 0;
        if (width < 600) {
          widthOffset = 35;
        } else if (width < 700) {
          widthOffset = 30;
        } else if (width < 800) {
          widthOffset = 25;
        } else if (width < 911) {
          widthOffset = 20;
        }
        
        const newBottom = `calc(100% - ${getHorizontalLinePosition('F')} + ${baseOffset + widthOffset}px)`;
        textRef.current.style.bottom = newBottom;
      } else if (height <= 911 && width < 1864) {
        // For screens with height <= 911px and width >= 911px but < 1864px
        // Add moderate offset for narrower screens
        let widthOffset = 0;
        if (width < 1000) {
          widthOffset = 40;
        } else if (width < 1200) {
          widthOffset = 35;
        } else if (width < 1400) {
          widthOffset = 30;
        } else if (width < 1600) {
          widthOffset = 25;
        } else if (width < 1864) {
          widthOffset = 20;
        }
        
        const newBottom = `calc(100% - ${getHorizontalLinePosition('F')} + ${baseOffset + widthOffset + additionalOffset}px)`;
        textRef.current.style.bottom = newBottom;
      } else if (height <= 1000 && width < 2000) {
        // Also adjust for slightly taller screens that are still narrow
        let widthOffset = 0;
        if (width < 1500) {
          widthOffset = 20;
        } else if (width < 1700) {
          widthOffset = 15;
        } else if (width < 2000) {
          widthOffset = 10;
        }
        const newBottom = `calc(100% - ${getHorizontalLinePosition('F')} + ${baseOffset + widthOffset + additionalOffset}px)`;
        textRef.current.style.bottom = newBottom;
      } else {
        // Para telas maiores, aplicar offset baseado na altura se necessário
        const newBottom = `calc(100% - ${getHorizontalLinePosition('F')} + ${baseOffset + additionalOffset}px)`;
        textRef.current.style.bottom = newBottom;
      }
    };

    updateTitlePosition();
    window.addEventListener('resize', updateTitlePosition);
    
    return () => {
      window.removeEventListener('resize', updateTitlePosition);
    };
  }, []);

  const centerTop = `calc(${getHorizontalLinePosition('E')} + (${getHorizontalLinePosition('F')} - ${getHorizontalLinePosition('E')}) / 2)`;
  const centerLeft = `calc(${getMarkerPosition(7)} + (${getMarkerPosition(8)} - ${getMarkerPosition(7)}) / 2)`;

  const newsSlides = newsHighlights.slice(0, 3).map((item, idx) => ({
    ...item,
    image: newsImages[idx % newsImages.length],
  }));

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!horizontalWrapperRef.current || !horizontalTrackRef.current) return;

    // Garantir que a página comece absolutamente do topo
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = horizontalWrapperRef.current;
    const track = horizontalTrackRef.current;
    const HOLD_DISTANCE = 300; // px extras de rolagem para segurar a primeira seção visível

    // Limpar qualquer ScrollTrigger existente neste elemento antes de criar um novo
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === wrapper || (st.vars?.trigger && st.vars.trigger === wrapper)) {
        st.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Garantir que wrapper e track estejam em estado limpo antes de começar
      gsap.set([wrapper, track], { clearProps: 'all' });
      gsap.set(track, { x: 0 });

      const getTravel = () => track.scrollWidth - wrapper.offsetWidth;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 50px',
          end: () => `+=${getTravel() + window.innerHeight + HOLD_DISTANCE}`,
          scrub: 0.5,
          pin: true,
          pinType: 'transform',
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: 'horizontal-main-track',
          onUpdate: (self) => {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
              indicator.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Segurar a primeira seção por uma fração do scroll antes de mover horizontalmente
      tl.to(track, { x: 0, duration: 0.2 });
      tl.to(track, { x: () => -getTravel(), duration: 0.8 }, '>');
      mainTrackTimelineRef.current = tl;
      setMainTrackReady(true);

      // Forçar atualização imediata do ScrollTrigger
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, horizontalWrapperRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mainTrackTimelineRef.current = null;
      setMainTrackReady(false);
      ctx.revert();
    };
  }, []);

  // Pin dedicado para manter a seção 2 fixa enquanto o trilho horizontal avança
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mainTrackReady) return;
    if (!mainTrackTimelineRef.current) return;
    if (!horizontalWrapperRef.current || !secondSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id === 'second-section-pin') {
        st.kill();
      }
    });

    const ctx = gsap.context(() => {
      const section = secondSectionRef.current;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        containerAnimation: mainTrackTimelineRef.current || undefined,
        start: 'left center',
        end: 'right center',
        pin: true,
        pinSpacing: false,
        pinType: 'transform',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: 'second-section-pin',
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, horizontalWrapperRef);

    return () => {
      ctx.revert();
    };
  }, [mainTrackReady]);

  // Pin dedicado para manter a seção 3 fixa enquanto o trilho horizontal avança
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mainTrackReady) return;
    if (!mainTrackTimelineRef.current) return;
    if (!horizontalWrapperRef.current || !thirdSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id === 'third-section-pin') {
        st.kill();
      }
    });

    const ctx = gsap.context(() => {
      const section = thirdSectionRef.current;
      if (!section) return;

      const HOLD_DISTANCE = window.innerHeight * 0.5; // Hold for half viewport height of scroll

      ScrollTrigger.create({
        trigger: section,
        containerAnimation: mainTrackTimelineRef.current || undefined,
        start: 'center center',
        end: () => `+=${HOLD_DISTANCE}`,
        pin: true,
        pinSpacing: false,
        pinType: 'transform',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: 'third-section-pin',
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, horizontalWrapperRef);

    return () => {
      ctx.revert();
    };
  }, [mainTrackReady]);

  // Animate MOVEO title synchronized with horizontal scroll timeline
  // Prevents premature displacement before other elements start scrolling
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mainTrackReady) return;
    if (!mainTrackTimelineRef.current) return;
    if (!firstSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const allTargets = Array.from(firstSectionRef.current?.querySelectorAll('[data-first-animate]') || []) as HTMLElement[];
      if (!allTargets.length) return;

      const moveoElement = allTargets.find((el) => {
        const text = el.textContent?.trim();
        return text === 'MOVEO' || (el.classList.contains('uppercase') && text?.includes('MOVEO'));
      }) as HTMLElement;

      if (!moveoElement || !mainTrackTimelineRef.current) return;

      const tl = mainTrackTimelineRef.current;

      // Add MOVEO animation to the existing timeline
      // Start at position 0.2 (after hold period) and animate during horizontal scroll (0.2 to 1.0)
      tl.to(moveoElement, {
        y: -40,
        ease: 'none',
        duration: 0.8, // Same duration as horizontal scroll movement (80% of timeline)
      }, 0.2); // Start at 20% (after the hold period, when horizontal movement begins)

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, firstSectionRef);

    return () => ctx.revert();
  }, [mainTrackReady]);

  // Spectacular entrance animation for first section
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!firstSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const allTargets = Array.from(firstSectionRef.current?.querySelectorAll('[data-first-animate]') || []) as HTMLElement[];
      if (!allTargets.length) return;

      // Find specific elements
      const moveoElement = allTargets.find((el) => {
        const text = el.textContent?.trim();
        return text === 'MOVEO' || (el.classList.contains('uppercase') && text?.includes('MOVEO'));
      }) as HTMLElement;
      
      const imageElement = allTargets.find((el) => {
        const hasImage = el.querySelector('img[alt="Capa Home"]') || 
                        el.querySelector('img[src*="capahome"]') ||
                        el.querySelector('img[src*="capahome"]');
        return hasImage || el.classList.contains('overflow-hidden');
      }) as HTMLElement;

      const decorativeLines = Array.from(firstSectionRef.current?.querySelectorAll('[data-decor-line]') || []) as HTMLElement[];

      // ENTRANCE TIMELINE - dramatic reveal
      const entranceTl = gsap.timeline({ 
        defaults: { ease: 'power3.out' },
        delay: 0.3 
      });

      // 1. Split MOVEO into characters and animate each
      if (moveoElement) {
        const text = moveoElement.textContent || '';
        moveoElement.innerHTML = text.split('').map(char => 
          `<span style="display: inline-block; will-change: transform, opacity;">${char}</span>`
        ).join('');
        
        const chars = Array.from(moveoElement.querySelectorAll('span'));
        
        gsap.set(chars, { 
          opacity: 0,
          y: 150,
          rotationX: -90,
          transformOrigin: '50% 50%',
        });

        entranceTl.to(chars, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          stagger: {
            each: 0.08,
            from: 'start',
            ease: 'power2.out',
          },
          ease: 'back.out(1.4)',
        });
      }

      // 2. Decorative lines fly in
      if (decorativeLines.length) {
        gsap.set(decorativeLines, { scaleX: 0, transformOrigin: 'left center' });
        entranceTl.to(decorativeLines, {
          scaleX: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
        }, '-=0.8');
      }

      // 3. Produtora text - set initial state (will animate on first scroll)
      // Note: Animation is handled in separate useLayoutEffect that triggers on scroll

      // 4. Image - set initial state (will animate on first scroll)
      if (imageElement) {
        gsap.set(imageElement, { 
          opacity: 0,
          scale: 1.1,
        });
      }

    }, firstSectionRef);

    return () => ctx.revert();
  }, []);

  // Animate image on scroll - with reverse animation on scroll back
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!firstSectionRef.current) return;

    const imageElement = firstSectionRef.current.querySelector('[data-animate][data-first-animate]') as HTMLElement;
    if (!imageElement) return;

    const hasImage = imageElement.querySelector('img[alt="Capa Home"]') || 
                    imageElement.querySelector('img[src*="capahome"]');
    if (!hasImage) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state - ensure element starts invisible
    gsap.set(imageElement, { 
      opacity: 0,
      scale: 1.1,
    });

    // Track animation state
    let isVisible = false;
    let animation: gsap.core.Tween | null = null;

    // Helper function to animate in
    const animateIn = () => {
      if (isVisible) return;
      isVisible = true;
      if (animation) animation.kill();
      animation = gsap.to(imageElement, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    // Helper function to animate out
    const animateOut = () => {
      if (!isVisible) return;
      isVisible = false;
      if (animation) animation.kill();
      animation = gsap.to(imageElement, {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    // Create ScrollTrigger to control animation based on scroll position
    const scrollTrigger = ScrollTrigger.create({
      trigger: firstSectionRef.current,
      start: 'top top',
      end: '+=200', // Trigger zone: 200px from start
      onEnter: animateIn,
      onLeaveBack: animateOut,
    });

    return () => {
      if (animation) animation.kill();
      scrollTrigger.kill();
    };
  }, []);

  // Animate produtora text on scroll with split text effect - with reverse animation
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!firstSectionRef.current) return;

    // Find the text element - try ref first, then fallback to querySelector
    let textElement: HTMLElement | null = produtoraTextRef.current;
    
    if (!textElement && firstSectionRef.current) {
      // Fallback: find by text content
      const allTargets = Array.from(firstSectionRef.current.querySelectorAll('[data-first-animate]') || []) as HTMLElement[];
      const produtoraElement = allTargets.find((el) => {
        const text = el.textContent || '';
        return text.includes('Produtora boutique') || text.includes('de filmes independentes');
      });
      if (produtoraElement) {
        textElement = produtoraElement.querySelector('[data-animate]') as HTMLElement;
      }
    }
    
    if (!textElement) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Store original HTML before any modifications
    const originalHTML = textElement.innerHTML;

    // Set initial state
    gsap.set(textElement, { 
      opacity: 0,
      x: -100,
      filter: 'blur(10px)',
    });

    // Track animation state
    let isVisible = false;
    let wordElements: HTMLElement[] = [];
    let animation: gsap.core.Tween | null = null;

    // Helper function to split text into words
    const splitTextIntoWords = () => {
      // Simple split by <br /> or <br>
      const lines = originalHTML.split(/<br\s*\/?>/i);
      let newHTML = '';
      
      lines.forEach((line, lineIndex) => {
        if (!line.trim()) return;
        
        // Get text content from the line
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = line.trim();
        const lineText = (tempDiv.textContent || tempDiv.innerText || '').trim();
        
        if (!lineText) return;
        
        // Split into words
        const words = lineText.split(/\s+/).filter(w => w.length > 0);
        
        // Wrap each word in a span
        words.forEach((word, wordIndex) => {
          newHTML += `<span class="word">${word}</span>`;
          if (wordIndex < words.length - 1) {
            newHTML += ' ';
          }
        });
        
        // Add <br /> between lines
        if (lineIndex < lines.length - 1) {
          newHTML += '<br />';
        }
      });
      
      // Replace HTML
      textElement.innerHTML = newHTML;
      
      // Get all word elements
      wordElements = Array.from(textElement.querySelectorAll('.word')) as HTMLElement[];
    };

    // Helper function to animate in
    const animateIn = () => {
      if (isVisible) return;
      isVisible = true;

      // Split text into words if not already split
      if (wordElements.length === 0) {
        splitTextIntoWords();
      }

      if (wordElements.length > 0) {
        // Set initial state for words
        wordElements.forEach((word) => {
          gsap.set(word, {
            opacity: 0,
            y: 15,
            display: 'inline-block',
          });
        });
        
        // Make container visible
        gsap.set(textElement, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
        });
        
        // Animate words with stagger
        if (animation) animation.kill();
        animation = gsap.to(wordElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
        });
      } else {
        // Fallback - simple fade in
        if (animation) animation.kill();
        animation = gsap.to(textElement, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
        });
      }
    };

    // Helper function to animate out (reverse)
    const animateOut = () => {
      if (!isVisible) return;
      isVisible = false;

      if (wordElements.length > 0) {
        // Animate words out with reverse stagger
        if (animation) animation.kill();
        animation = gsap.to(wordElements, {
          opacity: 0,
          y: 15,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          onComplete: () => {
            // Restore original HTML after animation completes
            textElement.innerHTML = originalHTML;
            wordElements = [];
            // Reset element state
            gsap.set(textElement, {
              opacity: 0,
              x: -100,
              filter: 'blur(10px)',
            });
          },
        });
      } else {
        // Fallback - simple fade out
        if (animation) animation.kill();
        animation = gsap.to(textElement, {
          opacity: 0,
          x: -100,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power3.out',
        });
      }
    };

    // Create ScrollTrigger to control animation based on scroll position
    const scrollTrigger = ScrollTrigger.create({
      trigger: firstSectionRef.current,
      start: 'top top',
      end: '+=200', // Trigger zone: 200px from start
      onEnter: animateIn,
      onLeaveBack: animateOut,
    });

    return () => {
      if (animation) animation.kill();
      scrollTrigger.kill();
    };
  }, []);

  // Animações para seções de "AS MIÇANGAS" - Scroll Acceleration
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!secondTrackReady) return;
    if (!horizontalSecondTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('[data-micangas-panel]') || []) as HTMLElement[];
      if (!panels.length) return;

      const horizontalTrackST = ScrollTrigger.getById('horizontal-second-track');
      if (!horizontalTrackST) return;

      // Scroll Acceleration para primeira seção (galeria)
      const firstPanel = panels[0];
      if (firstPanel) {
        const cols = Array.from(firstPanel.querySelectorAll('.data-micangas-col')) as HTMLElement[];
        
        if (cols.length) {
          const additionalY = { val: 0 };
          let additionalYAnim: gsap.core.Tween | null = null;
          let offset = 0;

          cols.forEach((col, i) => {
            const images = Array.from(col.querySelectorAll('.data-micangas-image')) as HTMLElement[];
            if (!images.length) return;

            // Duplicate images for seamless loop
            images.forEach((image) => {
              const clone = image.cloneNode(true) as HTMLElement;
              col.appendChild(clone);
            });

            // Set animation with different directions
            const direction = i % 2 !== 0 ? '+=' : '-='; // Odd columns move down, even move up
            const columnHeight = col.scrollHeight;

            images.forEach((item) => {
              gsap.to(item, {
                y: direction + (columnHeight / 2),
                duration: 20,
                repeat: -1,
                ease: 'none',
                modifiers: {
                  y: gsap.utils.unitize((y) => {
                    if (direction === '+=') {
                      offset += additionalY.val;
                      y = (parseFloat(y) - offset) % (columnHeight * 0.5);
                    } else {
                      offset += additionalY.val;
                      y = (parseFloat(y) + offset) % -(columnHeight * 0.5);
                    }
                    return y;
                  })
                }
              });
            });
          });

          // Scroll velocity acceleration
          ScrollTrigger.create({
            trigger: firstPanel,
            start: 'left 100%',
            end: 'left 0%',
            containerAnimation: secondTrackTweenRef.current || undefined,
            onUpdate: (self) => {
              const velocity = self.getVelocity();
              if (velocity > 0) {
                if (additionalYAnim) additionalYAnim.kill();
                additionalY.val = -velocity / 2000;
                additionalYAnim = gsap.to(additionalY, { val: 0 });
              }
              if (velocity < 0) {
                if (additionalYAnim) additionalYAnim.kill();
                additionalY.val = -velocity / 3000;
                additionalYAnim = gsap.to(additionalY, { val: 0 });
              }
            },
          });
        }
      }

      // Split text animation for all panels
      const splitTexts = horizontalSecondTrackRef.current 
        ? Array.from(horizontalSecondTrackRef.current.querySelectorAll('.split-text')) as HTMLElement[]
        : [];
      splitTexts.forEach((textEl) => {
        const text = textEl.textContent || '';
        const words = text.split(' ');
        textEl.innerHTML = words.map(word => `<span class="word" style="display: inline-block; opacity: 0; transform: translateY(15px);">${word}</span>`).join(' ');
      });

      // Animate other panels - Individual animations
      panels.forEach((panel, index) => {
        if (index === 0) {
          // Title animation for first panel - Individual
          const title = panel.querySelector('.data-micangas-title') as HTMLElement;
          if (title) {
            gsap.fromTo(title,
              { 
                opacity: 0, 
                scale: 0.6,
                rotation: -5,
                y: 50,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 1.4,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                  trigger: panel,
                  start: 'left 80%',
                  end: 'left 20%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
          return;
        }

        const content = panel.querySelector('.data-micangas-content') as HTMLElement;
        const title = panel.querySelector('.data-micangas-title') as HTMLElement;
        const words = Array.from(panel.querySelectorAll('.word')) as HTMLElement[];

        // Check if this is the first panel (panel 0) - make it visible immediately
        const isFirstPanel = panel.getAttribute('data-micangas-panel') === '0';

        // Title animation - Individual
        if (title) {
          if (isFirstPanel) {
            // For first panel, set visible immediately
            gsap.set(title, { opacity: 1, scale: 1, x: 0, rotation: 0 });
          }
          
          gsap.fromTo(title,
            { 
              opacity: isFirstPanel ? 1 : 0, 
              scale: isFirstPanel ? 1 : 0.7,
              x: isFirstPanel ? 0 : -50,
              rotation: isFirstPanel ? 0 : -3,
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              rotation: 0,
              duration: 1.3,
              ease: 'back.out(1.2)',
              scrollTrigger: {
                trigger: title,
                start: 'left 85%',
                end: 'left 15%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Content — slides from right with 3D rotation and blur
        if (content) {
          if (isFirstPanel) {
            gsap.set(content, { opacity: 1, x: 0, rotationY: 0, filter: 'blur(0px)' });
          }

          gsap.fromTo(content,
            {
              opacity: isFirstPanel ? 1 : 0,
              x: isFirstPanel ? 0 : 60,
              rotationY: isFirstPanel ? 0 : -6,
              filter: isFirstPanel ? 'blur(0px)' : 'blur(5px)',
            },
            {
              opacity: 1,
              x: 0,
              rotationY: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: content,
                start: 'left 85%',
                end: 'left 15%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Words — bouncy stagger with micro-rotation
        if (words.length) {
          words.forEach((word, index) => {
            gsap.to(word,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: index * 0.06,
                ease: 'back.out(1.4)',
                scrollTrigger: {
                  trigger: word,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Label — expands from compressed with expo ease
        const label = panel.querySelector('.data-micangas-label') as HTMLElement;
        if (label) {
          gsap.fromTo(label,
            { opacity: 0, y: -25, scaleX: 0.7, letterSpacing: '0.5em' },
            {
              opacity: 1,
              y: 0,
              scaleX: 1,
              letterSpacing: '0.1em',
              duration: 1.0,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: label,
                start: 'left 85%',
                end: 'left 15%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Ficha técnica — skewed slide-in with circ ease
        const ficha = panel.querySelector('.data-micangas-ficha') as HTMLElement;
        if (ficha) {
          const fichaItems = Array.from(ficha.querySelectorAll('div')) as HTMLElement[];
          fichaItems.forEach((item, index) => {
            gsap.fromTo(item,
              { opacity: 0, x: -30, skewX: -5 },
              {
                opacity: 1,
                x: 0,
                skewX: 0,
                duration: 0.7,
                delay: index * 0.13,
                ease: 'circ.out',
                scrollTrigger: {
                  trigger: ficha,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Individual image animations for AS MIÇANGAS
        const images = Array.from(panel.querySelectorAll('.data-micangas-image')) as HTMLElement[];
        if (images.length) {
          images.forEach((img, index) => {
            if (isFirstPanel) {
              // For first panel, set visible immediately
              gsap.set(img, { opacity: 1, scale: 1, rotation: 0, y: 0 });
            }
            
            gsap.fromTo(img,
              { 
                opacity: isFirstPanel ? 1 : 0, 
                scale: isFirstPanel ? 1 : 0.8,
                rotation: isFirstPanel ? 0 : (index % 2 === 0 ? -5 : 5),
                y: isFirstPanel ? 0 : 30,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 0.9,
                delay: index * 0.06,
                ease: 'back.out(1.1)',
                scrollTrigger: {
                  trigger: img,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }
      });

      // Parallax effect for background images
      const parallaxImages = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('[data-micangas-parallax]') || []) as HTMLElement[];
      
      if (horizontalTrackST && parallaxImages.length) {
        const updateParallax = () => {
          const progress = horizontalTrackST.progress;
          parallaxImages.forEach((img) => {
            const speed = parseFloat(img.getAttribute('data-speed') || '0.2');
            const moveX = -progress * 200 * speed;
            gsap.set(img, { x: moveX });
          });
        };

        ScrollTrigger.create({
          trigger: horizontalSecondWrapperRef.current,
          start: 'top 50px',
          end: () => {
            if (!horizontalSecondTrackRef.current || !horizontalSecondWrapperRef.current) return '+=0';
            return `+=${horizontalSecondTrackRef.current.scrollWidth + window.innerHeight}`;
          },
          onUpdate: updateParallax,
        });
      }
    }, horizontalSecondTrackRef);

    return () => ctx.revert();
  }, [secondTrackReady]);

  // 3D Carousel Animation - Catálogo Section
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!carouselContainerRef.current || !carouselScrollDistRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = carouselContainerRef.current;
    const scrollDist = carouselScrollDistRef.current;
    const boxes: HTMLDivElement[] = [];
    const numBoxes = 24;

    // Images array - using existing placeholder images
    // Note: Using the same image paths as used elsewhere in the codebase
    const images = [
      '/imagens/secao2home/Rectangle 8.png',
      '/imagens/secao2home/Rectangle 9.png',
      '/imagens/secao2home/Rectangle 10.png',
      '/imagens/secao2home/Rectangle 11.png',
      '/imagens/secao2home/Rectangle 122.png',
    ];

    // Create boxes
    for (let i = 0; i < numBoxes; i++) {
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.userSelect = 'none';
      box.style.cursor = 'pointer';
      boxes.push(box);
      container.appendChild(box);
    }

    const ctx = gsap.context(() => {
      // Preload images
      const imagePromises = images.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = document.createElement('img');
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
          img.src = src;
        });
      });

      // Initial setup for container
      gsap.set(container, {
        perspective: 600,
        transformStyle: 'preserve-3d',
      });

      // Wait for images to load, then setup boxes
      Promise.allSettled(imagePromises).then(() => {
        // Initial setup for each box
        boxes.forEach((box, i) => {
          const imageIndex = i % images.length;
          const imageUrl = images[imageIndex];
          
          // First set GSAP properties
          gsap.set(box, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            width: 180,
            height: 180,
            borderRadius: '8px',
            backfaceVisibility: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            transformStyle: 'preserve-3d',
            zIndex: 10 + i,
            backgroundColor: '#1a1a1a', // Fallback color while image loads
            opacity: 1,
          });
          
          // Then set background image directly on the element (after GSAP.set to ensure it's not overwritten)
          // Use requestAnimationFrame to ensure GSAP has finished applying styles
          requestAnimationFrame(() => {
            box.style.setProperty('background-image', `url(${imageUrl})`, 'important');
            box.style.setProperty('background-size', 'cover', 'important');
            box.style.setProperty('background-position', 'center', 'important');
            box.style.setProperty('background-repeat', 'no-repeat', 'important');
          });

          // Create timeline for each box
          const tl = gsap.timeline({ paused: true, defaults: { immediateRender: true } })
            .fromTo(box, {
              scale: 0.3,
              rotationX: (i / numBoxes) * 360,
              transformOrigin: '50% 50% -500px',
            }, {
              rotationX: '+=360',
              ease: 'none',
            })
            .timeScale(0.05);

          // Store timeline on the element
          (box as HTMLElement & { tl?: gsap.core.Timeline }).tl = tl;

          // Hover effects
          box.addEventListener('mouseenter', () => {
            gsap.to(box, { 
              opacity: 0.8, 
              scale: 0.35, 
              duration: 0.4, 
              ease: 'expo.out',
              boxShadow: '0 15px 60px rgba(255, 255, 255, 0.2)',
              zIndex: 100,
            });
          });

          box.addEventListener('mouseleave', () => {
            gsap.to(box, { 
              opacity: 1, 
              scale: 0.3, 
              duration: 0.2, 
              ease: 'back.out(3)', 
              overwrite: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              zIndex: 10 + i,
            });
          });
        });

        // Setup ScrollTriggers after boxes are ready
        // Entrance animation - Big spin when section enters viewport
        ScrollTrigger.create({
          trigger: container,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            // Animate container with a dramatic entrance spin
            gsap.fromTo(container, 
              {
                rotationY: -180,
                opacity: 0,
              },
              {
                rotationY: 0,
                opacity: 1,
                duration: 2,
                ease: 'power3.out',
              }
            );

            // Stagger the boxes appearing
            boxes.forEach((box, i) => {
              gsap.from(box, {
                opacity: 0,
                scale: 0,
                duration: 1,
                delay: i * 0.03,
                ease: 'back.out(2)',
              });
            });
          },
        });

        // ScrollTrigger for continuous rotation during scroll
        ScrollTrigger.create({
          trigger: scrollDist,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            boxes.forEach((box) => {
              const tl = (box as HTMLElement & { tl?: gsap.core.Timeline }).tl;
              if (tl) {
                tl.progress(progress);
              }
            });
          },
          invalidateOnRefresh: true,
        });
      });
    }, carouselContainerRef);

    return () => {
      // Clean up boxes
      boxes.forEach((box) => box.remove());
      ctx.revert();
    };
  }, []);

  // Animações para seções de "O Mistério da Carne"
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!secondTrackReady) return;
    if (!horizontalSecondTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('[data-misterio-panel]') || []) as HTMLElement[];
      if (!panels.length) return;

      const horizontalTrackST = ScrollTrigger.getById('horizontal-second-track');
      if (!horizontalTrackST) return;

      // Animate each panel when it enters viewport
      panels.forEach((panel) => {
        const title = panel.querySelector('.data-misterio-title') as HTMLElement;
        const galleryItems = Array.from(panel.querySelectorAll('.data-misterio-gallery-item')) as HTMLElement[];

        // Check if this is the first panel (panel 0) - make it visible immediately
        const isFirstPanel = panel.getAttribute('data-misterio-panel') === '0';

        // Title animation - Individual
        if (title) {
          if (isFirstPanel) {
            // For first panel, set visible immediately
            gsap.set(title, { opacity: 1, scale: 1, rotation: 0, y: 0 });
          }
          
          gsap.fromTo(title,
            { 
              opacity: isFirstPanel ? 1 : 0, 
              scale: isFirstPanel ? 1 : 0.6,
              rotation: isFirstPanel ? 0 : 5,
              y: isFirstPanel ? 0 : 50,
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              y: 0,
              duration: 1.4,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: title,
                start: 'left 85%',
                end: 'left 15%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Gallery items fade in - Individual animations
        if (galleryItems.length) {
          galleryItems.forEach((item, index) => {
            if (isFirstPanel) {
              // For first panel, set visible immediately
              gsap.set(item, { opacity: 1, scale: 1, rotation: 0, y: 0 });
            }
            
            gsap.fromTo(item,
              { 
                opacity: isFirstPanel ? 1 : 0, 
                scale: isFirstPanel ? 1 : 0.7,
                rotation: isFirstPanel ? 0 : (index % 2 === 0 ? -8 : 8),
                y: isFirstPanel ? 0 : 50,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 1,
                delay: index * 0.1,
                ease: 'back.out(1.3)',
                scrollTrigger: {
                  trigger: item,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Header (title + year) — drops from above with 3D flip and blur
        const header = panel.querySelector('.data-misterio-header') as HTMLElement;
        if (header) {
          gsap.fromTo(header,
            { opacity: 0, y: -40, rotationX: 12, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              filter: 'blur(0px)',
              duration: 1.3,
              ease: 'back.out(1.4)',
              scrollTrigger: {
                trigger: panel,
                start: 'left 85%',
                end: 'left 15%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Technical info — alternating directions with rotation
        const tech = panel.querySelector('.data-misterio-tech') as HTMLElement;
        if (tech) {
          const techItems = Array.from(tech.querySelectorAll('div')) as HTMLElement[];
          techItems.forEach((item, index) => {
            const isEven = index % 2 === 0;
            gsap.fromTo(item,
              { opacity: 0, x: isEven ? -30 : 30, rotation: isEven ? -2 : 2 },
              {
                opacity: 1,
                x: 0,
                rotation: 0,
                duration: isEven ? 0.7 : 0.8,
                delay: index * 0.12,
                ease: isEven ? 'expo.out' : 'power4.out',
                scrollTrigger: {
                  trigger: panel,
                  start: 'left 80%',
                  end: 'left 20%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Prêmios — elastic bounce from below
        const premios = panel.querySelector('.data-misterio-premios') as HTMLElement;
        if (premios) {
          gsap.fromTo(premios,
            { opacity: 0, scale: 0.85, y: 45 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.0,
              delay: 0.1,
              ease: 'elastic.out(1, 0.8)',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Estreias — slides from right with blur
        const estreias = panel.querySelector('.data-misterio-estreias') as HTMLElement;
        if (estreias) {
          gsap.fromTo(estreias,
            { opacity: 0, x: 50, filter: 'blur(6px)' },
            {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 1.1,
              delay: 0.25,
              ease: 'circ.out',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, horizontalSecondTrackRef);

    return () => ctx.revert();
  }, [secondTrackReady]);

  // Entrada suave da segunda seção (primeiro track horizontal)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mainTrackReady) return;
    if (!secondSectionRef.current || !mainTrackTimelineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(secondSectionRef.current);
      const imageTargets = q('[data-second-image]') as HTMLElement[];
      const contentTargets = q('[data-second-animate]') as HTMLElement[];
      if (!imageTargets.length && !contentTargets.length) return;

      // Only set images to invisible initially, text will be handled by typewriter
      gsap.set(imageTargets, { autoAlpha: 0 });

      // Unique animation variants for each of the 8 images
      const imageVariants = [
        // Imagem 1 - Rectangle 8.png
        { x: -120, y: 150, rotate: -4, scale: 1.2, blur: 12, duration: 1.9, ease: 'back.out(1.7)', delay: 0 },
        // Imagem 2 - Rectangle 11.png
        { x: 100, y: 130, rotate: 3, scale: 1.15, blur: 10, duration: 1.7, ease: 'power3.out', delay: 0.15 },
        // Imagem 3 - Rectangle 9.png
        { x: 0, y: 160, rotate: 0, scale: 1.25, blur: 15, duration: 2.0, ease: 'elastic.out(1, 0.5)', delay: 0.3 },
        // Imagem 4 - Rectangle 10.png
        { x: -80, y: 140, rotate: -2.5, scale: 1.18, blur: 11, duration: 1.8, ease: 'back.out(1.5)', delay: 0.45 },
        // Imagem 5 - Rectangle 12.png
        { x: 110, y: 145, rotate: 2.8, scale: 1.22, blur: 13, duration: 1.85, ease: 'power2.out', delay: 0.6 },
        // Imagem 6 - Rectangle 8.png
        { x: -60, y: 155, rotate: -1.8, scale: 1.16, blur: 9, duration: 1.75, ease: 'back.out(1.4)', delay: 0.75 },
        // Imagem 7 - Rectangle 122.png
        { x: 90, y: 125, rotate: 1.5, scale: 1.19, blur: 14, duration: 1.95, ease: 'elastic.out(1, 0.6)', delay: 0.9 },
        // Imagem 8 - Rectangle 10.png
        { x: 0, y: 135, rotate: 0, scale: 1.17, blur: 10, duration: 1.8, ease: 'power3.out', delay: 1.05 },
      ];

      imageTargets.forEach((target, index) => {
        const variant = imageVariants[index] || imageVariants[0]; // Fallback to first variant if more than 8 images

        gsap.fromTo(
          target,
          { 
            autoAlpha: 0, 
            x: variant.x, 
            y: variant.y, 
            scale: variant.scale, 
            rotate: variant.rotate, 
            filter: `blur(${variant.blur}px)` 
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: target,
              containerAnimation: mainTrackTimelineRef.current || undefined,
              start: 'left 115%',
              end: 'left 35%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Unique animation variants for each text content element
      const contentVariants = [
        // 1. "Brasília, desde 2018"
        { x: -50, y: 100, scale: 1.08, blur: 8 },
        // 2. "Filmes de arte para o mercado internacional" (first instance)
        { x: 55, y: 115, scale: 1.12, blur: 10 },
        // 3. "SOBRE A MOVEO"
        { x: 0, y: 130, scale: 1.15, blur: 12 },
        // 4. "Focado em promissores cineastas brasileiros"
        { x: -70, y: 105, scale: 1.09, blur: 9 },
        // 5. "Um histórico sólido de colaborações com talentos emergentes"
        { x: 65, y: 120, scale: 1.11, blur: 11 },
        // 6. "Filmes de arte para o mercado internacional" (second instance)
        { x: -45, y: 110, scale: 1.1, blur: 8 },
        // 7. "FILMES DESTAQUE DO NOSSO CATÁLOGO"
        { x: 0, y: 125, scale: 1.13, blur: 10 },
      ];

      contentTargets.forEach((target, index) => {
        const variant = contentVariants[index] || contentVariants[0]; // Fallback to first variant if more than 7 elements

        // Ensure container is visible
        gsap.set(target, { autoAlpha: 1 });

        // Apply typewriter effect to all text elements
        const paragraph = target.querySelector('p');
        const textContainer = target.querySelector('div[class*="text-white"]') || paragraph;
        
        if (textContainer) {
          // Get all text content
          const originalHTML = textContainer.innerHTML;
          
          // Check if it has nested divs (like SOBRE A MOVEO)
          const hasNestedDivs = textContainer.querySelector('div') !== null;
          
          if (hasNestedDivs) {
            // Handle nested structure (like SOBRE A MOVEO)
            const nestedDivs = textContainer.querySelectorAll('div');
            const allCharSpans: HTMLElement[] = [];
            
            nestedDivs.forEach((div) => {
              const text = div.textContent || '';
              div.innerHTML = '';
              
              for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
                span.style.opacity = '0';
                span.style.display = 'inline';
                div.appendChild(span);
                allCharSpans.push(span);
              }
            });
            
            // Animate all characters with timeline (no scrub, restarts on enter/exit)
            if (allCharSpans.length > 0) {
              const typewriterTl = gsap.timeline({
                paused: true,
                scrollTrigger: {
                  trigger: target,
                  containerAnimation: mainTrackTimelineRef.current || undefined,
                  start: 'left 112%',
                  end: 'left 40%',
                  toggleActions: 'play none none reverse', // Play on enter, reverse on leave
                  invalidateOnRefresh: true,
                },
              });
              
              allCharSpans.forEach((span, i) => {
                typewriterTl.to(span, {
                  opacity: 1,
                  duration: 0.03,
                  ease: 'none',
                }, i * 0.03);
              });
            }
          } else {
            // Handle simple paragraph structure
            const charSpans: HTMLElement[] = [];
            const hasBreaks = originalHTML.includes('<br');
            const parts = hasBreaks ? originalHTML.split(/<br\s*\/?>/i) : [originalHTML];
            
            textContainer.innerHTML = '';
            
            parts.forEach((part, partIndex) => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = part;
              const text = tempDiv.textContent || '';
              
              for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
                span.style.opacity = '0';
                span.style.display = 'inline';
                textContainer.appendChild(span);
                charSpans.push(span);
              }
              
              if (partIndex < parts.length - 1) {
                textContainer.appendChild(document.createElement('br'));
              }
            });
            
            // Animate characters appearing one by one with timeline (no scrub, restarts on enter/exit)
            if (charSpans.length > 0) {
              const typewriterTl = gsap.timeline({
                paused: true,
                scrollTrigger: {
                  trigger: target,
                  containerAnimation: mainTrackTimelineRef.current || undefined,
                  start: 'left 112%',
                  end: 'left 40%',
                  toggleActions: 'play none none reverse', // Play on enter, reverse on leave
                  invalidateOnRefresh: true,
                },
              });
              
              charSpans.forEach((span, i) => {
                typewriterTl.to(span, {
                  opacity: 1,
                  duration: 0.03,
                  ease: 'none',
                }, i * 0.03);
              });
            }
          }
        } else {
          // Fallback to original animation if no text container found
          gsap.fromTo(
            target,
            { 
              autoAlpha: 0, 
              x: variant.x, 
              y: variant.y, 
              scale: variant.scale, 
              filter: `blur(${variant.blur}px)` 
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: target,
                containerAnimation: mainTrackTimelineRef.current || undefined,
                start: 'left 112%',
                end: 'left 40%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, secondSectionRef);

    return () => ctx.revert();
  }, [mainTrackReady]);

  // ScrollTrigger animations for third section (images and text)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!thirdSectionRef.current || !mainTrackReady) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(thirdSectionRef.current);
      const imageTargets = q('[data-third-image]') as HTMLElement[];
      const contentTargets = q('[data-third-animate]') as HTMLElement[];
      const allTargets = [...imageTargets, ...contentTargets];
      if (!allTargets.length) return;

      gsap.set(allTargets, { autoAlpha: 0 });

      // Unique animation variants for each of the 10 images in third section
      const thirdImageVariants = [
        // Imagem 11 - Rectangle 8.png
        { x: -130, y: 160, rotate: -5, scale: 1.22, blur: 13 },
        // Imagem 12 - Rectangle 9.png
        { x: 105, y: 140, rotate: 3.5, scale: 1.16, blur: 11 },
        // Imagem 13 - Rectangle 10.png
        { x: 0, y: 170, rotate: 0, scale: 1.26, blur: 16 },
        // Imagem 14 - Rectangle 11.png
        { x: -90, y: 150, rotate: -3, scale: 1.19, blur: 12 },
        // Imagem 15 - Rectangle 12.png
        { x: 115, y: 155, rotate: 3, scale: 1.23, blur: 14 },
        // Imagem 16 - Rectangle 8.png
        { x: -70, y: 165, rotate: -2, scale: 1.17, blur: 10 },
        // Imagem 17 - Rectangle 9.png
        { x: 95, y: 135, rotate: 2, scale: 1.2, blur: 15 },
        // Imagem 18 - Rectangle 10.png
        { x: -50, y: 145, rotate: -1.5, scale: 1.18, blur: 11 },
        // Imagem 19 - Rectangle 11.png
        { x: 100, y: 150, rotate: 2.5, scale: 1.21, blur: 13 },
        // Imagem 20 - Rectangle 12.png
        { x: 0, y: 140, rotate: 0, scale: 1.19, blur: 12 },
      ];

      imageTargets.forEach((target, index) => {
        const variant = thirdImageVariants[index] || thirdImageVariants[0];
        // Images 16, 17, 18, 19, 20 (indices 5-9) finish animation sooner
        const shouldFinishSooner = index >= 5 && index <= 9;
        // Images 16, 17, 18 (indices 5-7) don't use blur, use opacity and brightness instead
        const noBlur = index >= 5 && index <= 7;

        gsap.fromTo(
          target,
          { 
            autoAlpha: 0, 
            x: variant.x, 
            y: variant.y, 
            scale: variant.scale, 
            rotate: variant.rotate, 
            filter: noBlur ? 'brightness(0.3)' : `blur(${variant.blur}px)`,
            opacity: noBlur ? 0 : undefined,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: noBlur ? 'brightness(1)' : 'blur(0px)',
            opacity: noBlur ? 1 : undefined,
            ease: 'none',
            scrollTrigger: {
              trigger: target,
              containerAnimation: mainTrackTimelineRef.current || undefined,
              start: 'left 115%',
              end: shouldFinishSooner ? 'left 60%' : 'left 35%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Unique animation variants for text content in third section
      const thirdContentVariants = [
        // "FILMES DESTAQUE DO NOSSO CATÁLOGO"
        { x: 0, y: 140, scale: 1.16, blur: 13 },
        // "Um histórico sólido de colaborações com talentos emergentes"
        { x: -75, y: 110, scale: 1.1, blur: 10 },
        // "Filmes de arte para o mercado internacional"
        { x: 70, y: 125, scale: 1.12, blur: 11 },
      ];

      contentTargets.forEach((target, index) => {
        const variant = thirdContentVariants[index] || thirdContentVariants[0];
        const isFilmesDestaque = index === 0;
        const isTypewriter = target.hasAttribute('data-typewriter-text');

        // Skip default animation for typewriter element
        if (isTypewriter) {
          return;
        }

        if (isFilmesDestaque) {
          // Unique creative animation: Dramatic wipe reveal with glitch effect
          gsap.set(target, { 
            clearProps: 'all',
            overflow: 'hidden',
          });

          // Create a timeline for complex animation sequence
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: target,
              containerAnimation: mainTrackTimelineRef.current || undefined,
              start: 'left 112%',
              end: 'left 65%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1: Dramatic wipe reveal from left with scale
          tl.fromTo(
            target,
            {
              clipPath: 'inset(0 100% 0 0)', // Completely hidden from right
              opacity: 0,
              x: -200, // Start far to the left
              scale: 0.5, // Start very small
              rotation: -10, // Tilted
            },
            {
              clipPath: 'inset(0 0% 0 0)', // Fully revealed
              opacity: 1,
              x: 0,
              scale: 1.05, // Slightly larger
              rotation: 0,
              duration: 0.6,
              ease: 'power3.out',
            }
          )
          // Phase 2: Glitch shake effect with color distortion
          .fromTo(
            target,
            {
              x: 0,
              y: 0,
              skewX: 0,
              filter: 'contrast(1) brightness(1) saturate(1)',
            },
            {
              x: -15, // Glitch offset
              y: 8,
              skewX: 5,
              filter: 'contrast(2.8) brightness(1.8) saturate(2.2)',
              duration: 0.15,
              ease: 'power1.in',
            },
            '-=0.4'
          )
          .to(
            target,
            {
              x: 12,
              y: -6,
              skewX: -4,
              filter: 'contrast(1.5) brightness(1.3) saturate(1.4)',
              duration: 0.1,
              ease: 'power1.inOut',
            }
          )
          .to(
            target,
            {
              x: 0,
              y: 0,
              skewX: 0,
              filter: 'contrast(1) brightness(1) saturate(1)',
              duration: 0.15,
              ease: 'power2.out',
            }
          )
          // Phase 3: Final settle with bounce
          .to(
            target,
            {
              scale: 1,
              duration: 0.3,
              ease: 'elastic.out(1, 0.6)',
            },
            '-=0.2'
          );
        } else {
          // Original animation for other elements
          const fromProps: gsap.TweenVars = { 
            autoAlpha: 0, 
            x: variant.x, 
            y: variant.y,
            scale: variant.scale,
            filter: `blur(${variant.blur}px)`,
          };
          
          const toProps: gsap.TweenVars = {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          };

          gsap.fromTo(
            target,
            fromProps,
            {
              ...toProps,
              ease: 'none',
              scrollTrigger: {
                trigger: target,
                containerAnimation: mainTrackTimelineRef.current || undefined,
                start: 'left 112%',
                end: 'left 40%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // Typewriter effect for "Um histórico sólido de colaborações com talentos emergentes"
      const typewriterElement = thirdSectionRef.current?.querySelector('[data-typewriter-text]') as HTMLElement;
      if (typewriterElement) {
        // Ensure container is visible
        gsap.set(typewriterElement, { autoAlpha: 1 });
        
        const paragraph = typewriterElement.querySelector('p');
        if (paragraph) {
          // Get all span elements (the 3 lines)
          const lineSpans = paragraph.querySelectorAll('span');
          
          if (lineSpans.length > 0) {
            const allChars: HTMLElement[] = [];
            
            // Process each line span
            lineSpans.forEach((lineSpan) => {
              const text = lineSpan.textContent || '';
              const chars = text.split('');
              
              // Clear the span and add character spans
              lineSpan.innerHTML = '';
              chars.forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char === ' ' ? '\u00A0' : char;
                charSpan.style.opacity = '0';
                charSpan.style.display = 'inline';
                lineSpan.appendChild(charSpan);
                allChars.push(charSpan);
              });
            });
            
            // Animate characters appearing one by one with timeline (no scrub, restarts on enter/exit)
            const totalChars = allChars.length;
            if (totalChars > 0) {
              const typewriterTl = gsap.timeline({
                paused: true,
                scrollTrigger: {
                  trigger: typewriterElement,
                  containerAnimation: mainTrackTimelineRef.current || undefined,
                  start: 'left 112%',
                  end: 'left 40%',
                  toggleActions: 'play none none reverse', // Play on enter, reverse on leave
                  invalidateOnRefresh: true,
                },
              });
              
              allChars.forEach((span, i) => {
                typewriterTl.to(span, {
                  opacity: 1,
                  duration: 0.03,
                  ease: 'none',
                }, i * 0.03);
              });
            }
          }
        }
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, thirdSectionRef);

    return () => ctx.revert();
  }, [mainTrackReady]);

  // ScrollTrigger animations for Catalog Section (Catálogo em Destaque) - Individual animations
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!dragonflySectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(dragonflySectionRef.current);
      
      // Get individual elements
      const labelElement = q('[data-catalog-label]')[0] as HTMLElement;
      const titleElement = q('[data-catalog-title]')[0] as HTMLElement;
      const descriptionElement = q('[data-catalog-description]')[0] as HTMLElement;
      const imageElement = q('[data-catalog-image]')[0] as HTMLElement;

      // Animation for label "NOSSOS FILMES" — letter-spacing + scaleY reveal
      if (labelElement) {
        gsap.set(labelElement, {
          opacity: 0,
          letterSpacing: '0.6em',
          scaleY: 0.5,
          y: 15,
        });

        gsap.to(labelElement, {
          opacity: 1,
          letterSpacing: '0.15em',
          scaleY: 1,
          y: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: labelElement,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Animation for title "Catálogo em Destaque" — 3D flip + scale bounce
      if (titleElement) {
        gsap.set(titleElement, {
          opacity: 0,
          y: 70,
          rotationX: -20,
          scale: 0.88,
        });

        gsap.to(titleElement, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.4,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: titleElement,
            start: 'top 85%',
            end: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Typewriter animation for description paragraph (character-by-character with proper wrapping)
      if (descriptionElement) {
        const originalText = descriptionElement.textContent || '';
        
        // Split text into characters
        const chars = originalText.split('');
        const charElements: HTMLElement[] = [];
        
        // Clear content and ensure proper wrapping styles
        descriptionElement.style.display = 'block';
        descriptionElement.style.width = '100%';
        descriptionElement.innerHTML = '';
        
        // Create spans for each character
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.style.display = 'inline';
          charSpan.style.opacity = '0';
          charSpan.style.transform = 'translateY(2px)';
          
          // Use regular spaces to allow wrapping
          if (char === ' ') {
            charSpan.textContent = ' ';
          } else {
            charSpan.textContent = char;
          }
          
          descriptionElement.appendChild(charSpan);
          charElements.push(charSpan);
        });

        // Create typewriter timeline with ScrollTrigger
        const typewriterTl = gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: descriptionElement,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        });

        // Animate each character appearing one by one - faster timing
        charElements.forEach((span, i) => {
          typewriterTl.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.03,
            ease: 'none',
          }, i * 0.018); // Slower spacing for organic reveal
        });
      }

      // Animation for image - Zoom in from center with blur and brightness
      if (imageElement) {
        const imageContainer = imageElement.parentElement;
        if (imageContainer) {
          // Set initial state - zoomed in, blurred, darker, with 3D tilt
          gsap.set(imageElement, {
            opacity: 0,
            scale: 1.25,
            filter: 'blur(15px) brightness(0.4)',
            rotationY: 5,
          });

          // Animate to final state — long reveal with power4 snap
          gsap.to(imageElement, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px) brightness(0.9)',
            rotationY: 0,
            duration: 1.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: imageContainer,
              start: 'top 80%',
              end: 'top 45%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, dragonflySectionRef);

    return () => ctx.revert();
  }, []);

  // ScrollTrigger animations for Cinema Section (CATÁLOGO/CINEMA)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!cinemaSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(cinemaSectionRef.current);
      const imageTargets = q('[data-cinema-image]') as HTMLElement[];
      const contentTargets = q('[data-cinema-animate]') as HTMLElement[];
      const allTargets = [...imageTargets, ...contentTargets];
      if (!allTargets.length) return;

      gsap.set(allTargets, { autoAlpha: 0 });

      // Unique animation configs per image — each with distinct direction, ease, duration
      const cinemaImageConfigs = [
        { from: { autoAlpha: 0, x: -100, rotationY: 8, scale: 1.15, filter: 'blur(12px)' }, dur: 1.4, ease: 'expo.out' },
        { from: { autoAlpha: 0, y: 120, rotation: -4, scale: 1.18, filter: 'blur(10px)' }, dur: 1.6, ease: 'back.out(1.2)' },
      ];

      // Unique animation configs per content block
      const cinemaContentConfigs = [
        { from: { autoAlpha: 0, x: -60, skewX: -3, filter: 'blur(8px)' }, dur: 1.0, ease: 'circ.out' },
        { from: { autoAlpha: 0, y: 80, scale: 1.08, filter: 'blur(6px)' }, dur: 1.2, ease: 'power4.out' },
        { from: { autoAlpha: 0, x: 55, rotation: 2, filter: 'blur(5px)' }, dur: 0.9, ease: 'sine.out' },
        { from: { autoAlpha: 0, y: -50, scale: 1.1, filter: 'blur(9px)' }, dur: 1.3, ease: 'expo.out' },
      ];

      imageTargets.forEach((target, index) => {
        const cfg = cinemaImageConfigs[index] || cinemaImageConfigs[0];
        gsap.fromTo(target, cfg.from, {
          autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, rotationY: 0, skewX: 0, filter: 'blur(0px)',
          duration: cfg.dur,
          ease: cfg.ease,
          scrollTrigger: {
            trigger: target,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      contentTargets.forEach((target, index) => {
        const cfg = cinemaContentConfigs[index] || cinemaContentConfigs[0];
        gsap.fromTo(target, cfg.from, {
          autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, skewX: 0, filter: 'blur(0px)',
          duration: cfg.dur,
          ease: cfg.ease,
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, cinemaSectionRef);

    return () => ctx.revert();
  }, []);

  // ScrollTrigger animations for Arquivo Section (ARQUIVO MOVEL)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!arquivoSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(arquivoSectionRef.current);
      const imageTargets = q('[data-arquivo-image]') as HTMLElement[];
      const contentTargets = q('[data-arquivo-animate]') as HTMLElement[];
      const allTargets = [...imageTargets, ...contentTargets];
      if (!allTargets.length) return;

      gsap.set(allTargets, { autoAlpha: 0 });

      // Unique configs per image — distinct from Cinema section
      const arquivoImageConfigs = [
        { from: { autoAlpha: 0, y: -100, rotationX: 10, scale: 1.2, filter: 'blur(14px)' }, dur: 1.5, ease: 'power4.out' },
        { from: { autoAlpha: 0, x: 90, skewY: 4, scale: 1.12, filter: 'blur(11px)' }, dur: 1.3, ease: 'circ.out' },
        { from: { autoAlpha: 0, scale: 0.7, rotation: -6, filter: 'blur(16px)' }, dur: 1.7, ease: 'elastic.out(1, 0.85)' },
      ];

      const arquivoContentConfigs = [
        { from: { autoAlpha: 0, x: -70, rotationY: 6, filter: 'blur(7px)' }, dur: 1.1, ease: 'expo.out' },
        { from: { autoAlpha: 0, y: 65, skewX: 3, filter: 'blur(5px)' }, dur: 0.95, ease: 'back.out(1.1)' },
        { from: { autoAlpha: 0, x: 50, scale: 1.06, filter: 'blur(6px)' }, dur: 1.15, ease: 'power3.out' },
        { from: { autoAlpha: 0, y: -45, rotation: 3, filter: 'blur(8px)' }, dur: 1.0, ease: 'sine.out' },
      ];

      imageTargets.forEach((target, index) => {
        const cfg = arquivoImageConfigs[index] || arquivoImageConfigs[0];
        gsap.fromTo(target, cfg.from, {
          autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, skewY: 0, filter: 'blur(0px)',
          duration: cfg.dur,
          ease: cfg.ease,
          scrollTrigger: {
            trigger: target,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      contentTargets.forEach((target, index) => {
        const cfg = arquivoContentConfigs[index] || arquivoContentConfigs[0];
        gsap.fromTo(target, cfg.from, {
          autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, rotationY: 0, skewX: 0, filter: 'blur(0px)',
          duration: cfg.dur,
          ease: cfg.ease,
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, arquivoSectionRef);

    return () => ctx.revert();
  }, []);

  // ScrollTrigger para segundo track horizontal (AS MIÇANGAS)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!horizontalSecondWrapperRef.current || !horizontalSecondTrackRef.current) return;
    // Aguardar o primeiro track estar pronto antes de inicializar o segundo
    if (!mainTrackReady) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = horizontalSecondWrapperRef.current;
    const track = horizontalSecondTrackRef.current;

    // Limpar qualquer ScrollTrigger existente neste elemento antes de criar um novo
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id === 'horizontal-second-track' ||
        st.trigger === wrapper ||
        (st.vars?.trigger && st.vars.trigger === wrapper)) {
        try {
          st.kill();
        } catch {
          // Ignorar erros ao limpar ScrollTriggers
        }
      }
    });

    let ctx: gsap.Context | null = null;
    let handleResize: (() => void) | null = null;

    // Aguardar um frame para garantir que o DOM está estável e o primeiro track terminou
    const timer = setTimeout(() => {
      if (!wrapper || !track || !wrapper.isConnected || !track.isConnected) return;

      ctx = gsap.context(() => {
        // Limpar transformações anteriores
        gsap.set(track, { clearProps: 'all' });
        gsap.set(track, { x: 0 });
        
        // Garantir que o wrapper está posicionado corretamente
        gsap.set(wrapper, { clearProps: 'transform' });

        const getTravel = () => {
          if (!track || !wrapper) return 0;
          return track.scrollWidth - wrapper.offsetWidth;
        };

        secondTrackTweenRef.current = gsap.to(track, {
          x: () => -getTravel(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => {
              if (!track || !wrapper) return '+=0';
              const travel = getTravel();
              return `+=${travel + window.innerHeight}`;
            },
            scrub: 0.5,
            pin: true,
            pinType: 'transform',
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            id: 'horizontal-second-track',
            markers: false, // Desabilitar markers em produção
            refreshPriority: -1, // Prioridade menor que o primeiro track
            onRefresh: () => {
              // Forçar atualização quando necessário
              if (track && wrapper) {
                gsap.set(track, { x: 0 });
              }
            },
          },
        });

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          setSecondTrackReady(true);
        });
      }, horizontalSecondWrapperRef);

      handleResize = () => {
        if (wrapper && track && wrapper.isConnected && track.isConnected) {
          ScrollTrigger.refresh();
        }
      };
      window.addEventListener('resize', handleResize);
    }, 200); // Aumentar delay para garantir que o primeiro track terminou

    return () => {
      clearTimeout(timer);
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      // Limpar ScrollTrigger específico antes de reverter o contexto
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'horizontal-second-track' || st.trigger === wrapper) {
          try {
            st.kill();
          } catch {
            // Ignorar erros ao limpar
          }
        }
      });
      if (ctx) {
        try {
          ctx.revert();
        } catch {
          // Ignorar erros ao reverter contexto
        }
      }
    };
  }, [mainTrackReady]);

  // Animações para seções de "A Natureza das Coisas Invisíveis"
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!secondTrackReady) return;
    if (!horizontalSecondTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('[data-natureza-panel]') || []) as HTMLElement[];
      if (!panels.length) return;

      const horizontalTrackST = ScrollTrigger.getById('horizontal-second-track');
      if (!horizontalTrackST) return;

      // Split text animation
      const splitTexts = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('.split-text') || []);
      splitTexts.forEach((textEl) => {
        const text = textEl.textContent || '';
        const words = text.split(' ');
        textEl.innerHTML = words.map(word => `<span class="word" style="display: inline-block; opacity: 0; transform: translateY(15px);">${word}</span>`).join(' ');
      });

      // Animate each panel when it enters viewport
      panels.forEach((panel) => {
        const content = panel.querySelector('.data-natureza-content') as HTMLElement;
        const megaText = panel.querySelector('.data-natureza-mega-text') as HTMLElement;
        const words = Array.from(panel.querySelectorAll('.word')) as HTMLElement[];
        const credits = panel.querySelector('.data-natureza-credits') as HTMLElement;
        const festivals = panel.querySelector('.data-natureza-festivals') as HTMLElement;
        const infoGrid = panel.querySelector('.data-natureza-info-grid') as HTMLElement;

        // Content — slides from left with 3D rotation and blur (Panel 1 editorial)
        if (content) {
          const isFirstPanel = panel.getAttribute('data-natureza-panel') === '0';
          const isPanel3 = panel.getAttribute('data-natureza-panel') === '3';

          if (isFirstPanel) {
            gsap.set(content, { opacity: 1, y: 0 });
          }

          // Panel 3 sinopse: rises with scale
          const fromProps = isFirstPanel
            ? { opacity: 1, x: 0, rotationY: 0, filter: 'blur(0px)' }
            : isPanel3
              ? { opacity: 0, y: 50, scale: 0.92 }
              : { opacity: 0, x: -60, rotationY: 8, filter: 'blur(6px)' };
          const toProps = isFirstPanel
            ? { opacity: 1, x: 0, rotationY: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
            : isPanel3
              ? { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'circ.out' }
              : { opacity: 1, x: 0, rotationY: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' };

          gsap.fromTo(content, fromProps, {
            ...toProps,
            scrollTrigger: {
              trigger: panel,
              start: 'left 80%',
              end: 'left 20%',
              containerAnimation: secondTrackTweenRef.current || undefined,
              toggleActions: 'play none none reverse',
            },
          });
        }

        // Mega text — scale bounce with blur
        if (megaText) {
          gsap.fromTo(megaText,
            { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.4,
              ease: 'back.out(1.3)',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Credits — skewed slide-up with bounce
        if (credits) {
          const creditItems = Array.from(credits.querySelectorAll('div')) as HTMLElement[];
          creditItems.forEach((item, index) => {
            gsap.fromTo(item,
              { opacity: 0, y: 35, skewX: -4 },
              {
                opacity: 1,
                y: 0,
                skewX: 0,
                duration: 0.85,
                delay: index * 0.12,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                  trigger: item,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Festivals — elastic bounce with scale
        if (festivals) {
          gsap.fromTo(festivals,
            { opacity: 0, scale: 0.9, y: 40 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2,
              ease: 'elastic.out(1, 0.75)',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Quote — slides from left with skew and blur
        const quote = panel.querySelector('.data-natureza-quote') as HTMLElement;
        if (quote) {
          gsap.fromTo(quote,
            { opacity: 0, x: -40, skewY: 3, filter: 'blur(4px)' },
            {
              opacity: 1,
              x: 0,
              skewY: 0,
              filter: 'blur(0px)',
              duration: 1.1,
              delay: 0.15,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Distribution children — alternating directions per index
        const distribution = panel.querySelector('.data-natureza-distribution') as HTMLElement;
        if (distribution) {
          const distChildren = Array.from(distribution.children) as HTMLElement[];
          const distConfigs = [
            { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0, duration: 0.75, ease: 'power4.out' } },
            { from: { opacity: 0, y: -30 }, to: { opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.1)' } },
            { from: { opacity: 0, x: -35 }, to: { opacity: 1, x: 0, duration: 0.65, ease: 'circ.out' } },
          ];
          distChildren.forEach((child, index) => {
            const cfg = distConfigs[index] || { from: { opacity: 0, y: 35, rotation: index % 2 ? 3 : -3 }, to: { opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: 'sine.out' } };
            gsap.fromTo(child, cfg.from, {
              ...cfg.to,
              delay: index * 0.18,
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            });
          });
        }

        // Overlay content (Panel 2 Berlinale) — unique per child
        const overlayContent = panel.querySelector('.data-natureza-overlay-content') as HTMLElement;
        if (overlayContent) {
          const overlayChildren = Array.from(overlayContent.children).filter(el => !el.classList.contains('data-natureza-festivals')) as HTMLElement[];
          const overlayConfigs = [
            { from: { opacity: 0, letterSpacing: '0.5em', y: -20 }, to: { opacity: 1, letterSpacing: '0.15em', y: 0, duration: 0.9, ease: 'sine.out' } },
            { from: { opacity: 0, scale: 0.85, rotationX: -15 }, to: { opacity: 1, scale: 1, rotationX: 0, duration: 1.3, ease: 'back.out(1.3)' } },
            { from: { opacity: 0, x: 80, filter: 'blur(8px)' }, to: { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power4.out' } },
          ];
          overlayChildren.forEach((child, index) => {
            const cfg = overlayConfigs[index] || overlayConfigs[2];
            gsap.fromTo(child, cfg.from, {
              ...cfg.to,
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            });
          });
        }

        // Info grid fade in - Individual animations
        if (infoGrid) {
          const gridItems = Array.from(infoGrid.querySelectorAll('div > div')) as HTMLElement[];
          gridItems.forEach((item, index) => {
            gsap.fromTo(item,
              { 
                opacity: 0, 
                y: 40,
                scale: 0.9,
                rotation: index % 2 === 0 ? -3 : 3,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                delay: index * 0.12,
                ease: 'back.out(1.1)',
                scrollTrigger: {
                  trigger: item,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Gallery items fade in - Individual animations
        const galleryItems = Array.from(panel.querySelectorAll('.data-natureza-gallery-item')) as HTMLElement[];
        if (galleryItems.length) {
          // Check if this is the first panel (panel 0) - make items visible immediately
          const isFirstPanel = panel.getAttribute('data-natureza-panel') === '0';
          
          galleryItems.forEach((item, index) => {
            if (isFirstPanel) {
              // For first panel, set visible immediately
              gsap.set(item, { opacity: 1, scale: 1, rotation: 0, y: 0 });
            }
            
            gsap.fromTo(item,
              { 
                opacity: isFirstPanel ? 1 : 0, 
                scale: isFirstPanel ? 1 : 0.8,
                rotation: isFirstPanel ? 0 : (index % 2 === 0 ? -5 : 5),
                y: isFirstPanel ? 0 : 30,
              },
              {
                opacity: 1,
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 0.9,
                delay: index * 0.08,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                  trigger: item,
                  start: 'left 85%',
                  end: 'left 15%',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  containerAnimation: secondTrackTweenRef.current || undefined,
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }

        // Words — circ ease with wider stagger for organic reveal
        if (words.length) {
          gsap.to(words,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.05,
              ease: 'circ.out',
              scrollTrigger: {
                trigger: panel,
                start: 'left 80%',
                end: 'left 20%',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerAnimation: secondTrackTweenRef.current || undefined,
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

        // Parallax effect baseado no scroll do track
        const parallaxImages = Array.from(horizontalSecondTrackRef.current?.querySelectorAll('[data-natureza-parallax]') || []) as HTMLElement[];
        
        if (horizontalTrackST && parallaxImages.length) {
        const updateParallax = () => {
          const progress = horizontalTrackST.progress;
          parallaxImages.forEach((img) => {
            const speed = parseFloat(img.getAttribute('data-speed') || '0.2');
            const moveX = -progress * 200 * speed;
            gsap.set(img, { x: moveX });
          });
        };

        ScrollTrigger.create({
          trigger: horizontalSecondWrapperRef.current,
          start: 'top 50px',
          end: () => {
            if (!horizontalSecondTrackRef.current || !horizontalSecondWrapperRef.current) return '+=0';
            return `+=${horizontalSecondTrackRef.current.scrollWidth + window.innerHeight}`;
          },
          onUpdate: updateParallax,
        });
      }
    }, horizontalSecondTrackRef);

    return () => ctx.revert();
  }, [secondTrackReady]);

  // ScrollTrigger para seção 7 - Scroll Vertical (de cima para baixo)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!verticalReverseWrapperRef.current || !verticalReverseContentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = verticalReverseWrapperRef.current;
    const content = verticalReverseContentRef.current;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Limpar qualquer transformação anterior
        gsap.set(content, { clearProps: 'all' });

        // Posicionar o conteúdo acima inicialmente (fora da tela)
        gsap.set(content, { y: '-100vh' });

        gsap.to(content, {
          y: 0, // Move para baixo até a posição normal
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Forçar atualização
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, verticalReverseWrapperRef);

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        ctx.revert();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Pin dedicado para seções verticais com entrada/pausa/saída gradual
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray<HTMLElement>('[data-pin-block]');
    if (!sections.length) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        const targets = Array.from(section.querySelectorAll('[data-pin-animate]')) as HTMLElement[];
        if (!targets.length) return;

        gsap.set(targets, { autoAlpha: 0, y: 60 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=180%',
              scrub: true,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              id: `pin-block-${index}`,
            },
          })
          .to(targets, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          })
          .to(targets, { autoAlpha: 1, duration: 0.4 })
          .to(targets, {
            autoAlpha: 0,
            y: -50,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power1.in',
          });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, []);

  // NOTÍCIAS section entrance animation
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const noticiasSection = document.querySelector('[data-noticias-section]') as HTMLElement;
    if (!noticiasSection) return;

    const ctx = gsap.context(() => {
      // Carousel entrance — slides in from left with 3D rotation and blur
      const carousel = noticiasSection.querySelector('.col-span-8') as HTMLElement;
      if (carousel) {
        gsap.fromTo(carousel,
          { opacity: 0, x: -80, rotationY: 6, filter: 'blur(10px)', scale: 0.92 },
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: noticiasSection,
              start: 'top 80%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Sidebar entrance — rises up with scale and skew
      const sidebar = noticiasSection.querySelector('.col-span-4') as HTMLElement;
      if (sidebar) {
        gsap.fromTo(sidebar,
          { opacity: 0, y: 60, scale: 0.88, skewY: -3 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            skewY: 0,
            duration: 1.1,
            delay: 0.3,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: noticiasSection,
              start: 'top 80%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Contact section entrance animation
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!contactSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const contactElements = Array.from(contactSectionRef.current!.querySelectorAll('[data-contact-animate]')) as HTMLElement[];
      const configs = [
        { from: { opacity: 0, y: 80, rotationX: -15, scale: 0.9 }, to: { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.4, ease: 'back.out(1.4)' } },
        { from: { opacity: 0, x: -50, filter: 'blur(8px)' }, to: { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.0, delay: 0.15, ease: 'power4.out' } },
        { from: { opacity: 0, y: 30, scaleX: 0.8 }, to: { opacity: 1, y: 0, scaleX: 1, duration: 0.9, delay: 0.3, ease: 'elastic.out(1, 0.8)' } },
        { from: { opacity: 0, scale: 1.15, filter: 'blur(12px)', rotationY: -5 }, to: { opacity: 1, scale: 1, filter: 'blur(0px)', rotationY: 0, duration: 1.6, delay: 0.2, ease: 'expo.out' } },
      ];
      contactElements.forEach((el, i) => {
        const cfg = configs[i] || configs[configs.length - 1];
        gsap.fromTo(el, cfg.from, {
          ...cfg.to,
          scrollTrigger: {
            trigger: contactSectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, contactSectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Scroll infinito removido temporariamente

  useEffect(() => {
    if (newsSlides.length <= 1) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [newsSlides.length]);

    // Função auxiliar movida para fora dos useEffects para ser acessível globalmente no escopo do componente
    const calculateDynamicFontSize = () => {
      if (!containerRef.current || typeof window === 'undefined') return;
      const targetWidth = containerRef.current.offsetWidth;
      if (targetWidth === 0) return;

      const height = window.innerHeight;
      const width = window.innerWidth;
      
      // Base reference: width 1336px, height 698px está ok
      // Para alturas menores que 698px, precisamos reduzir o tamanho da fonte
      const referenceWidth = 1336;
      const referenceHeight = 698;
      const minHeight = 400; // Altura mínima para evitar overflow extremo
      
      // Calcular proporção baseada na largura
      const measureElement = document.createElement('div');
      measureElement.style.position = 'absolute';
      measureElement.style.visibility = 'hidden';
      measureElement.style.whiteSpace = 'nowrap';
      measureElement.style.fontFamily = "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif";
      measureElement.style.letterSpacing = '-0.07em';
      measureElement.style.fontSize = '100px';
      measureElement.textContent = 'MOVEO';
      document.body.appendChild(measureElement);

      const baseWidth = measureElement.offsetWidth;
      let calculatedFontSize = (targetWidth / baseWidth) * 100;
      
      // Ajustar baseado na altura se necessário
      // Se a altura for menor que a referência (698px), reduzir proporcionalmente
      if (height < referenceHeight) {
        // Calcular fator de redução baseado na altura
        // Usar uma curva suave para a redução, mas mais agressiva para alturas muito pequenas
        const heightRatio = Math.max(height / referenceHeight, minHeight / referenceHeight);
        // Aplicar redução progressiva: quanto menor a altura, maior a redução
        // Usar exponencial para reduzir mais agressivamente em alturas muito pequenas
        const heightFactor = Math.pow(heightRatio, 0.75); // Curva mais agressiva
        calculatedFontSize = calculatedFontSize * heightFactor;
      }
      
      // Para telas com width >= 1336px e altura < 698px, aplicar redução adicional baseada no aspect ratio
      if (width >= referenceWidth && height < referenceHeight) {
        // Se a largura é >= 1336px mas altura < 698px, aplicar redução adicional
        const aspectRatio = width / height;
        const referenceAspectRatio = referenceWidth / referenceHeight; // ~1.91
        if (aspectRatio > referenceAspectRatio) {
          // Tela mais "achatada" que a referência, reduzir mais
          // Quanto maior a diferença no aspect ratio, maior a redução
          const aspectFactor = Math.min(1, referenceAspectRatio / aspectRatio);
          calculatedFontSize = calculatedFontSize * aspectFactor;
        }
      }
      
      // Aplicar redução adicional para alturas muito pequenas (< 500px)
      if (height < 500) {
        const extraReduction = height / 500; // Redução linear adicional
        calculatedFontSize = calculatedFontSize * extraReduction;
      }
      
      document.body.removeChild(measureElement);
      setDynamicFontSize(Math.max(calculatedFontSize, 30)); // Tamanho mínimo de 30px
    };

  useEffect(() => {

    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;

    const runCalculation = () => {
      rafId = requestAnimationFrame(() => {
        if (containerRef.current && containerRef.current.offsetWidth > 0) {
          calculateDynamicFontSize();

          if (containerRef.current && !resizeObserver) {
            resizeObserver = new ResizeObserver(() => {
              calculateDynamicFontSize();
            });
            resizeObserver.observe(containerRef.current);
          }
        } else {
          setTimeout(runCalculation, 10);
        }
      });
    };

    runCalculation();

    const handleResize = () => {
      calculateDynamicFontSize();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          calculateDynamicFontSize();
        }, 100);
      }
    };

    const handlePageShow = () => {
      setTimeout(() => {
        calculateDynamicFontSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      const timer = setTimeout(() => {
        if (containerRef.current && containerRef.current.offsetWidth > 0) {
          const targetWidth = containerRef.current.offsetWidth;
          const measureElement = document.createElement('div');
          measureElement.style.position = 'absolute';
          measureElement.style.visibility = 'hidden';
          measureElement.style.whiteSpace = 'nowrap';
          measureElement.style.fontFamily = "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif";
          measureElement.style.letterSpacing = '-0.07em';
          measureElement.style.fontSize = '100px';
          measureElement.textContent = 'MOVEO';
          document.body.appendChild(measureElement);
          const baseWidth = measureElement.offsetWidth;
          const calculatedFontSize = (targetWidth / baseWidth) * 100;
          document.body.removeChild(measureElement);
          setDynamicFontSize(calculatedFontSize);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      calculateDynamicFontSize();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          calculateDynamicFontSize();
        }, 100);
      }
    };

    const handlePageShow = () => {
      setTimeout(() => {
        calculateDynamicFontSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);


  // Calculate font size for "SOBRE A MOVEO" to fill container
  useEffect(() => {
    const calculateSobreMoveoFontSize = () => {
      if (!sobreMoveoContainerRef.current || !sobreMoveoTextRef.current) return;

      const containerWidth = sobreMoveoContainerRef.current.offsetWidth;
      const containerHeight = sobreMoveoContainerRef.current.offsetHeight;
      
      if (containerWidth === 0 || containerHeight === 0) return;

      // Create temporary elements to measure both text parts
      const sobreElement = document.createElement('span');
      sobreElement.style.position = 'absolute';
      sobreElement.style.visibility = 'hidden';
      sobreElement.style.whiteSpace = 'nowrap';
      sobreElement.style.fontFamily = "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif";
      sobreElement.style.fontWeight = '300';
      sobreElement.style.letterSpacing = '-0.05em';
      sobreElement.textContent = 'SOBRE A';
      document.body.appendChild(sobreElement);

      const moveoElement = document.createElement('span');
      moveoElement.style.position = 'absolute';
      moveoElement.style.visibility = 'hidden';
      moveoElement.style.whiteSpace = 'nowrap';
      moveoElement.style.fontFamily = "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif";
      moveoElement.style.fontWeight = '700';
      moveoElement.style.letterSpacing = '-0.05em';
      moveoElement.textContent = 'MOVEO';
      document.body.appendChild(moveoElement);

      // Binary search to find optimal font size
      let min = 24;
      let max = 400;
      let bestSize = min;
      const lineHeight = 0.9;

      for (let i = 0; i < 30; i++) {
        const mid = (min + max) / 2;
        sobreElement.style.fontSize = `${mid}px`;
        moveoElement.style.fontSize = `${mid}px`;
        
        const sobreWidth = sobreElement.offsetWidth;
        const moveoWidth = moveoElement.offsetWidth;
        const maxWidth = Math.max(sobreWidth, moveoWidth); // Use max since they're stacked vertically
        
        const sobreHeight = sobreElement.offsetHeight * lineHeight;
        const moveoHeight = moveoElement.offsetHeight * lineHeight;
        const totalHeight = sobreHeight + moveoHeight;

        // Check both width and height constraints, use the smaller constraint
        const widthFits = maxWidth <= containerWidth;
        const heightFits = totalHeight <= containerHeight;
        
        if (widthFits && heightFits) {
          bestSize = mid;
          min = mid;
        } else {
          max = mid;
        }
      }

      document.body.removeChild(sobreElement);
      document.body.removeChild(moveoElement);
      setSobreMoveoFontSize(Math.floor(bestSize));
    };

    if (pathname === '/') {
      const timer = setTimeout(calculateSobreMoveoFontSize, 100);
      
      const resizeObserver = new ResizeObserver(() => {
        calculateSobreMoveoFontSize();
      });

      if (sobreMoveoContainerRef.current) {
        resizeObserver.observe(sobreMoveoContainerRef.current);
      }

      window.addEventListener('resize', calculateSobreMoveoFontSize);

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
        window.removeEventListener('resize', calculateSobreMoveoFontSize);
      };
    }
  }, [pathname]);

  return (

    <MainLayout>
      {/* Global Visual Effects */}
      {/* Scroll Progress Bar */}
      <div data-scroll-progress className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white via-white/50 to-transparent z-[9999] pointer-events-none" />
      
      {/* Cursor Glow Effect */}
      <div 
        className="cursor-glow hidden md:block"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
        }}
      />
      
      {/* Subtle Noise Overlay */}
      <div className="noise-overlay grain-animation" />

      {/* Scroll Hint Indicator */}
      <div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 mix-blend-difference text-white"
        ref={(el) => {
          if (el) {
            // Initial check
            if (window.scrollY > 50) {
              el.style.opacity = '0';
            } else {
              el.style.opacity = '1';
            }
          }
        }}
        // Use inline style for initial state only, but controlled by effect below via ref/class if needed.
        // Or better, use a data attribute or just class.
        // But to keep it simple and robust with proper cleanup:
      >
        <ScrollHint />
      </div>


      {/* Espaço inicial para permitir rolagem antes do pin da primeira seção */}
      <div
        aria-hidden="true"
        style={{
          height: '25vh',
          minHeight: '140px',
        }}
      />

      <div
        ref={horizontalWrapperRef}
        className="relative"
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <div
          ref={horizontalTrackRef}
          className="flex h-full will-change-transform"
          style={{ width: 'max-content' }}
        >
          <section
            ref={firstSectionRef}
            className="horizontal-section relative flex-shrink-0"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            <div
              ref={containerRef}
              className="absolute invisible"
              style={{
                left: 0,
                right: 0,
                top: 0,
                height: '1px',
              }}
            />

            <div
              ref={produtoraContainerRef}
              className="absolute invisible"
              style={{
                left: 0,
                width: getWidthBetweenMarkers(1, 10),
                top: 0,
                height: getHeightBetweenLines('A', 'C'),
              }}
            />

            <div
              ref={textRef}
              data-first-animate
              className="absolute text-white uppercase z-30 mix-blend-difference moveo-title"
              style={{
                left: '-20px',
                top: '180px',
                bottom: `calc(100% - ${getHorizontalLinePosition('F')} + 40px)`,
                fontFamily: "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif",
                fontSize: `${dynamicFontSize}px`,
                lineHeight: '77.3%',
                letterSpacing: '-0.07em',
                whiteSpace: 'nowrap',
                margin: 0,
                padding: 0,
                transform: 'translateX(-1.55%)',
              }}
            >
              MOVEO
            </div>

            <div
              data-first-animate
              className="absolute z-30"
              style={{
                left: 0,
                width: getWidthBetweenMarkers(1, 10),
                top: 0,
                height: getHeightBetweenLines('A', 'C'),
              }}
            >
              <div
                ref={produtoraTextRef}
                data-animate
                className="absolute text-white mix-blend-difference produtora-subtitle"
                suppressHydrationWarning
                style={{
                  left: '0',
                  top: '25%',
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: FONT_LARGE,
                  lineHeight: '90%',
                  margin: 0,
                  padding: 0,
                }}
              >
                {t('produtoraBoutiqueShort').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < t('produtoraBoutiqueShort').split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div
              data-animate
              data-first-animate
              className="absolute z-30 overflow-hidden"
              style={{
                left: 0,
                right: 0,
                top: `calc(${centerTop} - 50px)`,
                bottom: 0,
              }}
            >
              <Image
                src="/imagens/capahome.png"
                alt="Capa Home"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Decorative Lines */}
            <div
              data-decor-line
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
              data-decor-line
              className="absolute z-20"
              style={{
                left: 0,
                bottom: '35%',
                width: '15%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
              }}
            />

            {/* Grid Guide Point */}
            <div
              className="absolute z-50 pointer-events-none transition-opacity duration-150"
              style={{
                left: `calc(${centerLeft} - 50px)`,
                top: `calc(${centerTop} - 50px)`,
                transform: 'translate(-50%, -50%)',
                opacity: isGuidesVisible ? 1 : 0,
              }}
            >
              <div
                className="w-3 h-3 bg-blue-500 rounded-full"
                style={{ boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' }}
              />
            </div>
          </section>

          <section
            ref={secondSectionRef}
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            <div className="w-full h-full p-[50px] box-border">
              <div className="w-full h-full">
                <div className="grid md:grid-cols-2 gap-6 h-full">
                  <div className="flex flex-col gap-6 h-full min-h-0">
                    <div className="grid grid-cols-4 grid-rows-3 flex-1 min-h-0 gap-2">
                      {/* Linha A */}
                      <div className="relative overflow-hidden rounded-lg" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 8.png"
                          alt="Imagem 1"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="relative overflow-hidden rounded-lg col-span-2" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 11.png"
                          alt="Imagem 2"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="relative overflow-hidden rounded-lg" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 9.png"
                          alt="Imagem 3"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Linhas B e C - Retângulo B1+B2+C1+C2 */}
                      <div className="relative overflow-hidden rounded-lg col-span-2 row-span-2" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 10.png"
                          alt="Imagem 4"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="relative overflow-hidden rounded-lg" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 12.png"
                          alt="Imagem 5"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="relative overflow-hidden rounded-lg" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 8.png"
                          alt="Imagem 6"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Linha C - restantes */}
                      <div className="relative overflow-hidden rounded-lg" data-second-image>
                        <Image
                          src="/imagens/secao2home/Rectangle 122.png"
                          alt="Imagem 7"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>

                    <div className="grid grid-rows-2 flex-1 min-h-0 gap-2">
                      {/* Linha superior dividida verticalmente em 2 */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-transparent rounded-lg pt-4 pr-4 pb-4 pl-0 flex items-end justify-start" data-second-animate>
                          <p
                            className="text-white mix-blend-difference"
                            suppressHydrationWarning
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              lineHeight: '1.4',
                            }}
                          >
                            {t('fundadaEm2018')}
                          </p>
                        </div>
                        <div className="relative overflow-hidden rounded-lg" data-second-image>
                          <Image
                            src="/imagens/secao2home/Rectangle 10.png"
                            alt="Imagem 8"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Container maior inferior com texto */}
                      <div className="bg-transparent rounded-lg pt-4 pr-4 pb-4 md:pt-6 md:pr-6 md:pb-6 pl-0 flex items-end justify-start" data-second-animate>
                        <p
                          className="text-white mix-blend-difference"
                          suppressHydrationWarning
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                            fontSize: FONT_MEDIUM,
                            lineHeight: '1.4',
                          }}
                        >
                          {t('baseadaEmBrasilia').split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < t('baseadaEmBrasilia').split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 h-full min-h-0">
                    <div 
                      ref={sobreMoveoContainerRef}
                      className="bg-black rounded-lg p-4 md:p-6 lg:p-8 flex flex-col items-end justify-end flex-[1] min-h-0 gap-4 relative z-[100]" 
                      data-second-animate
                      style={{ pointerEvents: 'auto' }}
                    >
                      <div 
                        ref={sobreMoveoTextRef}
                        className="text-white uppercase text-center mix-blend-difference" 
                        suppressHydrationWarning
                        style={{
                          fontSize: `${sobreMoveoFontSize}px`,
                          lineHeight: '0.9',
                          letterSpacing: '-0.05em',
                        }}
                      >
                        <div
                          suppressHydrationWarning
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 300,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t('sobreAMoveo').split('\n')[0]}
                        </div>
                        <div
                          suppressHydrationWarning
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          {t('sobreAMoveo').split('\n')[1]}
                        </div>
                      </div>
                      <Link 
                        href="/sobre"
                        className="text-white mix-blend-difference opacity-60 hover:opacity-100 transition-opacity duration-300 relative z-[100] cursor-pointer"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(10px, 0.85vw, 13px)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          pointerEvents: 'auto',
                          position: 'relative',
                        }}
                      >
                        {t('saibaMais')}
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 flex-[2] min-h-0 gap-2">
                      {/* Container esquerdo (esquerda + centro mesclados) */}
                      <div className="col-span-2 bg-transparent rounded-lg flex items-end justify-start" data-second-animate>
                        <p
                          className="text-white mix-blend-difference"
                          suppressHydrationWarning
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 700,
                            fontSize: FONT_LARGE,
                            lineHeight: '1.2',
                            marginLeft: `calc(${getMarkerPosition(7)} - 50px - 2rem)`,
                          }}
                        >
                          {t('focadoEmCineastas').split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < t('focadoEmCineastas').split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>

                      {/* Container direito dividido horizontalmente em 3, mesclando superior+centro */}
                      <div className="grid grid-rows-3 gap-2">
                        <div className="relative overflow-hidden rounded-lg row-span-2" data-second-image>
                          <Image
                            src="/imagens/secao2home/Rectangle 122.png"
                            alt="Imagem 9"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="relative overflow-hidden rounded-lg" data-second-image>
                          <Image
                            src="/imagens/secao2home/Rectangle 9.png"
                            alt="Imagem 10"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            ref={thirdSectionRef}
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            <div className="w-full h-full p-[50px] box-border">
              <div className="w-full h-full grid md:grid-cols-2 gap-6">
                {/* Container Esquerdo - Dividido em 3 partes horizontais */}
                <div className="flex flex-col h-full min-h-0">
                  {/* Container Superior */}
                  <div className="flex-1 bg-transparent flex items-center justify-start pt-4 pr-4 pb-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8 pl-0 min-h-0" data-third-animate data-typewriter-text suppressHydrationWarning>
                    <p
                      className="text-white mix-blend-difference"
                      suppressHydrationWarning
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontWeight: 700,
                        fontSize: FONT_LARGE,
                        lineHeight: '1.2',
                        width: '100%',
                        maxWidth: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: 0,
                      }}
                    >
                      {t('historicoSolidodeColaboracoes').split('\n').map((line, i) => (
                        <span key={i} suppressHydrationWarning style={{ display: 'block', width: '100%' }}>{line}</span>
                      ))}
                    </p>
                  </div>


                  {/* Container Inferior - Grid 2 linhas x 4 colunas */}
                  <div className="flex-1 grid grid-cols-4 grid-rows-4 min-h-0 gap-2">
                    {/* A1 superior */}
                    <div className="relative overflow-hidden rounded-lg" data-third-image>
                      <Image
                        src="/imagens/secao2home/Rectangle 8.png"
                        alt="Imagem 11"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* A3 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-3" data-third-image>
                      <Image
                        src="/imagens/secao2home/Rectangle 9.png"
                        alt="Imagem 12"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* A4 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-4" data-third-image>
                      <Image
                        src="/imagens/secao2home/Rectangle 10.png"
                        alt="Imagem 13"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Container mesclado: A'1, A'2, B1, B2, B'1 e B'2 */}
                    <div className="relative overflow-hidden rounded-lg col-span-2 row-span-3 col-start-1 row-start-2" data-third-image>
                      <Image
                        src="/imagens/secao2home/Rectangle 11.png"
                        alt="Imagem 14"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* B4 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-4 row-start-3" data-third-image>
                      <Image
                        src="/imagens/secao2home/Rectangle 12.png"
                        alt="Imagem 15"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 grid-rows-5 h-full min-h-0 gap-2">
                  {/* Rectangle 11 - squared image - first */}
                  <div className="relative overflow-hidden rounded-lg col-start-1 row-start-1" data-third-image>
                    <Image
                      src="/imagens/secao2home/Rectangle 11.png"
                      alt="Imagem 19"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Rectangle 12 - rectangled image - second */}
                  <div className="relative overflow-hidden rounded-lg col-span-2 col-start-1 row-start-2" data-third-image>
                    <Image
                      src="/imagens/secao2home/Rectangle 12.png"
                      alt="Imagem 20"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Container grande mesclado: Text - third */}
                  <div className="col-span-4 row-span-3 bg-transparent flex items-end justify-start pr-4 md:pr-6 lg:pr-8 pl-0 pb-0 col-start-1 row-start-3" data-third-animate>
                    <h2
                      className="text-white uppercase text-left mix-blend-difference"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_HUGE,
                        lineHeight: '0.85',
                        letterSpacing: '-0.02em',
                        fontWeight: 300,
                      }}
                    >
                      {language === 'pt' ? (
                        <>
                          FILMES DE
                          <br />
                          <span style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif", fontWeight: 700 }}>ARTE</span> PARA
                          <br />
                          O MERCADO
                          <br />
                          INTERNACIONAL
                        </>
                      ) : (
                        <>
                          ART FILMS
                          <br />
                          <span style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif", fontWeight: 700 }}>FOR</span> THE
                          <br />
                          INTERNATIONAL
                          <br />
                          MARKET
                        </>
                      )}
                    </h2>
                  </div>

                  {/* A5 */}
                  <div className="relative overflow-hidden rounded-lg col-start-5 row-start-1" data-third-image>
                    <Image
                      src="/imagens/secao2home/Rectangle 8.png"
                      alt="Imagem 16"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* B5 */}
                  <div className="relative overflow-hidden rounded-lg col-start-5 row-start-2" data-third-image>
                    <Image
                      src="/imagens/secao2home/Rectangle 9.png"
                      alt="Imagem 17"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* C5 e D5 mesclados */}
                  <div className="relative overflow-hidden rounded-lg row-span-2 col-start-5 row-start-3" data-third-image>
                    <Image
                      src="/imagens/secao2home/Rectangle 10.png"
                      alt="Imagem 18"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Seção de Transição - Introdução ao Catálogo de Filmes */}
      <div 
        ref={dragonflySectionRef}
        className="relative w-full bg-black"
        style={{
          marginBottom: '0',
        }}
      >
        <section
          className="relative bg-black text-white"
          style={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px',
          }}
        >
          <div 
            ref={dragonflyPinRef}
            className="w-full max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left - Text Content */}
              <div style={{ width: '100%' }}>
                <div
                  data-catalog-label
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {t('nossosFilmes')}
                </div>
                <h2
                  data-catalog-title
                  ref={dragonflyHeadingRef}
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                    fontSize: 'clamp(48px, 7vw, 120px)',
                    lineHeight: '0.95',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    marginBottom: 'clamp(30px, 4vh, 50px)',
                    color: 'white',
                  }}
                >
                  {t('catalogoEmDestaque')}
                </h2>
                <p
                  data-catalog-description
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(16px, 1.5vw, 22px)',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '100%',
                    width: '100%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  {t('exploreNossaSelecao')}
                </p>
              </div>

              {/* Right - Featured Image */}
              <div
                className="relative w-full aspect-[4/5] overflow-hidden"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Image
                  data-catalog-image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="Catálogo em Destaque"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  style={{
                    filter: 'brightness(0.9)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Segundo Track Horizontal - A Natureza, AS MIÇANGAS e O Mistério da Carne */}
      <div
        ref={horizontalSecondWrapperRef}
        className="relative bg-black"
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={horizontalSecondTrackRef}
          className="flex h-full will-change-transform"
          style={{ width: 'max-content', overflow: 'visible', gap: '100px' }}
        >
          {/* Seção 1 - A Natureza das Coisas Invisíveis - Title Only */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-natureza-panel="0"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Centered Title Card */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 1 }}
            >
              <h2
                className="data-natureza-content"
                suppressHydrationWarning
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(60px, 8vw, 140px)',
                  lineHeight: '0.9',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  color: 'rgba(255, 255, 255, 0.95)',
                  textAlign: 'center',
                  maxWidth: '90%',
                }}
              >
                {t('aNaturezaDasCoisasInvisiveis')}
              </h2>
            </div>
          </section>

          {/* Seção 2 - A Natureza das Coisas Invisíveis - Editorial Split */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-natureza-panel="1"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
            }}
          >
            {/* Left - Editorial Content */}
            <div 
              className="flex flex-col justify-center p-[50px]"
              style={{
                backgroundColor: '#0a0a0a',
              }}
            >
              <div 
                className="data-natureza-content"
              >
                <div
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {t('oFilme')}
                </div>
                <h1 
                  className="data-natureza-title split-text"
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                    fontSize: 'clamp(24px, 3vw, 48px)',
                    lineHeight: '1.2',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'white',
                  }}
                >
                  {t('aNaturezaDasCoisasInvisiveisTitle')}
                </h1>
                <div 
                  className="data-natureza-text"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(14px, 1.3vw, 18px)',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '90%',
                    marginBottom: 'clamp(30px, 4vh, 50px)',
                  }}
                >
                  <p className="split-text" suppressHydrationWarning>
                    {t('naturezaDescription')}
                  </p>
                </div>

                {/* Ficha Técnica Compacta */}
                <div 
                  className="data-natureza-credits"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(11px, 1vw, 13px)',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.6)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 'clamp(20px, 3vh, 30px)',
                    maxWidth: '90%',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('direcao')}</strong> Rafaela Camelo
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('ano')}</strong> 2025
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('coproducao')}</strong> Brasil-Chile
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('producao')}</strong> Moveo Filmes
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Editorial Image */}
            <div 
              className="relative overflow-hidden"
              style={{
                position: 'relative',
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  willChange: 'transform',
                }}
              >
                <Image
                  src="/imagens/capahome.png"
                  alt="A Natureza das Coisas Invisíveis"
                  fill
                  sizes="40vw"
                  className="object-cover data-natureza-parallax"
                  style={{
                    filter: 'saturate(0) brightness(0.8)',
                    transform: 'scale(1.1)',
                  }}
                  data-speed="0.3"
                  unoptimized
                />
              </div>
            </div>
          </section>

          {/* Seção 3 - A Natureza das Coisas Invisíveis - Full Background */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-natureza-panel="2"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Image */}
            <div className="absolute inset-0" style={{ willChange: 'transform' }}>
              <Image
                src="/imagens/capahome.png"
                alt="A Natureza das Coisas Invisíveis"
                fill
                sizes="100vw"
                className="object-cover data-natureza-parallax"
                style={{
                  filter: 'saturate(0) brightness(0.7)',
                  transform: 'scale(1.1)',
                }}
                data-speed="0.2"
                unoptimized
              />
            </div>

            {/* Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 2,
              }}
            />

            {/* Content */}
            <div
              className="relative data-natureza-content data-natureza-overlay-content"
              style={{
                width: '80%',
                maxWidth: '900px',
                zIndex: 3,
              }}
            >
              <div
                suppressHydrationWarning
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                  fontSize: 'clamp(10px, 0.9vw, 13px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 'clamp(20px, 3vh, 40px)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {t('estreiaMundial')}
              </div>
              <h2 
                className="data-natureza-title split-text"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 80px)',
                  lineHeight: '1.2',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: 'clamp(20px, 3vh, 40px)',
                  color: 'white',
                }}
              >
                75ª Berlinale
              </h2>
              <div 
                className="data-natureza-text"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                  fontSize: 'clamp(14px, 1.3vw, 18px)',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: 'clamp(30px, 4vh, 50px)',
                }}
              >
                <p className="split-text">
                  Generation KPlus, Filme de Abertura. Uma estreia histórica que marca o primeiro longa-metragem internacional da Moveo Filmes em um dos festivais mais prestigiosos do mundo.
                </p>
              </div>

              {/* Estreias Grid */}
              <div 
                className="data-natureza-festivals"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(20px, 3vw, 40px)',
                  marginTop: 'clamp(30px, 4vh, 50px)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: 'clamp(20px, 3vh, 30px)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(10px, 0.9vw, 12px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 'clamp(8px, 1vh, 12px)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {t('festivais')}
                  </div>
                  <div
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1.1vw, 15px)',
                      lineHeight: '1.6',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                      <strong>{t('colombia')}</strong> 64º Cartagena
                    </div>
                    <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                      <strong>{t('mexico')}</strong> 40º Guadalajara
                    </div>
                    <div>
                      <strong>{t('eua')}</strong> 51º Seattle
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(10px, 0.9vw, 12px)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 'clamp(8px, 1vh, 12px)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {t('premios')}
                  </div>
                  <div
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1.1vw, 15px)',
                      lineHeight: '1.6',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                      {t('melhorFilme')} — {t('uruguai')}
                    </div>
                    <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                      {t('mencaoEspecial')} — Seattle
                    </div>
                    <div>
                      Jury Prize — Frameline49
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 4 - A Natureza das Coisas Invisíveis - Split with Sinopse and Distribution */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-natureza-panel="3"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {/* Left - Sinopse */}
            <div
              className="flex flex-col justify-center p-[50px]"
              style={{
                backgroundColor: '#121212',
                paddingRight: '3vw',
                overflow: 'hidden',
              }}
            >
              <div 
                className="data-natureza-content"
              >
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Sinopse
                </div>
                <div 
                  className="data-natureza-text"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(14px, 1.3vw, 18px)',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.85)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <p className="split-text">
                    Uma jornada visceral através de narrativas invisíveis que conectam o Brasil contemporâneo com suas raízes mais profundas. O filme explora as histórias que não vemos, mas que nos definem, revelando camadas de memória, identidade e pertencimento através de uma linguagem cinematográfica ousada e poética.
                  </p>
                </div>

                {/* Quote */}
                <div
                  className="data-natureza-quote"
                  style={{
                    marginTop: 'clamp(30px, 4vh, 50px)',
                    paddingLeft: 'clamp(20px, 3vw, 30px)',
                    borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(16px, 1.5vw, 22px)',
                      lineHeight: '1.6',
                      fontStyle: 'italic',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: 'clamp(12px, 2vh, 20px)',
                    }}
                  >
                    &quot;O que não vemos é o que mais nos move.&quot;
                  </div>
                  <div
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(11px, 1vw, 13px)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    — Rafaela Camelo
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Distribution & Technical Info */}
            <div
              className="flex flex-col justify-center p-[50px]"
              style={{
                backgroundColor: '#0a0a0a',
                overflow: 'hidden',
              }}
            >
              <div
                className="data-natureza-content data-natureza-distribution"
              >
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Distribuição
                </div>
                <div 
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(13px, 1.2vw, 16px)',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: 'clamp(30px, 4vh, 50px)',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(12px, 2vh, 18px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Brasil:</strong> Vitrine Filmes
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.95)' }}>Internacional:</strong> The Open Reel
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 'clamp(20px, 3vh, 30px)',
                  }}
                >
                  Ficha Técnica
                </div>
                <div 
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(12px, 1.1vw, 14px)',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('direcao')}</strong> Rafaela Camelo
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('roteiro')}</strong> Rafaela Camelo
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('producao')}</strong> Moveo Filmes
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('coproducao')}</strong> Brasil-Chile
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('financiamento')}</strong> FAC-DF, FSA/Ancine
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Lançamento Brasil:</strong> 27/11/2025
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de Transição - ContentTransition */}
          <section
            className="horizontal-section relative flex-shrink-0"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <ContentTransition
              leftText={{ 
                line1: t('aNatureza'), 
                line2: t('dasCoisasInvisiveis')
              }}
              rightText={{ 
                line1: t('as'), 
                line2: t('micangas')
              }}
              boxCount={100}
            />
          </section>

          {/* Seção 1 - AS MIÇANGAS - Title Only with Scroll Acceleration Gallery */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-micangas-panel="0"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Centered Title Card */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 1 }}
            >
              <h1
                className="data-micangas-title"
                suppressHydrationWarning
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 6vw, 120px)',
                  fontWeight: 800,
                  textAlign: 'center',
                  maxWidth: '800px',
                  color: 'white',
                }}
              >
                {t('asMicangas')}
              </h1>
            </div>
          </section>

          {/* Seção 2 - AS MIÇANGAS - Info Panel */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-micangas-panel="1"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {/* Left - Content */}
            <div 
              className="flex flex-col justify-center p-[50px]"
              style={{
                backgroundColor: '#0a0a0a',
              }}
            >
              <div 
                className="data-micangas-content"
              >
                <div
                  className="data-micangas-label"
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(10px, 0.9vw, 13px)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {t('oFilme')}
                </div>
                <h2
                  className="data-micangas-title split-text"
                  suppressHydrationWarning
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                    fontSize: 'clamp(24px, 3vw, 48px)',
                    lineHeight: '1.2',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: 'clamp(20px, 3vh, 40px)',
                    color: 'white',
                  }}
                >
                  {t('asMicangasTitle')}
                </h2>
                <div 
                  className="data-micangas-text"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(14px, 1.3vw, 18px)',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: 'clamp(30px, 4vh, 50px)',
                  }}
                >
                  <p className="split-text">
                    (2023) Curta-metragem que explora a memória e a identidade através de narrativas fragmentadas e poéticas.
                  </p>
                </div>

                {/* Ficha Técnica */}
                <div
                  className="data-micangas-ficha"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(11px, 1vw, 13px)',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.6)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 'clamp(20px, 3vh, 30px)',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('direcao')}</strong> Rafaela Camelo
                  </div>
                  <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('producao')}</strong> Moveo Filmes
                  </div>
                  <div>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{t('financiamento')}</strong> FAC-DF, Edital Cardume
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Image */}
            <div 
              className="relative overflow-hidden"
              style={{
                position: 'relative',
              }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  willChange: 'transform',
                }}
              >
                <Image
                  src="/imagens/capahome.png"
                  alt="AS MIÇANGAS"
                  fill
                  sizes="50vw"
                  className="object-cover data-micangas-parallax"
                  style={{
                    filter: 'saturate(0) brightness(0.8)',
                    transform: 'scale(1.1)',
                  }}
                  data-speed="0.3"
                  unoptimized
                />
              </div>
            </div>
          </section>

          {/* Seção 1 - O Mistério da Carne - Title Only */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-misterio-panel="0"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Centered Title Card */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 1 }}
            >
              <h1
                className="data-misterio-title"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 6vw, 120px)',
                  fontWeight: 800,
                  textAlign: 'center',
                  maxWidth: '800px',
                  color: 'white',
                }}
              >
                O MISTÉRIO DA CARNE
              </h1>
            </div>
          </section>

          {/* Seção 2 - O Mistério da Carne - Content */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            data-misterio-panel="1"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'visible',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="p-[50px] box-border h-full" style={{ overflow: 'visible', width: '100%', minWidth: 'max-content' }}>
              <div className="w-full h-full" style={{ overflow: 'visible', width: '100%' }}>
                <div className="grid md:grid-cols-12 gap-4 md:gap-6 h-full" style={{ overflow: 'visible' }}>
                  {/* Coluna Esquerda - Título e Informações Técnicas */}
                  <div className="md:col-span-7 flex flex-col h-full justify-between" style={{ overflow: 'visible' }}>
                    {/* Container do Título */}
                    <div className="flex flex-col justify-start data-misterio-header">
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(24px, 3vw, 48px)',
                          lineHeight: '0.95',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          marginBottom: 'clamp(6px, 0.8vh, 12px)',
                          color: 'white',
                        }}
                      >
                        {t('oMisterioDaCarne')}
                      </div>
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          lineHeight: '1',
                          opacity: 0.7,
                          color: 'white',
                        }}
                      >
                        (2019)
                      </div>
                    </div>

                    {/* Container de Informações Técnicas */}
                    <div className="flex-shrink-0 mt-auto data-misterio-tech">
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.4,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          FAC-DF
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          {t('primeiroEditalCardume')}
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          {t('distribuicao')} {t('agenciaFreakMundo')}
                        </div>
                        <div>
                          {t('producao')} Moveo Filmes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Estreias e Prêmios */}
                  <div className="md:col-span-5 flex flex-col h-full min-h-0 justify-between" style={{ overflow: 'visible' }}>
                    {/* Container de Prêmios (topo) */}
                    <div className="flex-shrink-0 data-misterio-premios">
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('premios')}
                      </div>
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.5,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          {t('melhorFilme')} — Biarritz Amérique Latine
                        </div>
                        <div>
                          {t('melhorFilme')} — New Directors / New Films
                        </div>
                      </div>
                    </div>

                    {/* Container de Estreias (base) */}
                    <div className="flex-shrink-0 mt-auto data-misterio-estreias">
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(11px, 0.95vw, 14px)',
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {t('estreias')}
                      </div>
                      <div
                        className="mix-blend-difference"
                        suppressHydrationWarning
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(10px, 0.85vw, 13px)',
                          lineHeight: 1.5,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>{t('mundial')}</strong> Sundance Film Festival (2019)
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>{t('europa')}</strong> Biarritz Amérique Latine
                        </div>
                        <div>
                          <strong>{t('eua')}</strong> New Directors / New Films
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Seção - CATÁLOGO/CINEMA (Vertical) */}
      <div
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          height: 'calc(100vh - 100px)',
          overflow: 'visible',
        }}
      >
        <section ref={cinemaSectionRef} className="relative w-full h-full" style={{ height: '100%', overflow: 'visible' }}>
          <div className="w-full h-full p-[50px] box-border" style={{ overflow: 'visible' }}>
            <div className="max-w-7xl mx-auto w-full h-full" style={{ overflow: 'visible' }}>
              <div className="grid grid-cols-12 grid-rows-8 gap-4 md:gap-6 h-full min-h-0">
                {/* Bloco vertical esquerdo - torre */}
                <div className="col-span-2 row-span-8 bg-transparent p-4 md:p-6 min-h-0 relative flex items-center justify-center">
                  {/* Cantoneiras */}
                  <div
                    className="absolute"
                    style={{
                      top: 0,
                      left: 0,
                      width: '40px',
                      height: '80px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      bottom: 0,
                      right: 0,
                      width: '40px',
                      height: '80px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.8)',
                    }}
                  />
                  {/* Título centralizado */}
                  <h3
                    className="font-black text-white transform -rotate-90 origin-center whitespace-nowrap"
                    data-cinema-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(48px, 6vw, 96px)',
                      letterSpacing: '-0.02em',
                      lineHeight: '0.9',
                      marginLeft: '25px',
                    }}
                  >
                    {t('catalogo')}
                  </h3>
                </div>

                {/* Bloco horizontal superior largo */}
                <div
                  className="col-span-7 row-span-2 bg-transparent p-4 md:p-8 flex items-end justify-start min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <h2
                    className="font-black tracking-tight text-white"
                    data-cinema-animate
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(48px, 6vw, 96px)',
                      letterSpacing: '-0.02em',
                      lineHeight: '0.9',
                    }}
                  >
                    CINEMA
                  </h2>
                </div>

                {/* Quadrado superior direito - imagem */}
                <div className="col-span-3 row-span-3 bg-[#1f1f1f] min-h-0 relative overflow-hidden" data-cinema-image>
                  <Image
                    src="/imagens/secao2home/Rectangle 10.png"
                    alt="Catálogo Cinema placeholder 1"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Retângulo horizontal médio */}
                <div
                  className="col-span-5 row-span-3 bg-transparent p-4 md:p-8 flex items-start justify-start min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <div data-cinema-animate>
                    <p
                      className="text-white font-bold"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontWeight: 500,
                        fontSize: FONT_MEDIUM,
                        lineHeight: '1.2',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Descubra o acervo de histórias das quais a Moveo faz parte
                    </p>
                  </div>
                </div>

                {/* Bloco vertical médio - 3D Carousel */}
                <div className="col-span-2 row-span-4 bg-transparent min-h-0 relative overflow-visible">
                  <div 
                    ref={carouselScrollDistRef}
                    className="absolute top-0 w-full pointer-events-none z-0"
                    style={{ height: '400%', opacity: 0 }}
                  />
                  <div
                    ref={carouselContainerRef}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  />
                </div>

                {/* Quadrado inferior esquerdo */}
                <div
                  className="col-span-3 row-span-3 bg-transparent p-4 md:p-6 flex items-end min-h-0"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-bold mix-blend-difference"
                    data-cinema-animate
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: FONT_SMALL,
                      lineHeight: '1.4',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    dos projetos em desenvolvimento aos títulos em distribuição, até filmes que já completaram seu circuito nas telas.
                  </p>
                </div>

                {/* Retângulo horizontal inferior - imagem */}
                <div className="col-span-2 row-span-3 bg-[#1f1f1f] min-h-0 relative overflow-hidden" data-cinema-image>
                  <Image
                    src="/imagens/secao2home/Rectangle 8.png"
                    alt="Catálogo Cinema placeholder 2"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Bloco final inferior direito */}
                <div className="col-span-3 row-span-2 bg-transparent p-4 md:p-6 flex items-center justify-center min-h-0" style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <p
                    className="text-white font-bold mix-blend-difference"
                    data-cinema-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: FONT_MEDIUM,
                      letterSpacing: '-0.02em',
                      lineHeight: '1.1',
                    }}
                  >
                    {t('explorarArquivoNaIntegra')} {'>>>>'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção - ARQUIVO MOVEL */}
      <div
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          height: 'calc(100vh - 100px)',
          overflow: 'visible',
        }}
      >
        <section ref={arquivoSectionRef} className="relative w-full h-full" style={{ height: '100%', overflow: 'visible' }}>
          <div className="w-full h-full p-[50px] box-border" style={{ overflow: 'visible' }}>
            <div className="w-full h-full relative" style={{ overflow: 'visible' }}>
              <div className="grid grid-cols-12 grid-rows-8 gap-4 md:gap-6 h-full min-h-0" style={{ overflow: 'visible' }}>
                {/* Coluna imagem esquerda */}
                <div className="col-span-2 row-span-8 relative overflow-hidden" data-arquivo-image>
                  <Image
                    src="/imagens/secao2home/Rectangle 12.png"
                    alt="Arquivo móvel imagem 4"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Bloco principal - ALÉM DOS FILMES */}
                <div
                  className="col-start-3 col-span-6 row-span-5 bg-black p-8 md:p-12 flex flex-col items-start justify-end min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <h1
                    className="font-black tracking-tighter leading-none text-white mix-blend-difference"
                    data-arquivo-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: FONT_HUGE,
                      lineHeight: '0.9',
                    }}
                  >
                    {t('alemDosFilmes').split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < t('alemDosFilmes').split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h1>
                  <Link
                    href="/catalogo/mostras-e-exposicoes"
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-white/40 hover:border-white transition-colors uppercase"
                    data-arquivo-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {t('verArquivoCompleto')}
                  </Link>
                </div>

                {/* Bloco secundário - ARQUIVO MOVEO */}
                <div
                  className="col-start-9 col-span-3 row-span-3 bg-black p-6 flex items-end justify-start min-h-0"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-light leading-tight mix-blend-difference"
                    data-arquivo-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_MEDIUM,
                      lineHeight: '1.1',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    {t('arquivoMoveo').split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < t('arquivoMoveo').split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                {/* Texto descritivo compacto */}
                <div
                  className="col-start-3 col-span-4 row-start-6 row-span-3 bg-black p-6 md:p-8 flex items-start justify-start min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-light leading-relaxed mix-blend-difference"
                    data-arquivo-animate
                    suppressHydrationWarning
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      lineHeight: '1.4',
                      maxWidth: '24ch',
                      textAlign: 'justify',
                    }}
                  >
                    {t('arquivoDescription')}
                  </p>
                </div>

                {/* Imagens à direita */}
                <div className="col-start-8 col-span-4 row-start-1 row-span-3 relative overflow-hidden" data-arquivo-image>
                  <Image
                    src="/imagens/secao2home/Rectangle 10.png"
                    alt="Arquivo móvel imagem 1"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="col-start-8 col-span-4 row-start-3 row-span-3 relative overflow-hidden" data-arquivo-image>
                  <Image
                    src="/imagens/secao2home/Rectangle 9.png"
                    alt="Arquivo móvel imagem 2"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="col-start-7 col-span-5 row-start-6 row-span-2 relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 11.png"
                    alt="Arquivo móvel imagem 3"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção - NOTÍCIAS */}
      <div
        className="relative bg-black text-white"
        data-noticias-section
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          height: 'calc(100vh - 100px)',
          overflow: 'visible',
        }}
      >
        <section className="relative w-full h-full" style={{ height: '100%', overflow: 'visible' }}>
          <div className="w-full h-full p-[50px] box-border" style={{ overflow: 'visible' }}>
            <div className="max-w-7xl mx-auto w-full h-full" style={{ overflow: 'visible' }}>
              <div className="grid grid-cols-12 grid-rows-6 gap-4 md:gap-6 h-full min-h-0">
                {/* Carrossel minimal */}
                <div className="col-span-8 row-span-6 relative overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${newsIndex * 100}%)` }}
                  >
                    {newsSlides.map((item) => (
                      <div key={item.title} className="min-w-full h-full relative">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute top-5 left-5 flex items-center gap-3 z-10 mix-blend-difference">
                          <span
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              letterSpacing: '0.05em',
                            }}
                            className="px-3 py-1 border border-white/30 uppercase"
                          >
                            {item.tag}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              opacity: 0.8,
                            }}
                          >
                            {item.date}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 space-y-3">
                          <p
                            className="text-white font-bold mix-blend-difference"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_LARGE,
                              lineHeight: '1',
                              letterSpacing: '-0.02em',
                              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            }}
                          >
                            {item.title}
                          </p>
                          <p
                            className="text-white mix-blend-difference"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              lineHeight: '1.5',
                              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            }}
                          >
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-6 flex items-center gap-3 z-20">
                    {newsSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNewsIndex(idx)}
                        className="h-2 w-8 transition-opacity"
                        style={{
                          background: 'white',
                          opacity: newsIndex === idx ? 0.9 : 0.3,
                        }}
                        aria-label={`${t('irParaNoticia')} ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-y-0 right-0 flex flex-col justify-center gap-4 p-4 z-20">
                    <button
                      onClick={() => setNewsIndex((prev) => (prev - 1 + newsSlides.length) % newsSlides.length)}
                      className="h-10 w-10 border border-white/30 hover:border-white transition-colors"
                      aria-label={t('noticiaAnterior')}
                    >
                      <span className="sr-only">{t('anterior')}</span>
                    </button>
                    <button
                      onClick={() => setNewsIndex((prev) => (prev + 1) % newsSlides.length)}
                      className="h-10 w-10 border border-white/30 hover:border-white transition-colors"
                      aria-label={t('proximaNoticia')}
                    >
                      <span className="sr-only">{t('proxima')}</span>
                    </button>
                  </div>
                </div>

                {/* Lateral minimalista */}
                <div className="col-span-4 row-span-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-white uppercase"
                      suppressHydrationWarning
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontWeight: 700,
                        fontSize: FONT_LARGE,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {t('noticias')}
                    </h2>
                    <Link
                      href="/noticias"
                      className="px-4 py-2 border border-white/40 hover:border-white transition-colors uppercase"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {t('verPagina')}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {newsSlides.map((item) => (
                      <div key={item.title} className="px-3 py-1 border border-white/25 uppercase" style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif", fontSize: FONT_SMALL }}>
                        {item.tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção - CONTATO / FOOTER */}
      <div
        ref={contactSectionRef}
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          padding: '50px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            <h2
              data-contact-animate
              className="text-white uppercase"
              style={{
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: FONT_HUGE,
                lineHeight: '0.9',
                letterSpacing: '-0.02em',
              }}
            >
              Contato
            </h2>
            <p
              data-contact-animate
              className="text-white"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: FONT_SMALL,
                lineHeight: '1.5',
                maxWidth: '36ch',
              }}
            >
              Fale com a Moveo para projetos, parcerias e informações gerais.
            </p>
            <div data-contact-animate className="flex flex-wrap gap-3">
              <Link
                href="/contato"
                className="px-5 py-3 border border-white/50 hover:border-white transition-colors uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_SMALL,
                  letterSpacing: '0.08em',
                }}
              >
                {t('irParaContato')}
              </Link>
              <Link
                href="/catalogo/cinema"
                className="px-4 py-2 border border-white/40 hover:border-white transition-colors uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_SMALL,
                  letterSpacing: '0.08em',
                }}
              >
                Cinema
              </Link>
              <Link
                href="/catalogo/mostras-e-exposicoes"
                className="px-4 py-2 border border-white/40 hover:border-white transition-colors uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_SMALL,
                  letterSpacing: '0.08em',
                }}
              >
                Mostras
              </Link>
            </div>
            <p
              className="text-white opacity-80"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: FONT_SMALL,
                letterSpacing: '0.05em',
              }}
            >
              {t('produtoraBoutique')}
            </p>
          </div>

          <div data-contact-animate className="md:col-span-5 relative h-48 md:h-full overflow-hidden rounded">
            <Image
              src="/imagens/capahome.png"
              alt="Contato Moveo"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

    </MainLayout>
  );
}
