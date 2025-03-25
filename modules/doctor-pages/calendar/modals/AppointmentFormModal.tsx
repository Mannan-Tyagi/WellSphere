import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCalendar } from '../CalendarContext';
import { PatientSearchCombobox } from '../PatientSearchCombobox';
import { Appointment } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAppointment?: Appointment | null;
  initialDate?: Date;
  initialHour?: number;
}

const appointmentTypes = [
  { id: 'consultation', name: 'Consultation' },
  { id: 'surgery', name: 'Surgery' },
  { id: 'follow-up', name: 'Follow-up' },
  { id: 'check-up', name: 'Check-up' },
  { id: 'other', name: 'Other' }
];

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  isOpen,
  onClose,
  editAppointment = null,
  initialDate,
  initialHour = 9
}) => {
  const { addAppointment, updateAppointment } = useCalendar();
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientAge: 30,
    patientGender: 'Male' as Appointment['patientGender'],
    date: format(initialDate || new Date(), 'yyyy-MM-dd'),
    startHour: initialHour,
    startMinute: 0,
    duration: 30,
    purpose: '',
    status: 'pending' as Appointment['status'],
    type: 'consultation' as Appointment['type'],
    notes: '',
    preparationStatus: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Initialize form with appointment data if editing
  useEffect(() => {
    if (editAppointment) {
      setFormData({
        patientId: editAppointment.patientId,
        patientName: editAppointment.patientName,
        patientAge: editAppointment.patientAge || 30,
        patientGender: editAppointment.patientGender || 'Male',
        date: format(editAppointment.startTime, 'yyyy-MM-dd'),
        startHour: editAppointment.startTime.getHours(),
        startMinute: editAppointment.startTime.getMinutes(),
        duration: editAppointment.duration,
        purpose: editAppointment.purpose || '',
        status: editAppointment.status,
        type: editAppointment.type,
        notes: editAppointment.notes || '',
        preparationStatus: editAppointment.preparationStatus || ''
      });
    } else if (initialDate) {
      setFormData(prevData => ({
        ...prevData,
        date: format(initialDate, 'yyyy-MM-dd'),
        startHour: initialHour
      }));
    }
  }, [editAppointment, initialDate, initialHour]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handlePatientSelect = (patient: { id: string; name: string; age: number; gender: Appointment['patientGender'] }) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender
    }));
    // Clear patient error
    if (formErrors.patientId) {
      setFormErrors(prev => ({ ...prev, patientId: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.patientName) {
      errors.patientId = 'Patient is required';
    }
    
    if (!formData.purpose) {
      errors.purpose = 'Purpose is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (formData.duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create date objects for start and end time
    const startTime = new Date(formData.date);
    startTime.setHours(formData.startHour, formData.startMinute, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + formData.duration);
    
    const appointmentData: Appointment = {
      id: editAppointment ? editAppointment.id : uuidv4(),
      patientId: formData.patientId || `temp-${uuidv4().slice(0, 8)}`, // Generate temporary ID if none provided
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      startTime,
      endTime,
      duration: formData.duration,
      purpose: formData.purpose,
      status: formData.status,
      type: formData.type,
      notes: formData.notes,
      preparationStatus: formData.preparationStatus
    };
    
    if (editAppointment) {
      updateAppointment(appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-serif text-slate-800">
            {editAppointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient*
              </label>
              <PatientSearchCombobox
                selectedPatientId={formData.patientId}
                onPatientSelect={handlePatientSelect}
                initialPatientName={formData.patientName}
              />
              {formErrors.patientId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.patientId}</p>
              )}
            </div>
            
            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date*
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
              )}
            </div>
            
            {/* Appointment Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Time*
                </label>
                <div className="flex">
                  <select
                    name="startHour"
                    value={formData.startHour}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                      <option key={hour} value={hour}>{hour}:00</option>
                    ))}
                  </select>
                  <select
                    name="startMinute"
                    value={formData.startMinute}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-y border-r border-slate-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={0}>00</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={45}>45</option>
                  </select>
                </div>
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (mins)*
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
                {formErrors.duration && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                )}
              </div>
            </div>
            
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type*
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {appointmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            {/* Appointment Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Purpose */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Purpose*
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="E.g., Annual check-up, Follow-up consultation"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {formErrors.purpose && (
                <p className="mt-1 text-sm text-red-600">{formErrors.purpose}</p>
              )}
            </div>
            
            {/* Preparation Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preparation Status
              </label>
              <input
                type="text"
                name="preparationStatus"
                value={formData.preparationStatus}
                onChange={handleInputChange}
                placeholder="E.g., Lab results pending, X-ray scheduled"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes about the appointment"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {editAppointment ? 'Update Appointment' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};