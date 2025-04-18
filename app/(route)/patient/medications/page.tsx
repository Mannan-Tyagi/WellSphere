import { Metadata } from 'next';
import MedicationsPageClient from '@/modules/patient-pages/medications/MedicationsPageClient';

export const metadata: Metadata = {
  title: 'Medication Management - WellSphere',
  description: 'Track, manage, and refill your medications with smart adherence prediction and AR assistance',
};

export default function MedicationsPage() {
  return <MedicationsPageClient />;
}
