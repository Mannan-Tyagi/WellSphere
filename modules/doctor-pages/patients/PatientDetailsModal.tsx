import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit,  Trash2, Phone, Mail, MapPin, Calendar, Activity, User,  FileText, Download, Upload, Plus,  Thermometer, Droplet, Activity as Pulse, Gauge, Baseline as Timeline, Stethoscope, Pill, FlaskRound as Flask, } from 'lucide-react';
import { Patient } from '.';
import { format } from 'date-fns';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (patient: Patient) => void;
}

// Mock data for vitals
const vitalsHistory = [
  {
    date: '2023-11-20',
    bp: '120/80',
    pulse: '72',
    temp: '98.6',
    sugar: '95',
    oxygen: '98'
  },
  {
    date: '2023-11-15',
    bp: '118/78',
    pulse: '70',
    temp: '98.4',
    sugar: '92',
    oxygen: '99'
  }
];

// Mock data for lab results
const labResults = [
  {
    id: 'LAB001',
    date: '2023-11-20',
    type: 'Blood Test',
    status: 'Normal',
    doctor: 'Dr. Wilson',
    report: 'https://example.com/reports/lab001.pdf'
  },
  {
    id: 'LAB002',
    date: '2023-11-15',
    type: 'Urine Analysis',
    status: 'Abnormal',
    doctor: 'Dr. Johnson',
    report: 'https://example.com/reports/lab002.pdf'
  }
];

// Mock data for prescriptions
const prescriptions = [
  {
    id: 'RX001',
    date: '2023-11-20',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
    ],
    doctor: 'Dr. Wilson',
    notes: 'Take with food'
  },
  {
    id: 'RX002',
    date: '2023-11-15',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }
    ],
    doctor: 'Dr. Johnson',
    notes: 'Take in the morning'
  }
];

// Mock data for appointments
const appointments = [
  {
    id: 'APT001',
    date: '2023-12-10',
    time: '10:30 AM',
    type: 'Follow-up',
    doctor: 'Dr. Wilson',
    status: 'Scheduled'
  },
  {
    id: 'APT002',
    date: '2023-11-15',
    time: '2:00 PM',
    type: 'Regular Checkup',
    doctor: 'Dr. Johnson',
    status: 'Completed'
  }
];

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'history' | 'appointments' | 'lab' | 'prescriptions'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Patient>({ ...patient });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="relative mr-4">
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700" 
              />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                patient.status === 'Critical' ? 'bg-red-500' : 
                patient.status === 'Follow-Up Needed' ? 'bg-yellow-500' : 
                patient.status === 'Recovering' ? 'bg-blue-500' : 'bg-green-500'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {patient.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {patient.id} • {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'vitals', label: 'Vitals', icon: Activity },
            { id: 'history', label: 'Medical History', icon: Timeline },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'lab', label: 'Lab Results', icon: Flask },
            { id: 'prescriptions', label: 'Prescriptions', icon: Pill }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="grid grid-cols-2 gap-6"
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {patient.age} years, {patient.gender}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {patient.contactNumber}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {patient.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {patient.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                      Current Condition
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Activity size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {patient.condition}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Stethoscope size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Attending: {patient.doctor}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Department: {patient.department}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-600 dark:text-gray-300">
                            Last Visit
                          </span>
                        </div>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {formatDate(patient.lastVisit)}
                        </span>
                      </div>
                      {patient.upcomingAppointment && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Next Appointment
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium">
                            {formatDate(patient.upcomingAppointment)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                      Status & Alerts
                    </h3>
                    <div className="space-y-3">
                      <div className={`px-4 py-2 rounded-lg ${
                        patient.status === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        patient.status === 'Follow-Up Needed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        patient.status === 'Recovering' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        <div className="font-medium">Current Status: {patient.status}</div>
                        <div className="text-sm mt-1">
                          {patient.status === 'Critical' ? 'Requires immediate attention' :
                           patient.status === 'Follow-Up Needed' ? 'Schedule follow-up appointment' :
                           patient.status === 'Recovering' ? 'Monitoring progress' :
                           'Regular monitoring'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Vitals Tab */}
            {activeTab === 'vitals' && (
              <motion.div
                key="vitals"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Vitals */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                      Current Vitals
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Gauge className="text-primary-500 w-5 h-5 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Blood Pressure</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            {vitalsHistory[0].bp}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Pulse className="text-primary-500 w-5 h-5 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Pulse</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            {vitalsHistory[0].pulse} bpm
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Thermometer className="text-primary-500 w-5 h-5 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Temperature</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            {vitalsHistory[0].temp}°F
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Droplet className="text-primary-500 w-5 h-5 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Blood Sugar</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            {vitalsHistory[0].sugar} mg/dL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vitals History */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                      Vitals History
                    </h3>
                    <div className="space-y-4">
                      {vitalsHistory.map((record, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {formatDate(record.date)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600 dark:text-gray-300">BP: {record.bp}</div>
                            <div className="text-gray-600 dark:text-gray-300">Pulse: {record.pulse} bpm</div>
                            <div className="text-gray-600 dark:text-gray-300">Temp: {record.temp}°F</div>
                            <div className="text-gray-600 dark:text-gray-300">Sugar: {record.sugar} mg/dL</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  {patient.medicalHistory.map((condition, index) => (
                    <div key={index} className="relative pl-10 pb-6">
                      <div className="absolute left-2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 dark:border-primary-400"></div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                          {condition}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Diagnosed on {format(new Date(patient.lastVisit), 'MMMM d, yyyy')}
                        </div>
                        <div className="mt-2 text-gray-600 dark:text-gray-300">
                          Treatment ongoing under {patient.doctor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Appointments
                  </h3>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Schedule New Appointment
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Appointments */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Upcoming Appointments
                    </h4>
                    <div className="space-y-4">
                      {appointments.filter(apt => new Date(apt.date) >= new Date()).map(appointment => (
                        <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg font-medium text-gray-800 dark:text-white">
                                {appointment.type}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(appointment.date)} at {appointment.time}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                With {appointment.doctor}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <Edit size={16} />
                              </button>
                              <button className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Appointments */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Past Appointments
                    </h4>
                    <div className="space-y-4">
                      {appointments.filter(apt => new Date(apt.date) < new Date()).map(appointment => (
                        <div key={appointment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg font-medium text-gray-800 dark:text-white">
                                {appointment.type}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(appointment.date)} at {appointment.time}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                With {appointment.doctor}
                              </div>
                            </div>
                            <div className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                              Completed
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lab Results Tab */}
            {activeTab === 'lab' && (
              <motion.div
                key="lab"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Lab Results
                  </h3>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center">
                    <Upload size={16} className="mr-2" />
                    Upload New Report
                  </button>
                </div>

                <div className="grid gap-4">
                  {labResults.map(result => (
                    <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-lg font-medium text-gray-800 dark:text-white">
                            {result.type}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(result.date)} • Ordered by {result.doctor}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.status === 'Normal' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {result.status}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center">
                          <Download size={16} className="mr-2" />
                          Download Report
                        </button>
                        <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center">
                          <FileText size={16} className="mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <motion.div
                key="prescriptions"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    Prescriptions
                  </h3>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add New Prescription
                  </button>
                </div>

                <div className="space-y-6">
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-lg font-medium text-gray-800 dark:text-white">
                            Prescription #{prescription.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(prescription.date)} • Prescribed by {prescription.doctor}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Download size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {med.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {med.dosage} • {med.frequency}
                                </div>
                              </div>
                              <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
                                Active
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {prescription.notes && (
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                          <strong>Notes:</strong> {prescription.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetailsModal;
