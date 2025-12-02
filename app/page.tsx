'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from './components/MainLayout';
import { ScrollHint } from './components/ScrollHint';
import { useGridGuides } from '@/lib/hooks/useGridGuides';
import {
  getMarkerPosition,
  getHorizontalLinePosition,
  getWidthBetweenMarkers,
  getHeightBetweenLines,
} from '@/lib/utils/gridCoordinates';

const newsHighlights = [
  {
    title: 'Mostra Internacional 2025',
    summary: 'Dois longas autorais selecionados para Rotterdam exibindo a estética MOVEO.',
    date: 'Março 2025',
    tag: 'Festival',
  },
  {
    title: 'Residência Criativa DF',
    summary: 'Laboratório imersivo de direção com foco em narrativas híbridas e arquivos vivos.',
    date: 'Junho 2025',
    tag: 'Residência',
  },
  {
    title: 'Co-produção transatlântica',
    summary: 'Novo filme em parceria com estúdios europeus amplia a presença da produtora.',
    date: 'Agosto 2025',
    tag: 'Produção',
  },
];

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
  const isGuidesVisible = useGridGuides();
  const pathname = usePathname();
  const [dynamicFontSize, setDynamicFontSize] = useState<number>(100);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [produtoraFontSize, setProdutoraFontSize] = useState<number>(100); // Removed
  const produtoraTextRef = useRef<HTMLDivElement>(null);
  const produtoraContainerRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement | null>(null);
  const secondSectionRef = useRef<HTMLElement | null>(null);
  const thirdSectionRef = useRef<HTMLElement | null>(null);
  const horizontalSecondWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalSecondTrackRef = useRef<HTMLDivElement>(null);
  const horizontalThirdWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalThirdTrackRef = useRef<HTMLDivElement>(null);
  const verticalReverseWrapperRef = useRef<HTMLDivElement>(null);
  const verticalReverseContentRef = useRef<HTMLDivElement>(null);
  const imageCarouselSectionRef = useRef<HTMLDivElement>(null);
  const imageCarouselContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mainTrackReady, setMainTrackReady] = useState(false);
  const mainTrackTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);
  const sobreMoveoContainerRef = useRef<HTMLDivElement>(null);
  const sobreMoveoTextRef = useRef<HTMLDivElement>(null);
  const [sobreMoveoFontSize, setSobreMoveoFontSize] = useState<number>(40);
  const dragonflySectionRef = useRef<HTMLDivElement>(null);
  const dragonflyHeadingRef = useRef<HTMLDivElement>(null);
  const dragonflyPinRef = useRef<HTMLDivElement>(null);

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

      // Debug: Log para verificar dimensões
      console.log('Track width:', track.scrollWidth);
      console.log('Wrapper width:', wrapper.offsetWidth);
      console.log('Distance:', track.scrollWidth - wrapper.offsetWidth);
      console.log('Number of sections:', track.children.length);

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
      // Limpar ScrollTrigger específico antes de reverter o contexto
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'horizontal-main-track' || st.trigger === wrapper) {
          st.kill();
        }
      });
      mainTrackTimelineRef.current = null;
      setMainTrackReady(false);
      if (ctx) ctx.revert();
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
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'second-section-pin') {
          st.kill();
        }
      });
      if (ctx) ctx.revert();
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

      const st = ScrollTrigger.create({
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
      ScrollTrigger.getAll().forEach((st) => {
        const vars = st.vars as { id?: string };
        if (vars?.id === 'third-section-pin') {
          st.kill();
        }
      });
      if (ctx) ctx.revert();
    };
  }, [mainTrackReady]);

  // Unique scroll trigger effects for first section elements
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!firstSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const allTargets = gsap.utils.toArray<HTMLElement>('[data-first-animate]');
      if (!allTargets.length) return;

      // Find specific elements by checking their content and structure
      const moveoElement = allTargets.find((el) => {
        const text = el.textContent?.trim();
        return text === 'MOVEO' || (el.classList.contains('uppercase') && text?.includes('MOVEO'));
      }) as HTMLElement;
      
      const produtoraElement = allTargets.find((el) => {
        const text = el.textContent || '';
        return text.includes('Produtora boutique') || text.includes('De filmes independentes');
      }) as HTMLElement;
      
      const imageElement = allTargets.find((el) => {
        const hasImage = el.querySelector('img[alt="Capa Home"]') || 
                        el.querySelector('img[src*="capahome"]') ||
                        el.querySelector('img[src*="capahome"]');
        return hasImage || el.classList.contains('overflow-hidden');
      }) as HTMLElement;

      // Animation for MOVEO - Minimal fade with subtle vertical slide
      if (moveoElement) {
        gsap.set(moveoElement, { 
          opacity: 0,
          y: 60,
        });
        
        gsap.to(moveoElement, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: firstSectionRef.current,
            start: 'top top',
            end: '+=200',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animation for Produtora boutique - Simple horizontal slide in
      if (produtoraElement) {
        gsap.set(produtoraElement, { 
          opacity: 0,
          x: -80,
        });
        
        gsap.to(produtoraElement, {
          opacity: 1,
          x: 0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: firstSectionRef.current,
            start: 'top top',
            end: '+=250',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animation for Capa Home image - Simple fade in
      if (imageElement) {
        gsap.set(imageElement, { 
          opacity: 0,
        });
        
        gsap.to(imageElement, {
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: firstSectionRef.current,
            start: 'top top',
            end: '+=300',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }, firstSectionRef);

    return () => ctx.revert();
  }, []);

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

  // ScrollTrigger para terceiro track horizontal (Além dos filmes / Notícias / Contato)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!horizontalThirdWrapperRef.current || !horizontalThirdTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = horizontalThirdWrapperRef.current;
    const track = horizontalThirdTrackRef.current;

    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id === 'horizontal-third-track' || st.trigger === wrapper || (st.vars?.trigger && st.vars.trigger === wrapper)) {
        try {
          st.kill();
        } catch {
          // ignore
        }
      }
    });

    let ctx: gsap.Context | null = null;
    let handleResize: (() => void) | null = null;

    const timer = setTimeout(() => {
      if (!wrapper || !track || !wrapper.isConnected || !track.isConnected) return;

      ctx = gsap.context(() => {
        gsap.set(track, { clearProps: 'all', x: 0 });

        gsap.to(track, {
          x: () => {
            if (!track || !wrapper) return 0;
            return -(track.scrollWidth - wrapper.offsetWidth);
          },
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 50px',
            end: () => {
              if (!track || !wrapper) return '+=0';
              return `+=${track.scrollWidth + window.innerHeight}`;
            },
            scrub: 0.5,
            pin: true,
            pinType: 'transform',
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            id: 'horizontal-third-track',
          },
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, horizontalThirdWrapperRef);

      handleResize = () => {
        if (wrapper && track && wrapper.isConnected && track.isConnected) {
          ScrollTrigger.refresh();
        }
      };
      window.addEventListener('resize', handleResize);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (handleResize) window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id === 'horizontal-third-track' || st.trigger === wrapper) {
          try {
            st.kill();
          } catch {
            // ignore
          }
        }
      });
      if (ctx) {
        try {
          ctx.revert();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // ScrollTrigger para segundo track horizontal (AS MIÇANGAS)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!horizontalSecondWrapperRef.current || !horizontalSecondTrackRef.current) return;

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

    // Aguardar um frame para garantir que o DOM está estável
    const timer = setTimeout(() => {
      if (!wrapper || !track || !wrapper.isConnected || !track.isConnected) return;

      ctx = gsap.context(() => {
        // Limpar transformações anteriores
        gsap.set(track, { clearProps: 'all' });
        gsap.set(track, { x: 0 });

        gsap.to(track, {
          x: () => {
            if (!track || !wrapper) return 0;
            return -(track.scrollWidth - wrapper.offsetWidth);
          },
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 50px',
            end: () => {
              if (!track || !wrapper) return '+=0';
              return `+=${track.scrollWidth + window.innerHeight}`;
            },
            scrub: 0.5,
            pin: true,
            pinType: 'transform',
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            id: 'horizontal-second-track',
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
        });
      }, horizontalSecondWrapperRef);

      handleResize = () => {
        if (wrapper && track && wrapper.isConnected && track.isConnected) {
          ScrollTrigger.refresh();
        }
      };
      window.addEventListener('resize', handleResize);
    }, 100);

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
  }, []);

  // ScrollTrigger para Image Carousel com Parallax
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!imageCarouselSectionRef.current || !imageCarouselContainerRef.current) return;
    if (imageRefs.current.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = imageCarouselSectionRef.current;
    const container = imageCarouselContainerRef.current;
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    const totalImages = images.length;

    // Limpar ScrollTriggers existentes
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === section || (st.vars?.trigger && st.vars.trigger === section)) {
        st.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Configurar estado inicial de todas as imagens
      images.forEach((img, i) => {
        if (!img) return;
        gsap.set(img, {
          opacity: i === 0 ? 1 : 0,
          y: 0,
          scale: 1,
        });
      });

      // Estado inicial do container - fechado
      gsap.set(container, {
        height: '10vh',
        clipPath: 'inset(45% 0% 45% 0%)',
      });

      // Animação de abertura/fechamento do container
      // Abre quando o centro do container está no centro da viewport
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom', // Quando o topo da seção aparece
        end: 'bottom top', // Quando o bottom do container chega ao topo da viewport
        scrub: true,
        onUpdate: () => {
          // Calcular a posição do centro do container em relação à viewport
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.top + (containerRect.height / 2);
          const viewportCenter = window.innerHeight / 2;
          const distanceFromCenter = Math.abs(containerCenter - viewportCenter);

          // Quando o container está no centro, está 100% aberto
          // Quando está longe do centro, está fechado
          // Usar uma curva suave para a transição
          const maxDistance = window.innerHeight * 0.6; // Distância para considerar completamente fechado
          const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);

          // Curva suave usando easeOut
          const openProgress = 1 - Math.pow(normalizedDistance, 1.5);

          // Altura: 10vh (fechado) a 40vh (aberto)
          const heightPercent = 10 + (openProgress * 30);
          // Clip: 45% (fechado) a 0% (aberto)
          const clipAmount = 45 - (openProgress * 45);

          gsap.set(container, {
            height: `${heightPercent}vh`,
            clipPath: `inset(${clipAmount}% 0% ${clipAmount}% 0%)`,
          });
        },
        invalidateOnRefresh: true,
        id: 'container-open-close',
      });

      // Animação principal de transição entre imagens com parallax suave
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress));
          const normalizedProgress = progress * (totalImages - 1);
          const imageIndex = Math.floor(normalizedProgress);
          const currentImageProgress = normalizedProgress - imageIndex;

          images.forEach((img, i) => {
            if (!img) return;

            if (i === imageIndex) {
              // Imagem atual - fade out suave
              const opacity = 1 - currentImageProgress;
              const parallaxY = -currentImageProgress * 20; // Parallax mais sutil
              gsap.set(img, {
                opacity: opacity,
                y: parallaxY,
              });
            } else if (i === imageIndex + 1 && imageIndex + 1 < totalImages) {
              // Próxima imagem - fade in suave
              const opacity = currentImageProgress;
              const parallaxY = -(1 - currentImageProgress) * 20; // Parallax mais sutil
              gsap.set(img, {
                opacity: opacity,
                y: parallaxY,
              });
            } else {
              // Outras imagens - completamente ocultas
              gsap.set(img, {
                opacity: 0,
                y: 0,
              });
            }
          });
        },
        invalidateOnRefresh: true,
        id: 'image-carousel-main',
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, imageCarouselSectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars?.id?.toString().startsWith('image-carousel') || st.trigger === section) {
          st.kill();
        }
      });
      if (ctx) ctx.revert();
    };
  }, []);

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

        console.log('Seção 7 - Vertical configurado (de cima para baixo)');

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
        const targets = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-pin-animate]'));
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

  // Dragonfly SVG Animation Section
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!dragonflySectionRef.current || !dragonflyHeadingRef.current || !dragonflyPinRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const heading = dragonflyHeadingRef.current;
    const pin = dragonflyPinRef.current;
    const paths = dragonflySectionRef.current.querySelectorAll<SVGPathElement>('.dragonfly-path.draw');

    // 1. Prepara os caminhos do SVG (Calcula comprimento e esconde)
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    // Mostra o SVG após o setup inicial para evitar "flash"
    const svg = dragonflySectionRef.current.querySelector('svg');
    if (svg) {
      gsap.set(svg, { opacity: 1 });
    }

    const ctx = gsap.context(() => {
      // 2. Cria o Timeline de Desenho
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: dragonflySectionRef.current,
          start: 'top top',
          end: '+=1500',
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      });

      // === Sequência de Animação ===
      // Duração total do timeline é aproximadamente 4.0 segundos (0.8 + 1.2 + 1.5 + 0.5)

      // Desenha a Cabeça e Tórax
      tl.to(['#head', '#thorax'], {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0);

      // Desenha o Abdômen
      tl.to('#abdomen', {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      }, '<0.2'); // Inicia antes do anterior terminar

      // Desenha As Asas
      tl.to('.wing', {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power2.out',
      }, '-=0.5'); // Inicia antes do abdômen terminar

      // Efeito Visual Final (Aumenta espessura)
      tl.to('.dragonfly-path', {
        strokeWidth: 3.5,
        ease: 'power1.inOut',
        duration: 0.5,
      });

      // Animação das Imagens (Parallax com data-speed)
      const images = dragonflySectionRef.current?.querySelectorAll('.images > div'); // Agora mirando nos containers
      
      if (images) {
        // Parallax Effect (durante o scroll inicial)
        images.forEach((div) => {
          const speed = parseFloat(div.getAttribute('data-speed') || '1');
          
          gsap.to(div, {
            y: (i, target) => (1 - speed) * 200,
            ease: 'none',
            scrollTrigger: {
              trigger: dragonflySectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        });
      }

      // Saída dos elementos de texto para cima (Transição Suave)
      const headingElements = dragonflySectionRef.current?.querySelectorAll('.heading');
      if (headingElements) {
        tl.to(headingElements, {
          y: '-150vh',
          scale: 0.8,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.in',
        }, '+=0.2'); // Inicia logo após o desenho da libélula terminar
      }
    }, dragonflySectionRef);

    return () => {
      if (ctx) ctx.revert();
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
    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;

    // Remove calculation loop
    /*
    const calculateProdutoraFontSize = () => {
      // ... removed dynamic calculation ...
    };
    */
    
    // Cleanup unused vars
    // setProdutoraFontSize not used anymore


    const runCalculation = () => {
      rafId = requestAnimationFrame(() => {
      // Removido cálculo dinâmico de produtoraFontSize para usar tamanho fixo padronizado
      /*
      if (
        produtoraContainerRef.current &&
        produtoraContainerRef.current.offsetWidth > 0 &&
        produtoraContainerRef.current.offsetHeight > 0
      ) {
        // calculateProdutoraFontSize();
        
        if (produtoraContainerRef.current && !resizeObserver) {
          resizeObserver = new ResizeObserver(() => {
            // calculateProdutoraFontSize();
          });
          resizeObserver.observe(produtoraContainerRef.current);
        }
      }
      */
      // Mantendo estrutura apenas para não quebrar lógica existente se houver dependências, mas vazio.
      if (produtoraContainerRef.current && !resizeObserver) {
          resizeObserver = new ResizeObserver(() => {});
          resizeObserver.observe(produtoraContainerRef.current);
      }
      });
    };

    runCalculation();

    const handleResize = () => {
      calculateDynamicFontSize();
      // calculateProdutoraFontSize(); // Removed
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          calculateDynamicFontSize();
          // calculateProdutoraFontSize(); // Removed
        }, 100);
      }
    };

    const handlePageShow = () => {
      setTimeout(() => {
        calculateDynamicFontSize();
        // calculateProdutoraFontSize(); // Removed
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
        if (
          produtoraContainerRef.current &&
          produtoraContainerRef.current.offsetWidth > 0 &&
          produtoraContainerRef.current.offsetHeight > 0
        ) {
          /*
          const targetWidth = produtoraContainerRef.current.offsetWidth;
          const targetHeight = produtoraContainerRef.current.offsetHeight;
          const measureElement = document.createElement('div');
          measureElement.style.position = 'absolute';
          measureElement.style.visibility = 'hidden';
          measureElement.style.width = `${targetWidth}px`;
          measureElement.style.fontFamily = "'Helvetica Neue LT Pro Medium Extended', Arial, Helvetica, sans-serif";
          measureElement.style.lineHeight = '90%';
          measureElement.style.fontSize = '100px';
          measureElement.innerHTML = 'Produtora boutique<br />De filmes independentes';
          document.body.appendChild(measureElement);
          const baseWidth = measureElement.offsetWidth;
          const baseHeight = measureElement.offsetHeight;
          const widthBasedSize = (targetWidth / baseWidth) * 100;
          const heightBasedSize = (targetHeight / baseHeight) * 100;
          const calculatedFontSize = Math.min(widthBasedSize, heightBasedSize);
          document.body.removeChild(measureElement);
          setProdutoraFontSize(calculatedFontSize);
          */
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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

      {/* Debug: Indicador de scroll progress */}
      <div
        className="fixed top-0 left-0 h-1 bg-red-500 z-[9999]"
        style={{
          width: '0%',
          transition: 'width 0.1s ease-out'
        }}
        id="scroll-indicator"
      />

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
              className="absolute text-white uppercase z-30 mix-blend-difference"
              style={{
                left: 0,
                bottom: `calc(100% - ${getHorizontalLinePosition('F')} + 50px)`,
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
                className="absolute text-white mix-blend-difference"
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
                Produtora boutique<br />
                De filmes independentes
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
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              lineHeight: '1.4',
                            }}
                          >
                            Brasília, desde 2018
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
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                            fontSize: FONT_MEDIUM,
                            lineHeight: '1.4',
                          }}
                        >
                          Filmes de arte
                          <br />
                          para o mercado
                          <br />
                          internacional
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 h-full min-h-0">
                    <div 
                      ref={sobreMoveoContainerRef}
                      className="bg-black rounded-lg p-4 md:p-6 lg:p-8 flex items-center justify-center flex-[1] min-h-0" 
                      data-second-animate
                    >
                      <div 
                        ref={sobreMoveoTextRef}
                        className="text-white uppercase text-center mix-blend-difference" 
                        style={{
                          fontSize: `${sobreMoveoFontSize}px`,
                          lineHeight: '0.9',
                          letterSpacing: '-0.05em',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 300,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          SOBRE A
                        </div>
                        <div
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          MOVEO
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 flex-[2] min-h-0 gap-2">
                      {/* Container esquerdo (esquerda + centro mesclados) */}
                      <div className="col-span-2 bg-transparent rounded-lg p-4 md:p-6 flex items-end justify-start" data-second-animate>
                        <p
                          className="text-white mix-blend-difference"
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                            fontWeight: 700,
                            fontSize: FONT_LARGE,
                            lineHeight: '1.2',
                          }}
                        >
                          Focado em
                          <br />
                          promissores
                          <br />
                          cineastas
                          <br />
                          brasileiros
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
                  <div className="flex-1 bg-transparent flex items-center justify-start pt-4 pr-4 pb-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8 pl-0 min-h-0" data-third-animate data-typewriter-text>
                    <p
                      className="text-white mix-blend-difference"
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
                      <span style={{ display: 'block', width: '100%' }}>Um histórico sólido</span>
                      <span style={{ display: 'block', width: '100%' }}>de colaborações com</span>
                      <span style={{ display: 'block', width: '100%' }}>talentos emergentes</span>
                    </p>
                  </div>

                  {/* Container Central */}
                  <div className="flex-1 bg-transparent flex items-end pt-4 pr-4 pb-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8 pl-0 min-h-0" data-third-animate>
                    <p
                      className="text-white mix-blend-difference"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_MEDIUM,
                        lineHeight: '1.4',
                      }}
                    >
                      Filmes de arte para o mercado internacional
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
                  <div className="col-span-4 row-span-3 bg-transparent flex items-center justify-start pt-4 pr-4 pb-4 md:pt-6 md:pr-6 md:pb-6 lg:pt-8 lg:pr-8 lg:pb-8 pl-0 col-start-1 row-start-3" data-third-animate>
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
                      Filmes <span style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif", fontWeight: 700 }}>destaque</span> do nosso catálogo
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

      {/* Dragonfly Animation Section - ACERVO */}
      <div className="relative w-full">
        <section
          ref={dragonflySectionRef}
          className="relative min-h-screen bg-black text-white flex flex-col justify-center items-center overflow-hidden py-20"
        >
          <div className="container mx-auto px-4 relative z-10 w-full h-full flex flex-col items-center justify-center">
          
          {/* Heading Container */}
          <div 
            ref={dragonflyHeadingRef} 
            className="relative z-20 mix-blend-difference perspective-[1000px] w-full flex justify-center"
          >
            <div ref={dragonflyPinRef} className="relative text-center">
              <h1 className="relative flex flex-col items-center justify-center uppercase leading-none">
                {/* "ACERVO" - Huge Text */}
                <span 
                  className="relative block z-0 mix-blend-difference"
                  style={{ 
                    fontSize: 'clamp(60px, 15vw, 200px)',
                    fontFamily: "'Helvetica Neue LT Pro Light Condensed', Arial, Helvetica, sans-serif",
                    fontWeight: 300,
                    letterSpacing: '-0.04em'
                  }}
                >
                  ACERVO
                </span>

                {/* "MOVEO" - Subtitle */}
                <span 
                  className="relative z-10 -mt-[2vw] leading-none mix-blend-difference"
                  style={{ 
                    fontSize: 'clamp(32px, 10vw, 135px)',
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontWeight: 700,
                    letterSpacing: '-0.05em',
                    display: 'block'
                  }}
                >
                  MOVEO
                </span>
              </h1>
            </div>
          </div>
          
          {/* SVG Overlay - Posicionado absolutamente no centro da seção */}
          <svg
            data-name="Libelula"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 200"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] opacity-0 pointer-events-none z-0"
            style={{ maxWidth: '100vw', maxHeight: '80vh' }}
          >
            <path id="head" className="dragonfly-path draw" d="M 150 20 C 140 35, 160 35, 150 20 Z" />
            <path id="thorax" className="dragonfly-path draw" d="M 150 35 L 145 50 L 155 50 L 150 35 Z" /> 
            <path id="abdomen" className="dragonfly-path draw" d="M 150 50 L 150 180" /> 
            <path id="wing-tl" className="dragonfly-path draw wing" d="M 150 50 L 50 20 L 60 40 L 150 50 Z" />
            <path id="wing-bl" className="dragonfly-path draw wing" d="M 150 55 L 45 80 L 55 100 L 150 55 Z" />
            <path id="wing-tr" className="dragonfly-path draw wing" d="M 150 50 L 250 20 L 240 40 L 150 50 Z" />
            <path id="wing-br" className="dragonfly-path draw wing" d="M 150 55 L 255 80 L 245 100 L 150 55 Z" />
          </svg>

          {/* Images Grid */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20 w-full max-w-6xl z-0 images"
          >
            {[
              { speed: '2.4' },
              { speed: '1.8' },
              { speed: '2.2' },
              { speed: '1.5' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative w-full aspect-[3/4] overflow-hidden border border-white"
                data-speed={item.speed}
              >
                {/* Image removed as requested */}
              </div>
            ))}
          </div>

          </div>
        </section>
      </div>

      {/* Nova Seção - Image Carousel com Parallax */}
      <div
        ref={imageCarouselSectionRef}
        className="relative bg-black text-white"
        style={{
          marginLeft: '0',
          marginRight: '0',
          marginBottom: '50px',
          minHeight: '100vh',
        }}
      >
        <section
          className="relative"
          data-pin-animate
          style={{ height: '100vh', display: 'flex', alignItems: 'center' }}
        >
          {/* Container de imagem wide fino */}
          <div
            ref={imageCarouselContainerRef}
            className="relative w-full overflow-hidden"
            data-pin-animate
            style={{
              height: '40vh',
              marginLeft: '50px',
              marginRight: '50px',
            }}
          >
            {/* Imagens com parallax e transição */}
            {[
              '/imagens/secao2home/Rectangle 122.png',
              '/imagens/secao2home/Rectangle 8.png',
              '/imagens/secao2home/Rectangle 9.png',
              '/imagens/secao2home/Rectangle 10.png',
              '/imagens/secao2home/Rectangle 11.png',
            ].map((src, index) => (
              <div
                key={index}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: 'translateY(0px)',
                  willChange: 'opacity, transform',
                }}
              >
                <Image
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  priority={index === 0}
                />
              </div>
            ))}
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
          overflow: 'visible',
        }}
      >
        <div
          ref={horizontalSecondTrackRef}
          className="flex h-full will-change-transform"
          style={{ width: 'max-content', overflow: 'visible', gap: '100px' }}
        >
          {/* Seção - A Natureza das Coisas Invisíveis */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{
              width: 'calc(100vw - 100px)',
              height: 'calc(100vh - 100px)',
              overflow: 'visible',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="p-[50px] box-border h-full" style={{ overflow: 'visible', width: '100%', minWidth: 'max-content' }}>
              <div className="w-full h-full" style={{ overflow: 'visible', width: '100%' }}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 h-full" style={{ overflow: 'visible' }}>
                  {/* Coluna Esquerda - Título e Informações Técnicas */}
                  <div className="md:col-span-7 flex flex-col h-full justify-between" style={{ overflow: 'visible' }}>
                    {/* Container do Título */}
                    <div className="flex flex-col justify-start mb-6">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                          fontSize: FONT_LARGE,
                          lineHeight: '0.95',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          marginBottom: 'clamp(6px, 0.8vh, 12px)',
                          color: 'white',
                        }}
                      >
                        <span style={{ display: 'block' }}>A Natureza das</span>
                        <span style={{ display: 'block' }}>Coisas Invisíveis</span>
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
                        (2015)
                      </div>
                    </div>

                    {/* Container de Informações Técnicas */}
                    <div className="flex-shrink-0 mt-auto">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.4,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Coprodução Brasil-Chile
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Distribuição: Vitrine Filmes (Brasil) e The Open Reel (Internacional)
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Lançamento no Brasil: 27/11/2025
                        </div>
                        <div>
                          Produção: Moveo Filmes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Estreias e Prêmios */}
                  <div className="md:col-span-5 flex flex-col h-full min-h-0 justify-between" style={{ overflow: 'visible' }}>
                    {/* Container de Estreias */}
                    <div className="flex-shrink-0">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        ESTREIAS
                      </div>
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.5,
                          color: 'white',
                          maxWidth: '180px',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Mundial:</strong> 75ª Berlinale (Generation KPlus, Filme de Abertura)
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Colômbia:</strong> 64º Cartagena International Film Festival
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>México:</strong> 40º Guadalajara International Film Festival
                        </div>
                        <div>
                          <strong>EUA:</strong> 51º Seattle International Film Festival
                        </div>
                      </div>
                    </div>

                    {/* Container de Prêmios */}
                    <div className="flex-shrink-0 mt-auto" style={{ marginTop: 'clamp(20px, 3vh, 40px)' }}>
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        PRÊMIOS
                      </div>
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.5,
                          color: 'white',
                          maxWidth: '180px',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          Melhor Filme (Young Audience Award) — 43º Festival de Cinema do Uruguai
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          Menção Especial do Júri — 51º Seattle International Film Festival
                        </div>
                        <div>
                          Outstanding First Feature (Jury Prize) — Frameline49
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção - AS MIÇANGAS */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
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
                  <div className="md:col-span-7 flex flex-col h-full" style={{ overflow: 'visible' }}>
                    {/* Container de Informações Técnicas (topo) */}
                    <div className="flex-shrink-0">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(9px, 0.75vw, 11px)',
                          lineHeight: 1.4,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          FAC-DF
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Edital Cardume
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Distribuição: Agência Freak / Moveo Filmes
                        </div>
                        <div>
                          Produção: Moveo Filmes
                        </div>
                      </div>
                    </div>

                    {/* Container do Título (base) */}
                    <div className="flex flex-col justify-start mt-auto" style={{ paddingBottom: '4vh' }}>
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                          fontSize: FONT_LARGE,
                          lineHeight: '0.95',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          marginBottom: 'clamp(6px, 0.8vh, 12px)',
                          color: 'white',
                        }}
                      >
                        As Miçangas
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
                        (2023)
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Estreias (base) */}
                  <div className="md:col-span-5 flex flex-col h-full justify-end" style={{ overflow: 'visible' }}>
                    {/* Container de Estreias */}
                    <div className="flex-shrink-0 mt-auto">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        ESTREIAS
                      </div>
                      <div
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.5,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Mundial:</strong> 73ª Berlinale
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Asiática:</strong> 47ª Hong Kong
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Latino:</strong> 41º Uruguay
                        </div>
                        <div>
                          <strong>EUA:</strong> 29º Palm Springs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção - O Mistério da Carne */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
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
                    <div className="flex flex-col justify-start">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                          fontSize: FONT_LARGE,
                          lineHeight: '0.95',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          marginBottom: 'clamp(6px, 0.8vh, 12px)',
                          color: 'white',
                        }}
                      >
                        O Mistério da Carne
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
                    <div className="flex-shrink-0 mt-auto">
                      <div
                        className="mix-blend-difference"
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
                          1º Edital de Curtas da Cardume
                        </div>
                        <div style={{ marginBottom: 'clamp(4px, 0.6vh, 8px)' }}>
                          Distribuição: Agência Freak (Mundo) e Moveo Filmes (Brasil)
                        </div>
                        <div>
                          Produção: Moveo Filmes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Estreias e Prêmios */}
                  <div className="md:col-span-5 flex flex-col h-full min-h-0 justify-between" style={{ overflow: 'visible' }}>
                    {/* Container de Prêmios (topo) */}
                    <div className="flex-shrink-0">
                      <div
                        className="mix-blend-difference"
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_MEDIUM,
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        PRÊMIOS
                      </div>
                      <div
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: FONT_SMALL,
                          lineHeight: 1.5,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          Melhor Filme — Biarritz Amérique Latine
                        </div>
                        <div>
                          Melhor Filme — New Directors / New Films
                        </div>
                      </div>
                    </div>

                    {/* Container de Estreias (base) */}
                    <div className="flex-shrink-0 mt-auto">
                      <div
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(11px, 0.95vw, 14px)',
                          fontWeight: 'bold',
                          marginBottom: 'clamp(12px, 1.5vh, 18px)',
                          color: 'white',
                          letterSpacing: '0.5px',
                        }}
                      >
                        ESTREIAS
                      </div>
                      <div
                        style={{
                          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                          fontSize: 'clamp(10px, 0.85vw, 13px)',
                          lineHeight: 1.5,
                          color: 'white',
                        }}
                      >
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Mundial:</strong> Sundance Film Festival (2019)
                        </div>
                        <div style={{ marginBottom: 'clamp(8px, 1vh, 12px)' }}>
                          <strong>Europa:</strong> Biarritz Amérique Latine
                        </div>
                        <div>
                          <strong>EUA:</strong> New Directors / New Films
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
        <section className="relative w-full h-full" style={{ height: '100%', overflow: 'visible' }}>
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
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(48px, 6vw, 96px)',
                      letterSpacing: '-0.02em',
                      lineHeight: '0.9',
                      marginLeft: '25px',
                    }}
                  >
                    CATÁLOGO
                  </h3>
                </div>

                {/* Bloco horizontal superior largo */}
                <div
                  className="col-span-7 row-span-2 bg-transparent p-4 md:p-8 flex items-end justify-start min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <h2
                    className="font-black tracking-tight text-white"
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
                <div className="col-span-3 row-span-3 bg-[#1f1f1f] min-h-0 relative overflow-hidden">
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
                  <div>
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

                {/* Bloco vertical médio */}
                <div className="col-span-2 row-span-4 bg-transparent min-h-0">
                  <p className="font-light text-sm leading-relaxed text-white" style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif" }}>
                    {""}
                  </p>
                </div>

                {/* Quadrado inferior esquerdo */}
                <div
                  className="col-span-3 row-span-3 bg-transparent p-4 md:p-6 flex items-end min-h-0"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-bold mix-blend-difference"
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
                <div className="col-span-2 row-span-3 bg-[#1f1f1f] min-h-0 relative overflow-hidden">
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
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: FONT_MEDIUM,
                      letterSpacing: '-0.02em',
                      lineHeight: '1.1',
                    }}
                  >
                    EXPLORAR ARQUIVO NA ÍNTEGRA {'>>>>'}
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
        <section className="relative w-full h-full" style={{ height: '100%', overflow: 'visible' }}>
          <div className="w-full h-full p-[50px] box-border" style={{ overflow: 'visible' }}>
            <div className="w-full h-full relative" style={{ overflow: 'visible' }}>
              <div className="grid grid-cols-12 grid-rows-8 gap-4 md:gap-6 h-full min-h-0" style={{ overflow: 'visible' }}>
                {/* Coluna imagem esquerda */}
                <div className="col-span-2 row-span-8 relative overflow-hidden">
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
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontWeight: 500,
                      fontSize: FONT_HUGE,
                      lineHeight: '0.9',
                    }}
                  >
                    ALÉM<br />DOS FILMES
                  </h1>
                  <Link
                    href="/catalogo/mostras-e-exposicoes"
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-white/40 hover:border-white transition-colors uppercase"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      letterSpacing: '0.08em',
                    }}
                  >
                    Ver arquivo completo
                  </Link>
                </div>

                {/* Bloco secundário - ARQUIVO MOVEO */}
                <div
                  className="col-start-9 col-span-3 row-span-3 bg-black p-6 flex items-end justify-start min-h-0"
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-light leading-tight mix-blend-difference"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_MEDIUM,
                      lineHeight: '1.1',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    ARQUIVO<br />MOVEO
                  </p>
                </div>

                {/* Texto descritivo compacto */}
                <div
                  className="col-start-3 col-span-4 row-start-6 row-span-3 bg-black p-6 md:p-8 flex items-start justify-start min-h-0"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <p
                    className="text-white font-light leading-relaxed mix-blend-difference"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                      fontSize: FONT_SMALL,
                      lineHeight: '1.4',
                      maxWidth: '24ch',
                      textAlign: 'justify',
                    }}
                  >
                    mostras, exposições e outros projetos especiais dos quais fizemos parte
                  </p>
                </div>

                {/* Imagens à direita */}
                <div className="col-start-8 col-span-4 row-start-1 row-span-3 relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 10.png"
                    alt="Arquivo móvel imagem 1"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="col-start-8 col-span-4 row-start-3 row-span-3 relative overflow-hidden">
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
                        aria-label={`Ir para notícia ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-y-0 right-0 flex flex-col justify-center gap-4 p-4 z-20">
                    <button
                      onClick={() => setNewsIndex((prev) => (prev - 1 + newsSlides.length) % newsSlides.length)}
                      className="h-10 w-10 border border-white/30 hover:border-white transition-colors"
                      aria-label="Notícia anterior"
                    >
                      <span className="sr-only">Anterior</span>
                    </button>
                    <button
                      onClick={() => setNewsIndex((prev) => (prev + 1) % newsSlides.length)}
                      className="h-10 w-10 border border-white/30 hover:border-white transition-colors"
                      aria-label="Próxima notícia"
                    >
                      <span className="sr-only">Próxima</span>
                    </button>
                  </div>
                </div>

                {/* Lateral minimalista */}
                <div className="col-span-4 row-span-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2
                      className="text-white uppercase"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontWeight: 700,
                        fontSize: FONT_LARGE,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Notícias
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
                      Ver página
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <p
                      className="text-white font-bold uppercase"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_MEDIUM,
                        lineHeight: '1.1',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Lorem ipsum
                    </p>
                    <p
                      className="text-white opacity-80"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        lineHeight: '1.6',
                      }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae sem in sapien sodales tempor non ut justo.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden h-32">
                      <Image
                        src="/imagens/secao2home/Rectangle 11.png"
                        alt="Capa notícias 1"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="relative overflow-hidden h-32">
                      <Image
                        src="/imagens/secao2home/Rectangle 8.png"
                        alt="Capa notícias 2"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <p
                      className="text-white"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        letterSpacing: '0.06em',
                      }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                    <div className="flex gap-3">
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
          </div>
        </section>
      </div>

      {/* Seção - CONTATO / FOOTER */}
      <div
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
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contato"
                className="px-5 py-3 border border-white/50 hover:border-white transition-colors uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_SMALL,
                  letterSpacing: '0.08em',
                }}
              >
                Ir para contato
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
              Produtora boutique de filmes independentes — Brasília, desde 2018.
            </p>
          </div>

          <div className="md:col-span-5 relative h-48 md:h-full overflow-hidden rounded">
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
