import { Metadata } from 'next';
import { PillIdentificationPage } from '@/modules/patient-pages/medications/PillIdentificationPage';

export const metadata: Metadata = {
  title: 'Identify Medication - WellSphere',
  description: 'Use AR technology to identify and learn about your medications',
};

export default function Page({ params }: { params: { id: string } }) {
  return <PillIdentificationPage medicationId={params.id} />;
}
