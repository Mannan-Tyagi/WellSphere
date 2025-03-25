"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, Clock, CheckCircle, Activity } from 'lucide-react';
import ThemeToggle from '@/modules/doctor-pages/patients/ThemeToggle';
import LanguageSelector from '@/modules/doctor-pages/patients/LanguageSelector';
import SearchBar from '@/modules/doctor-pages/patients/SearchBar';
import PatientsList from '@/modules/doctor-pages/patients/PatientsList';
import AddPatientModal from '@/modules/doctor-pages/patients/AddPatientModal';
import PatientDetailsModal from '@/modules/doctor-pages/patients/PatientDetailsModal';
import { FilterOption, Language, Patient, SortOption, ThemeMode } from '@/modules/doctor-pages/patients';
const initialPatients: Patient[] = [];
// import { Patient, SortOption, FilterOption, ViewMode, ThemeMode, Language } from './types';

// // Components
// import SearchBar from './components/SearchBar';
// import PatientsList from './components/PatientsList';
// import AddPatientModal from './components/AddPatientModal';
// import PatientDetailsModal from './components/PatientDetailsModal';
// import ThemeToggle from './components/ThemeToggle';
// import LanguageSelector from './components/LanguageSelector';

function Patinets() {
  // State management
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(initialPatients);
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('All');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Calculate patient statistics
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const followUpCount = patients.filter(p => p.status === 'Follow-Up Needed').length;
  const stableCount = patients.filter(p => p.status === 'Stable').length;
  const recoveringCount = patients.filter(p => p.status === 'Recovering').length;

  // Handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  // Handle search results
  const handleSearch = useCallback((results: Patient[]) => {
    setFilteredPatients(results);
  }, []);

  // Handle adding a new patient
  const handleAddPatient = useCallback((newPatient: Patient) => {
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    setIsAddPatientModalOpen(false);
  }, [patients]);

  // Handle updating a patient
  const handleUpdatePatient = useCallback((updatedPatient: Patient) => {
    const updatedPatients = patients.map(patient => 
      patient.id === updatedPatient.id ? updatedPatient : patient
    );
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    setSelectedPatient(null);
  }, [patients]);

  // Handle patient selection for details view
  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
  }, []);

  const patientCategories = [
    {
      title: 'Critical',
      count: criticalCount,
      icon: <AlertCircle className="text-red-500" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    },
    {
      title: 'Follow-up',
      count: followUpCount,
      icon: <Clock className="text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    },
    {
      title: 'Stable',
      count: stableCount,
      icon: <CheckCircle className="text-green-500" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    },
    {
      title: 'Recovering',
      count: recoveringCount,
      icon: <Activity className="text-blue-500" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Patient Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Seamlessly manage your patients with our intelligent platform
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <LanguageSelector language={language} setLanguage={setLanguage} />
            </div>
          </div>

          {/* Search and Actions */}
          <div className="mt-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar patients={patients} onSearch={handleSearch} />
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddPatientModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                <Users className="h-5 w-5 mr-2" />
                Add Patient
              </motion.button>
            </div>
          </div>

          {/* Patient Categories */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {patientCategories.map((category) => (
              <motion.div
                key={category.title}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {category.icon}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{category.title}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{category.count}</p>
                    </div>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${category.color}`}>
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientsList
          patients={filteredPatients}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
          onPatientSelect={handlePatientSelect}
        />
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isAddPatientModalOpen && (
          <AddPatientModal 
            onClose={() => setIsAddPatientModalOpen(false)} 
            onAddPatient={handleAddPatient}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedPatient && (
          <PatientDetailsModal 
            patient={selectedPatient} 
            onClose={() => setSelectedPatient(null)}
            onUpdate={handleUpdatePatient}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Patinets;