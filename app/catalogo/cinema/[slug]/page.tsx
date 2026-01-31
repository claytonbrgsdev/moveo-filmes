import { notFound } from "next/navigation";
import FilmeContent from "./FilmeContent";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    // Criar cliente sem cookies para uso durante build estático
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: filmes } = await supabase
      .from("filmes")
      .select("slug");
    
    if (!filmes) return [];
    
    return filmes.map((filme) => ({
      slug: filme.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function FilmeCinemaPage({ params }: PageProps) {
  const { slug } = await params;
  // Usar cliente sem cookies para build estático
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Buscar filme pelo slug
  const { data: filme, error } = await supabase
    .from("filmes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !filme) {
    notFound();
  }

  // Buscar dados relacionados
  const [creditos, financiamentos, festivais, premiacoes, assets] = await Promise.all([
    // Créditos com relacionamentos
    supabase
      .from("filmes_creditos")
      .select(`
        *,
        pessoas(*),
        empresas(*)
      `)
      .eq("filme_id", filme.id)
      .order("ordem", { ascending: true }),
    
    // Financiamentos
    supabase
      .from("filmes_financiamentos")
      .select("*")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Festivais
    supabase
      .from("filmes_festivais")
      .select("*")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Premiações
    supabase
      .from("filmes_premiacoes")
      .select("*")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Assets (imagens adicionais)
    supabase
      .from("filmes_assets")
      .select("*")
      .eq("filme_id", filme.id)
      .eq("tipo", "imagem")
      .order("ordem", { ascending: true }),
  ]);

  return (
    <FilmeContent
      filme={filme}
      creditos={creditos.data || []}
      financiamentos={financiamentos.data || []}
      festivais={festivais.data || []}
      premiacoes={premiacoes.data || []}
      assets={assets.data || []}
    />
  );
}

