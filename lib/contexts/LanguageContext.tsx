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
    naturezaDescription: 'Primeiro longa-metragem internacional da Moveo Filmes. Uma jornada visceral através de narrativas invisíveis que conectam o Brasil contemporâneo com suas raízes mais profundas.',
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
    estreiaMundial: 'Estreia Mundial',
    festivais: 'Festivais',
    premios: 'Prêmios',
    melhorFilme: 'Melhor Filme',
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
    mostraInternacional2025: 'Mostra Internacional 2025',
    mostraInternacional2025Summary: 'Dois longas autorais selecionados para Rotterdam exibindo a estética MOVEO.',
    residenciaCriativaDF: 'Residência Criativa DF',
    residenciaCriativaDFSummary: 'Laboratório imersivo de direção com foco em narrativas híbridas e arquivos vivos.',
    coproducaoTransatlantica: 'Co-produção transatlântica',
    coproducaoTransatlanticaSummary: 'Novo filme em parceria com estúdios europeus amplia a presença da produtora.',
    marco2025: 'Março 2025',
    junho2025: 'Junho 2025',
    agosto2025: 'Agosto 2025',
    festival: 'Festival',
    residencia: 'Residência',
    producaoTag: 'Produção',
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
    naturezaDescription: 'Moveo Filmes\' first international feature film. A visceral journey through invisible narratives that connect contemporary Brazil with its deepest roots.',
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
    estreiaMundial: 'World Premiere',
    festivais: 'Festivals',
    premios: 'Awards',
    melhorFilme: 'Best Film',
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
    mostraInternacional2025: 'International Showcase 2025',
    mostraInternacional2025Summary: 'Two auteur feature films selected for Rotterdam showcasing MOVEO aesthetics.',
    residenciaCriativaDF: 'Creative Residency DF',
    residenciaCriativaDFSummary: 'Immersive directing laboratory focused on hybrid narratives and living archives.',
    coproducaoTransatlantica: 'Transatlantic co-production',
    coproducaoTransatlanticaSummary: 'New film in partnership with European studios expands the production company\'s presence.',
    marco2025: 'March 2025',
    junho2025: 'June 2025',
    agosto2025: 'August 2025',
    festival: 'Festival',
    residencia: 'Residency',
    producaoTag: 'Production',
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


