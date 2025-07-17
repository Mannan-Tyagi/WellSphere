"use client";

import React, { ReactNode } from 'react';
import { NotificationProvider } from './NotificationsContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}

export default AppProviders;
