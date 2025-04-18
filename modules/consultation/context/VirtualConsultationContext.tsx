"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for the consultation data
export interface Message {
  id: string;
  senderId: string;
  senderType: 'patient' | 'doctor' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'prescription' | 'lab_result';
  name: string;
  url: string;
  size: string;
  annotations?: Annotation[];
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  createdBy: string;
}

export interface Participant {
  id: string;
  name: string;
  role: 'doctor' | 'patient' | 'nurse' | 'pharmacist';
  avatar?: string;
  isConnected: boolean;
}

export interface ConsultationData {
  id: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  participants: Participant[];
  messages: Message[];
  sharedScreenUrl?: string;
  recordingConsent: boolean;
  encryptionEnabled: boolean;
  isRecording: boolean;
  language: string;
  appointmentInfo: {
    appointmentId: string;
    reason: string;
    duration: number; // in minutes
    scheduledTime: Date;
  };
  technicalInfo: {
    videoEnabled: boolean;
    audioEnabled: boolean;
    networkQuality: 'excellent' | 'good' | 'fair' | 'poor';
    deviceInfo: {
      camera: string;
      microphone: string;
      browser: string;
    };
  };
}

// Context type
interface VirtualConsultationContextType {
  consultation: ConsultationData;
  updateConsultation: (data: Partial<ConsultationData>) => void;
  sendMessage: (content: string, attachments?: Attachment[]) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleRecording: () => void;
  shareScreen: (enabled: boolean) => void;
  sendAnnotation: (attachmentId: string, annotation: Omit<Annotation, 'id'>) => void;
  toggleEncryption: (enabled: boolean) => void;
  updateNetworkQuality: (quality: ConsultationData['technicalInfo']['networkQuality']) => void;
  translateMessage: (messageId: string, targetLanguage: string) => Promise<string>;
  endConsultation: () => void;
  generateSummary: () => Promise<any>;
}

// Mock data for demonstration
const mockConsultation: ConsultationData = {
  id: `consultation-${Date.now()}`,
  status: 'scheduled',
  participants: [
    { 
      id: 'doctor-1', 
      name: 'Dr. Sarah Johnson', 
      role: 'doctor', 
      avatar: '/assets/doctors/sarah-johnson.jpg',
      isConnected: false 
    },
    { 
      id: 'patient-1', 
      name: 'Michael Chen', 
      role: 'patient', 
      isConnected: false 
    }
  ],
  messages: [],
  recordingConsent: false,
  encryptionEnabled: true,
  isRecording: false,
  language: 'en',
  appointmentInfo: {
    appointmentId: 'apt-12345',
    reason: 'Follow-up on recent lab results',
    duration: 30,
    scheduledTime: new Date(Date.now() + 1000 * 60 * 5) // 5 minutes from now
  },
  technicalInfo: {
    videoEnabled: true,
    audioEnabled: true,
    networkQuality: 'good',
    deviceInfo: {
      camera: '',
      microphone: '',
      browser: ''
    }
  }
};

// Create context with default undefined value
const VirtualConsultationContext = createContext<VirtualConsultationContextType | undefined>(undefined);

