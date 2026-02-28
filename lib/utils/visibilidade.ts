export function nextVisibilidade(current: string | null): 'publico' | 'rascunho' | 'privado' {
  if (current === 'rascunho') return 'publico'
  if (current === 'publico') return 'privado'
  return 'rascunho'
}
