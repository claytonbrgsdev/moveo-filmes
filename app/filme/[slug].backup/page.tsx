export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

export default async function FilmePage({
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return null;
}

