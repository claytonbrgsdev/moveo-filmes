import { notFound } from "next/navigation";
import { createCachedAnonClient } from "@/lib/supabase/cached";
import { TAG_FILMES } from "@/lib/cache/tags";
import FilmeContent from "./FilmeContent";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    // Criar cliente sem cookies para uso durante build estático
    const supabase = createCachedAnonClient([TAG_FILMES]);
    
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

export default async function FilmeMostrasExposicoesPage({ params }: PageProps) {
  const { slug } = await params;
  // Usar cliente sem cookies para build estático
  const supabase = createCachedAnonClient([TAG_FILMES]);

  // Só as colunas que a tela usa. FilmeContent é 'use client': tudo o que chega
  // aqui vai serializado no HTML público, inclusive o que a página não mostra.
  const { data: filme, error } = await supabase
    .from("filmes")
    .select(
      "id, slug, titulo_pt, titulo_en, ano, ano_previsto, tipo_obra, duracao_min, status_interno_pt, status_interno_en, generos, paises_producao, categoria_site, sinopse_pt, sinopse_en, buscando_pt, buscando_en, poster_principal_url, thumbnail_card_url, imagem_og_url"
    )
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
        id, cargo, pessoa_id, empresa_id, nome_exibicao, ordem,
        pessoas(id, nome, nome_exibicao, slug),
        empresas(id, nome, slug)
      `)
      .eq("filme_id", filme.id)
      .order("ordem", { ascending: true }),
    
    // Financiamentos
    supabase
      .from("filmes_financiamentos")
      // sem valor, moeda e observacoes
      .select("id, nome, tipo, ano, fase, resultado")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Festivais
    supabase
      .from("filmes_festivais")
      .select("id, nome, edicao, ano, cidade, pais, secao, tipo_evento, tipo_estreia")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Premiações
    supabase
      .from("filmes_premiacoes")
      .select("id, titulo_do_premio, categoria, ano, festival_nome, tipo")
      .eq("filme_id", filme.id)
      .order("ano", { ascending: false }),
    
    // Assets (imagens adicionais). O painel oferece "imagem" e "still"; filtrar só
    // "imagem" deixava a galeria vazia — os 29 assets do banco são stills.
    supabase
      .from("filmes_assets")
      .select("id, url, tipo, credito, alt_pt, alt_en")
      .eq("filme_id", filme.id)
      .in("tipo", ["imagem", "still"])
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

