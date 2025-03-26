export type PatientStatus = "stable" | "needs-attention" | "critical";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  profileImage: string;
  lastVisit: string;
  condition: string;
  status: PatientStatus;
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
    emergencyContact?: string;
  };
  allergies?: string[];
  medications?: Medication[];
  appointments?: Appointment[];
  testResults?: TestResult[];
  healthMetrics?: HealthMetric[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  notes?: string;
  prescriptions?: string[];
}

export interface TestResult {
  name: string;
  value: number | string;
  unit: string;
  date: string;
  normal: string;
}

export interface HealthMetric {
  name: string;
  data: {
    date: string;
    value: number;
  }[];
}