import { notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { PessoaContent } from './PessoaContent';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('pessoas')
      .select('slug')
      .not('slug', 'is', null)
      .eq('visibilidade', 'publico');
    return (data ?? []).map((p) => ({ slug: p.slug as string }));
  } catch {
    return [];
  }
}

export default async function PessoaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch person
  const { data: pessoa, error: pessoaError } = await supabase
    .from('pessoas')
    .select('id, slug, nome, nome_exibicao, bio_pt, bio_en, foto_url, areas_atuacao, links, visibilidade')
    .eq('slug', slug)
    .single();

  if (pessoaError || !pessoa || pessoa.visibilidade !== 'publico') {
    notFound();
  }

  // Fetch filmography
  const { data: filmografias } = await supabase
    .from('pessoas_filmografias')
    .select('id, titulo_pt, titulo_en, funcao, ano, tipo_obra, ordem, filme_id')
    .eq('pessoa_id', pessoa.id)
    .order('ano', { ascending: false });

  // Fetch linked film slugs (for linking to film detail pages)
  const filmeIds = (filmografias ?? [])
    .map((f) => f.filme_id)
    .filter(Boolean) as string[];

  let filmeSlugs: Record<string, string> = {};
  if (filmeIds.length > 0) {
    const { data: filmes } = await supabase
      .from('filmes')
      .select('id, slug')
      .in('id', filmeIds);
    filmeSlugs = Object.fromEntries(
      (filmes ?? []).map((f) => [f.id, f.slug])
    );
  }

  const filmografiasWithSlugs = (filmografias ?? []).map((f) => ({
    ...f,
    filme_slug: f.filme_id ? (filmeSlugs[f.filme_id] ?? null) : null,
  }));

  return (
    <PessoaContent
      pessoa={pessoa}
      filmografias={filmografiasWithSlugs}
    />
  );
}

