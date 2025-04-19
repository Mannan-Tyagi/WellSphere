"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Filter,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [specialty, setSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentConflict, setAppointmentConflict] = useState(false);

  // Mock data
  const specialties = [
    'Cardiology', 'Dermatology', 'Family Medicine', 'Gastroenterology',
    'Neurology', 'Obstetrics/Gynecology', 'Ophthalmology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Urology'
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      avatar: '/avatars/dr-johnson.png',
      rating: 4.9,
      reviews: 127,
      availableToday: true,
      nextAvailable: 'Today',
      telehealth: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Family Medicine',
      avatar: '/avatars/dr-chen.png',
      rating: 4.7,
      reviews: 93,
      availableToday: false,
      nextAvailable: 'Tomorrow',
      telehealth: true
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      avatar: '/avatars/dr-rodriguez.png',
      rating: 4.8,
      reviews: 108,
      availableToday: true,
      nextAvailable: 'Today',
      telehealth: false
    }
  ];

  // Generate available appointment dates
  const availableDates = [
    new Date(),
    new Date(Date.now() + 86400000), // Tomorrow
    new Date(Date.now() + 86400000 * 2),
    new Date(Date.now() + 86400000 * 3),
    new Date(Date.now() + 86400000 * 4),
  ];

  // Generate available time slots
  const availableTimeSlots = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '1:00 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false },
  ];

  // AI-recommended time slots based on past preferences and current schedule
  const aiRecommendedSlots = [
    { date: availableDates[0], time: '10:00 AM', reason: 'Based on your preference for morning appointments' },
    { date: availableDates[1], time: '2:00 PM', reason: 'Dr. Johnson usually has more time for consultations' },
  ];

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty ? doctor.specialty === specialty : true;
    const matchesType = appointmentType === 'telehealth' ? doctor.telehealth : true;
    return matchesSearch && matchesSpecialty && matchesType;
  });

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Reset time if date changes
    if (selectedDate !== date) {
      setSelectedTime(null);
    }
    
    // Check for conflicts (simulated)
    setAppointmentConflict(Math.random() > 0.8);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setAppointmentConflict(false);
  };

  // Handle appointment reason selection
  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setStep(3);
  };

  // Handle appointment booking
  const handleBookAppointment = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/patient/appointments/confirmation');
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 text-gray-500" 
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#006D77]">Book an Appointment</h1>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              step >= 2 ? 'bg-[#006D77]' : 'bg-gray-200'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`h-1 flex-grow mx-2 ${
              step >= 3 ? 'bg-[#006D77]' : 'bg-gray-200'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <div className="text-center w-full">Find a Doctor</div>
          <div className="text-center w-full">Select Time</div>
          <div className="text-center w-full">Confirm Details</div>
        </div>
      </div>

      {/* Step 1: Find a Doctor */}
      {step === 1 && (
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Appointment Type</h2>
              <Tabs defaultValue="in-person" value={appointmentType} onValueChange={setAppointmentType}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="in-person">In-Person Visit</TabsTrigger>
                  <TabsTrigger value="telehealth">Telehealth</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-person" className="mt-4">
                  <p className="text-gray-600 mb-4">Visit our clinic and meet with a healthcare provider face-to-face.</p>
                </TabsContent>
                
                <TabsContent value="telehealth" className="mt-4">
                  <p className="text-gray-600 mb-4">Connect with a healthcare provider remotely through video conferencing.</p>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search for a Doctor
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                      placeholder="Doctor name" 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Available Doctors</h2>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
              <Filter size={14} className="mr-1" />
              More Filters
            </Button>
          </div>
          
          {/* AI-recommended doctors */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-[#006D77] mb-2">
              <Sparkles size={16} className="mr-1" />
              AI Recommendations
            </div>
            
            <Card className="bg-[#F0F9FA] border-[#E8F3F4]">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={doctors[0].avatar} alt={doctors[0].name} />
                    <AvatarFallback>{doctors[0].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{doctors[0].name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm ml-1">{doctors[0].rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{doctors[0].specialty}</p>
                    <p className="text-xs text-[#006D77] mt-1">
                      Recommended based on your past appointments and health conditions
                    </p>
                    <div className="mt-2">
                      <Button 
                        className="bg-[#006D77] hover:bg-[#00585F]"
                        onClick={() => handleDoctorSelect(doctors[0])}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Doctor list */}
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{doctor.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm ml-1">{doctor.rating} ({doctor.reviews})</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doctor.telehealth && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <Video size={12} className="mr-1" />
                              Telehealth
                            </Badge>
                          )}
                          <Badge className={doctor.availableToday 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-amber-100 text-amber-800 border-amber-200"
                          }>
                            {doctor.availableToday ? 'Available Today' : `Next: ${doctor.nextAvailable}`}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <Button 
                            className="bg-[#006D77] hover:bg-[#00585F]"
                            onClick={() => handleDoctorSelect(doctor)}
                          >
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No doctors match your criteria</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Select Time */}
      {step === 2 && selectedDoctor && (
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                  <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium">{selectedDoctor.name}</h2>
                  <p className="text-gray-600">{selectedDoctor.specialty}</p>
                  <div className="flex items-center mt-1 text-sm">
                    <MapPin size={14} className="mr-1 text-gray-500" />
                    <span>{appointmentType === 'telehealth' ? 'Telehealth Appointment' : 'Main Clinic'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">AI Recommended Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiRecommendedSlots.map((slot, idx) => (
                    <div 
                      key={idx}
                      className="p-3 border border-[#006D77]/30 rounded-md bg-[#F0F9FA] cursor-pointer hover:bg-[#E8F3F4]"
                      onClick={() => {
                        handleDateSelect(slot.date);
                        handleTimeSelect(slot.time);
                      }}
                    >
                      <div className="flex items-center text-[#006D77]">
                        <Sparkles size={14} className="mr-1" />
                        <span className="font-medium">{format(slot.date, 'EEEE, MMM d')} at {slot.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{slot.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Select a Date & Time</h3>
              
              {/* Date selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {availableDates.map((date, idx) => (
                    <div 
                      key={idx}
                      className={`
                        p-3 border rounded-md text-center cursor-pointer hover:border-[#006D77]
                        ${selectedDate && date.toDateString() === selectedDate.toDateString() 
                          ? 'bg-[#006D77] text-white' 
                          : 'bg-white text-gray-800'}
                      `}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-xs">{format(date, 'EEE')}</div>
                      <div className="font-medium">{format(date, 'd')}</div>
                      <div className="text-xs">{format(date, 'MMM')}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Time selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimeSlots.map((slot, idx) => (
                      <div 
                        key={idx}
                        className={`
                          p-3 border rounded-md text-center 
                          ${!slot.available 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : selectedTime === slot.time
                              ? 'bg-[#006D77] text-white cursor-pointer'
                              : 'bg-white text-gray-800 cursor-pointer hover:border-[#006D77]'
                          }
                        `}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                      >
                        <div className="font-medium">{slot.time}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Appointment conflict warning */}
                  {appointmentConflict && (
                    <div className="flex items-center bg-amber-50 p-3 rounded-md mt-4 border border-amber-200">
                      <AlertCircle size={18} className="text-amber-500 mr-2" />
                      <div>
                        <p className="text-amber-800 text-sm font-medium">Potential scheduling conflict detected</p>
                        <p className="text-amber-700 text-xs">You already have a medication reminder at this time</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Appointment reason section */}
              {selectedDate && selectedTime && !appointmentConflict && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Reason for Visit</h3>
                  <Select value={selectedReason} onValueChange={setSelectedReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason for your visit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check-up</SelectItem>
                      <SelectItem value="illness">Illness/Symptoms</SelectItem>
                      <SelectItem value="followup">Follow-up Visit</SelectItem>
                      <SelectItem value="chronic">Chronic Condition Management</SelectItem>
                      <SelectItem value="preventive">Preventive Care</SelectItem>
                      <SelectItem value="other">Other (please specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedReason === 'other' && (
                    <Input 
                      className="mt-3" 
                      placeholder="Please specify the reason for your visit" 
                    />
                  )}
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  disabled={!selectedDate || !selectedTime || !selectedReason || appointmentConflict}
                  onClick={() => setStep(3)}
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Details */}
      {step === 3 && selectedDoctor && selectedDate && selectedTime && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-4">Appointment Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-[#F0F9FA] rounded-md">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                  <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedDoctor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center text-gray-700 mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-[#006D77]" />
                    <span className="font-medium">Date</span>
                  </div>
                  <p>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center text-gray-700 mb-1">
                    <Clock className="h-4 w-4 mr-2 text-[#006D77]" />
                    <span className="font-medium">Time</span>
                  </div>
                  <p>{selectedTime}</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center text-gray-700 mb-1">
                  {appointmentType === 'telehealth' ? (
                    <Video className="h-4 w-4 mr-2 text-[#006D77]" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2 text-[#006D77]" />
                  )}
                  <span className="font-medium">Appointment Type</span>
                </div>
                <p>{appointmentType === 'telehealth' ? 'Telehealth - Video Visit' : 'In-Person Visit'}</p>
                {appointmentType === 'in-person' && (
                  <p className="text-sm text-gray-500 mt-1">Main Clinic, 123 Medical Center Dr.</p>
                )}
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center text-gray-700 mb-1">
                  <Users className="h-4 w-4 mr-2 text-[#006D77]" />
                  <span className="font-medium">Reason for Visit</span>
                </div>
                <p>{selectedReason === 'routine' ? 'Routine Check-up' : 
                   selectedReason === 'illness' ? 'Illness/Symptoms' :
                   selectedReason === 'followup' ? 'Follow-up Visit' :
                   selectedReason === 'chronic' ? 'Chronic Condition Management' :
                   selectedReason === 'preventive' ? 'Preventive Care' : 'Other'}</p>
              </div>
              
              <div className="flex items-center bg-blue-50 p-4 rounded-md border border-blue-200">
                <Sparkles size={18} className="text-blue-500 mr-2" />
                <div className="text-sm text-blue-700">
                  This appointment will be added to your calendar and reminders will be sent 
                  24 hours and 1 hour before your appointment.
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={handleBookAppointment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Booking<span className="animate-pulse">...</span></>
                  ) : (
                    <>Confirm Appointment</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
