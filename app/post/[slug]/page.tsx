import { getAllPostSlugs, getPostBySlug } from '@/lib/supabase/posts';
import PostContent from './PostContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return <PostContent slug={slug} post={post} />;
}
