'use client';

import { useLayoutEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// MAGNETIC CURSOR EFFECT
// ============================================
export function useMagneticElements() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const magneticElements = Array.from(document.querySelectorAll('[data-magnetic]')) as HTMLElement[];
    if (!magneticElements.length) return;
    
    const handleMouseMove = (e: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;
      
      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = (el: HTMLElement) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    const ctx = gsap.context(() => {
      magneticElements.forEach((element) => {
        element.addEventListener('mousemove', (e) => handleMouseMove(e as MouseEvent, element));
        element.addEventListener('mouseleave', () => handleMouseLeave(element));
      });
    });

    return () => {
      magneticElements.forEach((element) => {
        gsap.killTweensOf(element);
        element.removeEventListener('mousemove', (e) => handleMouseMove(e as MouseEvent, element));
        element.removeEventListener('mouseleave', () => handleMouseLeave(element));
      });
      ctx.revert();
    };
  }, []);
}

// ============================================
// TEXT SPLIT & REVEAL ANIMATION
// ============================================
export function useTextReveal(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const textElements = containerRef.current?.querySelectorAll('[data-text-reveal]');
      
      textElements?.forEach((el) => {
        const element = el as HTMLElement;
        const text = element.textContent || '';
        const chars = text.split('');
        
        element.innerHTML = chars.map((char) =>
          `<span class="char" style="display: inline-block; opacity: 0; transform: translateY(100%);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        const charElements = Array.from(element.querySelectorAll('.char')) as HTMLElement[];
        if (!charElements.length) return;
        
        gsap.to(charElements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// PARALLAX DEPTH LAYERS
// ============================================
export function useParallaxLayers(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const layers = containerRef.current?.querySelectorAll('[data-parallax-speed]');
      
      layers?.forEach((layer) => {
        const element = layer as HTMLElement;
        const speed = parseFloat(element.dataset.parallaxSpeed || '0.5');
        
        gsap.to(element, {
          y: () => speed * 200,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// SCROLL-VELOCITY IMAGE COLUMNS
// ============================================
export function useScrollVelocityColumns(containerRef: RefObject<HTMLElement | null>) {
  const additionalY = useRef({ val: 0 });
  const additionalYAnim = useRef<gsap.core.Tween | null>(null);
  const offset = useRef(0);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cols = Array.from(containerRef.current!.querySelectorAll('.velocity-col')) as HTMLElement[];
      
      cols.forEach((col, i) => {
        const images = Array.from(col.querySelectorAll('.velocity-image')) as HTMLElement[];
        
        // Duplicate images for infinite loop
        images.forEach((image) => {
          const clone = image.cloneNode(true) as HTMLElement;
          col.appendChild(clone);
        });

        // Set animation
        images.forEach((item) => {
          const element = item as HTMLElement;
          const columnHeight = element.parentElement?.clientHeight || 0;
          const direction = i % 2 !== 0 ? '+=' : '-=';

          gsap.to(element, {
            y: `${direction}${columnHeight / 2}`,
            duration: 25,
            repeat: -1,
            ease: 'none',
            modifiers: {
              y: gsap.utils.unitize((y: number) => {
                if (direction === '+=') {
                  offset.current += additionalY.current.val;
                  return (parseFloat(String(y)) - offset.current) % (columnHeight * 0.5);
                } else {
                  offset.current += additionalY.current.val;
                  return (parseFloat(String(y)) + offset.current) % -(columnHeight * 0.5);
                }
              }),
            },
          });
        });
      });

      // Scroll velocity trigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (velocity > 0) {
            if (additionalYAnim.current) additionalYAnim.current.kill();
            additionalY.current.val = -velocity / 2000;
            additionalYAnim.current = gsap.to(additionalY.current, { val: 0 });
          }
          if (velocity < 0) {
            if (additionalYAnim.current) additionalYAnim.current.kill();
            additionalY.current.val = -velocity / 3000;
            additionalYAnim.current = gsap.to(additionalY.current, { val: 0 });
          }
        },
      });
    }, containerRef);

    return () => {
      if (additionalYAnim.current) additionalYAnim.current.kill();
      ctx.revert();
    };
  }, [containerRef]);
}

// ============================================
// CINEMATIC SECTION TRANSITIONS
// ============================================
export function useCinematicTransitions(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const sections = containerRef.current?.querySelectorAll('[data-cinematic-section]');
      
      sections?.forEach((section) => {
        const element = section as HTMLElement;
        const content = element.querySelector('[data-cinematic-content]');
        const image = element.querySelector('[data-cinematic-image]');
        const title = element.querySelector('[data-cinematic-title]');

        // Initial state
        gsap.set(element, { 
          clipPath: 'inset(100% 0 0 0)',
          visibility: 'visible',
        });

        if (content) {
          gsap.set(content, { y: 100, opacity: 0 });
        }
        if (image) {
          gsap.set(image, { scale: 1.3, opacity: 0 });
        }
        if (title) {
          gsap.set(title, { y: 50, opacity: 0, filter: 'blur(10px)' });
        }

        // Create timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        });

        tl.to(element, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power3.inOut',
        })
        .to(image, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }, '-=0.5')
        .to(title, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.7')
        .to(content, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.5');
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// STAGGER REVEAL GRID
// ============================================
export function useStaggerRevealGrid(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const grids = containerRef.current?.querySelectorAll('[data-stagger-grid]');
      
      grids?.forEach((grid) => {
        const items = Array.from(grid.querySelectorAll('[data-stagger-item]')) as HTMLElement[];
        if (!items.length) return;
        
        gsap.set(items, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotateX: 15,
        });

        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: {
            amount: 0.8,
            from: 'start',
            grid: 'auto',
            ease: 'power2.out',
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// HORIZONTAL SCROLL TYPOGRAPHY
// ============================================
export function useHorizontalTypography(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const textElements = containerRef.current?.querySelectorAll('[data-horizontal-text]');
      
      textElements?.forEach((el, index) => {
        const element = el as HTMLElement;
        const direction = index % 2 === 0 ? -1 : 1;
        const speed = parseFloat(element.dataset.horizontalSpeed || '1');
        
        gsap.to(element, {
          x: () => direction * window.innerWidth * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// IMAGE MASK REVEAL
// ============================================
export function useImageMaskReveal(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const images = containerRef.current?.querySelectorAll('[data-mask-reveal]');
      
      images?.forEach((img) => {
        const element = img as HTMLElement;
        const direction = element.dataset.maskDirection || 'left';
        
        let clipStart = 'inset(0 100% 0 0)';
        let clipEnd = 'inset(0 0% 0 0)';
        
        switch (direction) {
          case 'right':
            clipStart = 'inset(0 0 0 100%)';
            clipEnd = 'inset(0 0 0 0%)';
            break;
          case 'top':
            clipStart = 'inset(0 0 100% 0)';
            clipEnd = 'inset(0 0 0% 0)';
            break;
          case 'bottom':
            clipStart = 'inset(100% 0 0 0)';
            clipEnd = 'inset(0% 0 0 0)';
            break;
        }

        gsap.fromTo(element, 
          { clipPath: clipStart },
          {
            clipPath: clipEnd,
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// 3D CARD TILT ON HOVER
// ============================================
export function use3DCardTilt() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const cards = Array.from(document.querySelectorAll('[data-tilt-card]')) as HTMLElement[];
    if (!cards.length) return;
    
    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = (card: HTMLElement) => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    const ctx = gsap.context(() => {
      cards.forEach((element) => {
        element.style.transformStyle = 'preserve-3d';
        element.addEventListener('mousemove', (e) => handleMouseMove(e as MouseEvent, element));
        element.addEventListener('mouseleave', () => handleMouseLeave(element));
      });
    });

    return () => {
      cards.forEach((element) => {
        gsap.killTweensOf(element);
        element.removeEventListener('mousemove', (e) => handleMouseMove(e as MouseEvent, element));
        element.removeEventListener('mouseleave', () => handleMouseLeave(element));
      });
      ctx.revert();
    };
  }, []);
}

// ============================================
// SMOOTH COUNTER ANIMATION
// ============================================
export function useSmoothCounter(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const counters = containerRef.current?.querySelectorAll('[data-counter]');
      
      counters?.forEach((counter) => {
        const element = counter as HTMLElement;
        const target = parseInt(element.dataset.counterTarget || '0', 10);
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            element.textContent = Math.round(obj.value).toString();
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// FLOATING ELEMENTS
// ============================================
export function useFloatingElements() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const floatingElements = Array.from(document.querySelectorAll('[data-float]')) as HTMLElement[];
    if (!floatingElements.length) return;
    
    const ctx = gsap.context(() => {
      floatingElements.forEach((element, index) => {
        const intensity = parseFloat(element.dataset.floatIntensity || '20');
        const duration = parseFloat(element.dataset.floatDuration || '3');
        
        gsap.to(element, {
          y: `+=${intensity}`,
          duration: duration + (index * 0.2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    });

    return () => {
      floatingElements.forEach((el) => {
        gsap.killTweensOf(el);
      });
      ctx.revert();
    };
  }, []);
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
export function useScrollProgress() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const progressBar = document.querySelector('[data-scroll-progress]') as HTMLElement;
    if (!progressBar) return;

    const ctx = gsap.context(() => {
      gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });

      gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);
}

// ============================================
// ELASTIC SCALE ON SCROLL
// ============================================
export function useElasticScale(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll('[data-elastic-scale]');
      
      elements?.forEach((el) => {
        const element = el as HTMLElement;
        
        gsap.fromTo(element,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// MORPHING SHAPES
// ============================================
export function useMorphingShapes(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const shapes = containerRef.current?.querySelectorAll('[data-morph-shape]');
      
      shapes?.forEach((shape) => {
        const element = shape as HTMLElement;
        const morphTo = element.dataset.morphTo || '50%';
        
        gsap.to(element, {
          borderRadius: morphTo,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// SPLIT LINE REVEAL
// ============================================
export function useSplitLineReveal(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const lines = containerRef.current?.querySelectorAll('[data-line-reveal]');
      
      lines?.forEach((line) => {
        const element = line as HTMLElement;
        
        // Wrap content in a mask
        const content = element.innerHTML;
        element.innerHTML = `<span class="line-mask" style="display: block; overflow: hidden;"><span class="line-content" style="display: block; transform: translateY(100%);">${content}</span></span>`;
        
        const lineContent = element.querySelector('.line-content');
        
        gsap.to(lineContent, {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}

// ============================================
// COMBINED SPECTACULAR ANIMATIONS HOOK
// ============================================
export function useSpectacularAnimations(containerRef: RefObject<HTMLElement | null>) {
  useMagneticElements();
  useTextReveal(containerRef);
  useParallaxLayers(containerRef);
  useStaggerRevealGrid(containerRef);
  useImageMaskReveal(containerRef);
  use3DCardTilt();
  useFloatingElements();
  useScrollProgress();
  useElasticScale(containerRef);
  useSplitLineReveal(containerRef);
}

