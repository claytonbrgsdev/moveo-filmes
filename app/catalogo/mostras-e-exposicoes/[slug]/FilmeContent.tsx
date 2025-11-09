'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import Image from 'next/image';

interface FilmeContentProps {
  filme: any;
  creditos?: any[];
  financiamentos?: any[];
  festivais?: any[];
  premiacoes?: any[];
  assets?: any[];
}

// Função helper para determinar o ano a exibir
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
  // Adicionar URLs dos assets
  assets.forEach((asset: any) => {
    if (asset.url) imageUrls.push(asset.url);
  });

  return (
    <main className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          {/* Container Título */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              {language === 'pt' ? filme.titulo_pt : filme.titulo_en || filme.titulo_pt}
            </h1>
            {filme.titulo_en && language === 'pt' && (
              <h2 className="text-2xl md:text-3xl font-light text-black opacity-70 mt-2">
                {filme.titulo_en}
              </h2>
            )}
            {filme.titulo_pt && language === 'en' && (
              <h2 className="text-2xl md:text-3xl font-light text-black opacity-70 mt-2">
                {filme.titulo_pt}
              </h2>
            )}
          </div>

          {/* Container Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ano */}
            {(filme.ano || filme.ano_previsto) && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Ano' : 'Year'}
                </h3>
                <p className="text-2xl font-bold text-black">
                  {getAnoDisplay(filme.ano, filme.ano_previsto)}
                </p>
              </div>
            )}

            {/* Tipo de Obra */}
            {filme.tipo_obra && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Tipo de Obra' : 'Type'}
                </h3>
                <p className="text-xl font-semibold text-black capitalize">
                  {filme.tipo_obra}
                </p>
              </div>
            )}

            {/* Duração */}
            {filme.duracao_min && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Duração' : 'Duration'}
                </h3>
                <p className="text-xl font-semibold text-black">
                  {filme.duracao_min} {language === 'pt' ? 'min' : 'min'}
                </p>
              </div>
            )}

            {/* Status */}
            {filme.status_interno_pt && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Status' : 'Status'}
                </h3>
                <p className="text-xl font-semibold text-black italic">
                  {language === 'pt' ? filme.status_interno_pt : filme.status_interno_en || filme.status_interno_pt}
                </p>
              </div>
            )}

            {/* Gêneros */}
            {filme.generos && filme.generos.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Gêneros' : 'Genres'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filme.generos.map((genero: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm capitalize"
                    >
                      {genero}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Países de Produção */}
            {filme.paises_producao && filme.paises_producao.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Países de Produção' : 'Production Countries'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filme.paises_producao.map((pais: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
                    >
                      {pais}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categoria Site */}
            {filme.categoria_site && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-sm font-semibold text-black opacity-70 mb-2">
                  {language === 'pt' ? 'Categoria' : 'Category'}
                </h3>
                <p className="text-xl font-semibold text-black capitalize">
                  {filme.categoria_site}
                </p>
              </div>
            )}
          </div>

          {/* Container Sinopse */}
          {(filme.sinopse_pt || filme.sinopse_en) && (
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold text-black mb-4">
                {language === 'pt' ? 'Sinopse' : 'Synopsis'}
              </h3>
              <p className="text-black leading-relaxed">
                {language === 'pt' 
                  ? filme.sinopse_pt 
                  : filme.sinopse_en || filme.sinopse_pt}
              </p>
            </div>
          )}

          {/* Container Buscando */}
          {(filme.buscando_pt || filme.buscando_en) && (
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold text-black mb-4">
                {language === 'pt' ? 'Buscando' : 'Looking For'}
              </h3>
              <p className="text-black leading-relaxed">
                {language === 'pt' 
                  ? filme.buscando_pt 
                  : filme.buscando_en || filme.buscando_pt}
              </p>
            </div>
          )}

          {/* Container Imagens - Dinâmico (mínimo 1) */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-xl font-bold text-black mb-4">
              {language === 'pt' ? 'Imagens' : 'Images'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageUrls.length > 0 ? (
                imageUrls.map((url, index) => (
                  <div key={index} className="relative w-full aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`${language === 'pt' ? 'Imagem' : 'Image'} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))
              ) : (
                <div className="relative w-full aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image Placeholder</span>
                </div>
              )}
            </div>
          </div>

          {/* Container Ficha Técnica */}
          {(creditos.length > 0 || financiamentos.length > 0) && (
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold text-black mb-4">
                {language === 'pt' ? 'Ficha Técnica' : 'Technical Details'}
              </h3>
              
              {/* Créditos */}
              {creditos.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    {language === 'pt' ? 'Créditos' : 'Credits'}
                  </h4>
                  <div className="space-y-2">
                    {creditos.map((credito: any) => (
                      <div key={credito.id} className="flex flex-col gap-1">
                        <span className="font-semibold text-black capitalize">
                          {credito.cargo}:
                        </span>
                        <span className="text-black">
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
                  <h4 className="text-lg font-semibold text-black mb-3">
                    {language === 'pt' ? 'Financiamentos' : 'Financing'}
                  </h4>
                  <div className="space-y-3">
                    {financiamentos.map((financiamento: any) => (
                      <div key={financiamento.id} className="border-l-2 border-gray-300 pl-4">
                        <p className="font-semibold text-black">
                          {financiamento.nome}
                        </p>
                        {financiamento.tipo && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {financiamento.tipo}
                          </p>
                        )}
                        {financiamento.ano && (
                          <p className="text-sm text-black opacity-70">
                            {financiamento.ano}
                          </p>
                        )}
                        {financiamento.fase && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Fase' : 'Phase'}: {financiamento.fase}
                          </p>
                        )}
                        {financiamento.resultado && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Resultado' : 'Result'}: {financiamento.resultado}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Container Exibições, Festivais e Premiações */}
          {(festivais.length > 0 || premiacoes.length > 0) && (
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold text-black mb-4">
                {language === 'pt' ? 'Exibições e Premiações' : 'Screenings and Awards'}
              </h3>
              
              {/* Festivais */}
              {festivais.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-black mb-3">
                    {language === 'pt' ? 'Festivais' : 'Festivals'}
                  </h4>
                  <div className="space-y-3">
                    {festivais.map((festival: any) => (
                      <div key={festival.id} className="border-l-2 border-gray-300 pl-4">
                        <p className="font-semibold text-black">
                          {festival.nome}
                        </p>
                        {festival.edicao && (
                          <p className="text-sm text-black opacity-70">
                            {language === 'pt' ? 'Edição' : 'Edition'}: {festival.edicao}
                          </p>
                        )}
                        {festival.ano && (
                          <p className="text-sm text-black opacity-70">
                            {festival.ano}
                          </p>
                        )}
                        {(festival.cidade || festival.pais) && (
                          <p className="text-sm text-black opacity-70">
                            {festival.cidade && `${festival.cidade}`}
                            {festival.cidade && festival.pais && ', '}
                            {festival.pais}
                          </p>
                        )}
                        {festival.secao && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Seção' : 'Section'}: {festival.secao}
                          </p>
                        )}
                        {festival.tipo_evento && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Tipo' : 'Type'}: {festival.tipo_evento}
                          </p>
                        )}
                        {festival.tipo_estreia && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Estreia' : 'Premiere'}: {festival.tipo_estreia}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premiações */}
              {premiacoes.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-black mb-3">
                    {language === 'pt' ? 'Premiações' : 'Awards'}
                  </h4>
                  <div className="space-y-3">
                    {premiacoes.map((premiacao: any) => (
                      <div key={premiacao.id} className="border-l-2 border-gray-300 pl-4">
                        <p className="font-semibold text-black">
                          {premiacao.titulo_do_premio}
                        </p>
                        {premiacao.categoria && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Categoria' : 'Category'}: {premiacao.categoria}
                          </p>
                        )}
                        {premiacao.ano && (
                          <p className="text-sm text-black opacity-70">
                            {premiacao.ano}
                          </p>
                        )}
                        {premiacao.festival_nome && (
                          <p className="text-sm text-black opacity-70">
                            {language === 'pt' ? 'Festival' : 'Festival'}: {premiacao.festival_nome}
                          </p>
                        )}
                        {premiacao.tipo && (
                          <p className="text-sm text-black opacity-70 capitalize">
                            {language === 'pt' ? 'Tipo' : 'Type'}: {premiacao.tipo}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

