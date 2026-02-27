'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Hook para calcular tamanho de fonte responsivo baseado na largura do container.
 * Ajusta o tamanho da fonte para que o texto ocupe toda a largura disponível.
 *
 * Performance improvements:
 * - 150ms debounce on resize to prevent layout thrashing during window resize
 * - Single ResizeObserver instead of both ResizeObserver + window resize listener
 */
export function useResponsiveFontSize(text: string, minFontSize: number = 32, maxFontSize: number = 224) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = useState<number>(maxFontSize)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const calculateFontSize = () => {
      if (!containerRef.current || !textRef.current) return

      const containerWidth = containerRef.current.offsetWidth

      const tempElement = document.createElement('span')
      tempElement.style.visibility = 'hidden'
      tempElement.style.position = 'absolute'
      tempElement.style.whiteSpace = 'nowrap'
      tempElement.style.fontFamily = getComputedStyle(textRef.current).fontFamily
      tempElement.style.fontWeight = getComputedStyle(textRef.current).fontWeight
      tempElement.style.letterSpacing = getComputedStyle(textRef.current).letterSpacing
      tempElement.textContent = text
      document.body.appendChild(tempElement)

      let min = minFontSize
      let max = maxFontSize
      let bestSize = minFontSize

      for (let i = 0; i < 20; i++) {
        const mid = (min + max) / 2
        tempElement.style.fontSize = `${mid}px`
        const textWidth = tempElement.offsetWidth

        if (textWidth <= containerWidth) {
          bestSize = mid
          min = mid
        } else {
          max = mid
        }
      }

      document.body.removeChild(tempElement)
      setFontSize(Math.floor(bestSize))
    }

    const debouncedCalculate = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(calculateFontSize, 150)
    }

    // Initial calculation after DOM is ready
    const initialTimer = setTimeout(calculateFontSize, 0)

    // ResizeObserver covers both container resizes and window resizes —
    // no need to also attach window.addEventListener('resize')
    const resizeObserver = new ResizeObserver(debouncedCalculate)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      clearTimeout(initialTimer)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      resizeObserver.disconnect()
    }
  }, [text, minFontSize, maxFontSize])

  return { containerRef, textRef, fontSize }
}

