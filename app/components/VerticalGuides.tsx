'use client'

import { useGridGuides } from '@/lib/hooks/useGridGuides';
import { getMarkerPosition, getHorizontalLinePosition } from '@/lib/utils/gridCoordinates';

// Componente de Guias Verticais e Horizontais para desenvolvimento
// Remove este componente quando não precisar mais das guias
export function VerticalGuides() {
  const isVisible = useGridGuides();
  // Padding lateral fixo: 50px em cada lado
  const paddingPx = 50;
  
  // Calcular posições dos 14 marcadores verticais
  // Primeiro marcador: 50px (padding esquerdo)
  // Último marcador: calc(100% - 50px) (padding direito)
  // Espaçamento interno: calc((100% - 100px) / 13) - divide a área útil em 13 espaços iguais
  
  // Calcular posições das 10 linhas horizontais
  // Primeira linha: 50px do topo (border-bottom da navbar)
  // Última linha: 50px do bottom
  // 8 linhas intermediárias equidistantes (9 espaços internos)
  // Área útil vertical: calc(100vh - 100px)
  // Cada espaço: calc((100vh - 100px) / 9)
  
  // Gerar letras A-J para as 10 linhas horizontais
  const horizontalLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-150"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Marcadores Verticais */}
      {/* Primeiro marcador - padding esquerdo fixo */}
      <div
        className="absolute top-0 bottom-0 w-px bg-red-500 opacity-50"
        style={{ left: `${paddingPx}px` }}
      />
      {/* Label número 1 */}
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ left: `${paddingPx}px`, top: '0px', transform: 'translateX(-50%)' }}
      >
        1
      </div>
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ left: `${paddingPx}px`, bottom: '0px', transform: 'translateX(-50%)' }}
      >
        1
      </div>
      
      {/* Marcadores intermediários - distribuídos uniformemente */}
      {Array.from({ length: 12 }, (_, i) => {
        // i vai de 0 a 11, então temos 12 marcadores intermediários
        // Total de 14 marcadores: primeiro (50px) + 12 intermediários + último (calc(100% - 50px))
        // Área útil: calc(100% - 100px)
        // Cada espaço: calc((100% - 100px) / 13)
        const position = `calc(${paddingPx}px + (100% - ${paddingPx * 2}px) * ${(i + 1) / 13})`;
        const markerNumber = i + 2; // 2 a 13
        const isCenter = markerNumber === 7 || markerNumber === 8; // Linhas centrais (7 e 8)
        return (
          <div key={`vertical-${i + 1}`}>
            <div
              className={`absolute top-0 bottom-0 bg-red-500 ${isCenter ? 'w-[2px] opacity-80' : 'w-px opacity-50'}`}
              style={{ left: position }}
            />
            {/* Label número */}
            <div
              className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
              style={{ left: position, top: '0px', transform: 'translateX(-50%)' }}
            >
              {markerNumber}
            </div>
            <div
              className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
              style={{ left: position, bottom: '0px', transform: 'translateX(-50%)' }}
            >
              {markerNumber}
            </div>
          </div>
        );
      })}
      
      {/* Último marcador - padding direito fixo */}
      <div
        className="absolute top-0 bottom-0 w-px bg-red-500 opacity-50"
        style={{ right: `${paddingPx}px` }}
      />
      {/* Label número 14 */}
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ right: `${paddingPx}px`, top: '0px', transform: 'translateX(50%)' }}
      >
        14
      </div>
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ right: `${paddingPx}px`, bottom: '0px', transform: 'translateX(50%)' }}
      >
        14
      </div>

      {/* Linhas Horizontais */}
      {/* Primeira linha - border-bottom da navbar (50px do topo) */}
      <div
        className="absolute left-0 right-0 h-px bg-red-500 opacity-50"
        style={{ top: `${paddingPx}px` }}
      />
      {/* Label letra A */}
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ left: '0px', top: `${paddingPx}px`, transform: 'translateY(-50%)' }}
      >
        A
      </div>
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ right: '0px', top: `${paddingPx}px`, transform: 'translateY(-50%)' }}
      >
        A
      </div>
      
      {/* Linhas intermediárias - distribuídas uniformemente */}
      {Array.from({ length: 8 }, (_, i) => {
        // i vai de 0 a 7, então temos 8 linhas intermediárias
        // Total de 10 linhas: primeira (50px) + 8 intermediárias + última (calc(100vh - 50px))
        // Área útil vertical: calc(100vh - 100px)
        // Cada espaço: calc((100vh - 100px) / 9)
        // Posições: 1/9, 2/9, 3/9, 4/9, 5/9, 6/9, 7/9, 8/9 da área útil
        const position = `calc(${paddingPx}px + (100vh - ${paddingPx * 2}px) * ${(i + 1) / 9})`;
        const letterIndex = i + 1; // B a I
        const letter = horizontalLabels[letterIndex];
        const isCenter = letter === 'E' || letter === 'F'; // Linhas centrais (E e F)
        return (
          <div key={`horizontal-${i + 1}`}>
            <div
              className={`absolute left-0 right-0 bg-red-500 ${isCenter ? 'h-[2px] opacity-80' : 'h-px opacity-50'}`}
              style={{ top: position }}
            />
            {/* Label letra */}
            <div
              className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
              style={{ left: '0px', top: position, transform: 'translateY(-50%)' }}
            >
              {letter}
            </div>
            <div
              className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
              style={{ right: '0px', top: position, transform: 'translateY(-50%)' }}
            >
              {letter}
            </div>
          </div>
        );
      })}
      
      {/* Última linha - padding bottom fixo (50px do bottom) */}
      <div
        className="absolute left-0 right-0 h-px bg-red-500 opacity-50"
        style={{ bottom: `${paddingPx}px` }}
      />
      {/* Label letra J */}
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ left: '0px', bottom: `${paddingPx}px`, transform: 'translateY(50%)' }}
      >
        J
      </div>
      <div
        className="absolute text-xs font-bold text-red-500 bg-white px-1 rounded"
        style={{ right: '0px', bottom: `${paddingPx}px`, transform: 'translateY(50%)' }}
      >
        J
      </div>

      {/* Subdivisões nos quadrados dos eixos XY */}
      {/* Linhas verticais de subdivisão entre colunas 7 e 8 */}
      {Array.from({ length: 3 }, (_, i) => {
        // Dividir o espaço entre colunas 7 e 8 em 4 partes (3 linhas internas)
        const col7Pos = getMarkerPosition(7);
        const col8Pos = getMarkerPosition(8);
        const position = `calc(${col7Pos} + (${col8Pos} - ${col7Pos}) * ${(i + 1) / 4})`;
        return (
          <div
            key={`subdiv-vertical-${i}`}
            className="absolute top-0 bottom-0 w-px bg-red-500 opacity-30"
            style={{ left: position }}
          />
        );
      })}

      {/* Linhas horizontais de subdivisão entre linhas E e F */}
      {Array.from({ length: 3 }, (_, i) => {
        // Dividir o espaço entre linhas E e F em 4 partes (3 linhas internas)
        const lineEPos = getHorizontalLinePosition('E');
        const lineFPos = getHorizontalLinePosition('F');
        const position = `calc(${lineEPos} + (${lineFPos} - ${lineEPos}) * ${(i + 1) / 4})`;
        return (
          <div
            key={`subdiv-horizontal-${i}`}
            className="absolute left-0 right-0 h-px bg-red-500 opacity-30"
            style={{ top: position }}
          />
        );
      })}
    </div>
  );
}

