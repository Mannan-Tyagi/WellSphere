import { AppointmentsPageClient } from '@/modules/patient-pages/appointments/AppointmentsPageClient';

export default function AppointmentsPage() {
  // Force the server component to be client-compatible by adding a simple client-safe computation
  const currentTime = new Date().toISOString();
  
  return (
    <>
      {/* This comment helps establish proper component boundaries */}
      <AppointmentsPageClient />
    </>
  );
}