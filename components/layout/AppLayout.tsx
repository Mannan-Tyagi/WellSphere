"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GlobalTopBar from './GlobalTopBar';
import EnhancedSidebar from './EnhancedSidebar';
import Breadcrumbs from './Breadcrumbs';
import { AppProvider } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { NavigationProvider } from '@/contexts/NavigationContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Skip the layout for auth and landing pages
  if (pathname === '/' || pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  return (
    <AppProvider>
      <NotificationProvider>
        <SearchProvider>
          <NavigationProvider>
            <div className="flex h-screen bg-gray-50">
              {/* Sidebar */}
              <EnhancedSidebar 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
              />
              
              {/* Main Content */}
              <main className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
                {/* Top Navigation Bar */}
                <GlobalTopBar toggleMobileMenu={toggleMobileMenu} />
                
                {/* Breadcrumbs */}
                <Breadcrumbs />
                
                {/* Page Content */}
                <div className="flex-grow p-4 md:p-6 overflow-auto">
                  {children}
                </div>
              </main>
            </div>
          </NavigationProvider>
        </SearchProvider>
      </NotificationProvider>
    </AppProvider>
  );
};

export default AppLayout;
