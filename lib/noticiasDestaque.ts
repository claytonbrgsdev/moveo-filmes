// Notícias em destaque (cartela 15). A home e /noticias mostram as mesmas enquanto a tabela
// posts estiver vazia. Os textos ficam nas chaves noticia* do LanguageContext e são só fatos
// com fonte: o documento de alterações da cliente e "ANCI - Exibições e prêmios".
export const NOTICIAS_DESTAQUE = [
  {
    id: 'hamburgo',
    titulo: 'noticiaHamburgo',
    resumo: 'noticiaHamburgoResumo',
    data: 'junho2026',
    tag: 'festival',
    imagem: '/imagens/nao-ha-magia/pedra.jpg',
    href: '/catalogo/cinema/nao-ha-magia',
  },
  {
    id: 'gramado',
    titulo: 'noticiaGramado',
    resumo: 'noticiaGramadoResumo',
    data: 'agosto2025',
    tag: 'premioTag',
    imagem: '/imagens/destaques/natureza-janela.jpg',
    href: '/catalogo/cinema/a-natureza-das-coisas-invisiveis',
  },
  {
    id: 'berlinale',
    titulo: 'noticiaBerlinale',
    resumo: 'noticiaBerlinaleResumo',
    data: 'fevereiro2025',
    tag: 'festival',
    imagem: '/imagens/capahome-natureza.jpg',
    href: '/catalogo/cinema/a-natureza-das-coisas-invisiveis',
  },
] as const;
