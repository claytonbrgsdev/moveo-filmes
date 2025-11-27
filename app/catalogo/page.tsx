'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '../components/MainLayout';
import Link from 'next/link';

export default function CatalogoPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Container Principal */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Container com Título e Parágrafo */}
          <div className="md:w-1/3">
            {/* Título */}
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 flex flex-col w-full">
              <span className="w-full flex justify-between">
                {'CATA'.split('').map((letter, index) => (
                  <span key={index}>{letter}</span>
                ))}
              </span>
              <span className="w-full flex justify-between">
                {'LOGO'.split('').map((letter, index) => (
                  <span key={index}>{letter}</span>
                ))}
              </span>
            </h1>
            
            {/* Parágrafo Lorem Ipsum - formato quadrado/bloco */}
            <div className="aspect-square">
                <p className="text-white text-justify h-full w-full">
                {language === 'pt' 
                  ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
              </p>
            </div>
          </div>

          {/* Container com Cinema e Mostras/Exposições */}
          <div className="md:w-2/3 flex flex-col gap-8">
            {/* Container Cinema */}
            <div>
              {/* Subtítulo Cinema */}
                <h2 className="text-2xl font-bold text-white mb-4">
                {language === 'pt' ? 'Cinema' : 'Cinema'}
              </h2>
              
              {/* Container de Imagem - Link clicável */}
              <Link href="/catalogo/cinema">
                  <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-gray-400 text-sm">Image Placeholder</span>
                </div>
              </Link>
            </div>

            {/* Container Mostras / Exposições */}
            <div>
              {/* Subtítulo Mostras / Exposições */}
                <h2 className="text-2xl font-bold text-white mb-4">
                {language === 'pt' ? 'Mostras / Exposições' : 'Film Showcase'}
              </h2>
              
              {/* Container de Imagem - Link clicável */}
              <Link href="/catalogo/mostras-e-exposicoes">
                  <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-gray-400 text-sm">Image Placeholder</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
