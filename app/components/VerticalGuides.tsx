'use client'

// Componente de Guias Verticais para desenvolvimento
// Remove este componente quando não precisar mais das guias
export function VerticalGuides() {
  // Padding lateral: 2.6% em cada lado
  const padding = 2.6;
  // Área útil: 100% - (2.6% * 2) = 94.8%
  const usableArea = 100 - (padding * 2);
  // 7 marcadores = 6 espaços entre eles
  const spaces = 6;
  // Cada espaço: 94.8% / 6 = 15.8%
  const spaceWidth = usableArea / spaces;

  // Calcular posições dos 7 marcadores
  const markers = Array.from({ length: 7 }, (_, i) => {
    if (i === 0) return padding; // Primeiro marcador no padding esquerdo
    return padding + (spaceWidth * i); // Marcadores seguintes
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {markers.map((position, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 w-px bg-red-500 opacity-50"
          style={{ left: `${position}%` }}
        />
      ))}
    </div>
  );
}

