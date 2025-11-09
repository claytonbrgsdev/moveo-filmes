import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function CinemaPage() {
  const supabase = await createClient();

  // Buscar filmes da tabela filmes
  const { data: filmes, error } = await supabase
    .from("filmes")
    .select("id, slug, titulo_pt, ano, ano_previsto, status_interno_pt, poster_principal_url, thumbnail_card_url")
    .order("ano", { ascending: false });

  // Função helper para determinar o ano a exibir
  const getAnoDisplay = (ano: number | null | undefined, anoPrevisto: number | null | undefined): string => {
    if (ano) return ano.toString();
    if (anoPrevisto) return anoPrevisto.toString();
    return "em breve";
  };

  return (
    <main className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto w-full">
        {/* Container Principal */}
        <div className="flex flex-col gap-8">
          {/* Container com Título e Subtítulo */}
          <div>
            <h1 className="text-4xl font-bold text-black mb-4">Cinema</h1>
            <h2 className="text-2xl font-semibold text-black opacity-70">
              Filmes de longa-metragem
            </h2>
          </div>

          {/* Container com Grid de Cards */}
          <div>
            {error && (
              <div className="text-red-500 mb-4">
                <p className="font-bold">Erro ao carregar filmes:</p>
                <p className="text-sm mt-2">{error.message}</p>
              </div>
            )}

            {!error && (!filmes || filmes.length === 0) ? (
              <div className="border border-yellow-500 rounded-lg p-6 bg-yellow-50">
                <p className="font-bold text-yellow-800">
                  Nenhum filme encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filmes?.map((filme: any) => (
                  <Link
                    key={filme.id}
                    href={`/catalogo/cinema/${filme.slug}`}
                    className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                  >
                    {/* Imagem do Filme */}
                    <div className="w-full h-64 bg-gray-200 relative">
                      {filme.poster_principal_url || filme.thumbnail_card_url ? (
                        <Image
                          src={filme.poster_principal_url || filme.thumbnail_card_url}
                          alt={filme.titulo_pt || "Filme"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        </div>
                      )}
                      
                      {/* Título do Filme - Centralizado */}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white text-center drop-shadow-lg">
                          {filme.titulo_pt || "Sem título"}
                        </h3>
                      </div>
                      
                      {/* Ano - Canto inferior esquerdo */}
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-lg font-bold text-white drop-shadow-lg">
                          {getAnoDisplay(filme.ano, filme.ano_previsto)}
                        </p>
                      </div>
                      
                      {/* Status - Canto inferior direito */}
                      {filme.status_interno_pt && (
                        <div className="absolute bottom-0 right-0 p-4">
                          <p className="text-lg italic text-white drop-shadow-lg">
                            {filme.status_interno_pt}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