// Provider component
export function VirtualConsultationProvider({ children }: { children: ReactNode }) {
  const [consultation, setConsultation] = useState<ConsultationData>(mockConsultation);

  // Detect browser and device info on mount
  useEffect(() => {
    const detectDeviceInfo = async () => {
      // Get browser info
      const userAgent = navigator.userAgent;
      let browserName = "Unknown";
      
      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
      } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
      } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
      } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
      }

      // In a real app, we would use the Media Devices API to get camera and microphone names
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const microphones = devices.filter(device => device.kind === 'audioinput');
        
        setConsultation(prev => ({
          ...prev,
          technicalInfo: {
            ...prev.technicalInfo,
            deviceInfo: {
              camera: cameras.length > 0 ? cameras[0].label || 'Default Camera' : 'No Camera',
              microphone: microphones.length > 0 ? microphones[0].label || 'Default Microphone' : 'No Microphone',
              browser: browserName
            }
          }
        }));
      } catch (error) {
        console.error('Failed to get media devices:', error);
      }
    };

    detectDeviceInfo();
  }, []);

  // Function to update consultation data
  const updateConsultation = (data: Partial<ConsultationData>) => {
    setConsultation(prev => ({
      ...prev,
      ...data
    }));
  };

  // Function to send a message
  const sendMessage = (content: string, attachments: Attachment[] = []) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'patient-1', // Using patient ID for now
      senderType: 'patient',
      content,
      timestamp: new Date(),
      status: 'sending',
      attachments
    };

    setConsultation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    // Simulate message sent status update
    setTimeout(() => {
      setConsultation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      }));
    }, 500);

    // Simulate message delivered status update
    setTimeout(() => {
      setConsultation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1500);

    // Simulate doctor's response for demo purposes
    if (consultation.status === 'in-progress') {
      setTimeout(() => {
        const doctorResponse: Message = {
          id: `msg-${Date.now()}`,
          senderId: 'doctor-1',
          senderType: 'doctor',
          content: `Thank you for sharing. ${content.includes('pain') ? 'Could you rate your pain on a scale of 1-10?' : 'Is there anything else you want to discuss today?'}`,
          timestamp: new Date(),
          status: 'delivered'
        };

        setConsultation(prev => ({
          ...prev,
          messages: [...prev.messages, doctorResponse]
        }));
      }, 3000);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    setConsultation(prev => ({
      ...prev,
      technicalInfo: {
        ...prev.technicalInfo,
        videoEnabled: !prev.technicalInfo.videoEnabled
      }
    }));
  };

  // Toggle audio
  const toggleAudio = () => {
    setConsultation(prev => ({
      ...prev,
      technicalInfo: {
        ...prev.technicalInfo,
        audioEnabled: !prev.technicalInfo.audioEnabled
      }
    }));
  };

  // Toggle recording
  const toggleRecording = () => {
    if (!consultation.recordingConsent && !consultation.isRecording) {
      console.warn('Cannot start recording without consent');
      return;
    }

    setConsultation(prev => ({
      ...prev,
      isRecording: !prev.isRecording
    }));
  };

  // Share screen
  const shareScreen = (enabled: boolean) => {
    setConsultation(prev => ({
      ...prev,
      sharedScreenUrl: enabled ? 'screen-sharing-active' : undefined
    }));
  };

  // Send annotation on attachment
  const sendAnnotation = (attachmentId: string, annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `anno-${Date.now()}`
    };

    setConsultation(prev => ({
      ...prev,
      messages: prev.messages.map(message => {
        if (message.attachments) {
          return {
            ...message,
            attachments: message.attachments.map(att => {
              if (att.id === attachmentId) {
                return {
                  ...att,
                  annotations: [...(att.annotations || []), newAnnotation]
                };
              }
              return att;
            })
          };
        }
        return message;
      })
    }));
  };

  // Toggle encryption
  const toggleEncryption = (enabled: boolean) => {
    setConsultation(prev => ({
      ...prev,
      encryptionEnabled: enabled
    }));
  };

  // Update network quality
  const updateNetworkQuality = (quality: ConsultationData['technicalInfo']['networkQuality']) => {
    setConsultation(prev => ({
      ...prev,
      technicalInfo: {
        ...prev.technicalInfo,
        networkQuality: quality
      }
    }));
  };

  // Translate message (mock implementation)
  const translateMessage = async (messageId: string, targetLanguage: string): Promise<string> => {
    // In a real implementation, this would call a translation API
    console.log(`Translating message ${messageId} to ${targetLanguage}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = consultation.messages.find(msg => msg.id === messageId);
    if (!message) return "Message not found";

    // Mock translation
    if (targetLanguage === 'es') {
      return message.content.includes('pain') 
        ? 'Por favor, describe tu dolor en una escala del 1 al 10.'
        : '¿Hay algo más que quieras discutir hoy?';
    } else if (targetLanguage === 'fr') {
      return message.content.includes('pain')
        ? 'Veuillez décrire votre douleur sur une échelle de 1 à 10.'
        : 'Y a-t-il autre chose dont vous aimeriez discuter aujourd\'hui?';
    }

    return message.content;
  };

  // End consultation
  const endConsultation = () => {
    setConsultation(prev => ({
      ...prev,
      status: 'completed',
      endTime: new Date()
    }));
  };

  // Generate summary (mock implementation)
  const generateSummary = async () => {
    // In a real implementation, this would analyze the consultation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      duration: consultation.startTime && consultation.endTime
        ? Math.floor((consultation.endTime.getTime() - consultation.startTime.getTime()) / 60000)
        : 0,
      topicsCovered: ['Current symptoms', 'Medication review', 'Treatment plan'],
      nextSteps: [
        'Continue current medication regimen',
        'Schedule follow-up in 2 weeks',
        'Complete lab work before next visit'
      ],
      prescriptions: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily for 10 days' }
      ]
    };
  };

  // Provide context values
  const value: VirtualConsultationContextType = {
    consultation,
    updateConsultation,
    sendMessage,
    toggleVideo,
    toggleAudio,
    toggleRecording,
    shareScreen,
    sendAnnotation,
    toggleEncryption,
    updateNetworkQuality,
    translateMessage,
    endConsultation,
    generateSummary
  };

  return (
    <VirtualConsultationContext.Provider value={value}>
      {children}
    </VirtualConsultationContext.Provider>
  );
}

// Custom hook to use the virtual consultation context
export function useVirtualConsultation() {
  const context = useContext(VirtualConsultationContext);
  if (context === undefined) {
    throw new Error('useVirtualConsultation must be used within a VirtualConsultationProvider');
  }
  return context;
}
