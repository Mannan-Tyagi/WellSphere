"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type NavigationContextType = {
  activePath: string;
  breadcrumbs: BreadcrumbItem[];
  userType: 'patient' | 'doctor' | 'admin' | null;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Map path segments to human-readable names
const pathLabels: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  messages: 'Messages',
  records: 'Medical Records',
  vitals: 'Vital Signs',
  billing: 'Billing',
  settings: 'Settings',
  profile: 'Profile',
  family: 'Family Health',
  calendar: 'Calendar',
  patients: 'Patients',
  messaging: 'Messaging',
  consultation: 'Consultation',
  schedule: 'Schedule',
  search: 'Search Results',
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [userType, setUserType] = useState<'patient' | 'doctor' | 'admin' | null>(null);

  // Update active path and breadcrumbs when pathname changes
  useEffect(() => {
    if (!pathname) return;
    
    setActivePath(pathname);
    
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Determine user type from first path segment
    if (pathSegments[0] === 'patient') {
      setUserType('patient');
    } else if (pathSegments[0] === 'doctor') {
      setUserType('doctor');
    } else if (pathSegments[0] === 'admin') {
      setUserType('admin');
    } else {
      setUserType(null);
    }
    
    // Generate breadcrumbs
    const breadcrumbItems: BreadcrumbItem[] = [];
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      const label = pathLabels[segment.toLowerCase()] || segment;
      breadcrumbItems.push({
        label,
        href: currentPath,
      });
    });
    
    setBreadcrumbs(breadcrumbItems);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{
      activePath,
      breadcrumbs,
      userType,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
