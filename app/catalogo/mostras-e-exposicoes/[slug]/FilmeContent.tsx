'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '@/app/components/MainLayout';
import Image from 'next/image';
import {
  getMarkerPosition,
  getHorizontalLinePosition,
  getWidthBetweenMarkers,
  getHeightBetweenLines,
} from '@/lib/utils/gridCoordinates';

const FONT_LARGE = 'clamp(24px, 2.3vw, 40px)';
const FONT_MEDIUM = 'clamp(16px, 1.5vw, 22px)';
const FONT_SMALL = 'clamp(10px, 0.85vw, 13px)';

interface Pessoa {
  id?: string | null;
  nome?: string | null;
  nome_exibicao?: string | null;
  [key: string]: unknown;
}

interface Empresa {
  id?: string | null;
  nome?: string | null;
  nome_exibicao?: string | null;
  [key: string]: unknown;
}

interface Credito {
  id: string;
  cargo: string;
  pessoa_id?: string | null;
  empresa_id?: string | null;
  nome_exibicao?: string | null;
  pessoas?: Pessoa | null;
  empresas?: Empresa | null;
  [key: string]: unknown;
}

interface Financiamento {
  id: string;
  nome: string;
  tipo?: string | null;
  ano?: number | null;
  fase?: string | null;
  resultado?: string | null;
  [key: string]: unknown;
}

interface Festival {
  id: string;
  nome: string;
  edicao?: string | null;
  ano?: number | null;
  cidade?: string | null;
  pais?: string | null;
  secao?: string | null;
  tipo_evento?: string | null;
  tipo_estreia?: string | null;
  [key: string]: unknown;
}

interface Premiacao {
  id: string;
  titulo_do_premio: string;
  categoria?: string | null;
  ano?: number | null;
  festival_nome?: string | null;
  tipo?: string | null;
  [key: string]: unknown;
}

interface Asset {
  id: string;
  url?: string | null;
  tipo?: string | null;
  [key: string]: unknown;
}

interface Filme {
  id: string;
  titulo_pt?: string | null;
  titulo_en?: string | null;
  ano?: number | null;
  ano_previsto?: number | null;
  tipo_obra?: string | null;
  duracao_min?: number | null;
  status_interno_pt?: string | null;
  status_interno_en?: string | null;
  generos?: string[] | null;
  paises_producao?: string[] | null;
  categoria_site?: string | null;
  sinopse_pt?: string | null;
  sinopse_en?: string | null;
  buscando_pt?: string | null;
  buscando_en?: string | null;
  poster_principal_url?: string | null;
  thumbnail_card_url?: string | null;
  imagem_og_url?: string | null;
  [key: string]: unknown;
}

interface FilmeContentProps {
  filme: Filme;
  creditos?: Credito[];
  financiamentos?: Financiamento[];
  festivais?: Festival[];
  premiacoes?: Premiacao[];
  assets?: Asset[];
}

const getAnoDisplay = (ano: number | null | undefined, anoPrevisto: number | null | undefined): string => {
  if (ano) return ano.toString();
  if (anoPrevisto) return anoPrevisto.toString();
  return "em breve";
};

