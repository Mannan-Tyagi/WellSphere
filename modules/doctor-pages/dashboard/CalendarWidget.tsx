import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, ChevronLeft, Plus, Video, Phone, User } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, isAfter, isBefore } from 'date-fns';

const CalendarWidget = () => {
  const today = new Date('2025-03-25');
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Mock appointments data - expanded with more details
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patientName: 'Diana Cooper', 
      time: '09:30 AM',
      endTime: '10:00 AM',
      date: '2025-03-25',
      purpose: 'Follow-up',
      type: 'consultation',
      status: 'confirmed',
      method: 'in-person',
      notes: 'Review medication effectiveness, check blood pressure',
      patientId: 'P-1001'
    },
    { 
      id: 2, 
      patientName: 'Michael Chen', 
      time: '11:00 AM',
      endTime: '11:30 AM',
      date: '2025-03-25',
      purpose: 'Blood Pressure Check',
      type: 'check-up',
      status: 'confirmed',
      method: 'video',
      notes: 'Patient prefers video consultation due to mobility issues',
      patientId: 'P-1002'
    },
    { 
      id: 3, 
      patientName: 'Sarah Johnson', 
      time: '02:15 PM',
      endTime: '03:00 PM',
      date: '2025-03-25',
      purpose: 'Medication Review',
      type: 'follow-up',
      status: 'pending',
      method: 'in-person',
      notes: 'Discuss lab results and adjust medication if needed',
      patientId: 'P-1003'
    },
    { 
      id: 4, 
      patientName: 'Robert Williams', 
      time: '10:00 AM',
      endTime: '10:30 AM',
      date: '2025-03-26',
      purpose: 'Annual Physical',
      type: 'check-up',
      status: 'confirmed',
      method: 'in-person',
      notes: 'Complete physical examination, update vaccination records',
      patientId: 'P-1004'
    },
    { 
      id: 5, 
      patientName: 'Emily Davis', 
      time: '01:30 PM',
      endTime: '02:00 PM',
      date: '2025-03-26',
      purpose: 'Chronic Pain Management',
      type: 'follow-up',
      status: 'confirmed',
      method: 'phone',
      notes: 'Discuss pain management strategies and medication effectiveness',
      patientId: 'P-1005'
    }
  ]);

  // Filter appointments based on selected date
  useEffect(() => {
    const filtered = appointments.filter(appointment => 
      isSameDay(parseISO(appointment.date), selectedDate)
    );
    
    // Apply additional filters
    if (filter !== 'all') {
      return setFilteredAppointments(filtered.filter(app => app.method === filter));
    }
    
    setFilteredAppointments(filtered);
  }, [selectedDate, appointments, filter]);

  // Generate dates for mini calendar
  const generateCalendarDays = () => {
    const days = [];
    for (let i = -3 + calendarOffset; i <= 3 + calendarOffset; i++) {
      const date = addDays(today, i);
      days.push({
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        isToday: isSameDay(date, today),
        hasAppointments: appointments.some(app => isSameDay(parseISO(app.date), date))
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get appointment type color
  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'check-up':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'follow-up':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get appointment status indicator
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get appointment method icon
  const getMethodIcon = (method) => {
    switch (method) {
      case 'video':
        return <Video size={14} className="text-blue-600" />;
      case 'phone':
        return <Phone size={14} className="text-purple-600" />;
      case 'in-person':
        return <User size={14} className="text-emerald-600" />;
      default:
        return null;
    }
  };

  // Add new appointment
  const addAppointment = (newAppointment) => {
    setAppointments([...appointments, {
      id: appointments.length + 1,
      ...newAppointment
    }]);
    setShowAddModal(false);
  };

  // Navigate calendar
  const navigateCalendar = (direction) => {
    setCalendarOffset(calendarOffset + direction);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Calendar className="mr-2" size={20} />
          Today's Schedule
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-1.5 rounded-full bg-[#F0F9FA] text-[#006D77] hover:bg-[#E8F3F4] transition-colors"
            aria-label="Add appointment"
          >
            <Plus size={16} />
          </button>
          <Link href="/Doctor/Calendar" className="text-[#006D77] hover:underline flex items-center">
            View Full Schedule <ChevronRight size={16} />
          </Link>
        </div>
      </div>
      
      {/* Mini Calendar Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => navigateCalendar(-7)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {format(calendarDays[0].date, 'MMM d')} - {format(calendarDays[6].date, 'MMM d, yyyy')}
        </span>
        <button 
          onClick={() => navigateCalendar(7)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Mini Calendar */}
      <div className="flex justify-between mb-4">
        {calendarDays.map((day) => (
          <div 
            key={day.date.toString()}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors relative
              ${day.isToday ? 'bg-[#006D77] text-white' : 
                selectedDate.toDateString() === day.date.toDateString() ? 'bg-[#E8F3F4] text-[#006D77]' : 'hover:bg-gray-100'}
            `}
          >
            <span className="text-xs font-medium">{day.dayName}</span>
            <span className="text-sm font-bold">{day.dayNumber}</span>
            {day.hasAppointments && !day.isToday && selectedDate.toDateString() !== day.date.toDateString() && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#006D77] rounded-full"></span>
            )}
          </div>
        ))}
      </div>

      {/* Appointment Filters */}
      <div className="flex mb-3 space-x-2 text-xs">
        <button 
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('in-person')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'in-person' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <User size={12} className="mr-1" /> In-person
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'video' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <Video size={12} className="mr-1" /> Video
        </button>
        <button 
          onClick={() => setFilter('phone')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'phone' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <Phone size={12} className="mr-1" /> Phone
        </button>
      </div>
      
      {/* Appointments List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredAppointments.length > 0 ? (
          filteredAppointments
            .sort((a, b) => {
              // Convert time strings to comparable values
              const timeA = a.time.includes('PM') && !a.time.includes('12:') ? 
                parseInt(a.time.split(':')[0]) + 12 : parseInt(a.time.split(':')[0]);
              const timeB = b.time.includes('PM') && !b.time.includes('12:') ? 
                parseInt(b.time.split(':')[0]) + 12 : parseInt(b.time.split(':')[0]);
              return timeA - timeB;
            })
            .map(appointment => (
              <div 
                key={appointment.id}
                className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-[#F0F9FA] transition-colors"
              >
                <div className="mr-3 bg-[#E8F3F4] p-2 rounded-md flex-shrink-0">
                  <Clock size={18} className="text-[#006D77]" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800 flex items-center">
                      {appointment.patientName}
                      <span className={`ml-2 w-2 h-2 rounded-full ${getStatusIndicator(appointment.status)}`}></span>
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 flex items-center">
                        {getMethodIcon(appointment.method)}
                        <span className="ml-1">{appointment.method}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{appointment.time} - {appointment.endTime}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getAppointmentTypeColor(appointment.type)}`}>
                      {appointment.purpose}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{appointment.notes}</p>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments scheduled for this day</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-sm text-[#006D77] hover:underline flex items-center mx-auto"
            >
              <Plus size={14} className="mr-1" />
              Add Appointment
            </button>
          </div>
        )}
      </div>

      {/* Add Appointment Modal - In a real app, this would be a proper modal component */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Appointment</h3>
            {/* This would be a form in a real implementation */}
            <div className="space-y-4">
              {/* Form fields would go here */}
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Mock adding a new appointment
                    addAppointment({
                      patientName: 'New Patient',
                      time: '04:00 PM',
                      endTime: '04:30 PM',
                      date: format(selectedDate, 'yyyy-MM-dd'),
                      purpose: 'Initial Consultation',
                      type: 'consultation',
                      status: 'confirmed',
                      method: 'in-person',
                      notes: '',
                      patientId: 'P-1006'
                    });
                  }}
                  className="px-4 py-2 bg-[#006D77] text-white rounded-md hover:bg-[#005A66]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;