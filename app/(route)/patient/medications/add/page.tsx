import { Metadata } from 'next';
import AddMedicationPage from '@/modules/patient-pages/medications/AddMedicationPage';

export const metadata: Metadata = {
  title: 'Add Medication - WellSphere',
  description: 'Add a new medication to your WellSphere health profile',
};

export default function Page() {
  return <AddMedicationPage />;
}
