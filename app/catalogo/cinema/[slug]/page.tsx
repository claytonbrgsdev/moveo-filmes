import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FilmeContent from "./FilmeContent";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FilmeCinemaPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <FilmeContent
      filme={filme as any}
      creditos={(creditos.data || []) as any}
      financiamentos={(financiamentos.data || []) as any}
      festivais={(festivais.data || []) as any}
      premiacoes={(premiacoes.data || []) as any}
      assets={(assets.data || []) as any}
    />
  );
}

