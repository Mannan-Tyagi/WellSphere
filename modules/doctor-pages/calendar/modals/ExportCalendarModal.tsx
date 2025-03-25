import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useCalendar } from '../CalendarContext';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportCalendarModal: React.FC<ExportCalendarModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate } = useCalendar();
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [startDate, setStartDate] = useState<string>(format(selectedDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(
    format(endOfWeek(selectedDate), 'yyyy-MM-dd')
  );
  const [fileFormat, setFileFormat] = useState<'pdf' | 'csv' | 'ical'>('pdf');
  const [includeOptions, setIncludeOptions] = useState({
    patientDetails: true,
    appointmentNotes: false,
    completedAppointments: false
  });
  
  const handleDateRangeChange = (range: 'day' | 'week' | 'month' | 'custom') => {
    setDateRange(range);
    
    // Update date range based on selection
    switch (range) {
      case 'day':
        setStartDate(format(selectedDate, 'yyyy-MM-dd'));
        setEndDate(format(selectedDate, 'yyyy-MM-dd'));
        break;
      case 'week':
        setStartDate(format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'));
        setEndDate(format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(startOfMonth(selectedDate), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(selectedDate), 'yyyy-MM-dd'));
        break;
      // For custom, keep the current values
    }
  };
  
  const handleIncludeOptionChange = (option: keyof typeof includeOptions) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  const handleExport = () => {
    // In a real application, this would trigger API calls to generate the export
    console.log('Exporting calendar with settings:', {
      dateRange,
      startDate,
      endDate,
      fileFormat,
      includeOptions
    });
    
    // Simulate export success
    setTimeout(() => {
      alert('Calendar exported successfully!');
      onClose();
    }, 1000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-serif text-slate-800">Export Calendar</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDateRangeChange('day')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    dateRange === 'day'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Current Day
                </button>
                <button
                  type="button"
                  onClick={() => handleDateRangeChange('week')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    dateRange === 'week'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Current Week
                </button>
                <button
                  type="button"
                  onClick={() => handleDateRangeChange('month')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    dateRange === 'month'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Current Month
                </button>
                <button
                  type="button"
                  onClick={() => handleDateRangeChange('custom')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    dateRange === 'custom'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>
            
            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
            
            {/* File Format */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFileFormat('pdf')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    fileFormat === 'pdf'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setFileFormat('csv')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    fileFormat === 'csv'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => setFileFormat('ical')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    fileFormat === 'ical'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  iCal
                </button>
              </div>
            </div>
            
            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="include-patient-details"
                    type="checkbox"
                    checked={includeOptions.patientDetails}
                    onChange={() => handleIncludeOptionChange('patientDetails')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="include-patient-details" className="ml-2 text-sm text-slate-700">
                    Include patient details
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="include-notes"
                    type="checkbox"
                    checked={includeOptions.appointmentNotes}
                    onChange={() => handleIncludeOptionChange('appointmentNotes')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="include-notes" className="ml-2 text-sm text-slate-700">
                    Include appointment notes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="include-completed"
                    type="checkbox"
                    checked={includeOptions.completedAppointments}
                    onChange={() => handleIncludeOptionChange('completedAppointments')}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="include-completed" className="ml-2 text-sm text-slate-700">
                    Include completed appointments
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-6 p-3 bg-slate-50 rounded-md">
            <h3 className="text-sm font-medium text-slate-700 mb-1">Export Summary</h3>
            <p className="text-xs text-slate-600">
              {dateRange === 'day' && 'Exporting appointments for current day'}
              {dateRange === 'week' && 'Exporting appointments for current week'}
              {dateRange === 'month' && 'Exporting appointments for current month'}
              {dateRange === 'custom' && 'Exporting appointments for custom date range'}
              {' in '}
              {fileFormat === 'pdf' && 'PDF format'}
              {fileFormat === 'csv' && 'CSV format'}
              {fileFormat === 'ical' && 'iCalendar format'}
              {'.'}
            </p>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};