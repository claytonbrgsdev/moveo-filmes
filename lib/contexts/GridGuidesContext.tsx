'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GridGuidesContextType {
  isVisible: boolean;
}

const GridGuidesContext = createContext<GridGuidesContextType | undefined>(undefined);

export function GridGuidesProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Verificar se a tecla pressionada é "R" (case insensitive)
      if (event.key === 'r' || event.key === 'R') {
        // Evitar comportamento padrão se estiver em um input/textarea
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
          return;
        }
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <GridGuidesContext.Provider value={{ isVisible }}>
      {children}
    </GridGuidesContext.Provider>
  );
}

export function useGridGuides() {
  const context = useContext(GridGuidesContext);
  if (context === undefined) {
    throw new Error('useGridGuides must be used within a GridGuidesProvider');
  }
  return context.isVisible;
}

