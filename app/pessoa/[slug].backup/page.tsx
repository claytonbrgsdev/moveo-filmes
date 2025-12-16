export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return [];
}

export default async function PessoaPage({
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return null;
}

