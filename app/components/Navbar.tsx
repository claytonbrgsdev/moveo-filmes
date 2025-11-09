'use client'

import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { useAuth } from "@/lib/hooks/useAuth";
import { useLanguage } from "@/lib/hooks/useLanguage";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white" style={{ height: '50px', mixBlendMode: 'difference' }}>
      <div className="relative w-full h-full flex items-center">
        {/* Links de navegação posicionados no grid (relativo à tela total) */}
        <div className="absolute inset-0" style={{ mixBlendMode: 'difference' }}>
          {/* CATÁLOGO: Primeiro marcador (2.6%) */}
          <div className="absolute flex items-center justify-center" style={{ left: '2.6%', top: '3.5px', bottom: '0', height: '100%', overflow: 'visible' }}>
            <button
              onClick={() => handleNavigation('/catalogo')}
              className="text-white hover:opacity-70 transition-opacity text-sm md:text-base uppercase tracking-wide flex items-center justify-center bg-transparent border-none cursor-pointer"
              style={{ lineHeight: 'normal', paddingTop: '0', paddingBottom: '0', mixBlendMode: 'difference' }}
            >
              {t('catalog')}
            </button>
          </div>
          
          {/* MÍDIA: Segundo marcador (18.4%) */}
          <div className="absolute flex items-center justify-center" style={{ left: '18.4%', top: '3.5px', bottom: '0', height: '100%', overflow: 'visible' }}>
            <button
              onClick={() => handleNavigation('/posts')}
              className="text-white hover:opacity-70 transition-opacity text-sm md:text-base uppercase tracking-wide flex items-center justify-center bg-transparent border-none cursor-pointer"
              style={{ lineHeight: 'normal', paddingTop: '0', paddingBottom: '0', mixBlendMode: 'difference' }}
            >
              {t('media')}
            </button>
          </div>
          
          {/* SOBRE: Terceiro marcador (34.2%) */}
          <div className="absolute flex items-center justify-center" style={{ left: '34.2%', top: '3.5px', bottom: '0', height: '100%', overflow: 'visible' }}>
            <button
              onClick={() => handleNavigation('/sobre')}
              className="text-white hover:opacity-70 transition-opacity text-sm md:text-base uppercase tracking-wide flex items-center justify-center bg-transparent border-none cursor-pointer"
              style={{ lineHeight: 'normal', paddingTop: '0', paddingBottom: '0', mixBlendMode: 'difference' }}
            >
              {t('about')}
            </button>
          </div>
          
          {/* CONTATO: Quinto marcador (65.8%) */}
          <div className="absolute flex items-center justify-center" style={{ left: '65.8%', top: '3.5px', bottom: '0', height: '100%', overflow: 'visible' }}>
            <button
              onClick={() => handleNavigation('/contato')}
              className="text-white hover:opacity-70 transition-opacity text-sm md:text-base uppercase tracking-wide flex items-center justify-center bg-transparent border-none cursor-pointer"
              style={{ lineHeight: 'normal', paddingTop: '0', paddingBottom: '0', mixBlendMode: 'difference' }}
            >
              {t('contact')}
            </button>
          </div>
        </div>

        {/* Language Switcher e Auth - posicionados discretamente no canto */}
        <div className="absolute flex items-center gap-4" style={{ right: '2.6%', top: '0', bottom: '0', height: '100%' }}>
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            className="text-xs text-white hover:opacity-70 transition-opacity px-2 py-1 border border-white rounded"
            style={{ mixBlendMode: 'difference' }}
            aria-label="Toggle language"
          >
            {language === 'en' ? 'EN' : 'PT'}
          </button>
          
          {/* Auth Section - Apenas mostra logout se autenticado */}
          {!loading && user && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white opacity-70">
                {t('admin')}
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs text-white hover:opacity-70 transition-opacity"
              >
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

