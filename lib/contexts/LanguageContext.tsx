'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções básicas da navbar (podem ser expandidas)
const translations: Record<Language, Record<string, string>> = {
  pt: {
    catalog: 'Catálogo',
    media: 'Notícias',
    about: 'Sobre',
    contact: 'Contato',
    admin: 'Admin',
    logout: 'Sair',
  },
  en: {
    catalog: 'Catalog',
    media: 'News',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    logout: 'Logout',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Carregar idioma do localStorage ou usar padrão
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        return savedLanguage;
      }
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

  // Sempre fornecer o contexto, mesmo antes de montar
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


