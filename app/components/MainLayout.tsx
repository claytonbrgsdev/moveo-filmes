'use client'

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { LocationInfo } from './LocationInfo';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen bg-black">
      {/* Linha horizontal superior - Linha A (50px do topo) */}
      <div 
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ top: '50px' }}
      />
      
      {/* Linha horizontal inferior - Linha J (50px do bottom) */}
      <div 
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ bottom: '50px' }}
      />

      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Container central - onde o conteúdo das páginas vai */}
      <main
        className="relative bg-black"
        style={{
          margin: '50px',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        {children}
      </main>

      {/* Informações de localização - fixas no bottom */}
      <LocationInfo />

      {/* Switch de linguagem na posição J13 - fixo no bottom */}
      <div 
        className="fixed text-white text-xs z-40 cursor-pointer hover:opacity-70 transition-opacity"
        style={{ 
          left: getMarkerPosition(13),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div className="flex items-center gap-2">
          <span className={language === 'pt' ? 'font-bold' : 'opacity-50'}>PT</span>
          <span className="opacity-50">|</span>
          <span className={language === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
        </div>
      </div>
    </div>
  );
}

