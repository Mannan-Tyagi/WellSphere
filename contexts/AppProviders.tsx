"use client";

import React, { ReactNode } from 'react';
import { AppointmentProvider } from './AppointmentContext';
import { MedicalRecordsProvider } from './MedicalRecordsContext';
import { NotificationsProvider } from './NotificationsContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <NotificationsProvider>
      <MedicalRecordsProvider>
        <AppointmentProvider>
          {children}
        </AppointmentProvider>
      </MedicalRecordsProvider>
    </NotificationsProvider>
  );
};
