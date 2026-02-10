'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  setFontsLoaded: () => void;
  setVideosReady: () => void;
  setGsapReady: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [fontsLoaded, setFontsLoadedState] = useState(false);
  const [videosReady, setVideosReadyState] = useState(false);
  const [gsapReady, setGsapReadyState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate progress as percentage
  const progress = [fontsLoaded, videosReady, gsapReady].filter(Boolean).length / 3 * 100;

  // When all are ready, stop loading with a small delay for smooth transition
  useEffect(() => {
    if (fontsLoaded && videosReady && gsapReady) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, videosReady, gsapReady]);

  // Auto-detect font loading
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => setFontsLoadedState(true));
    } else {
      // Fallback if fonts API not available
      setFontsLoadedState(true);
    }
  }, []);

  // Fallback timeout - don't block forever
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setFontsLoadedState(true);
        setVideosReadyState(true);
        setGsapReadyState(true);
      }
    }, 5000); // Max 5 seconds loading

    return () => clearTimeout(fallbackTimer);
  }, [isLoading]);

  const setFontsLoaded = useCallback(() => setFontsLoadedState(true), []);
  const setVideosReady = useCallback(() => setVideosReadyState(true), []);
  const setGsapReady = useCallback(() => setGsapReadyState(true), []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        setFontsLoaded,
        setVideosReady,
        setGsapReady,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};
