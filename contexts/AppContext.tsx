"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type AppContextType = {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const pathname = usePathname();

  // Update page title based on path changes
  useEffect(() => {
    const pathSegments = pathname?.split('/').filter(Boolean) || [];
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      setPageTitle(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
    } else {
      setPageTitle('Dashboard');
    }
  }, [pathname]);

  return (
    <AppContext.Provider value={{
      pageTitle,
      setPageTitle,
      selectedPatientId,
      setSelectedPatientId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
