'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from './components/MainLayout';
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
  const [produtoraFontSize, setProdutoraFontSize] = useState<number>(100);
  const produtoraTextRef = useRef<HTMLDivElement>(null);
  const produtoraContainerRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const firstSectionRef = useRef<HTMLElement | null>(null);
  const secondSectionRef = useRef<HTMLElement | null>(null);
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

  // Entrada suave dos elementos da primeira seção
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!firstSectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-first-animate]');
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y: 40 });

      gsap.timeline({
        defaults: { duration: 0.9, ease: 'power2.out' },
        scrollTrigger: {
          trigger: firstSectionRef.current,
          start: 'top top',
          end: '+=300',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      }).to(targets, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.12,
      });
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
      const allTargets = [...imageTargets, ...contentTargets];
      if (!allTargets.length) return;

      gsap.set(allTargets, { autoAlpha: 0 });

      // Pin suave da seção 2 para segurar leitura e animar com espaço
      ScrollTrigger.create({
        trigger: secondSectionRef.current,
        containerAnimation: mainTrackTimelineRef.current || undefined,
        start: 'left 105%',
        end: '+=900',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      imageTargets.forEach((target, index) => {
        const variants = [
          { x: -110, y: 140, rotate: -3 },
          { x: 90, y: 120, rotate: 2.4 },
          { x: 0, y: 150, rotate: 0 },
        ];
        const variant = variants[index % variants.length];

        gsap.fromTo(
          target,
          { autoAlpha: 0, x: variant.x, y: variant.y, scale: 1.18, rotate: variant.rotate, filter: 'blur(10px)' },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'back.out(1.6)',
            delay: index * 0.18,
            scrollTrigger: {
              trigger: target,
              containerAnimation: mainTrackTimelineRef.current || undefined,
              start: 'left 115%',
              end: 'left 35%',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          }
        );
      });

      contentTargets.forEach((target, index) => {
        const variants = [
          { x: -60, y: 110 },
          { x: 60, y: 125 },
          { x: 0, y: 140 },
        ];
        const variant = variants[index % variants.length];

        gsap.fromTo(
          target,
          { autoAlpha: 0, x: variant.x, y: variant.y, scale: 1.1, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'back.out(1.4)',
            delay: index * 0.14,
            scrollTrigger: {
              trigger: target,
              containerAnimation: mainTrackTimelineRef.current || undefined,
              start: 'left 112%',
              end: 'left 40%',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          }
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, secondSectionRef);

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

  // Scroll infinito removido temporariamente

  useEffect(() => {
    if (newsSlides.length <= 1) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [newsSlides.length]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;

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

    const calculateProdutoraFontSize = () => {
      if (!produtoraContainerRef.current || !produtoraTextRef.current || typeof window === 'undefined') return;

      const targetWidth = produtoraContainerRef.current.offsetWidth;
      const targetHeight = produtoraContainerRef.current.offsetHeight;
      if (targetWidth === 0 || targetHeight === 0) return;

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
    };

    const runCalculation = () => {
      rafId = requestAnimationFrame(() => {
        if (
          produtoraContainerRef.current &&
          produtoraContainerRef.current.offsetWidth > 0 &&
          produtoraContainerRef.current.offsetHeight > 0
        ) {
          calculateProdutoraFontSize();

          if (produtoraContainerRef.current && !resizeObserver) {
            resizeObserver = new ResizeObserver(() => {
              calculateProdutoraFontSize();
            });
            resizeObserver.observe(produtoraContainerRef.current);
          }
        } else {
          setTimeout(runCalculation, 10);
        }
      });
    };

    runCalculation();

    const handleResize = () => {
      calculateProdutoraFontSize();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          calculateProdutoraFontSize();
        }, 100);
      }
    };

    const handlePageShow = () => {
      setTimeout(() => {
        calculateProdutoraFontSize();
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
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (

    <MainLayout>
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
              className="absolute text-white uppercase z-30"
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
                className="absolute text-white"
                style={{
                  left: '0',
                  top: '25%',
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: `${produtoraFontSize}px`,
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
              <div className="max-w-7xl mx-auto h-full">
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
                        <div className="bg-transparent rounded-lg p-4 flex items-end justify-start" data-second-animate>
                          <p
                            className="text-white"
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
                      <div className="bg-transparent rounded-lg p-4 md:p-6 flex items-end justify-start" data-second-animate>
                        <p
                          className="text-white"
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
                    <div className="bg-black rounded-lg p-4 md:p-6 lg:p-8 flex items-center justify-center flex-[1] min-h-0" data-second-animate>
                      <div className="text-white uppercase text-center" style={{
                        fontSize: FONT_LARGE,
                        lineHeight: '0.9',
                        letterSpacing: '-0.05em',
                      }}>
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
                          className="text-white"
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
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            <div className="w-full h-full p-[50px] box-border">
              <div className="max-w-7xl mx-auto w-full h-full grid md:grid-cols-2 gap-6">
                {/* Container Esquerdo - Dividido em 3 partes horizontais */}
                <div className="flex flex-col h-full min-h-0">
                  {/* Container Superior */}
                  <div className="flex-1 bg-transparent flex items-end p-4 md:p-6 lg:p-8 min-h-0">
                    <p
                      className="text-white"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontWeight: 700,
                        fontSize: FONT_LARGE,
                        lineHeight: '1.2',
                      }}
                    >
                      Um histórico sólido de colaborações
                      <br />
                      com talentos emergentes
                    </p>
                  </div>

                  {/* Container Central */}
                  <div className="flex-1 bg-transparent flex items-end p-4 md:p-6 lg:p-8 min-h-0">
                    <p
                      className="text-white"
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
                    <div className="relative overflow-hidden rounded-lg">
                      <Image
                        src="/imagens/secao2home/Rectangle 8.png"
                        alt="Imagem 11"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* A3 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-3">
                      <Image
                        src="/imagens/secao2home/Rectangle 9.png"
                        alt="Imagem 12"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* A4 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-4">
                      <Image
                        src="/imagens/secao2home/Rectangle 10.png"
                        alt="Imagem 13"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Container mesclado: A'1, A'2, B1, B2, B'1 e B'2 */}
                    <div className="relative overflow-hidden rounded-lg col-span-2 row-span-3 col-start-1 row-start-2">
                      <Image
                        src="/imagens/secao2home/Rectangle 11.png"
                        alt="Imagem 14"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* B4 */}
                    <div className="relative overflow-hidden rounded-lg row-span-2 col-start-4 row-start-3">
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
                  {/* Container grande mesclado: A1-A4, B1-B4, C1-C4 (12 células) */}
                  <div className="col-span-4 row-span-3 bg-transparent flex items-center justify-center p-4 md:p-6 lg:p-8 col-start-1 row-start-1">
                    <h2
                      className="text-white uppercase text-center"
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
                  <div className="relative overflow-hidden rounded-lg col-start-5 row-start-1">
                    <Image
                      src="/imagens/secao2home/Rectangle 8.png"
                      alt="Imagem 16"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* B5 */}
                  <div className="relative overflow-hidden rounded-lg col-start-5 row-start-2">
                    <Image
                      src="/imagens/secao2home/Rectangle 9.png"
                      alt="Imagem 17"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* C5 e D5 mesclados */}
                  <div className="relative overflow-hidden rounded-lg row-span-2 col-start-5 row-start-3">
                    <Image
                      src="/imagens/secao2home/Rectangle 10.png"
                      alt="Imagem 18"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* D2 */}
                  <div className="relative overflow-hidden rounded-lg col-start-2 row-start-4">
                    <Image
                      src="/imagens/secao2home/Rectangle 11.png"
                      alt="Imagem 19"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* D5 - já mesclado com C5 acima */}

                  {/* E1 e E2 mesclados */}
                  <div className="relative overflow-hidden rounded-lg col-span-2 col-start-1 row-start-5">
                    <Image
                      src="/imagens/secao2home/Rectangle 12.png"
                      alt="Imagem 20"
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

      {/* Nova Seção - Image Carousel com Parallax */}
      <div
        ref={imageCarouselSectionRef}
        className="relative bg-black text-white"
        data-pin-block
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
                    className="text-white font-bold"
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
                    className="text-white font-bold"
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
                    className="font-black tracking-tighter leading-none text-white"
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
                    className="text-white font-light leading-tight"
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
                    className="text-white font-light leading-relaxed"
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
                        <div className="absolute top-5 left-5 flex items-center gap-3 z-10">
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
                            className="text-white font-bold"
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
                            className="text-white"
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
