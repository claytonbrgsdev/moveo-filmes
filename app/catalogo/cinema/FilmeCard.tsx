'use client'

import Image from "next/image";
import Link from "next/link";

interface Filme {
  id: string;
  slug: string;
  titulo_pt?: string;
  ano?: number;
  ano_previsto?: number;
  status_interno_pt?: string;
  poster_principal_url?: string;
  thumbnail_card_url?: string;
}

interface FilmeCardProps {
  filme: Filme;
}

export function FilmeCard({ filme }: FilmeCardProps) {
  // Função helper para determinar o ano a exibir
  const getAnoDisplay = (ano: number | null | undefined, anoPrevisto: number | null | undefined): string => {
    if (ano) return ano.toString();
    if (anoPrevisto) return anoPrevisto.toString();
    return "em breve";
  };
  return (
    <Link
      key={filme.id}
      href={`/catalogo/cinema/${filme.slug}`}
      className="group relative overflow-hidden cursor-pointer block"
      style={{
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Imagem do Filme */}
      <div className="w-full aspect-[2/3] bg-black relative overflow-hidden">
        {filme.poster_principal_url || filme.thumbnail_card_url ? (
          <>
            <Image
              src={(filme.poster_principal_url || filme.thumbnail_card_url) as string}
              alt={filme.titulo_pt || "Filme"}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              unoptimized
            />
            {/* Overlay escuro para melhor legibilidade do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            <span 
              className="text-white/40"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(11px, 1vw, 13px)',
              }}
            >
              Sem imagem
            </span>
          </div>
        )}
        
        {/* Título do Filme - Centralizado */}
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          <h3 
            className="text-white text-center"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
              fontSize: 'clamp(20px, 2.5vw, 32px)',
              fontWeight: 700,
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            {filme.titulo_pt || "Sem título"}
          </h3>
        </div>
        
        {/* Ano - Canto inferior esquerdo */}
        <div className="absolute bottom-0 left-0 p-4 z-10">
          <p 
            className="text-white"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            }}
          >
            {getAnoDisplay(filme.ano, filme.ano_previsto)}
          </p>
        </div>
        
        {/* Status - Canto inferior direito */}
        {filme.status_interno_pt && (
          <div className="absolute bottom-0 right-0 p-4 z-10">
            <p 
              className="text-white/90 text-right"
              style={{
                fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                fontSize: 'clamp(12px, 1.2vw, 16px)',
                fontWeight: 400,
                fontStyle: 'italic',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              {filme.status_interno_pt}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

