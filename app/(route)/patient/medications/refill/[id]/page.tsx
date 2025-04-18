import { Metadata } from 'next';
import { MedicationRefillPage } from '@/modules/patient-pages/medications/MedicationRefillPage';

export const metadata: Metadata = {
  title: 'Refill Medication - WellSphere',
  description: 'Refill your prescription and find the best pharmacy options',
};

export default function Page({ params }: { params: { id: string } }) {
  return <MedicationRefillPage medicationId={params.id} />;
}
