"use client";

import { AppointmentModal } from '@/modules/doctor-pages/calendar/AppointmentModal';
import { Appointment, CalendarView, NewAppointmentData } from '@/modules/doctor-pages/calendar/calendar';
import { CalendarHeader } from '@/modules/doctor-pages/calendar/CalendarHeader';
import { DayView } from '@/modules/doctor-pages/calendar/DayView';
import React, { useState } from 'react';
;

const sampleAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    treatmentType: 'Check-up',
    startTime: '9:00',
    endTime: '10:00',
    status: 'finished',
    doctorId: '1',
    patientContact: '555-0123',
    notes: 'Regular check-up, patient has history of hypertension',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    treatmentType: 'Follow-up',
    startTime: '10:30',
    endTime: '11:30',
    status: 'in-progress',
    doctorId: '1',
    patientContact: '555-0124',
    notes: 'Follow-up for medication adjustment',
  },
  {
    id: '3',
    patientName: 'Bob Johnson',
    treatmentType: 'Consultation',
    startTime: '14:00',
    endTime: '15:00',
    status: 'upcoming',
    doctorId: '1',
    patientContact: '555-0125',
    notes: 'New patient consultation',
  },
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('day');
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    console.log('Viewing appointment:', appointment);
  };

  const handleNewAppointment = () => {
    setSelectedTime(undefined);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (data: NewAppointmentData) => {
    const newAppointment: Appointment = {
      id: `${Date.now()}`,
      ...data,
      status: 'upcoming',
      doctorId: '1',
    };

    setAppointments([...appointments, newAppointment]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        onNewAppointment={handleNewAppointment}
      />
      <div className="flex-1 overflow-hidden">
        <DayView
          date={currentDate}
          view={view}
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
      </div>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        initialTime={selectedTime}
      />
    </div>
  );
}

export default App;