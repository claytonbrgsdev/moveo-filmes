'use client'

import { useLanguage } from '@/lib/hooks/useLanguage';
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
    } catch (error) {
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
    const phoneNumber = '5561981424106'; // Formato internacional sem caracteres especiais
    const message = language === 'pt' 
      ? 'Olá, gostaria de entrar em contato com a Moveo Filmes.' 
      : 'Hello, I would like to contact Moveo Filmes.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Container do Formulário */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-black mb-8">
              {language === 'pt' ? 'Entre em Contato' : 'Get in Touch'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-black mb-2">
                  {language === 'pt' ? 'Nome' : 'Name'}
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>

              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>

              {/* Campo Mensagem */}
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-black mb-2">
                  {language === 'pt' ? 'Mensagem' : 'Message'}
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>

              {/* Mensagem de feedback */}
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="p-6 border border-gray-300 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-4">
                {language === 'pt' ? 'Email' : 'Email'}
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-black flex-1">contato@moveofilmes.com</p>
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                >
                  {emailCopied
                    ? (language === 'pt' ? 'Copiado!' : 'Copied!')
                    : (language === 'pt' ? 'Copiar' : 'Copy')}
                </button>
              </div>
            </div>

            {/* Container WhatsApp */}
            <div className="p-6 border border-gray-300 rounded-lg">
              <h2 className="text-2xl font-bold text-black mb-4">
                WhatsApp
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-black flex-1">(61) 98142-4106</p>
                <button
                  onClick={handleWhatsAppClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                >
                  {language === 'pt' ? 'Abrir WhatsApp' : 'Open WhatsApp'}
                </button>
              </div>
            </div>

            {/* Container de Imagem */}
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

