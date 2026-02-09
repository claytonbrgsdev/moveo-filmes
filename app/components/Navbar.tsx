'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';
import { useLanguage } from '@/lib/hooks/useLanguage';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const menuItems = [
    { label: t('catalog'), path: '/catalogo' },
    { label: t('about'), path: '/sobre' },
    { label: t('media'), path: '/posts' },
    { label: t('contact'), path: '/contato' },
  ];

  useEffect(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    setCurrentDate(`${year}.${month}.${day}`);
  }, []);

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

  const fontStyle = {
    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent" style={{ height: '50px', mixBlendMode: 'difference' }}>
        <div className="relative w-full h-full flex items-center">
          {/* REC indicator — col 1 */}
          <div
            className="absolute flex items-center text-white text-xs"
            style={{ left: getMarkerPosition(1), top: '50%', transform: 'translateY(-50%)', ...fontStyle }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '-12px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#ff3333',
                  borderRadius: '50%',
                  animation: 'pulse-rec 2s ease-in-out infinite',
                  marginRight: '6px',
                  flexShrink: 0,
                }}
              />
              <span style={{ letterSpacing: '0.1em' }}>REC</span>
            </span>
          </div>

          {/* Logo — col 3 */}
          <div
            className="absolute flex items-center cursor-pointer hover:opacity-70 transition-opacity"
            style={{ left: getMarkerPosition(3), bottom: '0px' }}
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
                width: 'auto',
              }}
              unoptimized
            />
          </div>

          {/* Date stamp — col 11 */}
          <div
            className="absolute text-white text-xs"
            suppressHydrationWarning
            style={{ left: getMarkerPosition(11), bottom: '0px', ...fontStyle, letterSpacing: '0.05em' }}
          >
            {currentDate}
          </div>

          {/* MENU — col 13 */}
          <div
            className="absolute text-white text-xs cursor-pointer hover:opacity-70 transition-opacity uppercase"
            style={{ left: getMarkerPosition(13), bottom: '0px', ...fontStyle }}
            onClick={handleMenuClick}
            data-magnetic
          >
            MENU
          </div>
        </div>
      </nav>

      {/* Pulse animation for REC dot */}
      <style jsx>{`
        @keyframes pulse-rec {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="flex flex-col gap-8 text-white text-2xl uppercase"
            style={fontStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:opacity-70 transition-opacity animated-underline"
                onClick={() => handleMenuItemClick(item.path)}
                data-magnetic
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
