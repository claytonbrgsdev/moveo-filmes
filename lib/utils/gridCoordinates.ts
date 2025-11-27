// Utilitários para trabalhar com coordenadas do grid
// Grid: 14 colunas verticais (1-14) e 10 linhas horizontais (A-J)

const PADDING_PX = 50;

/**
 * Converte uma letra (A-J) em índice de linha (0-9)
 */
export function letterToIndex(letter: string): number {
  const upperLetter = letter.toUpperCase();
  const index = upperLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  if (index < 0 || index > 9) {
    throw new Error(`Letra inválida: ${letter}. Use A-J.`);
  }
  return index;
}

/**
 * Converte um índice de linha (0-9) em letra (A-J)
 */
export function indexToLetter(index: number): string {
  if (index < 0 || index > 9) {
    throw new Error(`Índice inválido: ${index}. Use 0-9.`);
  }
  return String.fromCharCode('A'.charCodeAt(0) + index);
}

/**
 * Converte um número de marcador (1-14) em índice (0-13)
 */
export function markerNumberToIndex(markerNumber: number): number {
  const index = markerNumber - 1;
  if (index < 0 || index > 13) {
    throw new Error(`Número de marcador inválido: ${markerNumber}. Use 1-14.`);
  }
  return index;
}

/**
 * Converte um índice de marcador (0-13) em número (1-14)
 */
export function indexToMarkerNumber(index: number): number {
  if (index < 0 || index > 13) {
    throw new Error(`Índice inválido: ${index}. Use 0-13.`);
  }
  return index + 1;
}

/**
 * Calcula a posição horizontal (left) de um marcador vertical
 * @param markerNumber Número do marcador (1-14)
 */
export function getMarkerPosition(markerNumber: number): string {
  const markerIndex = markerNumberToIndex(markerNumber);
  if (markerIndex === 0) return `${PADDING_PX}px`;
  if (markerIndex === 13) return `calc(100% - ${PADDING_PX}px)`;
  return `calc(${PADDING_PX}px + (100% - ${PADDING_PX * 2}px) * ${markerIndex / 13})`;
}

/**
 * Calcula a posição vertical (top) de uma linha horizontal
 * @param letter Letra da linha (A-J)
 */
export function getHorizontalLinePosition(letter: string): string {
  const lineIndex = letterToIndex(letter);
  if (lineIndex === 0) return `${PADDING_PX}px`;
  if (lineIndex === 9) return `calc(100vh - ${PADDING_PX}px)`;
  return `calc(${PADDING_PX}px + (100vh - ${PADDING_PX * 2}px) * ${lineIndex / 9})`;
}

/**
 * Calcula o bottom relativo a uma linha horizontal
 * @param letter Letra da linha (A-J)
 */
export function getBottomFromHorizontalLine(letter: string): string {
  const lineIndex = letterToIndex(letter);
  if (lineIndex === 0) return `calc(100vh - ${PADDING_PX}px - 1px)`;
  if (lineIndex === 9) return `calc(${PADDING_PX}px - 1px)`;
  return `calc(100vh - ${PADDING_PX}px - (100vh - ${PADDING_PX * 2}px) * ${lineIndex / 9} - 1px)`;
}

/**
 * Calcula a largura entre dois marcadores
 * @param startMarker Marcador inicial (1-14)
 * @param endMarker Marcador final (1-14)
 */
export function getWidthBetweenMarkers(startMarker: number, endMarker: number): string {
  const startPos = getMarkerPosition(startMarker);
  const endPos = getMarkerPosition(endMarker);
  return `calc(${endPos} - ${startPos})`;
}

/**
 * Calcula a altura entre duas linhas horizontais
 * @param startLetter Linha inicial (A-J)
 * @param endLetter Linha final (A-J)
 */
export function getHeightBetweenLines(startLetter: string, endLetter: string): string {
  const startPos = getHorizontalLinePosition(startLetter);
  const endPos = getHorizontalLinePosition(endLetter);
  return `calc(${endPos} - ${startPos})`;
}

