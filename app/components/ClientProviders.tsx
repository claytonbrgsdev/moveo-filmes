'use client'

import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { GridGuidesProvider } from '@/lib/contexts/GridGuidesContext';
import { LoadingProvider } from '@/lib/contexts/LoadingContext';
import { VerticalGuides } from '@/app/components/VerticalGuides';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import LoadingScreen from './LoadingScreen';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingScreen />
      <LanguageProvider>
        <GridGuidesProvider>
          <SmoothScrollProvider>
            <VerticalGuides />
            {children}
          </SmoothScrollProvider>
        </GridGuidesProvider>
      </LanguageProvider>
    </LoadingProvider>
  );
}

