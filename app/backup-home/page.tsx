'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from '../components/MainLayout';
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

export default function BackupHome() {
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
  const horizontalReverseWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalReverseTrackRef = useRef<HTMLDivElement>(null);
  const verticalReverseWrapperRef = useRef<HTMLDivElement>(null);
  const verticalReverseContentRef = useRef<HTMLDivElement>(null);
  const infiniteLoopTriggerRef = useRef<HTMLDivElement>(null);

  const centerTop = `calc(${getHorizontalLinePosition('E')} + (${getHorizontalLinePosition('F')} - ${getHorizontalLinePosition('E')}) / 2)`;
  const centerLeft = `calc(${getMarkerPosition(7)} + (${getMarkerPosition(8)} - ${getMarkerPosition(7)}) / 2)`;

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

    const ctx = gsap.context(() => {
      // Garantir que wrapper e track estejam em estado limpo antes de começar
      gsap.set([wrapper, track], { clearProps: 'all' });
      gsap.set(track, { x: 0 });

      const scrollTriggerInstance = gsap.to(track, {
        x: () => -(track.scrollWidth - wrapper.offsetWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 50px',
          end: () => `+=${track.scrollWidth + window.innerHeight}`,
          scrub: 0.5,
          pin: true,
          pinType: 'transform',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Atualizar indicador de progresso
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
              indicator.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

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

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  // ScrollTrigger para seção 6 - Horizontal Reverso
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!horizontalReverseWrapperRef.current || !horizontalReverseTrackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = horizontalReverseWrapperRef.current;
    const track = horizontalReverseTrackRef.current;

    // Aguardar um pouco para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Limpar qualquer transformação anterior
        gsap.set(track, { clearProps: 'all' });
        
        // Posicionar o track na extrema direita inicialmente
        const scrollDistance = track.scrollWidth - wrapper.offsetWidth;
        gsap.set(track, { x: -scrollDistance });

        console.log('Seção 6 - Track width:', track.scrollWidth);
        console.log('Seção 6 - Wrapper width:', wrapper.offsetWidth);
        console.log('Seção 6 - Scroll distance:', scrollDistance);

        gsap.to(track, {
          x: 0, // Move para a esquerda (mostrando o conteúdo da direita)
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${scrollDistance * 2}`,
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Forçar atualização
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, horizontalReverseWrapperRef);

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

  // Scroll infinito - retorna ao topo após a seção 7
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!infiniteLoopTriggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = infiniteLoopTriggerRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top center',
        onEnter: () => {
          // Scroll suave de volta ao topo
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        },
      });
    }, infiniteLoopTriggerRef);

    return () => {
      ctx.revert();
    };
  }, []);

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
    if (pathname === '/backup-home') {
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
    if (pathname === '/backup-home') {
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
              data-animate
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
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            {/* Container do título vertical */}
            <div
              className="absolute"
              style={{
                left: getMarkerPosition(2),
                width: getWidthBetweenMarkers(2, 4),
                top: getHeightBetweenLines('B', 'B'),
                height: getHeightBetweenLines('B', 'H'),
              }}
            >
              <div
                className="absolute uppercase"
                style={{
                  left: `calc(${getWidthBetweenMarkers(2, 4)} + 0.7vw)`,
                  top: getHeightBetweenLines('B', 'C'),
                  transformOrigin: 'top left',
                  transform: 'rotate(-90deg) translateX(-102%) translateY(-17.8%)',
                  fontSize: 'clamp(80px, calc((100vh - 100px) * 0.178), 140px)',
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

            {/* Container 1: 3 colunas x 8 rows */}
            <div
              className="absolute"
              style={{
                left: getMarkerPosition(6),
                width: getWidthBetweenMarkers(6, 9),
                top: getHeightBetweenLines('B', 'C'),
                height: getHeightBetweenLines('C', 'J'),
              }}
            >
              {/* Imagem 1: Close-up de olhos (coluna 1, rows 1-2) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 0,
                  top: 0,
                  width: 'calc(100% / 3)',
                  height: 'calc(100% / 8 * 2)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="Close-up de olhos"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 2: Criança com cabelo cacheado (coluna 2, rows 1-2) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 'calc(100% / 3)',
                  top: 0,
                  width: 'calc(100% / 3)',
                  height: 'calc(100% / 8 * 2)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 9.png"
                  alt="Criança com cabelo cacheado"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 3: Duas meninas (coluna 1, rows 3-6) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 0,
                  top: 'calc(100% / 8 * 2)',
                  width: 'calc(100% / 3)',
                  height: 'calc(100% / 8 * 4)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="Duas meninas"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 4: Faixa horizontal (coluna 2-3, rows 3-4) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 'calc(100% / 3)',
                  top: 'calc(100% / 8 * 2)',
                  width: 'calc(100% / 3 * 2)',
                  height: 'calc(100% / 8 * 2)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 11.png"
                  alt="Faixa horizontal"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 5: Mulher e criança (coluna 1, rows 7-8) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 0,
                  top: 'calc(100% / 8 * 6)',
                  width: 'calc(100% / 3)',
                  height: 'calc(100% / 8 * 2)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 12.png"
                  alt="Mulher e criança"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 6: Paisagem (colunas 2-3, rows 5-8) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: 'calc(100% / 3)',
                  top: 'calc(100% / 8 * 4)',
                  width: 'calc(100% / 3 * 2)',
                  height: 'calc(100% / 8 * 4)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="Paisagem"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Container 2: 4 colunas x 8 rows */}
            <div
              className="absolute"
              style={{
                left: getMarkerPosition(10),
                width: getWidthBetweenMarkers(10, 14),
                top: getHeightBetweenLines('B', 'C'),
                height: getHeightBetweenLines('C', 'J'),
              }}
            >
              {/* Texto 1: "Filmes de arte para o mercado internacional" */}
              <div
                className="absolute text-white z-10"
                style={{
                  left: 0,
                  top: 0,
                  width: '50%',
                  height: 'calc(100% / 8 * 1.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(16px, 1.5vw, 22px)',
                  lineHeight: '1.4',
                  padding: 'clamp(6px, 0.6vw, 10px)',
                }}
              >
                <div>Filmes de arte</div>
                <div>para o mercado</div>
                <div>internacional</div>
              </div>

              {/* Imagem 7: lado direito do Texto 1 (colunas 3-4, rows 1-1.5) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: '50%',
                  top: 0,
                  width: '50%',
                  height: 'calc(100% / 8 * 1.5)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="Imagem decorativa 1"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Texto 2: "Focado em promissores cineastas brasileiros" */}
              <div
                className="absolute text-white z-10"
                style={{
                  left: 0,
                  top: 'calc(100% / 8 * 2)',
                  width: '50%',
                  height: 'calc(100% / 8 * 4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 2.3vw, 40px)',
                  lineHeight: '1.2',
                  padding: 'clamp(6px, 0.6vw, 10px)',
                }}
              >
                <div>Focado em</div>
                <div>promissores</div>
                <div>cineastas</div>
                <div>brasileiros</div>
              </div>

              {/* Imagem 8: lado direito do Texto 2 (colunas 3-4, rows 3-6) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: '50%',
                  top: 'calc(100% / 8 * 2)',
                  width: '50%',
                  height: 'calc(100% / 8 * 4)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="Imagem decorativa 2"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Texto 3: "Brasília, desde 2018" */}
              <div
                className="absolute text-white z-10"
                style={{
                  left: 0,
                  bottom: 0,
                  width: '50%',
                  height: 'calc(100% / 8 * 2)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(12px, 1vw, 16px)',
                  lineHeight: '1.4',
                  padding: 'clamp(6px, 0.6vw, 10px)',
                }}
              >
                Brasília, desde 2018
              </div>

              {/* Imagem 9: lado direito do Texto 3 (colunas 3-4, rows 7-8) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: '50%',
                  top: 'calc(100% / 8 * 6)',
                  width: '50%',
                  height: 'calc(100% / 8 * 2)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="Imagem decorativa 3"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </section>

          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' }}
          >
            {/* Bloco grande à esquerda */}
            <div
              className="absolute"
              style={{
                left: 0,
                width: getWidthBetweenMarkers(1, 12),
                top: getHeightBetweenLines('A', 'B'),
                bottom: getHeightBetweenLines('I', 'J'),
              }}
            >
              {/* Título principal no topo */}
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 2.3vw, 40px)',
                  lineHeight: '1.2',
                  marginBottom: 'clamp(20px, 2vh, 40px)',
                }}
              >
                Um histórico sólido de colaborações
                <br />
                com talentos emergentes
              </div>

              {/* Layout Criativo - Imagens em composição assimétrica */}
              
              {/* Imagem 1 - Topo Esquerdo (pequena) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(1),
                  top: getHeightBetweenLines('B', 'D'),
                  width: getWidthBetweenMarkers(1, 4),
                  height: getHeightBetweenLines('B', 'D'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="Destaques 1"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 2 - Centro Esquerdo (vertical) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(4),
                  top: getHeightBetweenLines('B', 'F'),
                  width: getWidthBetweenMarkers(4, 6),
                  height: getHeightBetweenLines('B', 'F'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 9.png"
                  alt="Destaques 2"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 3 - Centro (horizontal) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(6),
                  top: getHeightBetweenLines('D', 'F'),
                  width: getWidthBetweenMarkers(6, 9),
                  height: getHeightBetweenLines('D', 'F'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="Destaques 3"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 4 - Topo Direito (pequena) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(9),
                  top: getHeightBetweenLines('B', 'D'),
                  width: getWidthBetweenMarkers(9, 12),
                  height: getHeightBetweenLines('B', 'D'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 11.png"
                  alt="Destaques 4"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 5 - Centro Direito (grande vertical) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(9),
                  top: getHeightBetweenLines('D', 'G'),
                  width: getWidthBetweenMarkers(9, 12),
                  height: getHeightBetweenLines('D', 'G'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="Destaques 5"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 6 - Inferior Esquerdo (horizontal) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(1),
                  top: getHeightBetweenLines('F', 'I'),
                  width: getWidthBetweenMarkers(1, 6),
                  height: getHeightBetweenLines('F', 'I'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 12.png"
                  alt="Destaques 6"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 7 - Inferior Direito (pequena) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(6),
                  top: getHeightBetweenLines('F', 'H'),
                  width: getWidthBetweenMarkers(6, 9),
                  height: getHeightBetweenLines('F', 'H'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="Destaques 7"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Imagem 8 - Inferior Direito (pequena) */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: getMarkerPosition(9),
                  top: getHeightBetweenLines('G', 'I'),
                  width: getWidthBetweenMarkers(9, 12),
                  height: getHeightBetweenLines('G', 'I'),
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 9.png"
                  alt="Destaques 8"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

            </div>

            

            {/* Composição de Imagens acima do título "DESTAQUES" - Alinhadas ao grid */}
            
            {/* Imagem 1 - Topo, linha C-D, largura de 1 coluna do grid */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: `calc(${getMarkerPosition(13)} + 32%)`,
                top: getHorizontalLinePosition('B'),
                width: `calc((100% - 100px) / 13)`,
                height: getHeightBetweenLines('C', 'D'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 8.png"
                alt="Destaques Composição 1"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Imagem 2 - Topo, vertical, linha C-E, largura de 1 coluna */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: `calc(${getMarkerPosition(13)} + 32%)`,
                top: getHorizontalLinePosition('C'),
                width: `calc((100% - 100px) / 13)`,
                height: getHeightBetweenLines('C', 'E'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 12.png"
                alt="Destaques Composição 2"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Imagem 3 - Centro, vertical média, linha D-F, largura de 1 coluna */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: `calc(${getMarkerPosition(13)} + 32%)`,
                top: getHorizontalLinePosition('D'),
                width: `calc((100% - 100px) / 13)`,
                height: getHeightBetweenLines('D', 'F'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 10.png"
                alt="Destaques Composição 3"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Imagem 4 - Centro, pequena, linha E-F, largura de 1 coluna */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: `calc(${getMarkerPosition(13)} + (100% - 100px) / 13)`,
                top: getHorizontalLinePosition('E'),
                width: `calc((100% - 100px) / 13)`,
                height: getHeightBetweenLines('E', 'F'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 9.png"
                alt="Destaques Composição 4"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Imagem 5 - Acima do título, horizontal, linha F-G, largura de 2 colunas */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: getMarkerPosition(13),
                top: getHorizontalLinePosition('F'),
                width: `calc((100% - 100px) / 13 * 2)`,
                height: getHeightBetweenLines('F', 'G'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 11.png"
                alt="Destaques Composição 5"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Título "Destaques" - Alinhado à linha vertical 13, centralizado verticalmente entre H e I, ultrapassando o container */}
            <div
              className="absolute"
              style={{
                left: `calc(${getMarkerPosition(14)} - 8%)`,
                top: `calc(${getHorizontalLinePosition('F')}  - 22%) `,
                transform: 'translateY(-75%)',
                fontFamily: "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(60px, 4vw, 200px)',
                lineHeight: '.85',
                
                letterSpacing: '-0.02em',
                color: 'white',
                textTransform: 'uppercase',
              }}
            >
              Filmes <span style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif" }}>destaque</span> do nosso catálogo
            </div>
          </section>
        </div>
      </div>

      {/* Nova Seção - A Natureza das Coisas Invisíveis */}
      <div
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          minHeight: '100vh',
        }}
      >
        <section className="relative" style={{ height: '100vh' }}>
          {/* Container principal */}
          <div
            className="absolute"
            style={{
              left: getMarkerPosition(1),
              width: getWidthBetweenMarkers(1, 14),
              top: getHeightBetweenLines('B', 'D'),
              bottom: getHeightBetweenLines('I', 'J'),
            }}
          >
            {/* Título - Canto Superior Esquerdo */}
            <div
              className="absolute"
              style={{
                left: 0,
                top: 0,
                width: getWidthBetweenMarkers(1, 9),
              }}
            >
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 80px)',
                  lineHeight: '1',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: 'clamp(8px, 1vh, 16px)',
                  color: 'white',
                }}
              >
                A Natureza das Coisas Invisíveis
              </div>
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(28px, 3vw, 48px)',
                  lineHeight: '1',
                  opacity: 0.7,
                  color: 'white',
                }}
              >
                (2015)
              </div>
            </div>

            {/* Coluna 1 - Esquerda: Informações Técnicas (Canto Inferior) */}
            <div
              className="absolute"
              style={{
                left: 0,
                bottom: 0,
                width: getWidthBetweenMarkers(1, 5),
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(9px, 0.75vw, 11px)',
                lineHeight: 1.4,
                color: 'white',
              }}
            >
              <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                Coprodução Brasil-Chile
              </div>
              <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                Distribuição: Vitrine Filmes (Brasil) e The Open Reel (Internacional)
              </div>
              <div style={{ marginBottom: 'clamp(6px, 0.8vh, 10px)' }}>
                Lançamento no Brasil: 27/11/2025
              </div>
              <div>
                Produção: Moveo Filmes
              </div>
            </div>

            {/* Coluna 3 - Direita: Estreias e Prêmios */}
            <div
              className="absolute"
              style={{
                left: getMarkerPosition(12),
                top: 0,
                width: getWidthBetweenMarkers(12, 14),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* ESTREIAS */}
              <div>
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(11px, 0.95vw, 14px)',
                    fontWeight: 'bold',
                    marginBottom: 'clamp(15px, 1.8vh, 22px)',
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
                    lineHeight: 1.6,
                    color: 'white',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(10px, 1.2vh, 15px)' }}>
                    <strong>Mundial:</strong> 75ª Berlinale (Generation KPlus, Filme de Abertura)
                  </div>
                  <div style={{ marginBottom: 'clamp(10px, 1.2vh, 15px)' }}>
                    <strong>Colômbia:</strong> 64º Cartagena International Film Festival
                  </div>
                  <div style={{ marginBottom: 'clamp(10px, 1.2vh, 15px)' }}>
                    <strong>México:</strong> 40º Guadalajara International Film Festival
                  </div>
                  <div>
                    <strong>EUA:</strong> 51º Seattle International Film Festival
                  </div>
                </div>
              </div>

              {/* PRÊMIOS */}
              <div style={{ marginTop: 'clamp(30px, 4vh, 50px)' }}>
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(11px, 0.95vw, 14px)',
                    fontWeight: 'bold',
                    marginBottom: 'clamp(15px, 1.8vh, 22px)',
                    color: 'white',
                    letterSpacing: '0.5px',
                  }}
                >
                  PRÊMIOS
                </div>
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(10px, 0.85vw, 13px)',
                    lineHeight: 1.6,
                    color: 'white',
                  }}
                >
                  <div style={{ marginBottom: 'clamp(10px, 1.2vh, 15px)' }}>
                    Melhor Filme (Young Audience Award) — 43º Festival de Cinema do Uruguai
                  </div>
                  <div style={{ marginBottom: 'clamp(10px, 1.2vh, 15px)' }}>
                    Menção Especial do Júri — 51º Seattle International Film Festival
                  </div>
                  <div>
                    Outstanding First Feature (Jury Prize) — Frameline49
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção 4 - As Miçangas */}
      <div
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          minHeight: '100vh',
        }}
      >
        <section className="relative" style={{ height: '100vh' }}>
          {/* Container principal */}
          <div
            className="absolute"
            style={{
              left: getMarkerPosition(1),
              width: getWidthBetweenMarkers(1, 14),
              top: getHeightBetweenLines('B', 'D'),
              bottom: getHeightBetweenLines('I', 'J'),
            }}
          >
            {/* Imagem Hero Grande - Lado Esquerdo */}
            <div
              className="relative overflow-hidden"
              style={{
                position: 'absolute',
                left: getMarkerPosition(1),
                top: 0,
                width: getWidthBetweenMarkers(1, 8),
                height: getHeightBetweenLines('B', 'G'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 122.png"
                alt="As Miçangas - Hero"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Título Sobreposto - Grande e Ousado */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(1),
                bottom: `calc(${getHeightBetweenLines('I', 'J')} - ${getHeightBetweenLines('B', 'D')})`,
                width: getWidthBetweenMarkers(1, 10),
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(50px, 7vw, 110px)',
                  lineHeight: '0.9',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'white',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                As Miçangas
              </div>
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(28px, 4vw, 56px)',
                  lineHeight: '1',
                  opacity: 0.9,
                  marginTop: 'clamp(10px, 1.5vh, 20px)',
                  color: 'white',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                (2023)
              </div>
            </div>

            {/* Grid de Imagens Pequenas - Canto Superior Direito */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(9),
                top: 0,
                width: getWidthBetweenMarkers(9, 14),
                height: getHeightBetweenLines('B', 'E'),
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: 'clamp(6px, 0.6vw, 10px)',
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="As Miçangas - 1"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 9.png"
                  alt="As Miçangas - 2"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="As Miçangas - 3"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 11.png"
                  alt="As Miçangas - 4"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 12.png"
                  alt="As Miçangas - 5"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="As Miçangas - 6"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Bloco Texto Diretores - Flutuante */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(9),
                top: `calc(${getHeightBetweenLines('B', 'E')} + clamp(30px, 3vh, 50px))`,
                width: getWidthBetweenMarkers(9, 14),
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(12px, 1.1vw, 16px)',
                lineHeight: '1.6',
                opacity: 0.9,
              }}
            >
              Dirigido por Rafaela Camelo e Emanuel Lavor, &ldquo;As Miçangas&rdquo; nasce do encontro entre duas vozes sensíveis do cinema contemporâneo.
            </div>

            {/* Festivais - Coluna Direita */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(9),
                top: `calc(${getHeightBetweenLines('B', 'F')} + clamp(10px, 1vh, 20px))`,
                width: getWidthBetweenMarkers(9, 12),
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(10px, 0.85vw, 13px)',
                lineHeight: '1.5',
                opacity: 0.8,
              }}
            >
              <div style={{ 
                marginBottom: 'clamp(16px, 2vh, 24px)',
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                fontSize: 'clamp(11px, 0.95vw, 14px)',
                opacity: 0.9,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Estreias
              </div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                <span style={{ opacity: 0.6 }}>Mundial:</span> 73ª Berlinale
              </div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                <span style={{ opacity: 0.6 }}>Asiática:</span> 47ª Hong Kong
              </div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                <span style={{ opacity: 0.6 }}>Latino:</span> 41º Uruguay
              </div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                <span style={{ opacity: 0.6 }}>EUA:</span> 29º Palm Springs
              </div>
            </div>

            {/* Informações Técnicas - Coluna Direita, Abaixo */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(12),
                top: `calc(${getHeightBetweenLines('B', 'F')} + clamp(10px, 1vh, 20px))`,
                width: getWidthBetweenMarkers(12, 14),
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(9px, 0.75vw, 11px)',
                lineHeight: '1.5',
                opacity: 0.7,
              }}
            >
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>FAC-DF</div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                Edital Cardume
              </div>
              <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                Agência Freak / Moveo Filmes
              </div>
              <div>
                Moveo Filmes
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Seção 5 - O Mistério da Carne */}
      <div
        className="relative bg-black text-white"
        style={{
          marginLeft: '50px',
          marginRight: '50px',
          marginBottom: '50px',
          minHeight: '100vh',
        }}
      >
        <section className="relative" style={{ height: '100vh' }}>
          {/* Container principal com 3 colunas */}
          <div
            className="absolute"
            style={{
              left: getMarkerPosition(1),
              width: getWidthBetweenMarkers(1, 14),
              top: getHeightBetweenLines('B', 'D'),
              bottom: getHeightBetweenLines('I', 'J'),
              display: 'flex',
              gap: 'clamp(20px, 2vw, 40px)',
            }}
          >
            {/* Coluna 1 - Esquerda (texto diretores + imagem + festivais + prêmios) */}
            <div
              style={{
                flex: '0 0 calc(32% - 13.33px)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(10px, 0.85vw, 13px)',
                lineHeight: '1.5',
                opacity: 0.8,
              }}
            >
              {/* Texto sobre os diretores */}
              <div style={{ marginBottom: 'clamp(20px, 2.5vh, 30px)' }}>
                <div style={{ 
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(12px, 1vw, 15px)',
                  lineHeight: '1.6',
                  opacity: 1,
                }}>
                  Dirigido e roteirizado por Rafaela Camelo, &ldquo;O Mistério da Carne&rdquo; marca um momento decisivo em sua trajetória, revelando um cinema atento aos corpos e aos desejos que os atravessam.
                </div>
              </div>

              {/* Imagem */}
              <div 
                className="relative overflow-hidden"
                style={{ 
                  width: '100%',
                  flex: '0 0 auto',
                  height: 'clamp(180px, 22vh, 250px)',
                  marginBottom: 'clamp(20px, 2.5vh, 30px)',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="O Mistério da Carne - Destaque"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Festivais */}
              <div style={{ marginBottom: 'clamp(20px, 2.5vh, 30px)' }}>
                <div style={{ 
                  marginBottom: 'clamp(16px, 2vh, 24px)',
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(11px, 0.95vw, 14px)',
                  opacity: 0.9,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Estreias
                </div>
                <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                  <span style={{ opacity: 0.6 }}>Mundial:</span> Sundance Film Festival (2019)
                </div>
                <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                  <span style={{ opacity: 0.6 }}>Europa:</span> Biarritz Amérique Latine
                </div>
                <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                  <span style={{ opacity: 0.6 }}>EUA:</span> New Directors / New Films
                </div>
              </div>

              {/* Prêmios */}
              <div>
                <div style={{ 
                  marginBottom: 'clamp(16px, 2vh, 24px)',
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(11px, 0.95vw, 14px)',
                  opacity: 0.9,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Prêmios
                </div>
                <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                  Melhor Filme — Biarritz Amérique Latine
                </div>
                <div style={{ marginBottom: 'clamp(10px, 1.2vh, 14px)' }}>
                  Melhor Filme — New Directors / New Films
                </div>
              </div>
            </div>

            {/* Coluna 2 - Central (título) */}
            <div
              style={{
                flex: '0 0 calc(34% - 13.33px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(40px, 5vw, 80px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: 'clamp(8px, 1vh, 16px)',
                  }}
                >
                  O Mistério da Carne
                </div>
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(28px, 3vw, 48px)',
                    lineHeight: '1',
                    opacity: 0.7,
                  }}
                >
                  (2019)
                </div>
              </div>
            </div>

            {/* Coluna 3 - Direita (grid + informações técnicas) */}
            <div
              style={{
                flex: '0 0 calc(34% - 13.33px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Grid de imagens - 3 colunas x 2 linhas */}
              <div
                style={{
                  flex: '1 1 auto',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 'clamp(6px, 0.6vw, 10px)',
                  marginBottom: 'clamp(20px, 2.5vh, 30px)',
                }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 8.png"
                    alt="O Mistério da Carne - Imagem 1"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 9.png"
                    alt="O Mistério da Carne - Imagem 2"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 10.png"
                    alt="O Mistério da Carne - Imagem 3"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 11.png"
                    alt="O Mistério da Carne - Imagem 4"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 12.png"
                    alt="O Mistério da Carne - Imagem 5"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative overflow-hidden">
                  <Image
                    src="/imagens/secao2home/Rectangle 122.png"
                    alt="O Mistério da Carne - Imagem 6"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Informações Técnicas */}
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(10px, 0.85vw, 13px)',
                  lineHeight: '1.5',
                  opacity: 0.8,
                }}
              >
                <div style={{ marginBottom: 'clamp(12px, 1.5vh, 18px)' }}>FAC-DF</div>
                <div style={{ marginBottom: 'clamp(12px, 1.5vh, 18px)' }}>
                  1º Edital de Curtas da Cardume
                </div>
                <div style={{ marginBottom: 'clamp(12px, 1.5vh, 18px)' }}>
                  Distribuição: Agência Freak
                  <br />
                  (Mundo) e Moveo Filmes (Brasil)
                </div>
                <div>
                  Produção: Moveo Filmes
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção 6 - Scroll Horizontal Reverso (CATÁLOGO, CINEMA, OUTROS) */}
      <div
        ref={horizontalReverseWrapperRef}
        className="relative bg-black"
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          ref={horizontalReverseTrackRef}
          className="flex h-full will-change-transform"
          style={{ 
            width: 'max-content',
          }}
        >
          {/* Container 1 - OUTROS (Menor Prioridade - aparece primeiro no scroll reverso) */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ 
              width: 'calc(100vw - 100px)', 
              height: 'calc(100vh - 100px)',
              margin: '50px',
            }}
          >
            {/* MOVEO FILMES + Imagem */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: getHeightBetweenLines('B', 'B'),
                width: getWidthBetweenMarkers(10, 14),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(18px, 1.8vw, 28px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'rgba(212, 175, 55, 1)',
                    opacity: 0.9,
                  }}
                >
                  MOVEO FILMES
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(11px, 0.9vw, 14px)',
                  opacity: 0.6,
                  marginBottom: '20px',
                }}
              >
                COMPANY PROFILE
              </div>
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  position: 'relative',
                }}
              >
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="Company Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Título OUTROS - Menor */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: getHeightBetweenLines('D', 'E'),
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(50px, 6vw, 100px)',
                lineHeight: '0.9',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                opacity: 0.8,
              }}
            >
              Outros
            </div>

            {/* Texto descritivo */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: getHeightBetweenLines('F', 'G'),
                width: getWidthBetweenMarkers(10, 14),
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(24px, 2.3vw, 40px)',
                lineHeight: '1.2',
                opacity: 0.7,
              }}
            >
              Moveo, além dos filmes: mostras, exposições e outros projetos especiais dos quais fizemos parte.
            </div>

            {/* Imagem inferior */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: getWidthBetweenMarkers(10, 14),
                height: getHeightBetweenLines('H', 'I'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 8.png"
                alt="Outros projetos"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </section>

          {/* Container 2 - CINEMA (Prioridade Média - aparece no meio) */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ 
              width: 'calc(100vw - 100px)', 
              height: 'calc(100vh - 100px)',
              margin: '50px',
            }}
          >
            {/* Título CINEMA - Médio */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(1),
                top: getHorizontalLinePosition('C'),
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(80px, 12vw, 180px)',
                lineHeight: '0.85',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                opacity: 0.9,
              }}
            >
              CINEMA
            </div>

            {/* Texto descritivo */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(1),
                top: getHorizontalLinePosition('F'),
                width: getWidthBetweenMarkers(1, 7),
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(24px, 2.3vw, 40px)',
                lineHeight: '1.2',
                opacity: 0.8,
              }}
            >
              Descubra o acervo de histórias das quais a Moveo faz parte — dos projetos em desenvolvimento aos títulos em distribuição, até filmes que já completaram seu circuito nas telas.
            </div>

            {/* Imagem Grande - Direita */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(8),
                top: getHorizontalLinePosition('B'),
                width: getWidthBetweenMarkers(8, 14),
                height: getHeightBetweenLines('B', 'J'),
              }}
            >
              <Image
                src="/imagens/secao2home/Rectangle 122.png"
                alt="Cinema"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </section>

          {/* Container 3 - CATÁLOGO (Maior Prioridade - aparece por último no scroll reverso) */}
          <section
            className="horizontal-section relative flex-shrink-0 text-white"
            style={{ 
              width: 'calc(100vw - 100px)', 
              height: 'calc(100vh - 100px)',
              margin: '50px',
            }}
          >

            {/* Texto descritivo - Esquerda */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(11),
                top: `calc(${getHorizontalLinePosition('A')} - 30px)`,
                width: getWidthBetweenMarkers(1,5),
                fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(24px, 2.3vw, 40px)',
                lineHeight: '1.2',
                zIndex: 10,
              }}
            >
              Descubra o acervo de histórias das quais a Moveo faz parte — dos projetos em desenvolvimento aos títulos em distribuição, até filmes que já completaram seu circuito nas telas.
            </div>

            {/* Grid de Imagens - Direita */}
            <div
              style={{
                position: 'absolute',
                left: getMarkerPosition(7),
                top: getHorizontalLinePosition('B'),
                width: getWidthBetweenMarkers(7, 14),
                height: getHeightBetweenLines('B', 'J'),
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                gap: 'clamp(8px, 0.8vw, 12px)',
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 10.png"
                  alt="Catálogo 1"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 11.png"
                  alt="Catálogo 2"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 12.png"
                  alt="Catálogo 3"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 8.png"
                  alt="Catálogo 4"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 9.png"
                  alt="Catálogo 5"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/imagens/secao2home/Rectangle 122.png"
                  alt="Catálogo 6"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Seção 7 - Hub de Navegação (Scroll Vertical de Cima para Baixo) */}
      <div
        ref={verticalReverseWrapperRef}
        className="relative bg-black text-white"
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div
          ref={verticalReverseContentRef}
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px',
          }}
        >
          {/* Grid 2x2 de Links */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '20px',
              height: 'calc(100vh - 100px)',
              width: 'calc(100vw - 100px)',
            }}
          >
            {/* Link 1 - Catálogo */}
            <Link
              href="/catalogo"
              className="group relative overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(40px, 5vw, 80px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  CATÁLOGO
                </div>
              </div>
            </Link>

            {/* Link 2 - Sobre */}
            <Link
              href="/sobre"
              className="group relative overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(40px, 5vw, 80px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  SOBRE
                </div>
              </div>
            </Link>

            {/* Link 3 - Notícias */}
            <Link
              href="/noticias"
              className="group relative overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(40px, 5vw, 80px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  NOTÍCIAS
                </div>
              </div>
            </Link>

            {/* Link 4 - Contato */}
            <Link
              href="/contato"
              className="group relative overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(40px, 5vw, 80px)',
                    lineHeight: '1',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  CONTATO
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Gatilho para scroll infinito */}
      <div
        ref={infiniteLoopTriggerRef}
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 'clamp(20px, 2vw, 32px)',
          opacity: 0.3,
        }}
      >
        Retornando ao início...
      </div>
    </MainLayout>
  );
}

