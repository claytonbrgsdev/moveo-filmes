import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: {
    default: 'Moveo Filmes',
    template: '%s — Moveo Filmes',
  },
  description:
    'Produtora de cinema independente sediada em Brasília, fundada em 2018. Desenvolvimento, produção e distribuição de filmes de longa-metragem.',
  metadataBase: new URL('https://moveofilmes.com'),
  openGraph: {
    type: 'website',
    siteName: 'Moveo Filmes',
    title: 'Moveo Filmes',
    description:
      'Produtora de cinema independente sediada em Brasília, fundada em 2018.',
    images: [
      {
        url: '/imagens/capahome.png',
        width: 1920,
        height: 1080,
        alt: 'Moveo Filmes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moveo Filmes',
    description:
      'Produtora de cinema independente sediada em Brasília, fundada em 2018.',
    images: ['/imagens/capahome.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
      >
        <ClientProviders>
        {children}
        </ClientProviders>
      </body>
    </html>
  );
}
