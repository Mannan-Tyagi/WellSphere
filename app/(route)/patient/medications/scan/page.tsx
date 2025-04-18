import { Metadata } from 'next';
import { PillIdentificationPage } from '@/modules/patient-pages/medications/PillIdentificationPage';

export const metadata: Metadata = {
  title: 'Scan Medication - WellSphere',
  description: 'Scan your prescription or medication using AR technology',
};

export default function Page() {
  return <PillIdentificationPage />;
}
