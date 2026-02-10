'use client'

import Image from 'next/image';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '@/app/components/MainLayout';
import { notFound } from 'next/navigation';
import type { PostRow } from '@/lib/supabase/types';

interface PostContentProps {
  slug: string;
  post: PostRow | null;
}

export default function PostContent({ slug: _slug, post }: PostContentProps) {
  const { language } = useLanguage();

  if (!post) {
    notFound();
  }

  // Get content based on language
  const title = language === 'pt' ? post.titulo_pt : (post.titulo_en || post.titulo_pt);
  const content = language === 'pt' ? post.conteudo_pt : (post.conteudo_en || post.conteudo_pt);
  const imageAlt = language === 'pt' ? post.alt_pt : (post.alt_en || post.alt_pt);

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Post Header */}
          <article className="border border-gray-700 rounded-lg p-8 bg-gray-900">
            {/* Date & Category */}
            <div className="flex items-center gap-3 mb-4">
              {post.tipo && (
                <>
                  <span className="text-sm text-white opacity-70 uppercase tracking-wider">
                    {post.tipo === 'instagram' ? 'Instagram' : post.tipo}
                  </span>
                  <span className="text-white opacity-30">•</span>
                </>
              )}
              <p className="text-sm text-white opacity-50">
                {formatDate(post.publicado_em)}
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
              {title}
            </h1>

            {/* Image */}
            {post.imagem_capa_url ? (
              <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.imagem_capa_url}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-800 rounded-lg mb-8 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {language === 'pt' ? 'Imagem não disponível' : 'Image not available'}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-white text-lg leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>

            {/* External Link (for Instagram posts) */}
            {post.url_externa && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <a
                  href={post.url_externa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="mr-2">
                    {language === 'pt' ? 'Ver post original no Instagram' : 'View original post on Instagram'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </article>

          {/* Back Button */}
          <div className="mt-8">
            <a
              href="/posts"
              className="inline-flex items-center text-white hover:opacity-70 transition-opacity"
            >
              <span className="mr-2">←</span>
              {language === 'pt' ? 'Voltar para Notícias' : 'Back to News'}
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
