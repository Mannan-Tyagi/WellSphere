"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientCard from "@/modules/doctor-pages/patients/PatientCard";
import PatientDetailModal from "@/modules/doctor-pages/patients/PatientDetailModal";
import ScheduleAppointmentModal from "@/modules/doctor-pages/patients/ScheduleAppointmentModal";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Bell } from "lucide-react";
import { Patient } from "@/modules/doctor-pages/patients/patient";
import { cn, formatDate } from "@/lib/utils";
import SendMessageModal from "@/modules/doctor-pages/patients/SendMessageModal";
import AddPatientModal from "@/modules/doctor-pages/patients/AddPatientModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentDate, setCurrentDate] = useState<string>("2025-03-26");
  const [currentTime, setCurrentTime] = useState<string>("06:03:20");
  
  // State for modals
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch patients data
  useEffect(() => {
    // In a real implementation, this would be an API call
    const mockPatients: Patient[] = [
      {
        id: "P001",
        name: "Diana Cooper",
        age: 42,
        gender: "Female",
        profileImage: "/avatars/patient-1.jpg",
        lastVisit: "2025-03-20",
        condition: "Diabetes Type II",
        status: "stable",
        contactInfo: {
          email: "diana.cooper@example.com",
          phone: "555-123-4567",
          address: "123 Main St, Anytown, USA",
          emergencyContact: "John Cooper (Husband) - 555-987-6543"
        },
        allergies: ["Penicillin", "Shellfish"],
        medications: [
          { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2024-06-15" },
          { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2024-08-22" }
        ],
        appointments: [
          { 
            id: "A001", 
            date: "2025-03-20", 
            time: "10:30 AM", 
            type: "Check-up", 
            doctorName: "Dr. Julia Smith",
            notes: "Patient reported improved energy levels. Blood sugar levels are stabilizing. Continue with current medication regimen.",
            prescriptions: ["Metformin 500mg", "Lisinopril 10mg"]
          },
          { 
            id: "A002", 
            date: "2025-02-15", 
            time: "2:00 PM", 
            type: "Consultation", 
            doctorName: "Dr. Julia Smith",
            notes: "Patient experiencing occasional dizziness. Adjusted medication dosage to address side effects.",
            prescriptions: ["Metformin 500mg", "Lisinopril 5mg"]
          }
        ],
        testResults: [
          { name: "Blood Sugar", value: 145, unit: "mg/dL", date: "2025-03-20", normal: "70-120" },
          { name: "HbA1c", value: 7.2, unit: "%", date: "2025-03-20", normal: "<6.5" },
          { name: "Blood Pressure", value: "132/85", unit: "mmHg", date: "2025-03-20", normal: "<120/80" },
          { name: "Cholesterol", value: 195, unit: "mg/dL", date: "2025-03-20", normal: "<200" }
        ],
        healthMetrics: [
          { name: "Blood Sugar", data: [
            { date: "Jan", value: 165 },
            { date: "Feb", value: 155 },
            { date: "Mar", value: 145 },
          ] }
        ],
        upcomingAppointments: [
          {
            id: "U001",
            date: "2025-04-05",
            time: "11:15 AM",
            type: "Follow-up",
            doctorName: "Dr. Julia Smith"
          }
        ]
      },
      {
        id: "P002",
        name: "Michael Chen",
        age: 35,
        gender: "Male",
        profileImage: "/avatars/patient-2.jpg",
        lastVisit: "2025-03-15",
        condition: "Hypertension",
        status: "needs-attention",
        contactInfo: {
          email: "michael.chen@example.com",
          phone: "555-234-5678",
          address: "456 Oak Ave, Riverside, USA",
          emergencyContact: "Linda Chen (Wife) - 555-876-5432"
        },
        allergies: ["Latex"],
        medications: [
          { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", startDate: "2024-07-10" },
          { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily", startDate: "2024-07-10" }
        ],
        appointments: [
          { 
            id: "A003", 
            date: "2025-03-15", 
            time: "9:00 AM", 
            type: "Check-up", 
            doctorName: "Dr. Mark Williams",
            notes: "Blood pressure still elevated. Increased medication dosage.",
            prescriptions: ["Amlodipine 10mg", "Hydrochlorothiazide 25mg"]
          }
        ],
        testResults: [
          { name: "Blood Pressure", value: "145/95", unit: "mmHg", date: "2025-03-15", normal: "<120/80" },
          { name: "Heart Rate", value: 82, unit: "bpm", date: "2025-03-15", normal: "60-100" }
        ],
        healthMetrics: [
          { name: "Blood Pressure", data: [
            { date: "Jan", value: 150 },
            { date: "Feb", value: 148 },
            { date: "Mar", value: 145 },
          ] }
        ],
        upcomingAppointments: []
      },
      {
        id: "P003",
        name: "Sarah Johnson",
        age: 28,
        gender: "Female",
        profileImage: "/avatars/patient-3.jpg",
        lastVisit: "2025-03-22",
        condition: "Asthma",
        status: "stable",
        contactInfo: {
          email: "sarah.johnson@example.com",
          phone: "555-345-6789",
          address: "789 Pine St, Harbor City, USA",
          emergencyContact: "Robert Johnson (Father) - 555-765-4321"
        },
        allergies: ["Pollen", "Dust Mites"],
        medications: [
          { name: "Albuterol", dosage: "90mcg", frequency: "As needed", startDate: "2023-11-05" },
          { name: "Fluticasone", dosage: "110mcg", frequency: "Twice daily", startDate: "2023-11-05" }
        ],
        appointments: [
          { 
            id: "A004", 
            date: "2025-03-22", 
            time: "11:15 AM", 
            type: "Check-up", 
            doctorName: "Dr. Rebecca Lee",
            notes: "Asthma well-controlled. Continue current medications.",
            prescriptions: ["Albuterol inhaler", "Fluticasone inhaler"]
          }
        ],
        testResults: [
          { name: "Peak Flow", value: 480, unit: "L/min", date: "2025-03-22", normal: ">400" },
          { name: "Oxygen Saturation", value: 98, unit: "%", date: "2025-03-22", normal: "95-100" }
        ],
        healthMetrics: [
          { name: "Peak Flow", data: [
            { date: "Jan", value: 450 },
            { date: "Feb", value: 465 },
            { date: "Mar", value: 480 },
          ] }
        ],
        upcomingAppointments: [
          {
            id: "U002",
            date: "2025-06-22",
            time: "10:00 AM",
            type: "Annual Check-up",
            doctorName: "Dr. Rebecca Lee"
          }
        ]
      },
      {
        id: "P004",
        name: "Robert Martinez",
        age: 65,
        gender: "Male",
        profileImage: "/avatars/patient-4.jpg",
        lastVisit: "2025-03-10",
        condition: "Coronary Artery Disease",
        status: "critical",
        contactInfo: {
          email: "robert.martinez@example.com",
          phone: "555-456-7890",
          address: "101 Cedar Lane, Lakeside, USA",
          emergencyContact: "Maria Martinez (Wife) - 555-654-3210"
        },
        allergies: ["Iodine"],
        medications: [
          { name: "Aspirin", dosage: "81mg", frequency: "Once daily", startDate: "2023-08-12" },
          { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily", startDate: "2023-08-12" },
          { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", startDate: "2023-08-12" }
        ],
        appointments: [
          { 
            id: "A005", 
            date: "2025-03-10", 
            time: "2:30 PM", 
            type: "Emergency", 
            doctorName: "Dr. James Wilson",
            notes: "Patient admitted with chest pain. EKG showed ST elevation. Transferred for emergency cardiac catheterization.",
            prescriptions: ["Morphine 2mg IV", "Nitroglycerin 0.4mg sublingual"]
          }
        ],
        testResults: [
          { name: "Troponin I", value: 2.3, unit: "ng/mL", date: "2025-03-10", normal: "<0.04" },
          { name: "Cholesterol", value: 220, unit: "mg/dL", date: "2025-03-10", normal: "<200" },
          { name: "LDL", value: 145, unit: "mg/dL", date: "2025-03-10", normal: "<100" }
        ],
        healthMetrics: [
          { name: "Cholesterol", data: [
            { date: "Jan", value: 240 },
            { date: "Feb", value: 230 },
            { date: "Mar", value: 220 },
          ] }
        ],
        upcomingAppointments: [
          {
            id: "U003",
            date: "2025-03-28",
            time: "9:30 AM",
            type: "Urgent Follow-up",
            doctorName: "Dr. James Wilson"
          }
        ]
      },
      {
        id: "P005",
        name: "Emily Parker",
        age: 31,
        gender: "Female",
        profileImage: "/avatars/patient-5.jpg",
        lastVisit: "2025-03-18",
        condition: "Anxiety Disorder",
        status: "stable",
        contactInfo: {
          email: "emily.parker@example.com",
          phone: "555-567-8901",
          address: "202 Maple Ave, Hillside, USA",
          emergencyContact: "David Parker (Husband) - 555-543-2109"
        },
        allergies: [],
        medications: [
          { name: "Escitalopram", dosage: "10mg", frequency: "Once daily", startDate: "2024-01-22" }
        ],
        appointments: [
          { 
            id: "A006", 
            date: "2025-03-18", 
            time: "3:45 PM", 
            type: "Therapy", 
            doctorName: "Dr. Sophia Chen",
            notes: "Patient reports reduced anxiety with current medication and CBT techniques. Continue therapy sessions.",
            prescriptions: ["Escitalopram 10mg"]
          }
        ],
        testResults: [
          { name: "GAD-7 Score", value: 8, unit: "", date: "2025-03-18", normal: "<5" },
          { name: "PHQ-9 Score", value: 6, unit: "", date: "2025-03-18", normal: "<5" }
        ],
        healthMetrics: [
          { name: "Anxiety Score", data: [
            { date: "Jan", value: 14 },
            { date: "Feb", value: 11 },
            { date: "Mar", value: 8 },
          ] }
        ],
        upcomingAppointments: [
          {
            id: "U004",
            date: "2025-04-15",
            time: "3:45 PM",
            type: "Therapy Session",
            doctorName: "Dr. Sophia Chen"
          }
        ]
      },
      {
        id: "P006",
        name: "James Wilson",
        age: 52,
        gender: "Male",
        profileImage: "/avatars/patient-6.jpg",
        lastVisit: "2025-03-12",
        condition: "Arthritis",
        status: "needs-attention",
        contactInfo: {
          email: "james.wilson@example.com",
          phone: "555-678-9012",
          address: "303 Birch St, Meadowview, USA",
          emergencyContact: "Susan Wilson (Wife) - 555-432-1098"
        },
        allergies: ["Sulfa drugs"],
        medications: [
          { name: "Meloxicam", dosage: "15mg", frequency: "Once daily", startDate: "2024-02-10" },
          { name: "Acetaminophen", dosage: "500mg", frequency: "As needed", startDate: "2024-02-10" }
        ],
        appointments: [
          { 
            id: "A007", 
            date: "2025-03-12", 
            time: "10:00 AM", 
            type: "Check-up", 
            doctorName: "Dr. Alex Thompson",
            notes: "Increasing pain in right knee. Considering steroid injection if no improvement with current meds.",
            prescriptions: ["Meloxicam 15mg", "Acetaminophen 500mg"]
          }
        ],
        testResults: [
          { name: "ESR", value: 32, unit: "mm/hr", date: "2025-03-12", normal: "<20" },
          { name: "CRP", value: 4.2, unit: "mg/L", date: "2025-03-12", normal: "<3.0" }
        ],
        healthMetrics: [
          { name: "Pain Score", data: [
            { date: "Jan", value: 6 },
            { date: "Feb", value: 7 },
            { date: "Mar", value: 8 },
          ] }
        ],
        upcomingAppointments: []
      }
    ];
    
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);

    // Set current date and time from UTC value
    const currentDateTime = "2025-03-26 06:03:20";
    const [date, time] = currentDateTime.split(" ");
    setCurrentDate(date);
    setCurrentTime(time);
  }, []);

  // Filter and sort patients
  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        patient =>
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.condition.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(patient => patient.status === statusFilter);
    }
    
    // Apply condition filter
    if (conditionFilter !== "all") {
      result = result.filter(patient => 
        patient.condition.toLowerCase() === conditionFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "recent-visit":
        result.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
        break;
      default:
        break;
    }
    
    setFilteredPatients(result);
  }, [searchQuery, statusFilter, conditionFilter, sortOption, patients]);

  // Get unique conditions for filter dropdown
  const uniqueConditions = Array.from(
    new Set(patients.map(patient => patient.condition))
  );

  // Handle add new patient
  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    const newId = `P${(patients.length + 1).toString().padStart(3, '0')}`;
    
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      appointments: [],
      testResults: [],
      upcomingAppointments: []
    };
    
    setPatients(prev => [...prev, newPatient]);
    setIsAddPatientModalOpen(false);
    showSuccessMessage(`Patient ${patientData.name} has been added successfully`);
  };

  // Handle opening patient detail modal
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  // Handle scheduling appointment
  const handleScheduleAppointment = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsScheduleModalOpen(true);
    }
  };

  // Handle sending message
  const handleSendMessage = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsMessageModalOpen(true);
    }
  };

  // Handle appointment scheduling submission
  const handleScheduleSubmit = (appointmentData: any) => {
    if (!selectedPatient) return;
    
    const newAppointmentId = `U${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newAppointment = {
      id: newAppointmentId,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type,
      doctorName: appointmentData.doctor,
    };
    
    // Update the patient's upcoming appointments
    const updatedPatients = patients.map(patient => {
      if (patient.id === selectedPatient.id) {
        const upcomingAppointments = patient.upcomingAppointments || [];
        return {
          ...patient,
          upcomingAppointments: [...upcomingAppointments, newAppointment]
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    setIsScheduleModalOpen(false);
    showSuccessMessage(`Appointment scheduled with ${selectedPatient.name} for ${formatDate(appointmentData.date)} at ${appointmentData.time}`);
  };

  // Handle message send
  const handleMessageSend = (messageData: any) => {
    if (!selectedPatient) return;
    setIsMessageModalOpen(false);
    showSuccessMessage(`Message sent to ${selectedPatient.name}`);
  };

  // Show success message and auto-hide after delay
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white to-blue-50">
      {/* Current Date/Time and Welcome Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-[#006D77]">Welcome, Dr. Smith</h2>
          <p className="text-gray-500 text-sm">Current date: {formatDate(currentDate)} | {currentTime}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-[#006D77] cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 text-xs text-white flex items-center justify-center">3</span>
          </div>
          <div className="h-8 w-8 bg-[#006D77] rounded-full text-white flex items-center justify-center font-medium">
            JS
          </div>
        </div>
      </div>

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-down max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  type="button" 
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                  onClick={() => setSuccessMessage(null)}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">My Patients</h1>
          <p className="text-gray-500">Manage and monitor patient records</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-[#006D77] to-[#249EA0] text-white hover:opacity-90 transition-all duration-300"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          + Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-8 border border-[#E8F3F4]">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#006D77]" />
            <Input
              placeholder="Search patients by name, ID, or condition..."
              className="pl-10 border-[#E8F3F4] focus-visible:ring-[#006D77]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="h-5 w-5 text-[#006D77]" />
            <span className="text-sm font-medium text-[#006D77]">Filters:</span>
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px] border-[#E8F3F4] focus:ring-[#006D77]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="needs-attention">Needs Attention</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={conditionFilter} 
            onValueChange={setConditionFilter}
          >
            <SelectTrigger className="w-[180px] border-[#E8F3F4] focus:ring-[#006D77]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Conditions</SelectItem>
              {uniqueConditions.map(condition => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {statusFilter !== "all" && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-1 bg-[#F0F9FA] border-[#006D77] text-[#006D77]"
                onClick={() => setStatusFilter("all")}
              >
                Status: {statusFilter}
                <span className="text-xs ml-1 cursor-pointer">✕</span>
              </Badge>
            )}
            {conditionFilter !== "all" && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-1 bg-[#F0F9FA] border-[#006D77] text-[#006D77]"
                onClick={() => setConditionFilter("all")}
              >
                Condition: {conditionFilter}
                <span className="text-xs ml-1 cursor-pointer">✕</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#006D77]" />
            <span className="text-sm font-medium text-[#006D77]">Sort by:</span>
            <Select 
              value={sortOption} 
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-[180px] border-[#E8F3F4] focus:ring-[#006D77]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="recent-visit">Most Recent Visit</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md ml-4 border-[#E8F3F4] overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-none",
                  viewMode === "grid" 
                    ? "bg-[#006D77] text-white" 
                    : "text-[#006D77] hover:text-[#006D77] hover:bg-[#F0F9FA]"
                )}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-none",
                  viewMode === "list" 
                    ? "bg-[#006D77] text-white" 
                    : "text-[#006D77] hover:text-[#006D77] hover:bg-[#F0F9FA]"
                )}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              viewMode={viewMode} 
              onViewDetails={() => handleViewPatient(patient)}
              onScheduleAppointment={() => handleScheduleAppointment(patient.id)}
              onSendMessage={() => handleSendMessage(patient.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-[#E8F3F4]">
            <div className="w-20 h-20 mx-auto bg-[#F0F9FA] rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-[#006D77] opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No patients found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)}
          patient={selectedPatient}
          onScheduleAppointment={() => {
            setIsDetailModalOpen(false);
            setTimeout(() => {
              handleScheduleAppointment(selectedPatient.id);
            }, 100);
          }}
          onSendMessage={() => {
            setIsDetailModalOpen(false);
            setTimeout(() => {
              handleSendMessage(selectedPatient.id);
            }, 100);
          }}
        />
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSubmit={handleAddPatient}
      />

      {/* Schedule Appointment Modal */}
      {selectedPatient && (
        <ScheduleAppointmentModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          patient={selectedPatient}
          onSubmit={handleScheduleSubmit}
        />
      )}

      {/* Send Message Modal */}
      {selectedPatient && (
        <SendMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          patient={selectedPatient}
          onSubmit={handleMessageSend}
        />
      )}
    </div>
  );
}