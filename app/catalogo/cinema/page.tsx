import { createClient } from "@/lib/supabase/server";
import { MainLayout } from "@/app/components/MainLayout";
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

export default async function CinemaPage() {
  const supabase = await createClient();

  // Buscar filmes da tabela filmes
  let filmes: Filme[] | null = null;
  let error: { message: string; details?: string } | null = null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("filmes")
      .select("id, slug, titulo_pt, ano, ano_previsto, status_interno_pt, poster_principal_url, thumbnail_card_url")
      .order("ano", { ascending: false });

    if (supabaseError) {
      // Normalizar a mensagem de erro
      const errorStr = JSON.stringify(supabaseError, null, 2);
      const errorMessage = supabaseError.message || String(supabaseError);
      
      // Verificar se o erro contém indicações de servidor offline (HTML, Cloudflare, erro 521)
      if (
        errorStr.includes('<!DOCTYPE html') || 
        errorMessage.includes('<!DOCTYPE html') ||
        errorStr.includes('Cloudflare') || 
        errorMessage.includes('Cloudflare') ||
        errorStr.includes('521') || 
        errorMessage.includes('521') ||
        errorStr.includes('Web server is down') ||
        errorMessage.includes('Web server is down') ||
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('timeout') ||
        errorMessage.toLowerCase().includes('fetch failed')
      ) {
        error = {
          message: 'O servidor está temporariamente indisponível. Por favor, tente novamente em alguns minutos.',
          details: 'Erro de conexão com o banco de dados (Código 521)'
        };
      } else {
        error = {
          message: supabaseError.message || 'Erro ao carregar filmes',
          details: supabaseError.details || supabaseError.hint || undefined
        };
      }
    } else {
      filmes = data;
    }
  } catch (err) {
    // Capturar erros de rede ou outros erros não tratados
    const errorStr = err instanceof Error ? err.toString() : String(err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    // Verificar se é um erro de conexão/HTML
    if (
      errorStr.includes('<!DOCTYPE html') || 
      errorMessage.includes('<!DOCTYPE html') ||
      errorStr.includes('Cloudflare') || 
      errorMessage.includes('Cloudflare') ||
      errorStr.includes('521') || 
      errorMessage.includes('521') ||
      errorMessage.toLowerCase().includes('network') ||
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('timeout') ||
      errorMessage.toLowerCase().includes('fetch failed') ||
      errorMessage.toLowerCase().includes('failed to fetch')
    ) {
      error = {
        message: 'O servidor está temporariamente indisponível. Por favor, tente novamente em alguns minutos.',
        details: 'Erro de conexão com o banco de dados'
      };
    } else {
      // Para outros erros, mostrar uma mensagem genérica (sem expor detalhes técnicos)
      error = {
        message: 'Erro ao carregar filmes. Por favor, tente novamente mais tarde.',
        details: 'Erro inesperado'
      };
    }
  }

  // Função helper para determinar o ano a exibir
  const getAnoDisplay = (ano: number | null | undefined, anoPrevisto: number | null | undefined): string => {
    if (ano) return ano.toString();
    if (anoPrevisto) return anoPrevisto.toString();
    return "em breve";
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Container Principal */}
        <div className="flex flex-col gap-8">
          {/* Container com Título e Subtítulo */}
          <div>
              <h1 className="text-4xl font-bold text-white mb-4">Cinema</h1>
              <h2 className="text-2xl font-semibold text-white opacity-70">
              Filmes de longa-metragem
            </h2>
          </div>

          {/* Container com Grid de Cards */}
          <div>
            {error && (
              <div className="border border-red-500/50 rounded-lg p-6 bg-red-950/20 mb-8">
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  Erro ao carregar filmes
                </h3>
                <p className="text-red-300 mb-2">{error.message}</p>
                {error.details && (
                  <p className="text-sm text-red-400/70 mt-2 opacity-75">
                    {error.details}
                  </p>
                )}
                <p className="text-sm text-white/60 mt-4">
                  Se o problema persistir, verifique sua conexão com a internet ou entre em contato com o suporte.
                </p>
              </div>
            )}

            {!error && (!filmes || filmes.length === 0) ? (
                <div className="border border-yellow-500 rounded-lg p-6 bg-yellow-900">
                  <p className="font-bold text-yellow-200">
                  Nenhum filme encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filmes?.map((filme) => (
                  <Link
                    key={filme.id}
                    href={`/catalogo/cinema/${filme.slug}`}
                      className="border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                  >
                    {/* Imagem do Filme */}
                      <div className="w-full h-64 bg-gray-900 relative">
                      {filme.poster_principal_url || filme.thumbnail_card_url ? (
                        <Image
                          src={(filme.poster_principal_url || filme.thumbnail_card_url) as string}
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
      </div>
    </MainLayout>
  );
}
