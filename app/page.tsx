'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import Link from 'next/link';
import Image from 'next/image';
import { VerticalGuides } from '@/app/components/VerticalGuides';

export default function Home() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* Guias Verticais - Remover quando não precisar mais */}
      <VerticalGuides />
      {/* Primeira Seção - Hero com Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/imagens/TRÊS_7_300dpi.jpg')"
            }}
          />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="relative z-10 h-full">
          {/* Título "Moveo" - Posicionado conforme grid (relativo à tela total) */}
          <div className="absolute top-[82%] bottom-[10%] flex items-center" style={{ left: '2.6%', width: '46.4vw' }}>
            <h1 className="text-8xl md:text-[12rem] lg:text-[14rem] font-bold w-full leading-none" style={{ mixBlendMode: 'difference', color: 'antiquewhite', opacity: 0.5 }}>
              Moveo
            </h1>
          </div>

          {/* Logo e Tagline - Posicionado conforme grid (relativo à tela total) */}
          <div className="absolute top-[82%] bottom-[10%] flex flex-col gap-3" style={{ left: '65.8%', right: '2.6%' }}>
            {/* Logo */}
            <div className="bg-white rounded flex items-center justify-center self-start" style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }}>
              <Image
                src="/imagens/logomarca-backgroun-branco.png"
                alt="Logo Moveo"
                width={64}
                height={64}
                className="object-contain"
                style={{ width: '100%', height: '100%', mixBlendMode: 'difference', opacity: 0.5 }}
                unoptimized
              />
            </div>
            
            {/* Tagline */}
            <div className="text-left">
              <p className="text-sm md:text-base leading-relaxed" style={{ mixBlendMode: 'difference', opacity: 0.5, color: 'antiquewhite' }}>
                Produtora boutique de filmes
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ mixBlendMode: 'difference', opacity: 0.5, color: 'antiquewhite' }}>
                independentes baseada em Brasília-DF
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Segunda Seção - Conteúdo */}
      <section className="min-h-screen px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Container de texto PT */}
            <div className="p-6">
              <p className="text-black">
                Produtora boutique de filmes independentes baseada em Brasília-DF.
              </p>
            </div>

            {/* Container de texto EN */}
            <div className="p-6">
              <p className="text-black">
                Independent boutique film production company based in Brasília, Brazil.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Container de imagem retangular */}
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>

            {/* Container de imagem quadrado */}
            <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>
          </div>

          {/* Container próximo filme */}
          <div className="mb-8 p-6 border border-gray-300 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Imagem do filme */}
              <div className="w-full md:w-48 h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Film Image</span>
              </div>

              {/* Conteúdo do filme */}
              <div className="flex-1 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-black">
                  {language === 'pt' ? 'Próximo Filme' : 'Next Film'}
                </h2>
                <p className="text-black">
                  {language === 'pt' ? 'Título do filme' : 'Film title'}
                </p>
                <Link
                  href="#"
                  className="inline-block px-6 py-2 bg-black text-white rounded hover:opacity-80 transition-opacity w-fit"
                >
                  {language === 'pt' ? 'Ver mais' : 'Learn more'}
                </Link>
              </div>
            </div>
          </div>

          {/* Botão conhecer catálogo */}
          <div className="flex justify-center">
            <Link
              href="/catalogo"
              className="px-8 py-4 bg-black text-white rounded hover:opacity-80 transition-opacity text-lg"
            >
              {language === 'pt' ? 'Conhecer Catálogo' : 'View Catalog'}
            </Link>
          </div>
        </div>
      </section>
      </main>
  );
}
