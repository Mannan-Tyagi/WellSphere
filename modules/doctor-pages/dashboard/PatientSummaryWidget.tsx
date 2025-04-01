import React, { useState } from 'react';
import Link from 'next/link';
import { Users, ChevronRight, Search, UserPlus, Clock, Calendar, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

const PatientSummaryWidget = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('recent');
  
  // Mock patient data
  const patients = [
    {
      id: 'P-1001',
      name: 'Diana Cooper',
      age: 42,
      lastVisit: '2025-03-25',
      nextAppointment: '2025-04-08',
      condition: 'Hypertension',
      status: 'stable',
      recentActivity: 'Lab results uploaded',
      activityDate: '2025-03-25',
      avatar: '/avatars/diana-cooper.jpg'
    },
    {
      id: 'P-1002',
      name: 'Michael Chen',
      age: 65,
      lastVisit: '2025-03-25',
      nextAppointment: '2025-03-30',
      condition: 'Diabetes Type 2',
      status: 'needs-attention',
      recentActivity: 'Blood glucose levels elevated',
      activityDate: '2025-03-26',
      avatar: '/avatars/michael-chen.jpg'
    },
    {
      id: 'P-1003',
      name: 'Sarah Johnson',
      age: 35,
      lastVisit: '2025-03-25',
      nextAppointment: '2025-04-15',
      condition: 'Migraine',
      status: 'improving',
      recentActivity: 'Medication adjusted',
      activityDate: '2025-03-25',
      avatar: '/avatars/sarah-johnson.jpg'
    },
    {
      id: 'P-1004',
      name: 'Robert Williams',
      age: 58,
      lastVisit: '2025-03-20',
      nextAppointment: '2025-03-26',
      condition: 'Arthritis',
      status: 'stable',
      recentActivity: 'Physical therapy recommended',
      activityDate: '2025-03-20',
      avatar: '/avatars/robert-williams.jpg'
    },
    {
      id: 'P-1005',
      name: 'Emily Davis',
      age: 47,
      lastVisit: '2025-03-18',
      nextAppointment: '2025-03-26',
      condition: 'Chronic Pain',
      status: 'needs-attention',
      recentActivity: 'Pain assessment updated',
      activityDate: '2025-03-24',
      avatar: '/avatars/emily-davis.jpg'
    }
  ];

  // Filter and search patients
  const filteredPatients = patients
    .filter(patient => {
      // Apply search
      if (searchQuery) {
        return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
               patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(patient => {
      // Apply filter
      if (filter === 'recent') {
        return differenceInDays(new Date(), parseISO(patient.lastVisit)) <= 7;
      }
      if (filter === 'upcoming') {
        return differenceInDays(parseISO(patient.nextAppointment), new Date()) <= 7;
      }
      if (filter === 'attention') {
        return patient.status === 'needs-attention';
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by most recent activity
      return new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime();
    })
    .slice(0, 5); // Limit to 5 patients for the widget

  // Get status indicator
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'improving':
        return <ArrowUpRight size={14} className="text-green-600" />;
      case 'needs-attention':
        return <ArrowDownRight size={14} className="text-red-600" />;
      case 'stable':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Users className="mr-2" size={20} />
          Patient Summary
        </h2>
        <Link href="/Doctor/Patients/Add" className="p-1.5 rounded-full bg-[#F0F9FA] text-[#006D77] hover:bg-[#E8F3F4] transition-colors">
          <UserPlus size={16} />
        </Link>
      </div>
      
      {/* Search and filter */}
      <div className="flex space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-2 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="recent">Recent</option>
          <option value="upcoming">Upcoming</option>
          <option value="attention">Needs Attention</option>
        </select>
      </div>
      
      {/* Patients List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <Link 
              key={patient.id}
              href={`/Doctor/Patients/${patient.id}`}
              className="block p-3 border border-gray-100 rounded-lg hover:bg-[#F0F9FA] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {/* In a real app, this would be an actual image */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800 flex items-center">
                      {patient.name}
                      <span className="ml-2 flex items-center">
                        {getStatusIndicator(patient.status)}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">{patient.id}</span>
                  </div>
                  <p className="text-xs text-gray-600">{patient.age} yrs • {patient.condition}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>Last visit: {format(parseISO(patient.lastVisit), 'MMM d, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <Calendar size={12} className="mr-1" />
                    <span>Next: {format(parseISO(patient.nextAppointment), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600">{patient.recentActivity}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No patients found</p>
            <Link 
              href="/Doctor/Patients"
              className="mt-2 text-sm text-[#006D77] hover:underline flex items-center mx-auto justify-center"
            >
              <Filter size={14} className="mr-1" />
              Adjust filters
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <Link href="/Doctor/Patients" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
          View All Patients <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PatientSummaryWidget;