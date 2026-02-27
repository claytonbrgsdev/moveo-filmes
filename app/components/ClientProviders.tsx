'use client'

import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { GridGuidesProvider } from '@/lib/contexts/GridGuidesContext';
import { LoadingProvider } from '@/lib/contexts/LoadingContext';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import LoadingScreen from './LoadingScreen';

// VerticalGuides is a dev-only tool — excluded from production builds to avoid
// rendering ~80 DOM nodes and attaching keyboard listeners unnecessarily.
const VerticalGuides = process.env.NODE_ENV !== 'production'
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ? (require('@/app/components/VerticalGuides') as { VerticalGuides: () => null }).VerticalGuides
  : () => null;

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
