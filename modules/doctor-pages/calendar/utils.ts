import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    addDays,
    subDays,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    isWithinInterval,
    isBefore,
    isAfter,
    isSameDay
  } from 'date-fns';
  import { ViewType, Appointment } from './types';
  
  /**
   * Returns the date range for a given view type and date
   */
  export const getDateRangeForView = (viewType: ViewType, date: Date): { start: Date; end: Date } => {
    switch (viewType) {
      case 'day':
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
      case 'week':
        return {
          start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday as first day
          end: endOfWeek(date, { weekStartsOn: 0 })
        };
      case 'month':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      default:
        return {
          start: startOfDay(date),
          end: endOfDay(date)
        };
    }
  };
  
  /**
   * Navigates to the next time period based on view type
   */
  export const getNextDate = (viewType: ViewType, date: Date): Date => {
    switch (viewType) {
      case 'day':
        return addDays(date, 1);
      case 'week':
        return addWeeks(date, 1);
      case 'month':
        return addMonths(date, 1);
      default:
        return addDays(date, 1);
    }
  };
  
  /**
   * Navigates to the previous time period based on view type
   */
  export const getPreviousDate = (viewType: ViewType, date: Date): Date => {
    switch (viewType) {
      case 'day':
        return subDays(date, 1);
      case 'week':
        return subWeeks(date, 1);
      case 'month':
        return subMonths(date, 1);
      default:
        return subDays(date, 1);
    }
  };
  
  /**
   * Check for schedule conflicts between two appointments
   */
  export const hasScheduleConflict = (
    appointment1: Appointment, 
    appointment2: Appointment
  ): boolean => {
    // Skip comparing the same appointment
    if (appointment1.id === appointment2.id) {
      return false;
    }
    
    // Check if one appointment starts or ends within the time of another appointment
    return (
      isWithinInterval(appointment1.startTime, { start: appointment2.startTime, end: appointment2.endTime }) || 
      isWithinInterval(appointment1.endTime, { start: appointment2.startTime, end: appointment2.endTime }) || 
      (isBefore(appointment1.startTime, appointment2.startTime) && isAfter(appointment1.endTime, appointment2.endTime))
    );
  };
  
  /**
   * Format duration in minutes to hours and minutes
   */
  export const formatDuration = (durationInMinutes: number): string => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  };
  
  /**
   * Format a time range
   */
  export const formatTimeRange = (start: Date, end: Date): string => {
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };