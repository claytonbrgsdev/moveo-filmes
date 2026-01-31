import PostContent from './PostContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dados fictícios (em produção, viriam de uma API ou banco de dados)
const posts: Record<string, {
  title_pt: string;
  title_en: string;
  date: string;
  content_pt: string;
  content_en: string;
}> = {
  'natureza-coisas-invisiveis-berlinale': {
    title_pt: 'A Natureza das Coisas Invisíveis estreia na Berlinale 2025',
    title_en: 'A Natureza das Coisas Invisíveis premieres at Berlinale 2025',
    date: '2025-02-15',
    content_pt: `O primeiro longa-metragem internacional da Moveo Filmes, "A Natureza das Coisas Invisíveis", dirigido por Rafaela Camelo, teve sua estreia mundial na 75ª edição do Festival Internacional de Cinema de Berlim, na seção Generation.

O filme é uma coprodução entre Brasil e Chile, financiado pelo FAC-DF, FSA/Ancine, Fundo de Coprodução Minoritária Chileno, e desenvolvimento pela Nouvelle-Aquitaine, França.

A estreia na Berlinale marca um momento importante para a produtora e para o cinema brasileiro, consolidando a presença da Moveo Filmes no circuito internacional de festivais.`,
    content_en: `Moveo Filmes' first international feature film, "A Natureza das Coisas Invisíveis", directed by Rafaela Camelo, had its world premiere at the 75th Berlin International Film Festival, in the Generation section.

The film is a co-production between Brazil and Chile, funded by FAC-DF, FSA/Ancine, the Chilean Minor Coproduction Fund, and development by Nouvelle-Aquitaine, France.

The Berlinale premiere marks an important moment for the production company and Brazilian cinema, consolidating Moveo Filmes' presence on the international festival circuit.`
  },
  'musicá-secular-pos-producao': {
    title_pt: 'Música Secular em fase final de pós-produção',
    title_en: 'Música Secular in final post-production phase',
    date: '2025-01-20',
    content_pt: `O curta-metragem "Música Secular", de Emanuel Lavor, está em sua fase final de pós-produção. O projeto foi financiado pelo FAC-DF e representa mais uma colaboração entre a Moveo Filmes e o diretor.

A finalização do filme está prevista para o primeiro semestre de 2025, quando começará sua jornada por festivais nacionais e internacionais.`,
    content_en: `The short film "Música Secular", by Emanuel Lavor, is in its final post-production phase. The project was funded by FAC-DF and represents another collaboration between Moveo Filmes and the director.

The film's completion is scheduled for the first half of 2025, when it will begin its journey through national and international festivals.`
  },
  'as-micangas-berlinale-shorts': {
    title_pt: 'As Miçangas selecionado para Berlinale Shorts 2023',
    title_en: 'As Miçangas selected for Berlinale Shorts 2023',
    date: '2023-02-10',
    content_pt: `O curta-metragem "As Miçangas", dirigido por Rafaela Camelo e Emanuel Lavor, foi selecionado para a competição do Berlinale Shorts 2023.

O filme foi financiado pelo FAC-DF e também apoiado pela plataforma de streaming Cardume. A seleção para a Berlinale representa um reconhecimento importante do trabalho da Moveo Filmes no cenário internacional.`,
    content_en: `The short film "As Miçangas", directed by Rafaela Camelo and Emanuel Lavor, was selected for the Berlinale Shorts 2023 competition.

The film was funded by FAC-DF and also supported by the streaming platform Cardume. The selection for Berlinale represents an important recognition of Moveo Filmes' work on the international scene.`
  }
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  return <PostContent slug={slug} post={post} />;
}
