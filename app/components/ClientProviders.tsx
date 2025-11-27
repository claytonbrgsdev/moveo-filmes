'use client'

import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { GridGuidesProvider } from '@/lib/contexts/GridGuidesContext';
import { VerticalGuides } from '@/app/components/VerticalGuides';
import { SmoothScrollProvider } from './SmoothScrollProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <GridGuidesProvider>
        <SmoothScrollProvider>
          <VerticalGuides />
          {children}
        </SmoothScrollProvider>
      </GridGuidesProvider>
    </LanguageProvider>
  );
}

