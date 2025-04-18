import { Metadata } from 'next';
import { MedicalRecordsHub } from '@/modules/patient-pages/records/MedicalRecordsHub';

export const metadata: Metadata = {
  title: 'Medical Records Hub - WellSphere',
  description: 'Access, manage, and share your medical records securely',
};

export default function MedicalRecordsPage() {
  return <MedicalRecordsHub />;
}
