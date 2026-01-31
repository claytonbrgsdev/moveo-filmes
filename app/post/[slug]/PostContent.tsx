'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '@/app/components/MainLayout';
import { notFound } from 'next/navigation';

interface PostContentProps {
  slug: string;
  post: {
    title_pt: string;
    title_en: string;
    date: string;
    content_pt: string;
    content_en: string;
  } | undefined;
}

export default function PostContent({ slug: _slug, post }: PostContentProps) {
  const { language } = useLanguage();

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Cabeçalho do Post */}
          <article className="border border-gray-700 rounded-lg p-8 bg-gray-900">
            {/* Data */}
            <p className="text-sm text-white opacity-50 mb-4">
              {new Date(post.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            {/* Título */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
              {language === 'pt' ? post.title_pt : post.title_en}
            </h1>

            {/* Imagem (placeholder) */}
            <div className="w-full h-96 bg-gray-800 rounded-lg mb-8 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>

            {/* Conteúdo */}
            <div className="prose prose-invert max-w-none">
              <div className="text-white text-lg leading-relaxed whitespace-pre-line">
                {language === 'pt' ? post.content_pt : post.content_en}
              </div>
            </div>
          </article>

          {/* Botão Voltar */}
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


