import { getAllPosts } from '@/lib/supabase/posts';
import PostsClient from './PostsClient';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function PostsPage() {
  const posts = await getAllPosts();

  return <PostsClient posts={posts} />;
}
