'use client'

import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import Navbar from '@/app/components/Navbar';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      {children}
    </LanguageProvider>
  );
}

