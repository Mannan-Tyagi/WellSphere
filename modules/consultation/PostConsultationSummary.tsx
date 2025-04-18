"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Check, 
  Clock, 
  Calendar, 
  Download, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  AlertTriangle,
  Pill, 
  Clipboard, 
  MessageSquare, 
  Star, 
  StarHalf, 
  CheckSquare,
  Square,
  RotateCcw,
  Home,
  Share2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useVirtualConsultation } from './context/VirtualConsultationContext';
import Link from 'next/link';

export default function PostConsultationSummary() {
  const { consultation, generateSummary } = useVirtualConsultation();
  
  const [summary, setSummary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Generate consultation summary
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    try {
      const summaryData = await generateSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle feedback submission
  const submitFeedback = () => {
    // In a real app, this would send the feedback to an API
    console.log('Submitting feedback:', { rating: feedbackRating, text: feedbackText });
    setFeedbackSubmitted(true);
  };
  
  // Toggle checked state for action items
  const toggleCheckedItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format consultation date/time
  const formatConsultationTime = () => {
    if (!consultation.startTime || !consultation.endTime) return 'N/A';
    
    const start = format(consultation.startTime, 'MMM d, yyyy • h:mm a');
    const durationMinutes = Math.floor((consultation.endTime.getTime() - consultation.startTime.getTime()) / 60000);
    
    return `${start} • ${durationMinutes} minutes`;
  };
  
  // Format prescription dates
  const formatPrescriptionDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Summary</h1>
          <p className="text-gray-500">
            Your virtual visit with Dr. Sarah Johnson has been completed
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
          
          <Button className="bg-[#006D77] hover:bg-[#00565E]" asChild>
            <Link href="/appointments/schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Summary */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#006D77]">Visit Summary</CardTitle>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 flex items-center text-xs">
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                  
                  <Button variant="outline" size="sm" className="h-8 flex items-center text-xs">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5">
              {!summary && !isGenerating && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Generate Your Consultation Summary
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    A summary of your visit including key points, diagnoses, treatment plans and next steps will be created for your reference.
                  </p>
                  <Button 
                    onClick={handleGenerateSummary}
                    className="bg-[#006D77] hover:bg-[#00565E]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Summary
                  </Button>
                </div>
              )}
              
              {isGenerating && (
                <div className="text-center py-12">
                  <RotateCcw className="h-12 w-12 mx-auto text-[#006D77] mb-3 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Generating Your Summary
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    Please wait while we process the details of your consultation...
                  </p>
                </div>
              )}
              
              {summary && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src="/assets/doctors/sarah-johnson.jpg" alt="Dr. Sarah Johnson" />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Dr. Sarah Johnson</h3>
                        <p className="text-sm text-gray-500">Family Medicine</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Consultation Time</p>
                      <p className="font-medium">{formatConsultationTime()}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-[#006D77] mb-3">Diagnosis</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <Badge className="mt-0.5 mr-2" variant="outline">Primary</Badge>
                        <div>
                          <p className="font-medium">Hypertension (Essential), Benign</p>
                          <p className="text-sm text-gray-500">ICD-10: I10</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-[#006D77] mb-3">Treatment Plan</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Continue current medication regimen (see prescriptions below)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Monitor blood pressure daily, preferably at the same time each day</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Reduce sodium intake to less than 2,300mg per day</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Increase physical activity: 30 minutes of moderate exercise, 5 days per week</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-[#006D77] mb-3">Prescriptions</h3>
                    <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg overflow-hidden">
                      <div className="p-3 border-b border-[#E8F3F4] flex items-center">
                        <Pill className="h-5 w-5 text-[#006D77] mr-2" />
                        <span className="font-medium">Lisinopril 10mg</span>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Instructions</p>
                            <p>Take 1 tablet by mouth once daily</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p>30 tablets</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Refills</p>
                            <p>2 refills</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Expiration</p>
                            <p>{formatPrescriptionDate(90)}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <p className="text-sm flex items-center text-amber-600">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            Take with food to avoid stomach upset
                          </p>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                            Request Refill
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-[#006D77] mb-3">Follow-up</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-[#006D77] mr-2" />
                          <span>Schedule a follow-up appointment in 2 weeks</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/appointments/schedule">
                            Schedule Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Action Items */}
          {summary && (
            <Card className="shadow-sm">
              <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
                <CardTitle className="text-[#006D77]">Action Items</CardTitle>
              </CardHeader>
              
              <CardContent className="p-5">
                <ul className="space-y-3">
                  {[
                    { id: 'action1', text: 'Schedule follow-up appointment in 2 weeks' },
                    { id: 'action2', text: 'Fill new prescription at pharmacy' },
                    { id: 'action3', text: 'Begin daily blood pressure monitoring' },
                    { id: 'action4', text: 'Review educational materials on hypertension' },
                    { id: 'action5', text: 'Update medication list in health profile' }
                  ].map(item => (
                    <li key={item.id} className="flex items-start">
                      <button 
                        className="mr-2 mt-0.5 flex-shrink-0"
                        onClick={() => toggleCheckedItem(item.id)}
                      >
                        {checkedItems[item.id] ? (
                          <CheckSquare className="h-5 w-5 text-[#006D77]" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <span className={checkedItems[item.id] ? 'line-through text-gray-400' : ''}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Feedback */}
          {summary && (
            <Card className="shadow-sm">
              <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
                <CardTitle className="text-[#006D77]">Consultation Feedback</CardTitle>
              </CardHeader>
              
              <CardContent className="p-5">
                {!feedbackSubmitted ? (
                  <div className="space-y-4">
                    <p className="text-gray-500">
                      Your feedback helps us improve our virtual consultation experience
                    </p>
                    
                    <div>
                      <p className="font-medium mb-2">How would you rate your consultation experience?</p>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFeedbackRating(rating)}
                            className={`p-2 hover:text-[#006D77] ${feedbackRating >= rating ? 'text-[#006D77]' : 'text-gray-300'}`}
                          >
                            <Star className="h-8 w-8" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Additional Comments</p>
                      <Textarea
                        placeholder="Share your thoughts about the consultation..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={submitFeedback}
                        disabled={feedbackRating === 0}
                        className="bg-[#006D77] hover:bg-[#00565E]"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <h3 className="text-lg font-medium mb-1">Thank You for Your Feedback!</h3>
                    <p className="text-gray-500">
                      We appreciate your input and will use it to improve our services.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Consultation Details */}
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <CardTitle className="text-[#006D77]">Consultation Details</CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Visit Type</p>
                  <p className="font-medium">Virtual Video Consultation</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">{formatConsultationTime()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Reason for Visit</p>
                  <p className="font-medium">{consultation.appointmentInfo.reason}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/assets/doctors/sarah-johnson.jpg" alt="Dr. Sarah Johnson" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Dr. Sarah Johnson</span>
                  </div>
                </div>
                
                <Separator />
                
                {consultation.isRecording && (
                  <div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Recording Available
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your consultation recording is available for 90 days
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Recording
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Resources */}
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <CardTitle className="text-[#006D77]">Additional Resources</CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-3">
                  <h3 className="font-medium mb-1 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#006D77]" />
                    Understanding Hypertension
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Learn about high blood pressure, its causes, and management strategies.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Link className="h-4 w-4 mr-2" />
                    View Resource
                  </Button>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-3">
                  <h3 className="font-medium mb-1 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#006D77]" />
                    DASH Diet Guidelines
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Dietary approaches to stop hypertension with meal plans and recipes.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Link className="h-4 w-4 mr-2" />
                    View Resource
                  </Button>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-3">
                  <h3 className="font-medium mb-1 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-[#006D77]" />
                    Home Blood Pressure Monitoring
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    How to correctly measure and track your blood pressure at home.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Link className="h-4 w-4 mr-2" />
                    View Resource
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Need Help */}
          <Card className="shadow-sm">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <CardTitle className="text-[#006D77]">Need Help?</CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Your Provider
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Pill className="h-4 w-4 mr-2" />
                  Pharmacy Support
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Scheduling Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
