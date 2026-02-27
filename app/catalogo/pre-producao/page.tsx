import { MainLayout } from "@/app/components/MainLayout";
import { FilmeCard } from "../cinema/FilmeCard";

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

function isConnectionError(msg: string, str: string): boolean {
  return (
    str.includes('<!DOCTYPE html') || msg.includes('<!DOCTYPE html') ||
    str.includes('Cloudflare') || msg.includes('Cloudflare') ||
    str.includes('521') || msg.includes('521') ||
    msg.toLowerCase().includes('network') || msg.toLowerCase().includes('connection') ||
    msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('fetch failed') ||
    msg.toLowerCase().includes('failed to fetch')
  );
}

export default async function PreProducaoPage() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let filmes: Filme[] | null = null;
  let error: { message: string; details?: string } | null = null;

  try {
    const { data, error: supabaseError } = await supabase
      .from("filmes")
      .select("id, slug, titulo_pt, ano, ano_previsto, status_interno_pt, poster_principal_url, thumbnail_card_url")
      .eq("categoria_site", "pre-producao")
      .order("ano", { ascending: false });

    if (supabaseError) {
      const msg = supabaseError.message || String(supabaseError);
      const str = JSON.stringify(supabaseError, null, 2);
      error = isConnectionError(msg, str)
        ? { message: 'O servidor está temporariamente indisponível. Por favor, tente novamente em alguns minutos.', details: 'Erro de conexão com o banco de dados (Código 521)' }
        : { message: msg || 'Erro ao carregar projetos', details: supabaseError.details || supabaseError.hint || undefined };
    } else {
      filmes = data?.map(f => ({
        ...f,
        ano: f.ano ?? undefined,
        ano_previsto: f.ano_previsto ?? undefined,
        titulo_pt: f.titulo_pt ?? undefined,
        status_interno_pt: f.status_interno_pt ?? undefined,
        poster_principal_url: f.poster_principal_url ?? undefined,
        thumbnail_card_url: f.thumbnail_card_url ?? undefined,
      })) || null;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const str = err instanceof Error ? err.toString() : String(err);
    error = isConnectionError(msg, str)
      ? { message: 'O servidor está temporariamente indisponível. Por favor, tente novamente em alguns minutos.', details: 'Erro de conexão com o banco de dados' }
      : { message: 'Erro ao carregar projetos. Por favor, tente novamente mais tarde.', details: 'Erro inesperado' };
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto">
        <div className="w-full">
          <div className="flex flex-col">
            <div className="mb-12 md:mb-16">
              <h1
                className="text-white mb-3"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(32px, 5vw, 100px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Pré-Produção
              </h1>
              <h2
                className="text-white opacity-70"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
                  fontSize: 'clamp(16px, 1.5vw, 22px)',
                  fontWeight: 400,
                }}
              >
                Projetos em fase de pré-produção
              </h2>
            </div>
            <div>
              {error && (
                <div className="border border-white/10 rounded p-6 mb-8 bg-white/5" style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif" }}>
                  <h3 className="text-white mb-2" style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif", fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700 }}>
                    Erro ao carregar projetos
                  </h3>
                  <p className="text-white/70 mb-2" style={{ fontSize: 'clamp(14px, 1.3vw, 18px)' }}>{error.message}</p>
                  {error.details && <p className="text-white/50 mt-2" style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}>{error.details}</p>}
                  <p className="text-white/60 mt-4" style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}>Se o problema persistir, verifique sua conexão com a internet ou entre em contato com o suporte.</p>
                </div>
              )}
              {!error && (!filmes || filmes.length === 0) ? (
                <div className="border border-white/10 rounded p-6 bg-white/5" style={{ fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif" }}>
                  <p className="text-white/70" style={{ fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, Helvetica, sans-serif", fontSize: 'clamp(16px, 1.5vw, 22px)', fontWeight: 700 }}>
                    Nenhum projeto encontrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filmes?.map((filme) => (
                    <FilmeCard key={filme.id} filme={filme} />
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