export default function FilmeContent({ 
  filme, 
  creditos = [], 
  financiamentos = [], 
  festivais = [], 
  premiacoes = [],
  assets = []
}: FilmeContentProps) {
  const { language } = useLanguage();

  // Coletar todas as URLs de imagem disponíveis
  const imageUrls: string[] = [];
  if (filme.poster_principal_url) imageUrls.push(filme.poster_principal_url);
  if (filme.thumbnail_card_url) imageUrls.push(filme.thumbnail_card_url);
  if (filme.imagem_og_url) imageUrls.push(filme.imagem_og_url);
  assets.forEach((asset: Asset) => {
    if (asset.url) imageUrls.push(asset.url);
  });

  return (
    <MainLayout>
      <div className="relative w-full text-white" style={{ paddingBottom: getHeightBetweenLines('A', 'B') }}>
        {/* Hero Section */}
        <section 
          className="relative"
          style={{
            width: getWidthBetweenMarkers(1, 14),
            minHeight: 'calc(100vh - 100px)',
            marginBottom: getHeightBetweenLines('A', 'B'),
          }}
        >
          {/* Background Image/Poster */}
          {filme.poster_principal_url && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                  zIndex: 1,
                }}
              />
              <Image
                src={filme.poster_principal_url}
                alt={language === 'pt' ? filme.titulo_pt || '' : filme.titulo_en || filme.titulo_pt || ''}
                fill
                className="object-cover"
                priority
                unoptimized
                style={{ zIndex: 0 }}
              />
            </div>
          )}

          {/* Content Container */}
          <div
            className="relative z-10 flex flex-col justify-end"
            style={{
              paddingLeft: getMarkerPosition(1),
              paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
              paddingTop: getHorizontalLinePosition('A'),
              paddingBottom: getHorizontalLinePosition('A'),
              height: '100%',
              minHeight: 'calc(100vh - 100px)',
            }}
          >
            {/* Título Principal */}
            <div
              style={{
                width: getWidthBetweenMarkers(1, 10),
                marginBottom: getHeightBetweenLines('A', 'B'),
              }}
            >
              <h1
                className="text-white uppercase mix-blend-difference"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Heavy Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(64px, 8vw, 180px)',
                  lineHeight: '0.85',
                  letterSpacing: '-0.07em',
                  margin: 0,
                  padding: 0,
                  textShadow: '0 0 40px rgba(0,0,0,0.5)',
                }}
              >
                {language === 'pt' ? filme.titulo_pt : filme.titulo_en || filme.titulo_pt}
              </h1>
              
              {/* Subtítulo (título no outro idioma) */}
              {(filme.titulo_en && language === 'pt') || (filme.titulo_pt && language === 'en') ? (
                <h2
                  className="text-white opacity-70 mix-blend-difference"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Light Extended', Arial, Helvetica, sans-serif",
                    fontSize: 'clamp(20px, 2vw, 36px)',
                    lineHeight: '1.3',
                    fontWeight: 300,
                    marginTop: 'clamp(16px, 2vw, 32px)',
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {filme.titulo_en && language === 'pt' ? filme.titulo_en : filme.titulo_pt}
                </h2>
              ) : null}

              {/* Decorative Lines */}
              <div
                className="absolute"
                style={{
                  left: 0,
                  bottom: '-2em',
                  width: getWidthBetweenMarkers(1, 3),
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
              <div
                className="absolute"
                style={{
                  left: 0,
                  bottom: '-2.5em',
                  width: getWidthBetweenMarkers(1, 2),
                  height: '1px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
            </div>
          </div>
        </section>

        {/* Seção Informações Básicas - Grid organizado */}
        <div 
          className="mb-8"
          style={{
            width: getWidthBetweenMarkers(1, 14),
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: getWidthBetweenMarkers(1, 2),
              paddingLeft: getMarkerPosition(1),
              paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
            }}
          >
            {/* Ano */}
            {(filme.ano || filme.ano_previsto) && (
              <div>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Ano' : 'Year'}
                </p>
                <p
                  className="text-white"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: FONT_LARGE,
                    lineHeight: '1.2',
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {getAnoDisplay(filme.ano, filme.ano_previsto)}
                </p>
              </div>
            )}

            {/* Tipo de Obra */}
            {filme.tipo_obra && (
              <div>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Tipo' : 'Type'}
                </p>
                <p
                  className="text-white capitalize"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_MEDIUM,
                    lineHeight: '1.4',
                    margin: 0,
                  }}
                >
                  {filme.tipo_obra}
                </p>
              </div>
            )}

            {/* Duração */}
            {filme.duracao_min && (
              <div>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Duração' : 'Duration'}
                </p>
                <p
                  className="text-white"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_MEDIUM,
                    lineHeight: '1.4',
                    margin: 0,
                  }}
                >
                  {filme.duracao_min} {language === 'pt' ? 'min' : 'min'}
                </p>
              </div>
            )}

            {/* Status */}
            {filme.status_interno_pt && (
              <div>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Status' : 'Status'}
                </p>
                <p
                  className="text-white italic"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_MEDIUM,
                    lineHeight: '1.4',
                    margin: 0,
                  }}
                >
                  {language === 'pt' ? filme.status_interno_pt : filme.status_interno_en || filme.status_interno_pt}
                </p>
              </div>
            )}

            {/* Gêneros - Span 2 colunas */}
            {filme.generos && filme.generos.length > 0 && (
              <div style={{ gridColumn: 'span 2' }}>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Gêneros' : 'Genres'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
                  {filme.generos.map((genero: string, index: number) => (
                    <span
                      key={index}
                      className="text-white capitalize"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        lineHeight: '1.4',
                        padding: '0.25em 0.75em',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {genero}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Países de Produção - Span 2 colunas */}
            {filme.paises_producao && filme.paises_producao.length > 0 && (
              <div style={{ gridColumn: 'span 2' }}>
                <p
                  className="text-white opacity-60"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                    fontSize: FONT_SMALL,
                    lineHeight: '1.4',
                    marginBottom: '0.5em',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {language === 'pt' ? 'Países' : 'Countries'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
                  {filme.paises_producao.map((pais: string, index: number) => (
                    <span
                      key={index}
                      className="text-white"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                        fontSize: FONT_SMALL,
                        lineHeight: '1.4',
                        padding: '0.25em 0.75em',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {pais}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>

        {/* Seção Sinopse */}
          {(filme.sinopse_pt || filme.sinopse_en) && (
          <div 
            className="mb-8"
            style={{
              width: getWidthBetweenMarkers(1, 14),
            }}
          >
            <div
              style={{
                paddingLeft: getMarkerPosition(1),
                paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
                width: getWidthBetweenMarkers(1, 10),
              }}
            >
              <h3
                className="text-white uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_LARGE,
                  lineHeight: '1.2',
                  fontWeight: 700,
                  marginBottom: '1em',
                  letterSpacing: '-0.02em',
                }}
              >
                {language === 'pt' ? 'Sinopse' : 'Synopsis'}
              </h3>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: FONT_MEDIUM,
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {language === 'pt' 
                  ? filme.sinopse_pt 
                  : filme.sinopse_en || filme.sinopse_pt}
              </p>
            </div>
            </div>
          )}

        {/* Seção Buscando */}
          {(filme.buscando_pt || filme.buscando_en) && (
          <div 
            className="mb-8"
            style={{
              width: getWidthBetweenMarkers(1, 14),
            }}
          >
            <div
              style={{
                paddingLeft: getMarkerPosition(1),
                paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
                width: getWidthBetweenMarkers(1, 10),
              }}
            >
              <h3
                className="text-white uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_LARGE,
                  lineHeight: '1.2',
                  fontWeight: 700,
                  marginBottom: '1em',
                  letterSpacing: '-0.02em',
                }}
              >
                {language === 'pt' ? 'Buscando' : 'Looking For'}
              </h3>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: FONT_MEDIUM,
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {language === 'pt' 
                  ? filme.buscando_pt 
                  : filme.buscando_en || filme.buscando_pt}
              </p>
            </div>
            </div>
          )}

        {/* Seção Imagens - Grid organizado */}
        {imageUrls.length > 0 && (
          <div 
            className="mb-8"
            style={{
              width: getWidthBetweenMarkers(1, 14),
            }}
          >
            <div
              style={{
                paddingLeft: getMarkerPosition(1),
                paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
                width: getWidthBetweenMarkers(1, 14),
              }}
            >
              <h3
                className="text-white uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_LARGE,
                  lineHeight: '1.2',
                  fontWeight: 700,
                  marginBottom: '1.5em',
                  letterSpacing: '-0.02em',
                }}
              >
              {language === 'pt' ? 'Imagens' : 'Images'}
            </h3>
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: getWidthBetweenMarkers(1, 2),
                }}
              >
                {imageUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: '2/3',
                      width: '100%',
                    }}
                  >
                    <Image
                      src={url}
                      alt={`${language === 'pt' ? 'Imagem' : 'Image'} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                </div>
            </div>
          </div>
        )}

        {/* Seção Ficha Técnica - Duas Colunas */}
          {(creditos.length > 0 || financiamentos.length > 0) && (
          <div 
            className="mb-8"
            style={{
              width: getWidthBetweenMarkers(1, 14),
            }}
          >
            <div
              style={{
                paddingLeft: getMarkerPosition(1),
                paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
                width: getWidthBetweenMarkers(1, 14),
                display: 'grid',
                gridTemplateColumns: `1fr 1fr`,
                gap: getWidthBetweenMarkers(7, 8),
              }}
            >
              {/* Coluna Esquerda */}
              <div>
                <h3
                  className="text-white uppercase"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                    fontSize: FONT_LARGE,
                    lineHeight: '1.2',
                    fontWeight: 700,
                    marginBottom: '1.5em',
                    letterSpacing: '-0.02em',
                  }}
                >
                {language === 'pt' ? 'Ficha Técnica' : 'Technical Details'}
              </h3>
              
              {/* Créditos */}
              {creditos.length > 0 && (
                  <div style={{ marginBottom: '2.5em' }}>
                    <h4
                      className="text-white uppercase"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_MEDIUM,
                        lineHeight: '1.4',
                        fontWeight: 700,
                        marginBottom: '1em',
                        letterSpacing: '0.05em',
                      }}
                    >
                    {language === 'pt' ? 'Créditos' : 'Credits'}
                  </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
                      {creditos.slice(0, Math.ceil(creditos.length / 2)).map((credito: Credito) => (
                        <div key={credito.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                          <span
                            className="text-white uppercase"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_SMALL,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                            }}
                          >
                          {credito.cargo}:
                        </span>
                          <span
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                            }}
                          >
                          {credito.pessoa_id && credito.pessoas
                            ? (credito.pessoas.nome_exibicao || credito.pessoas.nome)
                            : credito.empresa_id && credito.empresas
                            ? (credito.empresas.nome_exibicao || credito.empresas.nome)
                            : credito.nome_exibicao || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financiamentos */}
              {financiamentos.length > 0 && (
                <div>
                    <h4
                      className="text-white uppercase"
                      style={{
                        fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                        fontSize: FONT_MEDIUM,
                        lineHeight: '1.4',
                        fontWeight: 700,
                        marginBottom: '1em',
                        letterSpacing: '0.05em',
                      }}
                    >
                    {language === 'pt' ? 'Financiamentos' : 'Financing'}
                  </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    {financiamentos.map((financiamento: Financiamento) => (
                        <div 
                          key={financiamento.id}
                          style={{
                            paddingLeft: '1em',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <p
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              marginBottom: '0.25em',
                            }}
                          >
                          {financiamento.nome}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em', marginTop: '0.25em' }}>
                            {financiamento.tipo && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {financiamento.tipo}
                              </span>
                        )}
                        {financiamento.ano && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                            {financiamento.ano}
                              </span>
                        )}
                        {financiamento.fase && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                            {language === 'pt' ? 'Fase' : 'Phase'}: {financiamento.fase}
                              </span>
                        )}
                        {financiamento.resultado && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                            {language === 'pt' ? 'Resultado' : 'Result'}: {financiamento.resultado}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna Direita - Resto dos Créditos */}
              {creditos.length > 0 && (
                <div style={{ paddingTop: 'calc(1.5em + 1.5em)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em', marginTop: '1em' }}>
                    {creditos.slice(Math.ceil(creditos.length / 2)).map((credito: Credito) => (
                      <div key={credito.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                        <span
                          className="text-white uppercase"
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                            fontSize: FONT_SMALL,
                            lineHeight: '1.4',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {credito.cargo}:
                        </span>
                        <span
                          className="text-white"
                          style={{
                            fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                            fontSize: FONT_MEDIUM,
                            lineHeight: '1.4',
                          }}
                        >
                          {credito.pessoa_id && credito.pessoas
                            ? (credito.pessoas.nome_exibicao || credito.pessoas.nome)
                            : credito.empresa_id && credito.empresas
                            ? (credito.empresas.nome_exibicao || credito.empresas.nome)
                            : credito.nome_exibicao || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}

        {/* Seção Festivais e Premiações - Duas Colunas */}
        {(festivais.length > 0 || premiacoes.length > 0) && (
          <div 
            style={{
              width: getWidthBetweenMarkers(1, 14),
            }}
          >
            <div
              style={{
                paddingLeft: getMarkerPosition(1),
                paddingRight: `calc(100% - ${getMarkerPosition(14)})`,
                width: getWidthBetweenMarkers(1, 14),
              }}
            >
              <h3
                className="text-white uppercase"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: FONT_LARGE,
                  lineHeight: '1.2',
                  fontWeight: 700,
                  marginBottom: '1.5em',
                  letterSpacing: '-0.02em',
                }}
              >
                {language === 'pt' ? 'Exibições e Premiações' : 'Screenings and Awards'}
              </h3>

              {/* Premiações - Distribuídas entre 2 colunas */}
              {premiacoes.length > 0 && (
                <div style={{ marginBottom: '2.5em' }}>
                  <h4
                    className="text-white uppercase"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_MEDIUM,
                      lineHeight: '1.4',
                      fontWeight: 700,
                      marginBottom: '1em',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {language === 'pt' ? 'Premiações' : 'Awards'}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `1fr 1fr`,
                      gap: getWidthBetweenMarkers(7, 8),
                    }}
                  >
                    {/* Coluna Esquerda - Primeira metade das premiações */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                      {premiacoes.slice(0, Math.ceil(premiacoes.length / 2)).map((premiacao: Premiacao) => (
                        <div
                          key={premiacao.id}
                          style={{
                            paddingLeft: '1em',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <p
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              marginBottom: '0.5em',
                            }}
                          >
                            {premiacao.titulo_do_premio}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                            {premiacao.categoria && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Categoria' : 'Category'}: {premiacao.categoria}
                              </span>
                            )}
                            {premiacao.ano && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {premiacao.ano}
                              </span>
                            )}
                            {premiacao.festival_nome && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Festival' : 'Festival'}: {premiacao.festival_nome}
                              </span>
                            )}
                            {premiacao.tipo && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Tipo' : 'Type'}: {premiacao.tipo}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coluna Direita - Segunda metade das premiações */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                      {premiacoes.slice(Math.ceil(premiacoes.length / 2)).map((premiacao: Premiacao) => (
                        <div
                          key={premiacao.id}
                          style={{
                            paddingLeft: '1em',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <p
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              marginBottom: '0.5em',
                            }}
                          >
                            {premiacao.titulo_do_premio}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                            {premiacao.categoria && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Categoria' : 'Category'}: {premiacao.categoria}
                              </span>
                            )}
                            {premiacao.ano && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {premiacao.ano}
                              </span>
                            )}
                            {premiacao.festival_nome && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Festival' : 'Festival'}: {premiacao.festival_nome}
                              </span>
                            )}
                            {premiacao.tipo && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Tipo' : 'Type'}: {premiacao.tipo}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Festivais - Distribuídos entre 2 colunas */}
              {festivais.length > 0 && (
                <div>
                  <h4
                    className="text-white uppercase"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: FONT_MEDIUM,
                      lineHeight: '1.4',
                      fontWeight: 700,
                      marginBottom: '1em',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {language === 'pt' ? 'Festivais' : 'Festivals'}
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `1fr 1fr`,
                      gap: getWidthBetweenMarkers(7, 8),
                    }}
                  >
                    {/* Coluna Esquerda - Primeira metade dos festivais */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                      {festivais.slice(0, Math.ceil(festivais.length / 2)).map((festival: Festival) => (
                        <div
                          key={festival.id}
                          style={{
                            paddingLeft: '1em',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <p
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              marginBottom: '0.5em',
                            }}
                          >
                            {festival.nome}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                            {festival.edicao && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Edição' : 'Edition'}: {festival.edicao}
                              </span>
                            )}
                            {festival.ano && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {festival.ano}
                              </span>
                            )}
                            {(festival.cidade || festival.pais) && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {festival.cidade && `${festival.cidade}`}
                                {festival.cidade && festival.pais && ', '}
                                {festival.pais}
                              </span>
                            )}
                            {festival.secao && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Seção' : 'Section'}: {festival.secao}
                                {festival.tipo_estreia && ` (${festival.tipo_estreia})`}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coluna Direita - Segunda metade dos festivais */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                      {festivais.slice(Math.ceil(festivais.length / 2)).map((festival: Festival) => (
                        <div
                          key={festival.id}
                          style={{
                            paddingLeft: '1em',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <p
                            className="text-white"
                            style={{
                              fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                              fontSize: FONT_MEDIUM,
                              lineHeight: '1.4',
                              fontWeight: 700,
                              marginBottom: '0.5em',
                            }}
                          >
                            {festival.nome}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
                            {festival.edicao && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Edição' : 'Edition'}: {festival.edicao}
                              </span>
                            )}
                            {festival.ano && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {festival.ano}
                              </span>
                            )}
                            {(festival.cidade || festival.pais) && (
                              <span
                                className="text-white opacity-60"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {festival.cidade && `${festival.cidade}`}
                                {festival.cidade && festival.pais && ', '}
                                {festival.pais}
                              </span>
                            )}
                            {festival.secao && (
                              <span
                                className="text-white opacity-60 capitalize"
                                style={{
                                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                                  fontSize: FONT_SMALL,
                                  lineHeight: '1.4',
                                }}
                              >
                                {language === 'pt' ? 'Seção' : 'Section'}: {festival.secao}
                                {festival.tipo_estreia && ` (${festival.tipo_estreia})`}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
