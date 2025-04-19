'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, addDays, isPast, isToday, isTomorrow } from 'date-fns';
import { 
  Search, 
  Filter, 
  StarIcon as Star, 
  MapPin, 
  Video, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  CalendarDays, 
  Clock, 
  DollarSign, 
  Languages, 
  ArrowLeft, 
  CheckCircle2,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import our context
import { useAppointments } from '@/contexts/AppointmentContext';
import { useNotifications } from '@/contexts/NotificationsContext';

// Booking process steps
enum BookingStep {
  FIND_DOCTOR = 0,
  SELECT_SLOT = 1,
  FINALIZE = 2,
  CONFIRMATION = 3
}

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  nextAvailable: string;
  education: string[];
  experience: number;
  consultationFee: number;
  bio: string;
  acceptingNew: boolean;
  videoConsultation: boolean;
  inPersonConsultation: boolean;
  location: string;
  distance: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  isEmergency?: boolean;
  isAIRecommended?: boolean;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

// Mock data for the demo
const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Julia Smith',
    specialty: 'Cardiology',
    photo: '/assets/doctors/julia-smith.jpg',
    rating: 4.9,
    reviewCount: 205,
    languages: ['English', 'Spanish'],
    nextAvailable: 'Today',
    education: ['Harvard Medical School', 'Johns Hopkins Residency'],
    experience: 12,
    consultationFee: 250,
    bio: 'Cardiologist specializing in preventive cardiology and heart disease management.',
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: 'Heart Care Center',
    distance: '2.3 miles'
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    specialty: 'Endocrinology',
    photo: '/assets/doctors/michael-chen.jpg',
    rating: 4.8,
    reviewCount: 189,
    languages: ['English', 'Mandarin'],
    nextAvailable: 'Tomorrow',
    education: ['Stanford Medical School', 'UCSF Medical Center Residency'],
    experience: 9,
    consultationFee: 175,
    bio: 'Specialist in diabetes management and thyroid disorders with a focus on lifestyle modifications.',
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: 'Westside Health Pavilion',
    distance: '3.7 miles'
  },
  {
    id: 'd3',
    name: 'Dr. Sarah Johnson',
    specialty: 'Psychiatry',
    photo: '/assets/doctors/sarah-johnson.jpg',
    rating: 4.7,
    reviewCount: 156,
    languages: ['English', 'French'],
    nextAvailable: 'Today',
    education: ['Yale School of Medicine', 'UCLA Medical Center Residency'],
    experience: 15,
    consultationFee: 200,
    bio: 'Experienced psychiatrist specializing in anxiety, depression, and stress management with a holistic approach.',
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: false,
    location: 'Virtual Practice Only',
    distance: 'Virtual'
  },
  {
    id: 'd4',
    name: 'Dr. Robert Williams',
    specialty: 'Family Medicine',
    photo: '/assets/doctors/robert-williams.jpg',
    rating: 4.6,
    reviewCount: 208,
    languages: ['English'],
    nextAvailable: 'Apr 19, 2025',
    education: ['University of Pennsylvania', 'Mayo Clinic Residency'],
    experience: 20,
    consultationFee: 125,
    bio: 'Dedicated family physician providing comprehensive care for patients of all ages.',
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: 'Community Health Partners',
    distance: '1.5 miles'
  },
  {
    id: 'd5',
    name: 'Dr. Emily Davis',
    specialty: 'Neurology',
    photo: '/assets/doctors/emily-davis.jpg',
    rating: 4.9,
    reviewCount: 89,
    languages: ['English', 'German'],
    nextAvailable: 'Apr 20, 2025',
    education: ['Johns Hopkins Medical School', 'Mass General Hospital Residency'],
    experience: 11,
    consultationFee: 225,
    bio: 'Neurologist specializing in headache disorders, epilepsy, and neurodegenerative conditions.',
    acceptingNew: false,
    videoConsultation: true,
    inPersonConsultation: true,
    location: 'Neurological Institute',
    distance: '4.2 miles'
  }
];

