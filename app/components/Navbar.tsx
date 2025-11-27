'use client'

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const menuItems = [
    { label: t('catalog'), path: '/catalogo' },
    { label: t('about'), path: '/sobre' },
    { label: t('media'), path: '/posts' },
    { label: t('contact'), path: '/contato' },
  ];

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent" style={{ height: '50px', mixBlendMode: 'difference' }}>
      <div className="relative w-full h-full flex items-center">
          {/* Logo na posição A1 (linha A, coluna 1) */}
          <div 
            className="absolute flex items-center cursor-pointer hover:opacity-70 transition-opacity"
            style={{ 
              left: getMarkerPosition(1),
              bottom: '0px'
            }}
            onClick={handleLogoClick}
          >
              <Image
              src="/imagens/logomarca.png"
                alt="Logo Moveo"
                width={64}
                height={64}
                className="object-contain"
              style={{ 
                mixBlendMode: 'difference',
                filter: 'brightness(0) invert(1)',
                height: '1.125rem',
                width: 'auto'
              }}
                unoptimized
              />
            </div>

          {/* Tab MENU na posição A13 - canto inferior esquerdo do quadrante dentro da Navbar */}
          <div 
            className="absolute text-white text-xs cursor-pointer hover:opacity-70 transition-opacity uppercase"
            style={{ 
              left: getMarkerPosition(13),
              bottom: '0px',
              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
            }}
            onClick={handleMenuClick}
          >
            MENU
          </div>
        </div>
      </nav>
          
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="flex flex-col gap-8 text-white text-2xl uppercase"
            style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif" }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => handleMenuItemClick(item.path)}
              >
                {item.label}
              </div>
            ))}
            </div>
        </div>
      )}
    </>
  );
}

