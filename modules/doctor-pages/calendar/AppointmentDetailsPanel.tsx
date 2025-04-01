import React, { useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { 
  XMarkIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  CalendarIcon, 
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { AppointmentFormModal } from './modals/AppointmentFormModal';
import { RecurringAppointmentModal } from './modals/RecurringAppointmentModal';

interface AppointmentDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentDetailsPanel: React.FC<AppointmentDetailsPanelProps> = ({ isOpen, onClose }) => {
  const { 
    selectedAppointment, 
    appointments, 
    cancelAppointment,
    deleteAppointment 
  } = useCalendar();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // For demo purposes, we'll show the first appointment if none is selected
  const appointment = selectedAppointment || appointments[0];
  
  if (!appointment) {
    return null;
  }

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeColor = () => {
    switch (appointment.type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'surgery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'follow-up':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'check-up':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  const handleCancel = () => {
    cancelAppointment(appointment.id);
    onClose();
  };
  
  const handleDelete = () => {
    deleteAppointment(appointment.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-4 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-serif text-slate-800">Appointment Details</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 h-full overflow-y-auto pb-20">
          {/* Status & Type Tags */}
          <div className="flex space-x-2 mb-4">
            <span className={`px-2 py-1 text-xs rounded ${getStatusColor()}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${getTypeColor()}`}>
              {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
            </span>
          </div>
          
          {/* Date & Time */}
          <div className="mb-6">
            <div className="flex items-center text-slate-600 mb-2">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{format(appointment.startTime, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>
                {format(appointment.startTime, 'h:mm a')} - {format(appointment.endTime, 'h:mm a')}
                {' '}({appointment.duration} mins)
              </span>
            </div>
          </div>
          
          {/* Patient Details */}
          <div className="border-t border-slate-100 pt-4 mb-6">
            <h3 className="font-medium text-slate-800 mb-3">Patient Information</h3>
            
            <div className="flex items-center mb-4">
              {/* Patient Photo or Initial */}
              <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-300 mr-3">
                {appointment.patientPhoto ? (
                  <img 
                    src={appointment.patientPhoto} 
                    alt={appointment.patientName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-700 font-medium text-lg">
                    {appointment.patientName.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Patient Name & Details */}
              <div>
                <h4 className="font-medium text-slate-800">{appointment.patientName}</h4>
                <p className="text-sm text-slate-500">
                  {appointment.patientAge} yrs, {appointment.patientGender}
                </p>
              </div>
            </div>
            
            {/* Patient Contact */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <PhoneIcon className="w-4 h-4 mr-2 text-slate-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-slate-400" />
                <span>{appointment.patientName.toLowerCase().replace(' ', '.')}@example.com</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2 mb-4">
              <button className="flex-1 flex items-center justify-center py-1.5 text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors">
                <PhoneIcon className="w-3.5 h-3.5 mr-1" />
                Call
              </button>
              <button className="flex-1 flex items-center justify-center py-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                <EnvelopeIcon className="w-3.5 h-3.5 mr-1" />
                Message
              </button>
              <button className="flex-1 flex items-center justify-center py-1.5 text-xs bg-slate-50 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">
                View Records
              </button>
            </div>
          </div>
          
          {/* Appointment Details */}
          <div className="border-t border-slate-100 pt-4 mb-6">
            <h3 className="font-medium text-slate-800 mb-3">Appointment Details</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-slate-700">Purpose</h4>
                <p className="text-sm text-slate-600">{appointment.purpose}</p>
              </div>
              
              {appointment.preparationStatus && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700">Preparation Status</h4>
                  <p className="text-sm text-slate-600">{appointment.preparationStatus}</p>
                </div>
              )}
              
              {appointment.notes && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700">Notes</h4>
                  <p className="text-sm text-slate-600">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            {/* Primary actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {appointment.status !== 'cancelled' ? (
                <button 
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center py-2 border border-slate-200 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={() => setShowRecurringModal(true)}
                  className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Reschedule
                </button>
              )}
            </div>
            
            {/* Secondary actions */}
            <div className="flex justify-between">
              <button 
                onClick={() => setShowRecurringModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Create recurring
              </button>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <TrashIcon className="w-3.5 h-3.5 mr-1" />
                  Delete
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-600">Confirm?</span>
                  <button 
                    onClick={handleDelete}
                    className="text-xs font-medium text-red-600 hover:text-red-800"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-slate-600 hover:text-slate-800"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Appointment Modal */}
      {showEditModal && (
        <AppointmentFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          editAppointment={appointment}
        />
      )}
      
      {/* Recurring Appointment Modal */}
      {showRecurringModal && (
        <RecurringAppointmentModal
          isOpen={showRecurringModal}
          onClose={() => setShowRecurringModal(false)}
          appointment={appointment}
        />
      )}
    </>
  );
};