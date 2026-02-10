import { getAllPosts } from '@/lib/supabase/posts';
import NoticiasClient from './NoticiasClient';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function NoticiasPage() {
  const posts = await getAllPosts();

  return <NoticiasClient posts={posts} />;
}
