import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Lista de tabelas para testar conectividade
const TABLES_TO_TEST = [
  "filmes",
  "posts",
  "pessoas",
  "empresas",
  "catalogo",
  "filmes_assets",
  "filmes_creditos",
  "filmes_elenco",
  "filmes_festivais",
  "filmes_financiamentos",
  "filmes_premiacoes",
  "filmes_relacionamentos",
  "pessoas_filmografias",
];

interface TableStatus {
  name: string;
  status: "success" | "error" | "empty";
  count: number;
  error?: string;
}

async function testTableConnection(
  supabase: SupabaseClient,
  tableName: string
): Promise<TableStatus> {
  try {
    const { error, count } = await supabase
      .from(tableName)
      .select("*", { count: "exact" })
      .limit(0);

    if (error) {
      return {
        name: tableName,
        status: "error",
        count: 0,
        error: error.message,
      };
    }

    return {
      name: tableName,
      status: count === 0 ? "empty" : "success",
      count: count || 0,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    return {
      name: tableName,
      status: "error",
      count: 0,
      error: errorMessage,
    };
  }
}

export default async function CentralPage() {
  // Verificar autenticação - redireciona para /login se não estiver autenticado
  // requireAuth() não funciona com static export - pular autenticação durante build
  // await requireAuth();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Variáveis de ambiente do Supabase não configuradas");
    return (
      <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
        <div className="text-red-500">
          Erro: Variáveis de ambiente do Supabase não configuradas. 
          Verifique se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão no .env.local
        </div>
      </div>
    );
  }

  // Usar cliente sem cookies para build estático
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as SupabaseClient<Database>;

  // Testar conectividade com todas as tabelas
  const tableStatuses = await Promise.all(
    TABLES_TO_TEST.map((table) => testTableConnection(supabase, table))
  );

  // Buscar filmes para exibição
  const { data: filmes, error, count } = await supabase
    .from("filmes")
    .select("*", { count: "exact" });

  const successfulTables = tableStatuses.filter((t) => t.status === "success");
  const errorTables = tableStatuses.filter((t) => t.status === "error");
  const emptyTables = tableStatuses.filter((t) => t.status === "empty");

  interface Filme {
    id: string;
    [key: string]: unknown;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen text-white">
      {/* Seção de Teste de Conectividade */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Teste de Conectividade - Frontend ↔ Database</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Resumo */}
          <div className="col-span-full grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-900 border border-green-500 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-300">
                {successfulTables.length}
              </div>
              <div className="text-sm text-green-400">
                Tabelas Acessíveis
              </div>
            </div>
            <div className="bg-yellow-900 border border-yellow-500 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-300">
                {emptyTables.length}
              </div>
              <div className="text-sm text-yellow-400">
                Tabelas Vazias
              </div>
            </div>
            <div className="bg-red-900 border border-red-500 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-300">
                {errorTables.length}
              </div>
              <div className="text-sm text-red-400">
                Erros de Conexão
              </div>
            </div>
          </div>

          {/* Lista de Status das Tabelas */}
          {tableStatuses.map((table) => (
            <div
              key={table.name}
              className={`border rounded-lg p-4 ${
                table.status === "success"
                  ? "bg-green-900 border-green-500"
                  : table.status === "empty"
                  ? "bg-yellow-900 border-yellow-500"
                  : "bg-red-900 border-red-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{table.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    table.status === "success"
                      ? "bg-green-800 text-green-200"
                      : table.status === "empty"
                      ? "bg-yellow-800 text-yellow-200"
                      : "bg-red-800 text-red-200"
                  }`}
                >
                  {table.status === "success"
                    ? "✓ OK"
                    : table.status === "empty"
                    ? "○ Vazia"
                    : "✗ Erro"}
                </span>
              </div>
              <div className="text-xs mt-1">
                {table.status === "success" && (
                  <span className="text-green-300">
                    {table.count} registro{table.count !== 1 ? "s" : ""}
                  </span>
                )}
                {table.status === "empty" && (
                  <span className="text-yellow-300">
                    Tabela existe mas está vazia
                  </span>
                )}
                {table.status === "error" && (
                  <span className="text-red-300 text-xs">
                    {table.error}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Filmes */}
      <div className="border-t border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-4">Filmes</h2>
        
        {error && (
          <div className="text-red-500 mb-4">
            <p className="font-bold">Erro ao carregar filmes:</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        )}

        {!error && (!filmes || filmes.length === 0) ? (
          <div className="border border-yellow-500 rounded-lg p-6 bg-yellow-900">
            <p className="font-bold text-yellow-200">
              Nenhum filme encontrado
            </p>
            <p className="text-sm text-yellow-300 mt-2">
              Total de registros: {count ?? 0}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Total de filmes encontrados: {filmes?.length || 0}
            </div>
            <div className="grid gap-6">
              {filmes?.map((filme: Filme) => (
                <div key={filme.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                  <pre className="text-sm overflow-auto text-white">
                    {JSON.stringify(filme, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
