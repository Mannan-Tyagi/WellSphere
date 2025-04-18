import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// Fix: Change from named import to default import
import PreConsultationQuestionnaire from './PreConsultationQuestionnaire';
import { Clock, FileText, ShieldCheck, CheckCircle2, AlertCircle, Calendar, MessageCircle } from 'lucide-react';

// Default consultation data to prevent errors when props aren't passed
const defaultConsultation = {
  status: 'scheduled',
  participants: [],
  appointmentInfo: {
    appointmentId: '',
    reason: 'Not specified',
    duration: 30,
    scheduledTime: new Date()
  },
  recordingConsent: false
};

const VirtualWaitingRoom = ({ 
  consultation = defaultConsultation, 
  doctor, 
  prepSteps = {
    devicesChecked: false,
    consentCompleted: false,
    questionnaireCompleted: false,
    documentsReviewed: false
  }, 
  estimatedWaitTime = 5, 
  onJoinConsultation = () => {}, 
  updateConsultation = () => {} 
}) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  // Safely access consultation properties
  const appointmentInfo = consultation?.appointmentInfo || defaultConsultation.appointmentInfo;
  const participants = consultation?.participants || [];
  const recordingConsent = consultation?.recordingConsent || false;

  const startConsultation = () => {
    updateConsultation({
      status: 'in-progress',
      startTime: new Date(),
      participants: participants.map(p => 
        p.id === 'patient-1' ? { ...p, isConnected: true } : p
      )
    });
    
    onJoinConsultation();
  };

  const isReadyToJoin = () => {
    return doctor?.isConnected && 
      Object.values(prepSteps).every(step => step) && 
      recordingConsent;
  };

  const formatAppointmentTime = (time) => {
    if (!time) return 'Not scheduled';
    
    const date = new Date(time);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleString();
  };

  const handleDocumentsReviewed = () => {
    // Logic to mark documents as reviewed
    const updatedPrepSteps = { ...prepSteps, documentsReviewed: true };
    // You might want to update this state in the parent component
  };

  const handleQuestionnaireComplete = () => {
    // Logic to mark questionnaire as completed
    const updatedPrepSteps = { ...prepSteps, questionnaireCompleted: true };
    // You might want to update this state in the parent component
    setShowQuestionnaire(false);
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting Status */}
        <div className="md:col-span-2">
          <Card className="shadow-md border-[#E8F3F4] h-full">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <CardTitle className="text-xl text-[#006D77]">Virtual Waiting Room</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#F0F9FA] rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-8 w-8 text-[#006D77]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Appointment Time</h3>
                      <p className="text-xl font-semibold">{formatAppointmentTime(appointmentInfo.scheduledTime)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500">Estimated Wait Time</h3>
                    <p className="text-xl font-semibold">
                      {doctor?.isConnected ? (
                        <span className="text-green-600">Doctor is ready</span>
                      ) : (
                        `${estimatedWaitTime} minutes`
                      )}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-white border rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4">Your Healthcare Provider</h3>
                  
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={doctor?.avatar} alt={doctor?.name || 'Doctor'} />
                      <AvatarFallback>{doctor?.name ? doctor.name.charAt(0) : 'D'}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="text-lg font-medium">{doctor?.name || 'Your doctor'}</h4>
                      <p className="text-sm text-gray-500">Family Medicine</p>
                      
                      <div className="flex items-center mt-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${doctor?.isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">
                          {doctor?.isConnected ? 'Online - Ready to begin consultation' : 'Preparing for your visit'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
                    Pre-Consultation Checklist
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${prepSteps.devicesChecked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {prepSteps.devicesChecked ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className={prepSteps.devicesChecked ? 'text-gray-900' : 'text-gray-500'}>
                        Device check completed
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${prepSteps.consentCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {prepSteps.consentCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className={prepSteps.consentCompleted ? 'text-gray-900' : 'text-gray-500'}>
                        Consent form submitted
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${prepSteps.questionnaireCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {prepSteps.questionnaireCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className={prepSteps.questionnaireCompleted ? 'text-gray-900' : 'text-gray-500'}>
                        Pre-visit questionnaire completed
                      </span>
                      {!prepSteps.questionnaireCompleted && (
                        <Button 
                          variant="link" 
                          className="ml-2 text-[#006D77]"
                          onClick={() => setShowQuestionnaire(true)}
                        >
                          Complete now
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${prepSteps.documentsReviewed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {prepSteps.documentsReviewed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className={prepSteps.documentsReviewed ? 'text-gray-900' : 'text-gray-500'}>
                        Review visit info
                      </span>
                      {!prepSteps.documentsReviewed && (
                        <Button 
                          variant="link" 
                          className="ml-2 text-[#006D77]"
                          onClick={handleDocumentsReviewed}
                        >
                          Review now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <ShieldCheck className="h-4 w-4 mr-2 text-[#006D77]" />
                    <span>End-to-end encrypted consultation</span>
                  </div>
                  
                  <Button
                    onClick={startConsultation}
                    disabled={!doctor?.isConnected}
                    className="bg-[#006D77] hover:bg-[#00565E]"
                  >
                    {doctor?.isConnected ? 'Join Consultation Now' : 'Waiting for Doctor...'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Appointment Info */}
        <div>
          <Card className="shadow-md border-[#E8F3F4] h-full">
            <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
              <CardTitle className="text-lg text-[#006D77]">Appointment Details</CardTitle>
            </CardHeader>
            
            <CardContent className="p-5">
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Visit Reason</h3>
                  <p className="font-medium">{appointmentInfo.reason}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-[#006D77]" />
                    <p>{formatAppointmentTime(appointmentInfo.scheduledTime)}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-[#006D77]" />
                    <p>{appointmentInfo.duration} minutes</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Prepare for Your Visit</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Have your medication list ready</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Be in a quiet, private location</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Have good lighting so the doctor can see you clearly</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Prepare questions you want to ask</span>
                    </li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Need Help?</h3>
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pre-Consultation Questionnaire Modal */}
      {showQuestionnaire && (
        <PreConsultationQuestionnaire
          onClose={() => setShowQuestionnaire(false)}
          onComplete={handleQuestionnaireComplete}
        />
      )}
    </div>
  );
};

export default VirtualWaitingRoom;