// Helper functions
const generateTimeSlots = (date: Date, doctor: Doctor): DaySchedule => {
  const slots: TimeSlot[] = [];
  const isToday = new Date().toDateString() === date.toDateString();
  
  // Start from the next hour if today, otherwise start from 8 AM
  const startHour = isToday ? new Date().getHours() + 1 : 8; // Start from next hour if today
  
  // Generate slots from startHour to 7 PM
  for (let hour = startHour; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip past times for today
      if (isToday && hour === startHour && minute < new Date().getMinutes()) {
        continue;
      }
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Randomly determine availability (80% chance of being available)
      // In a real app, this would come from your backend
      const available = Math.random() > 0.2;
      
      // Mark some slots as emergency or AI recommended
      const isEmergency = hour >= 8 && hour <= 9 && minute === 0 && available;
      const isAIRecommended = (hour === 14 || hour === 15) && minute === 30 && available;
      
      slots.push({
        id: `${date.toISOString()}-${time}`,
        time: format(new Date().setHours(hour, minute), 'h:mm a'),
        available,
        isEmergency,
        isAIRecommended
      });
    }
  }
  
  return { date, slots };
};

// Main component
export default function AppointmentSchedulePage() {
  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.FIND_DOCTOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateSchedule, setDateSchedule] = useState<DaySchedule | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person' | 'phone'>('video');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [hasUploaded, setHasUploaded] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [feeRangeFilter, setFeeRangeFilter] = useState<[number, number] | null>(null);
  const [consultationType, setConsultationType] = useState<string>('');
  
  // Use our contexts
  const { addAppointment, navigateToAppointmentDetails } = useAppointments();
  const { addNotification } = useNotifications();

  // Filter doctors based on selected filters
  const filteredDoctors = mockDoctors.filter(doctor => {
    // Search term filter
    if (searchTerm && !doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Specialty filter
    if (specialtyFilter && doctor.specialty !== specialtyFilter) {
      return false;
    }
    
    // Language filter
    if (languageFilter && !doctor.languages.includes(languageFilter)) {
      return false;
    }
    
    // Rating filter
    if (ratingFilter && doctor.rating < ratingFilter) {
      return false;
    }
    
    // Fee range filter
    if (feeRangeFilter && (doctor.consultationFee < feeRangeFilter[0] || doctor.consultationFee > feeRangeFilter[1])) {
      return false;
    }
    
    // Consultation type filter
    if (consultationType === 'video' && !doctor.videoConsultation) {
      return false;
    }
    if (consultationType === 'in-person' && !doctor.inPersonConsultation) {
      return false;
    }
    
    return true;
  });

  // Effect to generate schedule when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const schedule = generateTimeSlots(selectedDate, selectedDoctor);
      setDateSchedule(schedule);
      setSelectedTimeSlot(null); // Reset selected time slot
    }
  }, [selectedDoctor, selectedDate]);

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(BookingStep.SELECT_SLOT);
  };

  // Handle date navigation
  const goToNextDate = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const goToPreviousDate = () => {
    if (!isPast(addDays(selectedDate, -1)) || isToday(addDays(selectedDate, -1))) {
      setSelectedDate(prev => addDays(prev, -1));
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
      setCurrentStep(BookingStep.FINALIZE);
    }
  };

  // Handle booking submission with context integration
  const handleBookingSubmit = () => {
    if (!selectedDoctor || !selectedTimeSlot) return;
    
    // Create the new appointment
    const newAppointment = {
      id: Date.now(),
      title: reasonForVisit || `Appointment with Dr. ${selectedDoctor.name}`,
      doctor: selectedDoctor.name,
      doctorPhoto: selectedDoctor.photo,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTimeSlot.time,
      type: appointmentType,
      status: 'confirmed',
      location: appointmentType === 'in-person' ? selectedDoctor.location : null,
      notes: reasonForVisit
    };
    
    // Add to global state
    addAppointment(newAppointment);
    
    // Add a notification
    addNotification({
      id: Date.now().toString(),
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${selectedDoctor.name} on ${format(selectedDate, 'MMM d, yyyy')} at ${selectedTimeSlot.time} has been confirmed.`,
      timestamp: new Date(),
      read: false,
      priority: 'normal',
      type: 'appointment',
      relatedItemId: newAppointment.id,
      actionUrl: `/patient/appointments/details/${newAppointment.id}`
    });
    
    // Move to confirmation step
    setCurrentStep(BookingStep.CONFIRMATION);
    
    // Store the appointment ID for navigation after confirmation
    sessionStorage.setItem('lastBookedAppointmentId', newAppointment.id.toString());
  };

  // Navigate to appointment details after booking
  const handleViewAppointmentDetails = () => {
    const appointmentId = sessionStorage.getItem('lastBookedAppointmentId');
    if (appointmentId) {
      navigateToAppointmentDetails(appointmentId);
    }
  };

  // Render the doctor search and selection step
  const renderDoctorSearch = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search doctors by name or specialty" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        
        {/* Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium">Filter Doctors</h3>
              
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="All specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All specialties</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Any language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any language</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select 
                  value={ratingFilter?.toString() || ''} 
                  onValueChange={(val) => setRatingFilter(val ? parseInt(val) : null)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Consultation Type</Label>
                <Select value={consultationType} onValueChange={setConsultationType}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSpecialtyFilter('');
                    setLanguageFilter('');
                    setRatingFilter(null);
                    setFeeRangeFilter(null);
                    setConsultationType('');
                  }}
                  className="mr-2"
                >
                  Reset
                </Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Doctor cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              onSelect={handleDoctorSelect} 
            />
          ))
        ) : (
          <div className="text-center py-8 border rounded-lg bg-white">
            <div className="flex justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium">No doctors found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
      
      {/* AI Recommendations */}
      <div className="mt-6 px-4 py-3 bg-[#E8F3F4] border border-[#006D77] rounded-lg">
        <div className="flex items-start">
          <div className="bg-white p-2 rounded-full mr-3">
            <Stethoscope className="h-5 w-5 text-[#006D77]" />
          </div>
          <div>
            <h3 className="font-medium text-[#006D77]">AI Doctor Recommendation</h3>
            <p className="text-sm text-gray-700 mt-1">
              Based on your health profile and recent symptoms, we recommend 
              <span className="font-medium"> Dr. Michael Chen (Endocrinologist)</span> for optimal care.
            </p>
            <Button 
              variant="link" 
              className="text-[#006D77] p-0 h-auto text-sm mt-1"
              onClick={() => handleDoctorSelect(mockDoctors[1])}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the time slot selection step
  const renderTimeSlotSelection = () => (
    <div className="space-y-5">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => setCurrentStep(BookingStep.FIND_DOCTOR)}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Doctors
      </Button>
      
      {/* Doctor header */}
      {selectedDoctor && (
        <div className="flex items-center bg-white p-4 rounded-lg border border-slate-200">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={selectedDoctor.photo} alt={selectedDoctor.name} />
            <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{selectedDoctor.name}</h2>
            <p className="text-gray-600">{selectedDoctor.specialty}</p>
            <div className="flex items-center mt-1">
              <span className="flex items-center text-amber-500 mr-2">
                <Star className="fill-amber-500 stroke-amber-500 h-4 w-4 mr-0.5" />
                {selectedDoctor.rating}
              </span>
              <span className="text-sm text-gray-500">{selectedDoctor.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Date selection */}
      <div className="bg-white border rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <Button variant="ghost" onClick={goToPreviousDate} disabled={isPast(addDays(selectedDate, -1)) && !isToday(addDays(selectedDate, -1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h3 className="text-lg font-medium">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          
          <Button variant="ghost" onClick={goToNextDate}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Quick date selectors */}
        <div className="p-4 border-b overflow-x-auto">
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = addDays(new Date(), i);
              const isSelected = date.toDateString() === selectedDate.toDateString();
              
              let label = format(date, 'EEE');
              if (isToday(date)) label = 'Today';
              if (isTomorrow(date)) label = 'Tomorrow';
              
              return (
                <Button 
                  key={i} 
                  variant={isSelected ? 'default' : 'outline'}
                  className={`flex flex-col py-2 ${isSelected ? 'bg-[#006D77] hover:bg-[#005A64]' : 'bg-white'}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-xs">{label}</div>
                  <div className="text-sm font-medium">{format(date, 'd')}</div>
                </Button>
              );
            })}
          </div>
          
          {/* Calendar popover for selecting dates beyond the quick selectors */}
          <div className="flex justify-center mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>More dates</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={(date) => isPast(date) && !isToday(date)}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Time slots */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dateSchedule?.slots.map(slot => (
                <TimeSlotButton
                  key={slot.id}
                  slot={slot}
                  onSelect={handleTimeSlotSelect}
                />
              ))}
            </div>
            
            {dateSchedule?.slots.length === 0 && (
              <div className="text-center py-8">
                <CalendarDays className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-gray-600">No available time slots for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Appointment type selection */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium mb-3">Appointment Type</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className={`justify-start bg-white ${appointmentType === 'video' ? 'border-[#006D77] ring-1 ring-[#006D77]' : ''}`}
            onClick={() => setAppointmentType('video')}
            disabled={!selectedDoctor?.videoConsultation}
          >
            <Video className={`mr-2 h-4 w-4 ${appointmentType === 'video' ? 'text-[#006D77]' : ''}`} />
            <span>Video Call</span>
          </Button>
          
          <Button
            variant="outline"
            className={`justify-start bg-white ${appointmentType === 'in-person' ? 'border-[#006D77] ring-1 ring-[#006D77]' : ''}`}
            onClick={() => setAppointmentType('in-person')}
            disabled={!selectedDoctor?.inPersonConsultation}
          >
            <MapPin className={`mr-2 h-4 w-4 ${appointmentType === 'in-person' ? 'text-[#006D77]' : ''}`} />
            <span>In-Person</span>
          </Button>
          
          <Button
            variant="outline"
            className={`justify-start bg-white ${appointmentType === 'phone' ? 'border-[#006D77] ring-1 ring-[#006D77]' : ''}`}
            onClick={() => setAppointmentType('phone')}
          >
            <Phone className={`mr-2 h-4 w-4 ${appointmentType === 'phone' ? 'text-[#006D77]' : ''}`} />
            <span>Phone Call</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Render the appointment finalization step
  const renderFinalizeAppointment = () => (
    <div className="space-y-5">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => setCurrentStep(BookingStep.SELECT_SLOT)}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Time Slots
      </Button>
      
      {/* Appointment summary */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium mb-4">Appointment Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={selectedDoctor?.photo} alt={selectedDoctor?.name} />
              <AvatarFallback>{selectedDoctor?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{selectedDoctor?.name}</h4>
              <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-[#006D77] mr-2" />
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-[#006D77] mr-2" />
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div>{selectedTimeSlot?.time}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              {appointmentType === 'video' && <Video className="h-5 w-5 text-[#006D77] mr-2" />}
              {appointmentType === 'in-person' && <MapPin className="h-5 w-5 text-[#006D77] mr-2" />}
              {appointmentType === 'phone' && <Phone className="h-5 w-5 text-[#006D77] mr-2" />}
              <div>
                <div className="text-sm text-gray-600">Appointment Type</div>
                <div className="capitalize">{appointmentType}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-[#006D77] mr-2" />
              <div>
                <div className="text-sm text-gray-600">Fee</div>
                <div>${selectedDoctor?.consultationFee.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment details form */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium mb-4">Appointment Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Describe your symptoms or reason for consultation"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="mt-1 bg-white resize-none"
              rows={4}
            />
            
            <div className="mt-2 text-sm text-gray-500">
              <span className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                This information will be shared with your doctor
              </span>
            </div>
          </div>
          
          <div>
            <Label>Upload Prior Reports (Optional)</Label>
            <div className="mt-2">
              <Button
                variant="outline"
                className="bg-white w-full justify-center border-dashed h-24"
                onClick={() => setHasUploaded(true)}
              >
                {hasUploaded ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span className="text-emerald-500">File uploaded successfully</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Drag & drop files or click to browse
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox id="insurance" />
              <Label htmlFor="insurance" className="text-sm">
                I'll be using my insurance for this visit
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                I agree to the <Link href="#" className="text-[#006D77] hover:underline">terms and conditions</Link> and <Link href="#" className="text-[#006D77] hover:underline">privacy policy</Link>
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end">
        <Button 
          className="bg-[#006D77] hover:bg-[#005A64] text-white px-6"
          onClick={handleBookingSubmit}
        >
          Confirm Appointment
        </Button>
      </div>
    </div>
  );

  // Render the confirmation step
  const renderConfirmation = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-[#E8F3F4] rounded-full p-4 mb-4">
        <CheckCircle2 className="h-12 w-12 text-[#006D77]" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Your appointment with {selectedDoctor?.name} is scheduled for {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTimeSlot?.time}.
      </p>
      
      <div className="bg-white border rounded-lg p-5 w-full max-w-md mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Appointment ID</span>
            <span className="font-medium">APT-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Doctor</span>
            <span className="font-medium">{selectedDoctor?.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')} • {selectedTimeSlot?.time}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Type</span>
            <span className="font-medium capitalize">{appointmentType}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="bg-white">
          Add to Calendar
        </Button>
        
        <Button onClick={handleViewAppointmentDetails}>
          View Appointment Details
        </Button>
      </div>
    </div>
  );

  // Render the appropriate step
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.FIND_DOCTOR:
        return renderDoctorSearch();
      case BookingStep.SELECT_SLOT:
        return renderTimeSlotSelection();
      case BookingStep.FINALIZE:
        return renderFinalizeAppointment();
      case BookingStep.CONFIRMATION:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/patient/dashboard" className="text-[#006D77] hover:underline flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Schedule an Appointment
        </h1>
        
        {/* Steps indicator - only show for non-confirmation steps */}
        {currentStep !== BookingStep.CONFIRMATION && (
          <div className="mt-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= BookingStep.FIND_DOCTOR ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > BookingStep.FIND_DOCTOR ? 'bg-[#006D77]' : 'bg-gray-200'
              }`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= BookingStep.SELECT_SLOT ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > BookingStep.SELECT_SLOT ? 'bg-[#006D77]' : 'bg-gray-200'
              }`}></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= BookingStep.FINALIZE ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep === BookingStep.FIND_DOCTOR ? 'font-medium text-[#006D77]' : 'text-gray-600'}>
                Find Doctor
              </span>
              <span className={currentStep === BookingStep.SELECT_SLOT ? 'font-medium text-[#006D77]' : 'text-gray-600'}>
                Select Time
              </span>
              <span className={currentStep === BookingStep.FINALIZE ? 'font-medium text-[#006D77]' : 'text-gray-600'}>
                Finalize
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Step content */}
      <div className="bg-[#F5F5F5] p-6 rounded-lg">
        {renderStepContent()}
      </div>
    </div>
  );
}

// Doctor card component
const DoctorCard: React.FC<{ 
  doctor: Doctor; 
  onSelect: (doctor: Doctor) => void;
}> = ({ doctor, onSelect }) => {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 md:border-r border-b md:border-b-0 p-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={doctor.photo} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <h3 className="font-medium text-center">{doctor.name}</h3>
              <p className="text-sm text-gray-500 text-center">{doctor.specialty}</p>
              
              <div className="flex items-center mt-2">
                <span className="flex items-center text-amber-500">
                  <Star className="fill-amber-500 stroke-amber-500 h-4 w-4 mr-0.5" />
                  {doctor.rating}
                </span>
                <span className="text-xs text-gray-500 ml-1">({doctor.reviewCount})</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 text-[#006D77] mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Next Available</div>
                    <div className="text-sm font-medium">{doctor.nextAvailable}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Languages className="h-4 w-4 text-[#006D77] mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Languages</div>
                    <div className="text-sm font-medium">{doctor.languages.join(', ')}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-[#006D77] mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm font-medium">{doctor.distance}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-[#006D77] mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Consultation Fee</div>
                    <div className="text-sm font-medium">${doctor.consultationFee}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex space-x-2 mt-2">
                  {doctor.videoConsultation && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Offers video consultations</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {doctor.inPersonConsultation && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <MapPin className="h-3 w-3 mr-1" />
                            In-Person
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Available for in-person visits</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {doctor.acceptingNew && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            New Patients
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Accepting new patients</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                className="bg-[#006D77] hover:bg-[#005A64]"
                onClick={() => onSelect(doctor)}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Time slot button component
const TimeSlotButton: React.FC<{
  slot: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
}> = ({ slot, onSelect }) => {
  const getSlotClassName = () => {
    if (!slot.available) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed line-through';
    }
    
    if (slot.isEmergency) {
      return 'bg-[#FF9500] text-white border-[#FF9500] hover:bg-[#E58600]';
    }
    
    if (slot.isAIRecommended) {
      return 'bg-[#E8F3F4] text-[#006D77] border-[#006D77] hover:bg-[#D6EBEC]';
    }
    
    return 'bg-white hover:bg-gray-50 border-gray-200';
  };
  
  return (
    <button
      className={`p-3 border rounded flex items-center justify-between ${getSlotClassName()}`}
      disabled={!slot.available}
      onClick={() => slot.available && onSelect(slot)}
    >
      <span className="font-medium">{slot.time}</span>
      
      {slot.isEmergency && (
        <Badge className="bg-white text-[#FF9500] hover:bg-gray-100">
          Emergency Slot
        </Badge>
      )}
      
      {slot.isAIRecommended && (
        <Badge className="bg-white text-[#006D77] hover:bg-gray-100">
          Recommended
        </Badge>
      )}
    </button>
  );
};