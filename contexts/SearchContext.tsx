"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  isSearching: boolean;
  performSearch: (query: string, target?: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load recent searches from localStorage when component mounts
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = (search: string) => {
    if (search.trim() && !recentSearches.includes(search)) {
      const newSearches = [search, ...recentSearches.slice(0, 4)]; // Keep only 5 most recent
      setRecentSearches(newSearches);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const performSearch = (query: string, target?: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    addRecentSearch(query);
    
    // If a specific target is provided, navigate to that page with the search query
    if (target) {
      router.push(`${target}?q=${encodeURIComponent(query)}`);
    } else {
      // Otherwise, handle search based on current context
      const pathSegments = pathname?.split('/').filter(Boolean) || [];
      const userType = pathSegments[0] || '';
      
      // Route to the appropriate search page based on user type
      if (userType === 'patient') {
        router.push(`/patient/search?q=${encodeURIComponent(query)}`);
      } else if (userType === 'doctor') {
        router.push(`/doctor/search?q=${encodeURIComponent(query)}`);
      } else {
        // Default search page
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
    
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      isSearching,
      performSearch,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
