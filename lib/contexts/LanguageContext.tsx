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
    historicoSolidodeColaboracoes: 'Um histórico sólido\nde colaborações com\ntalentos emergentes',
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
    estreiaMundial: 'Estreia Mundial',
    festivais: 'Festivais',
    premios: 'Prêmios',
    melhorFilme: 'Melhor Filme',
    asMicangas: 'AS MIÇANGAS',
    asMicangasTitle: 'As Miçangas',
    oFilme: 'O Filme',
    oMisterioDaCarne: 'O Mistério da Carne',
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
    estreias: 'Estreias',
    mundial: 'Mundial:',
    europa: 'Europa:',
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
    historicoSolidodeColaboracoes: 'A solid history\nof collaborations with\nemerging talents',
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
    estreiaMundial: 'World Premiere',
    festivais: 'Festivals',
    premios: 'Awards',
    melhorFilme: 'Best Film',
    asMicangas: 'THE BEADS',
    asMicangasTitle: 'The Beads',
    oFilme: 'The Film',
    oMisterioDaCarne: 'The Mystery of Meat',
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
    estreias: 'Premieres',
    mundial: 'World:',
    europa: 'Europe:',
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
    distribuicao: 'Distribution:',
    agenciaFreakMundo: 'Freak Agency (World) and Moveo Filmes (Brazil)',
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


