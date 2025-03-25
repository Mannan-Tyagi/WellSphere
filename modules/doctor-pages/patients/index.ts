export interface Patient {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: 'Stable' | 'Follow-Up Needed' | 'Critical' | 'Recovering';
  contactNumber: string;
  email: string;
  address: string;
  medicalHistory: string[];
  upcomingAppointment?: string;
  doctor: string;
  department: string;
  isFeatured?: boolean;
}

export type SortOption = 'name' | 'lastVisit' | 'status' | 'age';
export type FilterOption = 'All' | 'Inpatient' | 'Outpatient' | 'High-Risk' | 'Follow-Up';
export type ViewMode = 'grid' | 'list';
export type ThemeMode = 'light' | 'dark';
export type Language = 'en' | 'es' | 'fr';