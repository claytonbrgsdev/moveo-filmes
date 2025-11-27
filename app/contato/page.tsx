'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
import { MainLayout } from '../components/MainLayout';
import { useState } from 'react';

export default function ContatoPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: language === 'pt' 
            ? 'Mensagem enviada com sucesso!' 
            : 'Message sent successfully!',
        });
        setFormData({ nome: '', email: '', mensagem: '' });
      } else {
        setMessage({
          type: 'error',
          text: data.error || (language === 'pt' 
            ? 'Erro ao enviar mensagem. Tente novamente.' 
            : 'Error sending message. Please try again.'),
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: language === 'pt' 
          ? 'Erro ao enviar mensagem. Tente novamente.' 
          : 'Error sending message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contato@moveofilmes.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar email:', error);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '5561981424106';
    const message = language === 'pt' 
      ? 'Olá, gostaria de entrar em contato com a Moveo Filmes.' 
      : 'Hello, I would like to contact Moveo Filmes.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full overflow-auto px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Container do Formulário */}
          <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-8">
              {language === 'pt' ? 'Entre em Contato' : 'Get in Touch'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nome */}
              <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-white mb-2">
                  {language === 'pt' ? 'Nome' : 'Name'}
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                />
              </div>

              {/* Campo Email */}
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                />
              </div>

              {/* Campo Mensagem */}
              <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-white mb-2">
                  {language === 'pt' ? 'Mensagem' : 'Message'}
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  required
                  rows={6}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white resize-none"
                />
              </div>

              {/* Mensagem de feedback */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === 'success'
                        ? 'bg-green-900 text-green-200 border border-green-700'
                        : 'bg-red-900 text-red-200 border border-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={loading}
                  className="w-full px-6 py-3 bg-white text-black rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'pt' ? 'Enviando...' : 'Sending...')
                  : (language === 'pt' ? 'Enviar' : 'Send')}
              </button>
            </form>
          </div>

          {/* Container de Email e WhatsApp */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Container Copiar Email */}
              <div className="p-6 border border-gray-700 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                {language === 'pt' ? 'Email' : 'Email'}
              </h2>
              <div className="flex items-center gap-4">
                  <p className="text-white flex-1">contato@moveofilmes.com</p>
                <button
                  onClick={handleCopyEmail}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:opacity-80 transition-opacity text-sm"
                >
                  {emailCopied
                    ? (language === 'pt' ? 'Copiado!' : 'Copied!')
                    : (language === 'pt' ? 'Copiar' : 'Copy')}
                </button>
              </div>
            </div>

            {/* Container WhatsApp */}
              <div className="p-6 border border-gray-700 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                WhatsApp
              </h2>
              <div className="flex items-center gap-4">
                  <p className="text-white flex-1">(61) 98142-4106</p>
                <button
                  onClick={handleWhatsAppClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                >
                  {language === 'pt' ? 'Abrir WhatsApp' : 'Open WhatsApp'}
                </button>
              </div>
            </div>

            {/* Container de Imagem */}
              <div className="w-full h-64 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
