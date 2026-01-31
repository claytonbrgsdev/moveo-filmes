import { MainLayout } from "@/app/components/MainLayout";
import { FilmeCard } from "./FilmeCard";

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
  // Usar cliente sem cookies para build estático
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      // Converter null para undefined para compatibilidade com o tipo Filme
      filmes = data?.map(filme => ({
        ...filme,
        ano: filme.ano ?? undefined,
        ano_previsto: filme.ano_previsto ?? undefined,
        titulo_pt: filme.titulo_pt ?? undefined,
        status_interno_pt: filme.status_interno_pt ?? undefined,
        poster_principal_url: filme.poster_principal_url ?? undefined,
        thumbnail_card_url: filme.thumbnail_card_url ?? undefined,
      })) || null;
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

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto">
        <div className="w-full">
          {/* Container Principal */}
          <div className="flex flex-col">
            {/* Container com Título e Subtítulo */}
            <div className="mb-12 md:mb-16">
              <h1 
                className="text-white mb-3"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(48px, 6vw, 120px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Cinema
              </h1>
              <h2 
                className="text-white opacity-70"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(16px, 1.5vw, 22px)',
                  fontWeight: 400,
                }}
              >
                Filmes de longa-metragem
              </h2>
            </div>

            {/* Container com Grid de Cards */}
            <div>
              {error && (
                <div 
                  className="border border-white/10 rounded p-6 mb-8 bg-white/5"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  }}
                >
                  <h3 
                    className="text-white mb-2"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      fontWeight: 700,
                    }}
                  >
                    Erro ao carregar filmes
                  </h3>
                  <p 
                    className="text-white/70 mb-2"
                    style={{
                      fontSize: 'clamp(14px, 1.3vw, 18px)',
                    }}
                  >
                    {error.message}
                  </p>
                  {error.details && (
                    <p 
                      className="text-white/50 mt-2"
                      style={{
                        fontSize: 'clamp(11px, 1vw, 13px)',
                      }}
                    >
                      {error.details}
                    </p>
                  )}
                  <p 
                    className="text-white/60 mt-4"
                    style={{
                      fontSize: 'clamp(11px, 1vw, 13px)',
                    }}
                  >
                    Se o problema persistir, verifique sua conexão com a internet ou entre em contato com o suporte.
                  </p>
                </div>
              )}

              {!error && (!filmes || filmes.length === 0) ? (
                <div 
                  className="border border-white/10 rounded p-6 bg-white/5"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  }}
                >
                  <p 
                    className="text-white/70"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                      fontSize: 'clamp(16px, 1.5vw, 22px)',
                      fontWeight: 700,
                    }}
                  >
                    Nenhum filme encontrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filmes?.map((filme) => (
                    <FilmeCard
                      key={filme.id}
                      filme={filme}
                    />
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
