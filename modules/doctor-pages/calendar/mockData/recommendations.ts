import { AIRecommendation } from '../types';
import { addHours, subHours } from 'date-fns';

// Helper function to create a date relative to now
const relativeTime = (hoursOffset: number): Date => {
  return new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
};

export const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'scheduling',
    suggestion: 'Reschedule Daniel White to 10:30 AM to resolve conflict with John Smith',
    reason: 'Current schedule has an overlap at 9:15 AM',
    timestamp: new Date(),
    applied: false,
    relatedAppointmentId: '11',
    suggestedTime: relativeTime(1.5),
    efficiencyImprovement: 15
  },
  {
    id: '2',
    type: 'patient-risk',
    suggestion: 'Review William Daviss lab results before tomorrows appointment',
    reason: 'Critical values detected in recent CBC panel',
    timestamp: subHours(new Date(), 2),
    applied: false,
    relatedPatientId: 'p5',
    efficiencyImprovement: 30
  },
  {
    id: '3',
    type: 'optimization',
    suggestion: 'Group check-ups on Tuesday morning for better efficiency',
    reason: 'Similar appointment types scheduled throughout the week',
    timestamp: subHours(new Date(), 5),
    applied: false,
    efficiencyImprovement: 25
  },
  {
    id: '4',
    type: 'follow-up',
    suggestion: 'Schedule 3-month follow-up with John Smith',
    reason: 'Diabetes management protocol suggests quarterly check-ins',
    timestamp: subHours(new Date(), 12),
    applied: true,
    relatedPatientId: 'p1',
    suggestedTime: addHours(new Date(), 24 * 90), // 90 days in the future
  },
];