import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ChevronRight, Search, Filter, Clock, Calendar, Heart, Activity, AlertCircle } from 'lucide-react';

const PatientOverviewWidget = () => {
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: 'Sarah Thompson', 
      status: 'Active Treatment', 
      summary: 'Ongoing diabetes management',
      priority: 'high',
      age: 42,
      gender: 'Female',
      lastVisit: '2025-03-20',
      nextAppointment: '2025-03-28',
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: 78,
        temperature: '98.6°F'
      },
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      medications: ['Metformin', 'Lisinopril'],
      alerts: ['Blood sugar trending high']
    },
    { 
      id: 2, 
      name: 'Michael Rodriguez', 
      status: 'New Patient', 
      summary: 'Initial consultation scheduled',
      priority: 'medium',
      age: 35,
      gender: 'Male',
      lastVisit: null,
      nextAppointment: '2025-03-27',
      vitalSigns: null,
      conditions: [],
      medications: [],
      alerts: []
    },
    { 
      id: 3, 
      name: 'Emma Wilson', 
      status: 'Follow-up', 
      summary: 'Post-surgery recovery check',
      priority: 'high',
      age: 58,
      gender: 'Female',
      lastVisit: '2025-03-15',
      nextAppointment: '2025-03-29',
      vitalSigns: {
        bloodPressure: '125/80',
        heartRate: 72,
        temperature: '98.2°F'
      },
      conditions: ['Osteoarthritis', 'Recent knee replacement'],
      medications: ['Tramadol', 'Celebrex'],
      alerts: ['Physical therapy recommended']
    },
    { 
      id: 4, 
      name: 'David Chen', 
      status: 'Medication Review', 
      summary: 'Hypertension treatment adjustment',
      priority: 'medium',
      age: 62,
      gender: 'Male',
      lastVisit: '2025-03-10',
      nextAppointment: '2025-03-31',
      vitalSigns: {
        bloodPressure: '145/90',
        heartRate: 80,
        temperature: '98.4°F'
      },
      conditions: ['Hypertension', 'High Cholesterol'],
      medications: ['Amlodipine', 'Atorvastatin'],
      alerts: ['Blood pressure above target']
    },
    { 
      id: 5, 
      name: 'Olivia Martinez', 
      status: 'Lab Results', 
      summary: 'Review recent blood work',
      priority: 'high',
      age: 45,
      gender: 'Female',
      lastVisit: '2025-03-18',
      nextAppointment: '2025-03-26',
      vitalSigns: {
        bloodPressure: '118/75',
        heartRate: 68,
        temperature: '98.5°F'
      },
      conditions: ['Hypothyroidism', 'Anemia'],
      medications: ['Levothyroxine', 'Iron supplements'],
      alerts: ['Thyroid levels require adjustment']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter patients based on search and priority
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || patient.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-[#2D6A4F] text-white';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle patient selection for detailed view
  const handlePatientSelect = (patient) => {
    setSelectedPatient(selectedPatient?.id === patient.id ? null : patient);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Users className="mr-2" size={20} />
          Patient Overview
        </h2>
        <Link href="/Doctor/Patients" className="text-[#006D77] hover:underline flex items-center">
          View Patient List <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="mb-4 relative">
        <div className="flex">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search patients" 
              className="w-full p-2 pl-8 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search 
              className="absolute left-2 top-3 text-gray-400" 
              size={16} 
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border-y border-r rounded-r-md ${showFilters ? 'bg-[#E8F3F4] text-[#006D77]' : 'bg-white text-gray-600'}`}
          >
            <Filter size={16} />
          </button>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-3">
            <h3 className="text-sm font-medium mb-2">Filter by Priority</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterPriority('all')}
                className={`px-3 py-1 text-xs rounded-full ${filterPriority === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterPriority('high')}
                className={`px-3 py-1 text-xs rounded-full ${filterPriority === 'high' ? 'bg-[#2D6A4F] text-white' : 'bg-red-50 text-red-800'}`}
              >
                High Priority
              </button>
              <button 
                onClick={() => setFilterPriority('medium')}
                className={`px-3 py-1 text-xs rounded-full ${filterPriority === 'medium' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'}`}
              >
                Medium
              </button>
              <button 
                onClick={() => setFilterPriority('low')}
                className={`px-3 py-1 text-xs rounded-full ${filterPriority === 'low' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Low
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {filteredPatients.map(patient => (
          <div key={patient.id}>
            <div 
              onClick={() => handlePatientSelect(patient)}
              className={`flex items-center p-2 hover:bg-[#F0F9FA] rounded-md transition-colors cursor-pointer
                ${selectedPatient?.id === patient.id ? 'bg-[#F0F9FA] border border-[#006D77]/20' : ''}
              `}
            >
              <div className="w-10 h-10 rounded-full bg-[#E8F3F4] flex items-center justify-center mr-3 text-[#006D77] font-medium">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{patient.name}</p>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500">{patient.summary}</p>
                  {patient.alerts.length > 0 && (
                    <span className="ml-2 text-amber-500">
                      <AlertCircle size={14} />
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(patient.priority)}`}>
                {patient.status}
              </span>
            </div>
            
            {/* Expanded patient details */}
            {selectedPatient?.id === patient.id && (
              <div className="mt-2 ml-12 p-3 bg-gray-50 rounded-md text-sm">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-gray-500">Age:</span> {patient.age}, {patient.gender}
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-500">Last Visit:</span> {formatDate(patient.lastVisit)}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-500">Next Appointment:</span> {formatDate(patient.nextAppointment)}
                  </div>
                  {patient.vitalSigns && (
                    <div className="flex items-center">
                      <Heart size={14} className="text-red-500 mr-1" />
                      <span className="text-gray-500">BP:</span> {patient.vitalSigns.bloodPressure}
                    </div>
                  )}
                </div>
                
                {patient.conditions.length > 0 && (
                  <div className="mb-2">
                    <span className="text-gray-500 font-medium">Conditions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.conditions.map((condition, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.medications.length > 0 && (
                  <div className="mb-2">
                    <span className="text-gray-500 font-medium">Medications:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medications.map((medication, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.alerts.length > 0 && (
                  <div>
                    <span className="text-gray-500 font-medium">Alerts:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.alerts.map((alert, idx) => (
                        <span key={idx} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full flex items-center">
                          <AlertCircle size={10} className="mr-1" /> {alert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 flex justify-end">
                  <Link href={`/Doctor/Patients/${patient.id}`} className="text-xs text-[#006D77] hover:underline flex items-center">
                    View Full Profile <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>No patients found</p>
            <button className="mt-2 text-sm text-[#006D77] hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientOverviewWidget;