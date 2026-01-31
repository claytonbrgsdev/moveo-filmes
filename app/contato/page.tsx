'use client'

import { useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/lib/hooks/useLanguage';
import Navbar from '../components/Navbar';
import { LocationInfo } from '../components/LocationInfo';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Content translations
const content = {
  pt: {
    heroTitle: 'Contato',
    heroSubtitle: 'Entre em contato conosco. Estamos prontos para colaborar em projetos cinematográficos e parcerias internacionais.',
    formTitle: 'Envie uma mensagem',
    nameLabel: 'Nome',
    emailLabel: 'Email',
    messageLabel: 'Mensagem',
    sendButton: 'Enviar',
    sendingButton: 'Enviando...',
    successMessage: 'Mensagem enviada com sucesso!',
    errorMessage: 'Erro ao enviar mensagem. Tente novamente.',
    contactTitle: 'Contato',
    emailLabel2: 'Email',
    copyButton: 'Copiar',
    copiedButton: 'Copiado!',
    whatsappButton: 'Abrir WhatsApp',
  },
  en: {
    heroTitle: 'Contact',
    heroSubtitle: 'Get in touch with us. We are ready to collaborate on film projects and international partnerships.',
    formTitle: 'Send a message',
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    sendButton: 'Send',
    sendingButton: 'Sending...',
    successMessage: 'Message sent successfully!',
    errorMessage: 'Error sending message. Please try again.',
    contactTitle: 'Contact',
    emailLabel2: 'Email',
    copyButton: 'Copy',
    copiedButton: 'Copied!',
    whatsappButton: 'Open WhatsApp',
  },
};

export default function ContatoPage() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];
  
  const heroSectionRef = useRef<HTMLElement>(null);
  const contentSectionRef = useRef<HTMLElement>(null);

  // Hero section entrance animations (on page load)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      const heroTitle = heroSectionRef.current?.querySelector('[data-hero-title]');
      const heroLine = heroSectionRef.current?.querySelector('[data-hero-line]');
      const heroCircle = heroSectionRef.current?.querySelector('[data-hero-circle]');
      const heroLogo = heroSectionRef.current?.querySelector('[data-hero-logo]');

      // Animate elements in sequence
      const tl = gsap.timeline();
      
      if (heroTitle) {
        tl.from(heroTitle, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (heroLine) {
        tl.from(heroLine, {
          scaleX: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, '-=0.4');
      }

      if (heroCircle) {
        tl.from(heroCircle, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, '-=0.6');
      }

      if (heroLogo) {
        tl.from(heroLogo, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.5');
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // Content section animations
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (!contentSectionRef.current) return;

    const ctx = gsap.context(() => {
      const formTitle = contentSectionRef.current?.querySelector('[data-form-title]');
      const formFields = Array.from(contentSectionRef.current?.querySelectorAll('[data-form-field]') || []);
      const contactTitle = contentSectionRef.current?.querySelector('[data-contact-title]');
      const contactBlocks = Array.from(contentSectionRef.current?.querySelectorAll('[data-contact-block]') || []);

      if (formTitle) {
        gsap.fromTo(formTitle,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formTitle,
              start: 'top 80%',
            },
          }
        );
      }

      if (formFields.length) {
        gsap.fromTo(formFields,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formFields[0],
              start: 'top 75%',
            },
          }
        );
      }

      if (contactTitle) {
        gsap.fromTo(contactTitle,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactTitle,
              start: 'top 80%',
            },
          }
        );
      }

      if (contactBlocks.length) {
        gsap.fromTo(contactBlocks,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactBlocks[0],
              start: 'top 75%',
            },
          }
        );
      }
    }, contentSectionRef);

    return () => ctx.revert();
  }, []);

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
          text: t.successMessage,
        });
        setFormData({ nome: '', email: '', mensagem: '' });
      } else {
        setMessage({
          type: 'error',
          text: data.error || t.errorMessage,
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: t.errorMessage,
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
    <div className="relative min-h-screen bg-black">
      {/* Top border line */}
      <div 
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ top: '50px' }}
      />
      
      {/* Bottom border line */}
      <div 
        className="fixed left-0 right-0 h-px bg-white z-40"
        style={{ bottom: '50px' }}
      />

      {/* Navbar */}
      <Navbar />

      {/* ============================================
          SECTION 1: HERO - VARIATION: CENTERED VERTICAL
          ============================================ */}
      <section 
        ref={heroSectionRef}
        className="relative flex items-center justify-center"
        style={{ 
          minHeight: '100vh',
          paddingTop: '50px',
          paddingBottom: '50px',
        }}
      >
        {/* Decorative Circle - Top Right */}
        <div 
          data-hero-circle
          className="absolute pointer-events-none"
          style={{
            right: '-80px',
            top: '20%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        />

        {/* Central Content */}
        <div className="relative z-10 text-center" style={{ padding: '0 50px' }}>
          {/* Large Title - Centered */}
          <h1 
            data-hero-title
            className="leading-none mb-12"
            style={{
              fontFamily: "'Helvetica Neue LT Pro Bold Extended', 'Helvetica Neue LT Pro', Arial, sans-serif",
              fontSize: 'clamp(100px, 18vw, 280px)',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            {t.heroTitle}
          </h1>

          {/* Decorative Line */}
          <div 
            data-hero-line
            className="mx-auto"
            style={{
              width: '80px',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>

        {/* Dragonfly Logo - Bottom Right */}
        <div 
          data-hero-logo
          className="absolute"
          style={{
            bottom: '60px',
            right: '50px',
          }}
        >
          <Image
            src="/imagens/logomarca.png"
            alt="Moveo Logo"
            width={50}
            height={50}
            className="object-contain"
            style={{ filter: 'brightness(0.6) sepia(0.3)', width: 'auto', height: 'auto' }}
          />
        </div>
      </section>

      {/* ============================================
          SECTION 2: FORM & CONTACT INFO
          ============================================ */}
      <section 
        ref={contentSectionRef}
        className="relative"
        style={{ 
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '120px',
        }}
      >
        {/* Decorative Circle - Left Edge */}
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '-100px',
            top: '30%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        />

        {/* Content Grid */}
        <div 
          className="relative z-10"
          style={{ 
            padding: '0 50px 0 150px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">
            {/* Left Column - Form */}
            <div>
              {/* Form Title */}
              <h2 
                data-form-title
                className="text-white mb-10"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  fontWeight: 700,
                }}
              >
                {t.formTitle}
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div data-form-field>
                  <label 
                    htmlFor="nome" 
                    className="block text-white mb-2"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-white transition-colors"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(14px, 1.1vw, 16px)',
                    }}
                  />
                </div>

                {/* Email Field */}
                <div data-form-field>
                  <label 
                    htmlFor="email" 
                    className="block text-white mb-2"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-white transition-colors"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(14px, 1.1vw, 16px)',
                    }}
                  />
                </div>

                {/* Message Field */}
                <div data-form-field>
                  <label 
                    htmlFor="mensagem" 
                    className="block text-white mb-2"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-transparent border border-white/20 text-white focus:outline-none focus:border-white transition-colors resize-none"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(14px, 1.1vw, 16px)',
                    }}
                  />
                </div>

                {/* Feedback Message */}
                {message && (
                  <div
                    className={`p-4 ${
                      message.type === 'success'
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-red-900/20 text-red-200 border border-red-700/30'
                    }`}
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(13px, 1vw, 15px)',
                    }}
                  >
                    {message.text}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                    fontSize: 'clamp(13px, 1vw, 15px)',
                    fontWeight: 500,
                    padding: '14px 40px',
                    border: '1px solid white',
                    backgroundColor: 'transparent',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = 'black';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                >
                  <span className="relative z-10">
                    {loading ? t.sendingButton : t.sendButton}
                  </span>
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div>
              {/* Contact Title */}
              <h2 
                data-contact-title
                className="text-white mb-10"
                style={{
                  fontFamily: "'Helvetica Neue LT Pro Bold Extended', Arial, sans-serif",
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  fontWeight: 700,
                }}
              >
                {t.contactTitle}
              </h2>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Email Block */}
                <div data-contact-block style={{ maxWidth: '220px' }}>
                  <h3 
                    className="text-white mb-3"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(14px, 1.2vw, 18px)',
                      fontWeight: 600,
                    }}
                  >
                    {t.emailLabel2}
                  </h3>
                  <p 
                    className="text-neutral-400 leading-snug mb-3"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    contato@moveofilmes.com
                  </p>
                  <button
                    onClick={handleCopyEmail}
                    className="relative overflow-hidden"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(11px, 0.9vw, 13px)',
                      fontWeight: 500,
                      padding: '10px 24px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: emailCopied ? 'white' : 'transparent',
                      color: emailCopied ? 'black' : 'white',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!emailCopied) {
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = 'black';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!emailCopied) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                  >
                    {emailCopied ? t.copiedButton : t.copyButton}
                  </button>
                </div>

                {/* WhatsApp Block */}
                <div data-contact-block style={{ maxWidth: '220px' }}>
                  <h3 
                    className="text-white mb-3"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(14px, 1.2vw, 18px)',
                      fontWeight: 600,
                    }}
                  >
                    WhatsApp
                  </h3>
                  <p 
                    className="text-neutral-400 leading-snug mb-3"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    (61) 98142-4106
                  </p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="relative overflow-hidden"
                    style={{
                      fontFamily: "'Helvetica Neue LT Pro', Arial, sans-serif",
                      fontSize: 'clamp(11px, 0.9vw, 13px)',
                      fontWeight: 500,
                      padding: '10px 24px',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      backgroundColor: 'transparent',
                      color: 'rgb(34, 197, 94)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(34, 197, 94)';
                      e.currentTarget.style.backgroundColor = 'rgb(34, 197, 94)';
                      e.currentTarget.style.color = 'black';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(34, 197, 94)';
                    }}
                  >
                    {t.whatsappButton}
                  </button>
                </div>

                {/* Image */}
                <div 
                  data-contact-block
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '1',
                    maxWidth: '200px',
                    gridColumn: '1',
                  }}
                >
                  <Image
                    src="/imagens/secao2home/Rectangle 10.png"
                    alt="Contact"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dragonfly Logo - Bottom Left */}
        <div 
          className="absolute"
          style={{
            bottom: '80px',
            left: '50px',
          }}
        >
          <Image
            src="/imagens/logomarca.png"
            alt="Moveo Logo"
            width={50}
            height={50}
            className="object-contain"
            style={{ filter: 'brightness(0.6) sepia(0.3)', width: 'auto', height: 'auto' }}
          />
        </div>
      </section>

      {/* Location Info - Fixed bottom */}
      <LocationInfo />

      {/* Language Switch */}
      <div 
        className="fixed text-white text-xs z-40 cursor-pointer hover:opacity-70 transition-opacity"
        style={{ 
          left: getMarkerPosition(13),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
      >
        <div className="flex items-center gap-2">
          <span suppressHydrationWarning className={language === 'pt' ? 'font-bold' : 'opacity-50'}>PT</span>
          <span className="opacity-50">/</span>
          <span suppressHydrationWarning className={language === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
        </div>
      </div>
    </div>
  );
}
