'use client'

import { useEffect, useRef } from 'react'

/**
 * Authentic 16mm film grain overlay rendered via canvas.
 *
 * A tiny 256×256 canvas is scaled to fill the viewport with
 * `image-rendering: pixelated`, making each grain pixel visible as
 * a coarse block — naturally simulating 16mm documentary film stock.
 *
 * Grain is fully regenerated each frame (~6fps) rather than translated,
 * matching how real film grain works (each frame of celluloid has
 * independent silver halide crystal patterns).
 *
 * Subtle gate weave (sub-pixel random shifts) simulates film not
 * sitting perfectly steady in the camera gate.
 *
 * Performance: pauses rendering when the canvas is off-screen using
 * IntersectionObserver, and runs at 6fps (down from 12fps) to halve
 * CPU cost while remaining visually convincing.
 */
export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const ctxResult = canvasEl.getContext('2d')
    if (!ctxResult) return

    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = ctxResult

    const W = 512
    const H = 512
    canvas.width = W
    canvas.height = H

    const imageData = ctx.createImageData(W, H)
    const data = imageData.data

    let animId: number
    let lastTime = 0
    const FRAME_INTERVAL = 1000 / 6 // ~6fps — half the CPU cost, still cinematic

    // Pause rendering when canvas is not visible in the viewport
    const isPaused = { current: false }

    const observer = new IntersectionObserver(
      (entries) => {
        isPaused.current = !entries[0].isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    function renderGrain(time: number) {
      animId = requestAnimationFrame(renderGrain)

      // Skip rendering entirely when off-screen
      if (isPaused.current) return

      if (time - lastTime < FRAME_INTERVAL) return
      lastTime = time

      // Generate grain — fully regenerated each frame
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.85) {
          const intensity = 120 + (Math.random() * 135) | 0
          data[i] = intensity     // R
          data[i + 1] = intensity // G
          data[i + 2] = intensity // B
          data[i + 3] = (Math.random() * 12) | 0
        } else {
          data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Gate weave — subtle random drift each frame
      const weaveX = (Math.random() - 0.5) * 0.5
      const weaveY = (Math.random() - 0.5) * 0.4
      canvas.style.transform = `translate(${weaveX}px, ${weaveY}px)`
    }

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!motionQuery.matches) {
      animId = requestAnimationFrame(renderGrain)
    } else {
      // Render one static frame for reduced-motion users
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.88) {
          const intensity = 150 + (Math.random() * 105) | 0
          data[i] = intensity
          data[i + 1] = intensity
          data[i + 2] = intensity
          data[i + 3] = (Math.random() * 8) | 0
        } else {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="film-grain-canvas"
      aria-hidden="true"
    />
  )
}
