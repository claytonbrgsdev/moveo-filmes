'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '../components/MainLayout';
import Link from 'next/link';

export default function PostsPage() {
  const { language } = useLanguage();

  // Dados fictícios de notícias (em produção, viriam de uma API ou banco de dados)
  const posts = [
    {
      id: '1',
      slug: 'natureza-coisas-invisiveis-berlinale',
      title_pt: 'A Natureza das Coisas Invisíveis estreia na Berlinale 2025',
      title_en: 'A Natureza das Coisas Invisíveis premieres at Berlinale 2025',
      excerpt_pt: 'Primeiro longa-metragem internacional da Moveo Filmes tem estreia mundial no Festival de Berlim.',
      excerpt_en: "Moveo Filmes' first international feature film has its world premiere at the Berlin Film Festival.",
      date: '2025-02-15',
      image: '/imagens/placeholder-news.jpg'
    },
    {
      id: '2',
      slug: 'musicá-secular-pos-producao',
      title_pt: 'Música Secular em fase final de pós-produção',
      title_en: 'Música Secular in final post-production phase',
      excerpt_pt: 'Novo curta-metragem de Emanuel Lavor está em fase final de pós-produção.',
      excerpt_en: 'New short film by Emanuel Lavor is in final post-production phase.',
      date: '2025-01-20',
      image: '/imagens/placeholder-news.jpg'
    },
    {
      id: '3',
      slug: 'as-micangas-berlinale-shorts',
      title_pt: 'As Miçangas selecionado para Berlinale Shorts 2023',
      title_en: 'As Miçangas selected for Berlinale Shorts 2023',
      excerpt_pt: 'Curta-metragem de Rafaela Camelo e Emanuel Lavor foi selecionado para a competição.',
      excerpt_en: 'Short film by Rafaela Camelo and Emanuel Lavor was selected for the competition.',
      date: '2023-02-10',
      image: '/imagens/placeholder-news.jpg'
    }
  ];

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Cabeçalho */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {language === 'pt' ? 'Notícias' : 'News'}
            </h1>
            <p className="text-lg text-white opacity-70">
              {language === 'pt' 
                ? 'Acompanhe as últimas novidades sobre nossos filmes e produções.' 
                : 'Follow the latest news about our films and productions.'}
            </p>
          </div>

          {/* Grid de Notícias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="border border-gray-700 rounded-lg overflow-hidden hover:border-white transition-colors cursor-pointer block bg-gray-900"
              >
                {/* Imagem */}
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image Placeholder</span>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  {/* Data */}
                  <p className="text-sm text-white opacity-50 mb-3">
                    {new Date(post.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Título */}
                  <h2 className="text-xl font-bold text-white mb-3">
                    {language === 'pt' ? post.title_pt : post.title_en}
                  </h2>

                  {/* Resumo */}
                  <p className="text-white opacity-70 text-sm leading-relaxed">
                    {language === 'pt' ? post.excerpt_pt : post.excerpt_en}
                  </p>

                  {/* Link "Ler mais" */}
                  <div className="mt-4">
                    <span className="text-white text-sm font-semibold hover:opacity-70 transition-opacity">
                      {language === 'pt' ? 'Ler mais →' : 'Read more →'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mensagem se não houver posts */}
          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white opacity-50 text-lg">
                {language === 'pt' 
                  ? 'Nenhuma notícia disponível no momento.' 
                  : 'No news available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
