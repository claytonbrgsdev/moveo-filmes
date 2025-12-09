"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

interface ContentTransitionProps {
  leftText?: { line1: string; line2: string }
  rightText?: { line1: string; line2: string }
  boxCount?: number
}

export default function ContentTransition({
  leftText = { line1: "A NATUREZA", line2: "DAS COISAS INVISÍVEIS" },
  rightText = { line1: "AS", line2: "MIÇANGAS" },
  boxCount = 100,
}: ContentTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const boxesRef = useRef<HTMLDivElement[]>([])
  const leftTextRef = useRef<HTMLSpanElement>(null)
  const rightTextRef = useRef<HTMLSpanElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const leftTextEl = leftTextRef.current
    const rightTextEl = rightTextRef.current
    if (!section || !leftTextEl || !rightTextEl) return

    const boxes = boxesRef.current

    gsap.set(boxes, { width: "100vw", xPercent: 0, force3D: true })
    gsap.set(leftTextEl, {
      xPercent: -50,
      left: "50%",
      textAlign: "center",
      force3D: true,
      willChange: "transform, opacity",
    })
    gsap.set(rightTextEl, {
      opacity: 0,
      xPercent: 20,
      force3D: true,
      willChange: "transform, opacity",
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scrub: 0.5,
        pin: true,
        start: "top top",
        end: "+=300%",
      },
    })

    tl.to(boxes, {
      width: "50vw",
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        leftTextEl,
        {
          xPercent: 0,
          left: "5%",
          textAlign: "left",
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<+=0.2",
      )
      .to(
        rightTextEl,
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<",
      )
      .to({}, { duration: 0.3 })
      // Animação principal das barras
      .to(boxes, {
        force3D: true,
        duration: 1,
        xPercent: 100,
        ease: "power1.inOut",
        stagger: { amount: 1 },
      })
      .to(boxes, { ease: "power1.out", duration: 0.5, rotation: "45deg" }, "<")
      .to(boxes, { ease: "power1.in", duration: 0.5, rotation: "0deg" }, "<+=0.5")
      .to({}, { duration: 0.3 })
      // Animação final
      .to(leftTextEl, {
        opacity: 0,
        xPercent: -20,
        duration: 0.4,
        ease: "power2.inOut",
      })
      .to(
        rightTextEl,
        {
          xPercent: -50,
          left: "50%",
          textAlign: "center",
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<",
      )
      .to(
        boxes,
        {
          width: "100vw",
          x: 0,
          xPercent: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<+=0.15",
      )

    return () => {
      gsap.set([leftTextEl, rightTextEl], { willChange: "auto" })
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-screen h-screen overflow-hidden bg-[#eee]">
      {/* Left text */}
      <span
        ref={leftTextRef}
        className="absolute block text-left text-[50px] leading-[2.5rem] tracking-[-2px] z-[2] w-1/2 uppercase font-semibold text-[#eee] left-0 top-[calc(50vh-56px)] backface-hidden transform-gpu"
      >
        {leftText.line1}
        <br />
        {leftText.line2}
      </span>

      {/* Right text */}
      <span
        ref={rightTextRef}
        className="absolute block text-left text-[50px] leading-[2.5rem] tracking-[-2px] z-[2] w-1/2 uppercase font-semibold text-[#eee] right-0 top-[calc(50vh-56px)] backface-hidden transform-gpu"
      >
        {rightText.line1}
        <br />
        {rightText.line2}
      </span>

      {/* Boxes */}
      {Array.from({ length: boxCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) boxesRef.current[i] = el
          }}
          className="h-[1.2vh] w-[50vw] -mb-[0.2vh] bg-[#161616] block transform-gpu"
        />
      ))}
    </section>
  )
}
