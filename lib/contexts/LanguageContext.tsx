'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções completas para o site
const translations: Record<Language, Record<string, string>> = {
  pt: {
    catalog: 'Catálogo',
    media: 'Notícias',
    about: 'Sobre',
    contact: 'Contato',
    admin: 'Admin',
    logout: 'Sair',
    // Hero section
    brasiliaDesde2018: 'Brasília, desde 2018',
    fundadaEm2018: 'Fundada em 2018',
    baseadaEmBrasilia: 'Baseada em\nBrasília,\nBrasil',
    sobreAMoveo: 'SOBRE A\nMOVEO',
    saibaMais: 'Saiba mais →',
    focadoEmCineastas: 'Focado em\npromissores\ncineastas\nbrasileiros',
    historicoSolidodeColaboracoes: 'O cinema independente nos principais mercados e laboratórios do mundo.\nUma plataforma para realizadores e narrativas fora do eixo tradicional.\nDezenas de prêmios e seleções oficiais na última década.',
    filmesDeArteParaMercado: 'FILMES DE\nARTE PARA\nO MERCADO\nINTERNACIONAL',
    filmesDestaqueDoCatalogo: 'FILMES DESTAQUE DO NOSSO CATÁLOGO',
    // Catálogo section
    nossosFilmes: 'Nossos Filmes',
    catalogoEmDestaque: 'Catálogo em Destaque',
    catalogoEm: 'CATÁLOGO EM',
    destaque: 'DESTAQUE',
    exploreNossaSelecao: 'Explore nossa seleção de obras que marcaram festivais internacionais e conquistaram audiências ao redor do mundo. De longas-metragens a curtas experimentais, cada projeto representa nossa dedicação à narrativa cinematográfica de excelência.',
    catalogo: 'CATÁLOGO',
    explorarArquivoNaIntegra: 'EXPLORAR ARQUIVO NA ÍNTEGRA',
    // Filmes
    aNaturezaDasCoisasInvisiveis: 'A NATUREZA DAS COISAS INVISÍVEIS',
    aNaturezaDasCoisasInvisiveisTitle: 'A Natureza das Coisas Invisíveis',
    naturezaDescription: 'Primeiro longa-metragem internacional da Moveo Filmes.',
    direcao: 'Direção:',
    roteiro: 'Roteiro:',
    ano: 'Ano:',
    coproducao: 'Coprodução:',
    producao: 'Produção:',
    financiamento: 'Financiamento:',
    elenco: 'Elenco:',
    formato: 'Formato:',
    sinopse: 'Sinopse',
    naturezaFormato: '90 min · Cor · Drama · 12 anos',
    naturezaElenco: 'Laura Brandão, Serena, Larissa Mauro, Camila Márdila, Aline Marta Maia',
    naturezaSinopse: 'Durante as férias de verão, duas meninas de dez anos se encontram num hospital e formam um vínculo inesperado. Esse laço as conduz por uma jornada agridoce de despedidas e de profundas descobertas sobre a vida.',
    grandeOteloTitulo: 'Prêmio Grande Otelo 2026',
    grandeOteloCategoria: 'Melhor Primeira Direção de Longa-Metragem',
    // Estas três eram usadas na cartela 06 e não existiam em pt: a tela
    // mostrava o nome da chave, "colombia", em vez do país.
    colombia: 'Colômbia:',
    mexico: 'México:',
    uruguai: 'Uruguai',
    premioJuri: 'Prêmio do Júri',
    linkFestivaisPremios: 'Festivais e prêmios',
    linkLaureas: 'Láureas',
    linkPresskit: 'Presskit',
    linkFotosPreEstreias: 'Fotos das pré-estreias',
    linkDistribuicaoInternacional: 'The Open Reel (distribuição internacional)',
    linkOndeAssistir: 'Vitrine Filmes (onde assistir no Brasil)',
    // As Miçangas: sinopse do documento de alterações da cliente; formato e
    // elenco da ficha técnica oficial. O documento escreve "Letícia Ferraz", a
    // ficha e os arquivos dos stills escrevem "Tícia Ferraz" — ficou a ficha.
    micangasSinopse: 'Isoladas em uma casa no coração do cerrado, duas irmãs realizam um procedimento de aborto sem se darem conta de que há uma serpente silvestre escondida no ambiente.',
    micangasFormato: '19 min · Cor · Drama · 14 anos',
    micangasElenco: 'Tícia Ferraz, Pâmela Germano, Karine Teles',
    // Cartela 08 — Não Há Magia. Ficha e sinopse do documento de alterações da cliente.
    naoHaMagiaTitulo: 'Não Há Magia',
    naoHaMagiaFormato: 'Curta-metragem · 15 min · Documentário/Fantasia',
    naoHaMagiaElenco: 'Yara Ktaish, Márcia Witczak',
    naoHaMagiaSinopse: 'Um dia na vida de Yara, uma atriz síria exilada no Brasil, enquanto viaja pelo país com uma peça de teatro. Em Brasília, um encontro com uma pedra flutuante a perturba silenciosamente. O momento surreal persiste, confundindo as fronteiras entre memória e atuação, passado e presente. Enquanto caminha pela cidade, a inescapável saudade de um lar para o qual não pode mais retornar emerge suavemente.',
    naoHaMagiaLancamento: '04/06/2026 — Festival Internacional de Curtas-Metragens de Hamburgo, Alemanha',
    lancamento: 'Lançamento:',
    estreiaMundial: 'Estreia Mundial',
    festivais: 'Festivais',
    premios: 'Prêmios',
    melhorFilme: 'Melhor Filme',
    melhorFilmeJuriInfantil: 'Melhor Filme, Júri Infantil',
    asMicangas: 'AS MIÇANGAS',
    asMicangasTitle: 'As Miçangas',
    oFilme: 'O Filme',
    tresTitulo: 'Três',
    tresFormato: '20 min · Cor · Drama · 14 anos',
    tresElenco: 'Gabriela Correa, João Campos, Amora Inocêncio, Raissa Gregori, Paula Passos',
    tresLogline: 'O cotidiano de uma vida a três.',
    tresPremiereNacional: 'Premiere Nacional',
    tresFestivais: 'Festivais',
    tresCirculacao: 'Circulação',
    selecaoOficial: 'Seleção Oficial',
    tresFotosDivulgacao: 'Fotos de divulgação',
    fotos: 'Fotos:',
    // Arquivo
    alemDosFilmes: 'ALÉM\nDOS FILMES',
    verArquivoCompleto: 'Ver arquivo completo',
    arquivoMoveo: 'ARQUIVO\nMOVEO',
    arquivoDescription: 'mostras, exposições e outros projetos especiais dos quais fizemos parte',
    // Notícias
    noticias: 'Notícias',
    verPagina: 'Ver página',
    irParaNoticia: 'Ir para notícia',
    noticiaAnterior: 'Notícia anterior',
    proximaNoticia: 'Próxima notícia',
    anterior: 'Anterior',
    proxima: 'Próxima',
    eua: 'EUA:',
    // Footer
    produtoraBoutique: 'Produtora boutique de filmes independentes — Brasília, desde 2018.',
    produtoraBoutiqueShort: 'Produtora boutique\nde filmes independentes',
    mencaoEspecial: 'Menção Especial',
    irParaContato: 'Ir para contato',
    // ContentTransition
    aNatureza: 'A NATUREZA',
    dasCoisasInvisiveis: 'DAS COISAS INVISÍVEIS',
    as: 'AS',
    micangas: 'MIÇANGAS',
    // News/Notícias
    // Notícias da home (cartela 15). Eram texto de exemplo ("Dois longas autorais selecionados
    // para Rotterdam…"); agora só fatos com fonte: o documento de alterações da cliente
    // (Hamburgo) e "ANCI - Exibições e prêmios" (Gramado, Berlinale).
    noticiaHamburgo: 'Não Há Magia em Hamburgo',
    noticiaHamburgoResumo: 'O curta de Lucas Milhomem foi lançado em 04/06/2026 no Festival Internacional de Curtas-Metragens de Hamburgo, na Alemanha.',
    noticiaGramado: 'Três prêmios em Gramado',
    noticiaGramadoResumo: 'A Natureza das Coisas Invisíveis recebeu o Prêmio Especial do Júri e os de Melhor Atriz Coadjuvante e Melhor Trilha Sonora no 53º Festival de Cinema de Gramado.',
    noticiaBerlinale: 'Abertura da Generation KPlus na Berlinale',
    noticiaBerlinaleResumo: 'A Natureza das Coisas Invisíveis foi o filme de abertura da mostra Generation KPlus no 75º Festival Internacional de Cinema de Berlim.',
    junho2026: 'Junho 2026',
    fevereiro2025: 'Fevereiro 2025',
    agosto2025: 'Agosto 2025',
    festival: 'Festival',
    premioTag: 'Prêmio',
  },
  en: {
    catalog: 'Catalog',
    media: 'News',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    logout: 'Logout',
    // Hero section
    brasiliaDesde2018: 'Brasília, since 2018',
    fundadaEm2018: 'Founded in 2018',
    baseadaEmBrasilia: 'Based in\nBrasília,\nBrazil',
    sobreAMoveo: 'ABOUT\nMOVEO',
    saibaMais: 'Learn more →',
    focadoEmCineastas: 'Focused on\npromising\nBrazilian\nfilmmakers',
    historicoSolidodeColaboracoes: 'Independent cinema in the world\u2019s leading markets and labs.\nA platform for filmmakers and narratives outside the mainstream.\nDozens of awards and official selections over the past decade.',
    filmesDeArteParaMercado: 'ART FILMS\nFOR THE\nINTERNATIONAL\nMARKET',
    filmesDestaqueDoCatalogo: 'HIGHLIGHTED FILMS FROM OUR CATALOG',
    // Catálogo section
    nossosFilmes: 'Our Films',
    catalogoEmDestaque: 'Featured Catalog',
    exploreNossaSelecao: 'Explore our selection of works that have marked international festivals and won audiences around the world. From feature films to experimental shorts, each project represents our dedication to excellence in cinematic storytelling.',
    catalogo: 'CATALOG',
    explorarArquivoNaIntegra: 'EXPLORE FULL ARCHIVE',
    // Filmes
    aNaturezaDasCoisasInvisiveis: 'THE NATURE OF INVISIBLE THINGS',
    aNaturezaDasCoisasInvisiveisTitle: 'The Nature of Invisible Things',
    naturezaDescription: 'Moveo Filmes\' first international feature film.',
    direcao: 'Direction:',
    roteiro: 'Screenplay:',
    ano: 'Year:',
    coproducao: 'Co-production:',
    producao: 'Production:',
    financiamento: 'Funding:',
    elenco: 'Cast:',
    formato: 'Format:',
    sinopse: 'Synopsis',
    naturezaFormato: '90 min · Color · Drama · 12+',
    naturezaElenco: 'Laura Brandão, Serena, Larissa Mauro, Camila Márdila, Aline Marta Maia',
    naturezaSinopse: 'During summer break, two ten-year-old girls meet in a hospital and form an unexpected bond. That bond leads them on a bittersweet journey of farewells and profound discoveries about life.',
    // Sem versão oficial: o documento de prêmios da produção só lista o
    // Grande Otelo em português. Tradução nossa — confirmar com a Moveo.
    grandeOteloTitulo: 'Grande Otelo Award 2026',
    grandeOteloCategoria: 'Best Directorial Debut, Feature Film',
    // Usadas no título "CATÁLOGO EM DESTAQUE" e ausentes em en: o site em
    // inglês mostrava "catalogoEm" e "destaque".
    catalogoEm: 'FEATURED',
    destaque: 'CATALOG',
    premioJuri: 'Jury Prize',
    linkFestivaisPremios: 'Festivals and awards',
    linkLaureas: 'Laurels',
    linkPresskit: 'Press kit',
    linkFotosPreEstreias: 'Premiere photos',
    linkDistribuicaoInternacional: 'The Open Reel (international distribution)',
    linkOndeAssistir: 'Vitrine Filmes (where to watch in Brazil)',
    // Sem sinopse oficial em inglês de As Miçangas: tradução nossa.
    micangasSinopse: 'Isolated in a house in the heart of the cerrado, two sisters carry out an abortion without realizing that a wild snake is hiding in the room.',
    micangasFormato: '19 min · Color · Drama · 14+',
    micangasElenco: 'Tícia Ferraz, Pâmela Germano, Karine Teles',
    // Não Há Magia: a cliente só mandou a versão em português. Sinopse, formato e
    // lançamento abaixo são tradução nossa — confirmar com ela. O título fica o original.
    naoHaMagiaTitulo: 'Não Há Magia',
    naoHaMagiaFormato: 'Short film · 15 min · Documentary/Fantasy',
    naoHaMagiaElenco: 'Yara Ktaish, Márcia Witczak',
    naoHaMagiaSinopse: 'A day in the life of Yara, a Syrian actress exiled in Brazil, as she travels the country with a theater play. In Brasília, an encounter with a floating stone quietly unsettles her. The surreal moment lingers, blurring the boundaries between memory and performance, past and present. As she walks through the city, the inescapable longing for a home she can no longer return to gently emerges.',
    naoHaMagiaLancamento: 'June 4, 2026 — Hamburg International Short Film Festival, Germany',
    lancamento: 'Release:',
    estreiaMundial: 'World Premiere',
    festivais: 'Festivals',
    premios: 'Awards',
    melhorFilme: 'Best Film',
    melhorFilmeJuriInfantil: 'Best Feature Film, Young Audience Award',
    asMicangas: 'THE BEADS',
    asMicangasTitle: 'The Beads',
    oFilme: 'The Film',
    tresTitulo: 'Três',
    tresFormato: '20 min · Color · Drama · 14+',
    tresElenco: 'Gabriela Correa, João Campos, Amora Inocêncio, Raissa Gregori, Paula Passos',
    tresLogline: 'Everyday life of a throuple.',
    tresPremiereNacional: 'National Premiere',
    tresFestivais: 'Festivals',
    tresCirculacao: 'Circulation',
    selecaoOficial: 'Official Selection',
    tresFotosDivulgacao: 'Publicity stills',
    fotos: 'Photos:',
    // Arquivo
    alemDosFilmes: 'BEYOND\nTHE FILMS',
    verArquivoCompleto: 'View full archive',
    arquivoMoveo: 'MOVEO\nARCHIVE',
    arquivoDescription: 'exhibitions and other special projects we have been part of',
    // Notícias
    noticias: 'News',
    verPagina: 'View page',
    irParaNoticia: 'Go to news',
    noticiaAnterior: 'Previous news',
    proximaNoticia: 'Next news',
    anterior: 'Previous',
    proxima: 'Next',
    eua: 'USA:',
    // Footer
    produtoraBoutique: 'Boutique production company for independent films — Brasília, since 2018.',
    produtoraBoutiqueShort: 'Boutique production company\nfor independent films',
    mencaoEspecial: 'Special Mention',
    irParaContato: 'Go to contact',
    // ContentTransition
    aNatureza: 'THE NATURE',
    dasCoisasInvisiveis: 'OF INVISIBLE THINGS',
    as: 'THE',
    micangas: 'BEADS',
    // News/Notícias
    // Notícias da home (cartela 15). Eram texto de exemplo ("Dois longas autorais selecionados
    // para Rotterdam…"); agora só fatos com fonte: o documento de alterações da cliente
    // (Hamburgo) e "ANCI - Exibições e prêmios" (Gramado, Berlinale).
    noticiaHamburgo: 'Não Há Magia in Hamburg',
    noticiaHamburgoResumo: 'Lucas Milhomem\'s short film was released on June 4, 2026 at the Hamburg International Short Film Festival, Germany.',
    noticiaGramado: 'Three awards at Gramado',
    noticiaGramadoResumo: 'A Natureza das Coisas Invisíveis won the Special Jury Award, Best Supporting Actress and Best Original Score at the 53rd Gramado Film Festival.',
    noticiaBerlinale: 'Opening Generation KPlus at the Berlinale',
    noticiaBerlinaleResumo: 'A Natureza das Coisas Invisíveis was the opening film of Generation KPlus at the 75th Berlin International Film Festival.',
    junho2026: 'June 2026',
    fevereiro2025: 'February 2025',
    agosto2025: 'August 2025',
    festival: 'Festival',
    premioTag: 'Award',
    // Placeholder texts
    // Informações técnicas adicionais
    colombia: 'Colombia:',
    mexico: 'Mexico:',
    uruguai: 'Uruguay',
    primeiroEditalCardume: '1st Cardume Short Film Grant',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language | null;
      if (saved === 'pt' || saved === 'en') return saved;
    }
    return 'pt';
  });

  useEffect(() => {
    // Sincronizar com localStorage quando mudar
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


