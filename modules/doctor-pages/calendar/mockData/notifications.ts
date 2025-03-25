import { Notification } from '../types';
import { addMinutes, addHours, addDays, subHours } from 'date-fns';

// Current date for reference
const now = new Date('2025-03-25T19:44:50');

export const mockNotifications: Notification[] = [
  // Recent notifications
  {
    id: '1',
    title: 'Appointment Rescheduled',
    message: 'John Smith rescheduled his appointment to tomorrow at 10:00 AM',
    timestamp: now,
    read: false,
    priority: 'important',
    type: 'appointment',
    actionUrl: '/appointments/123',
  },
  {
    id: '2',
    title: 'Lab Results Available',
    message: 'New lab results for Emma Johnson are ready for review',
    timestamp: subHours(now, 1),
    read: false,
    priority: 'important',
    type: 'task',
    actionUrl: '/patients/456/lab-results',
  },
  {
    id: '3',
    title: 'Appointment Reminder',
    message: 'You have 5 appointments scheduled for tomorrow',
    timestamp: subHours(now, 3),
    read: true,
    priority: 'routine',
    type: 'system',
  },
  {
    id: '4',
    title: 'Missed Appointment',
    message: 'Michael Brown missed his scheduled appointment at 9:00 AM today',
    timestamp: subHours(now, 6),
    read: false,
    priority: 'critical',
    type: 'appointment',
    actionUrl: '/appointments/789',
  },
  
  // Yesterday's notifications
  {
    id: '5',
    title: 'Patient Message',
    message: 'William Davis sent you a message regarding his medication',
    timestamp: addDays(now, -1),
    read: true,
    priority: 'important',
    type: 'task',
  },
  {
    id: '6',
    title: 'System Update Completed',
    message: 'WellSphere was updated to version 2.5.1 with new features',
    timestamp: addHours(addDays(now, -1), -3),
    read: true,
    priority: 'routine',
    type: 'system',
  },
  
  // Earlier notifications
  {
    id: '7',
    title: 'New Appointment Request',
    message: 'Charlotte Lee requested an appointment for arthritis consultation',
    timestamp: addDays(now, -3),
    read: true,
    priority: 'routine',
    type: 'appointment',
  },
  {
    id: '8',
    title: 'Prescription Renewal',
    message: 'Lucas Garcia requested a prescription renewal for his blood pressure medication',
    timestamp: addDays(now, -4),
    read: true,
    priority: 'important',
    type: 'task',
  },
  {
    id: '9',
    title: 'Staff Meeting Reminder',
    message: 'Weekly staff meeting tomorrow at 8:30 AM in Conference Room A',
    timestamp: addDays(now, -4),
    read: true,
    priority: 'routine',
    type: 'system',
  },
  {
    id: '10',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully',
    timestamp: addDays(now, -7),
    read: true,
    priority: 'routine',
    type: 'system',
  },
];