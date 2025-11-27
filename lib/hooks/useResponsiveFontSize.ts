'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Hook para calcular tamanho de fonte responsivo baseado na largura do container
 * Ajusta o tamanho da fonte para que o texto ocupe toda a largura disponível
 */
export function useResponsiveFontSize(text: string, minFontSize: number = 32, maxFontSize: number = 224) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = useState<number>(maxFontSize)

  useEffect(() => {
    const calculateFontSize = () => {
      if (!containerRef.current || !textRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      
      // Criar um elemento temporário para medir o texto
      const tempElement = document.createElement('span')
      tempElement.style.visibility = 'hidden'
      tempElement.style.position = 'absolute'
      tempElement.style.whiteSpace = 'nowrap'
      tempElement.style.fontFamily = getComputedStyle(textRef.current).fontFamily
      tempElement.style.fontWeight = getComputedStyle(textRef.current).fontWeight
      tempElement.style.letterSpacing = getComputedStyle(textRef.current).letterSpacing
      tempElement.textContent = text
      document.body.appendChild(tempElement)

      // Busca binária para encontrar o tamanho ideal
      let min = minFontSize
      let max = maxFontSize
      let bestSize = minFontSize

      // Fazer múltiplas iterações para encontrar o tamanho exato
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

    // Aguardar um frame para garantir que o DOM está renderizado
    const timeoutId = setTimeout(calculateFontSize, 0)

    // Recalcular quando a janela for redimensionada
    const resizeObserver = new ResizeObserver(() => {
      calculateFontSize()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', calculateFontSize)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateFontSize)
    }
  }, [text, minFontSize, maxFontSize])

  return { containerRef, textRef, fontSize }
}

