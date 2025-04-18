"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Mic, 
  Volume2, 
  Globe, 
  FileCheck, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Check,
  X,
  Clock,
  Zap,
  FileText,
  Video 
} from 'lucide-react';
import { useVirtualConsultation } from './context/VirtualConsultationContext';
import { format } from 'date-fns';

interface PreConsultationCheckProps {
  onComplete: () => void;
}

export default function PreConsultationCheck({ onComplete }: PreConsultationCheckProps) {
  const { consultation, updateConsultation } = useVirtualConsultation();
  const [activeTab, setActiveTab] = useState('device-check');
  const [testingCamera, setTestingCamera] = useState(false);
  const [testingMicrophone, setTestingMicrophone] = useState(false);
  const [testingAudio, setTestingAudio] = useState(false);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [connectionSpeed, setConnectionSpeed] = useState<number | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load available devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // Enumerate all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const cameras = devices.filter(device => device.kind === 'videoinput');
        const microphones = devices.filter(device => device.kind === 'audioinput');
        
        setAvailableCameras(cameras);
        setAvailableMicrophones(microphones);
        
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
        
        if (microphones.length > 0) {
          setSelectedMicrophone(microphones[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    
    loadDevices();
    
    // Start with a device check
    startCameraTest();
    
    return () => {
      // Clean up any open streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update progress for the current test
  useEffect(() => {
    if (testingCamera || testingMicrophone || testingAudio) {
      const interval = setInterval(() => {
        setTestProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [testingCamera, testingMicrophone, testingAudio]);

  // Simulate a network speed test
  useEffect(() => {
    if (activeTab === 'connection-check') {
      const testConnection = async () => {
        setConnectionSpeed(null);
        setTestProgress(0);
        
        // Simulate a network test with progress updates
        const interval = setInterval(() => {
          setTestProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 100);
        
        // Simulate completion after 2 seconds
        setTimeout(() => {
          clearInterval(interval);
          setTestProgress(100);
          
          // Generate a random speed between 5 and 50 Mbps
          const randomSpeed = Math.floor(Math.random() * 45) + 5;
          setConnectionSpeed(randomSpeed);
          
          // Update network quality based on speed
          let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
          if (randomSpeed > 30) quality = 'excellent';
          else if (randomSpeed > 15) quality = 'good';
          else if (randomSpeed > 5) quality = 'fair';
          
          updateConsultation({
            technicalInfo: {
              ...consultation.technicalInfo,
              networkQuality: quality
            }
          });
        }, 2000);
      };
      
      testConnection();
    }
  }, [activeTab, updateConsultation, consultation.technicalInfo]);

  // Start camera test
  const startCameraTest = async () => {
    setTestingCamera(true);
    setTestProgress(0);
    
    try {
      // Stop any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Get the video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true
      });
      
      streamRef.current = stream;
      
      // Display the video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setTestingCamera(false);
        setTestProgress(100);
      }, 3000);
    } catch (error) {
      console.error('Error starting camera test:', error);
      setTestingCamera(false);
    }
  };

  // Start microphone test
  const startMicrophoneTest = async () => {
    setTestingMicrophone(true);
    setTestProgress(0);
    setMicrophoneLevel(0);
    
    try {
      // Stop any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Get the audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true
      });
      
      streamRef.current = stream;
      
      // Create an audio context to analyze the microphone input
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      
      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;
        
        for (let i = 0; i < array.length; i++) {
          values += array[i];
        }
        
        const average = values / array.length;
        setMicrophoneLevel(Math.min(average * 2, 100)); // Scale to 0-100
      };
      
      // Simulate completion after 5 seconds
      setTimeout(() => {
        setTestingMicrophone(false);
        setTestProgress(100);
        
        // Clean up audio processing
        javascriptNode.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        audioContext.close();
      }, 5000);
    } catch (error) {
      console.error('Error starting microphone test:', error);
      setTestingMicrophone(false);
    }
  };

  // Start audio playback test
  const startAudioTest = () => {
    setTestingAudio(true);
    setTestProgress(0);
    
    // Play a test sound
    const audio = new Audio('/assets/test-sound.mp3');
    audio.play().catch(error => {
      console.error('Error playing test sound:', error);
    });
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      setTestingAudio(false);
      setTestProgress(100);
    }, 3000);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    updateConsultation({ language });
  };

  // Handle consent toggle
  const handleConsentToggle = (consented: boolean) => {
    updateConsultation({ recordingConsent: consented });
  };

  // Get connection quality label
  const getConnectionQualityLabel = () => {
    if (!connectionSpeed) return 'Testing...';
    
    if (connectionSpeed > 30) return 'Excellent';
    if (connectionSpeed > 15) return 'Good';
    if (connectionSpeed > 5) return 'Fair';
    return 'Poor';
  };

  // Get connection quality color
  const getConnectionQualityColor = () => {
    if (!connectionSpeed) return 'bg-gray-200';
    
    if (connectionSpeed > 30) return 'bg-green-500';
    if (connectionSpeed > 15) return 'bg-green-400';
    if (connectionSpeed > 5) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  // Check if all tests have been completed
  const areAllTestsCompleted = () => {
    // In a real app, we would check if each test has been successfully completed
    return activeTab === 'consent';
  };

  // Format the appointment time
  const formatAppointmentTime = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-md border-[#E8F3F4]">
        <CardHeader className="bg-[#F0F9FA] border-b border-[#E8F3F4]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#006D77]">Prepare for Your Virtual Consultation</CardTitle>
              <CardDescription className="mt-1">
                Complete these quick checks to ensure the best consultation experience
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Appointment Time</p>
              <p className="text-sm text-gray-500">{formatAppointmentTime(consultation.appointmentInfo.scheduledTime)}</p>
              <div className="flex items-center justify-end mt-1">
                <Clock className="h-4 w-4 mr-1 text-[#006D77]" />
                <span className="text-sm text-[#006D77] font-medium">
                  {consultation.appointmentInfo.duration} minutes
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="device-check" className="flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span className="hidden md:inline">Devices</span>
              </TabsTrigger>
              <TabsTrigger value="connection-check" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span className="hidden md:inline">Connection</span>
              </TabsTrigger>
              <TabsTrigger value="language-check" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Language</span>
              </TabsTrigger>
              <TabsTrigger value="consent" className="flex items-center space-x-2">
                <FileCheck className="h-4 w-4" />
                <span className="hidden md:inline">Consent</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Device Check Tab */}
            <TabsContent value="device-check">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Video className="h-5 w-5 mr-2 text-[#006D77]" />
                    Video Check
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <div className="relative bg-black rounded-lg overflow-hidden w-full" style={{ height: '200px' }}>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                        ></video>
                        
                        {testingCamera && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="text-white text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                              <p>Testing camera...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {testProgress === 100 && !testingCamera && (
                        <div className="flex items-center justify-center mt-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5 mr-1" />
                          <span>Camera working properly</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-1/3 space-y-3">
                      <div>
                        <Label htmlFor="camera-select">Select Camera</Label>
                        <Select 
                          value={selectedCamera} 
                          onValueChange={setSelectedCamera}
                        >
                          <SelectTrigger id="camera-select">
                            <SelectValue placeholder="Select camera" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCameras.map(camera => (
                              <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={startCameraTest} 
                        disabled={testingCamera}
                        className="w-full bg-[#006D77] hover:bg-[#00565E]"
                      >
                        {testingCamera ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>Test Camera</>
                        )}
                      </Button>
                      
                      {testingCamera && (
                        <Progress value={testProgress} className="h-2" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Mic className="h-5 w-5 mr-2 text-[#006D77]" />
                    Microphone Check
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <div className="bg-white border rounded-lg p-4 h-[100px] flex items-center justify-center">
                        {testingMicrophone ? (
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                              <span>Microphone Level</span>
                              <span>{Math.round(microphoneLevel)}%</span>
                            </div>
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#006D77]" 
                                style={{ width: `${microphoneLevel}%` }}
                              ></div>
                            </div>
                            <p className="text-center mt-4 text-sm text-gray-500">
                              Please speak to test your microphone
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            {testProgress === 100 && !testingMicrophone ? (
                              <div className="flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-5 w-5 mr-1" />
                                <span>Microphone working properly</span>
                              </div>
                            ) : (
                              <p>Click "Test Microphone" to begin</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 space-y-3">
                      <div>
                        <Label htmlFor="microphone-select">Select Microphone</Label>
                        <Select 
                          value={selectedMicrophone} 
                          onValueChange={setSelectedMicrophone}
                        >
                          <SelectTrigger id="microphone-select">
                            <SelectValue placeholder="Select microphone" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMicrophones.map(mic => (
                              <SelectItem key={mic.deviceId} value={mic.deviceId}>
                                {mic.label || `Microphone ${availableMicrophones.indexOf(mic) + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={startMicrophoneTest} 
                        disabled={testingMicrophone}
                        className="w-full bg-[#006D77] hover:bg-[#00565E]"
                      >
                        {testingMicrophone ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>Test Microphone</>
                        )}
                      </Button>
                      
                      {testingMicrophone && (
                        <Progress value={testProgress} className="h-2" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Volume2 className="h-5 w-5 mr-2 text-[#006D77]" />
                    Speaker Check
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <div className="bg-white border rounded-lg p-4 h-[100px] flex items-center justify-center">
                        {testingAudio ? (
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Playing test sound...</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Can you hear the audio?
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            {testProgress === 100 && !testingAudio ? (
                              <div className="flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-5 w-5 mr-1" />
                                <span>Speaker test completed</span>
                              </div>
                            ) : (
                              <p>Click "Test Speakers" to play a test sound</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 space-y-3">
                      <Button 
                        onClick={startAudioTest} 
                        disabled={testingAudio}
                        className="w-full bg-[#006D77] hover:bg-[#00565E]"
                      >
                        {testingAudio ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>Test Speakers</>
                        )}
                      </Button>
                      
                      {testingAudio && (
                        <Progress value={testProgress} className="h-2" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Connection Check Tab */}
            <TabsContent value="connection-check">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-md font-medium mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-[#006D77]" />
                    Internet Connection Quality
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Connection Speed</p>
                        <p className="text-3xl font-bold">
                          {connectionSpeed ? `${connectionSpeed} Mbps` : 'Testing...'}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className={`h-3 w-3 rounded-full mr-2 ${getConnectionQualityColor()}`}></div>
                          <p className="text-sm">{getConnectionQualityLabel()}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">Recommended</p>
                        <p className="text-sm">At least 5 Mbps</p>
                        <div className="flex items-center justify-end mt-1">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <p className="text-xs text-gray-500">Video: 3+ Mbps</p>
                        </div>
                        <div className="flex items-center justify-end mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                          <p className="text-xs text-gray-500">Audio only: 0.5+ Mbps</p>
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={testProgress} className="h-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-2">Connection Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Video Streaming</span>
                            <span className={connectionSpeed && connectionSpeed > 3 ? "text-green-600" : "text-red-600"}>
                              {connectionSpeed && connectionSpeed > 3 ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <X className="h-5 w-5" />
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Audio Quality</span>
                            <span className={connectionSpeed && connectionSpeed > 0.5 ? "text-green-600" : "text-red-600"}>
                              {connectionSpeed && connectionSpeed > 0.5 ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <X className="h-5 w-5" />
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Screen Sharing</span>
                            <span className={connectionSpeed && connectionSpeed > 5 ? "text-green-600" : "text-red-600"}>
                              {connectionSpeed && connectionSpeed > 5 ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <X className="h-5 w-5" />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                        <ul className="space-y-2 text-sm">
                          {connectionSpeed && connectionSpeed < 5 && (
                            <>
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span>Close other applications using your network</span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span>Move closer to your WiFi router</span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span>Consider using a wired connection</span>
                              </li>
                            </>
                          )}
                          
                          {connectionSpeed && connectionSpeed >= 5 && (
                            <li className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span>Your connection is suitable for a video consultation</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Language Tab */}
            <TabsContent value="language-check">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-[#006D77]" />
                  Language Preferences
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="language-select" className="mb-2 block">Consultation Language</Label>
                      <Select 
                        value={selectedLanguage} 
                        onValueChange={handleLanguageChange}
                      >
                        <SelectTrigger id="language-select">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish (Español)</SelectItem>
                          <SelectItem value="fr">French (Français)</SelectItem>
                          <SelectItem value="zh">Chinese (中文)</SelectItem>
                          <SelectItem value="ar">Arabic (العربية)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">
                        Choose your preferred language for the consultation
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Translation Features</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Real-time Translation</p>
                            <p className="text-sm text-gray-500">
                              Messages can be automatically translated during your consultation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Medical Terminology Support</p>
                            <p className="text-sm text-gray-500">
                              Specialized medical translations are available
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Language Assistance Note</p>
                        <p className="text-sm text-blue-600 mt-1">
                          If you need a human interpreter for your consultation, please contact our support team before your appointment. AI translation is available for immediate assistance during the consultation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Consent Tab */}
            <TabsContent value="consent">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-[#006D77]" />
                  Consent & Privacy
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#F0F9FA] p-3 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-[#006D77]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Secure Encryption</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Your consultation is protected with end-to-end encryption. No one outside of your consultation can access your conversation or video.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-b py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="recording-consent" className="text-base font-medium">
                          Recording Consent
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Allow this consultation to be recorded for your personal reference and medical documentation
                        </p>
                      </div>
                      <Switch 
                        id="recording-consent" 
                        checked={consultation.recordingConsent}
                        onCheckedChange={handleConsentToggle}
                      />
                    </div>
                    
                    {consultation.recordingConsent && (
                      <div className="mt-4 bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
                        <h5 className="text-sm font-medium text-[#006D77] mb-2">Recording Information</h5>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-[#006D77] mt-0.5 mr-2 flex-shrink-0" />
                            <span>The recording will be stored securely in your patient portal</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-[#006D77] mt-0.5 mr-2 flex-shrink-0" />
                            <span>You can access it later to review treatment instructions</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-[#006D77] mt-0.5 mr-2 flex-shrink-0" />
                            <span>The recording will be automatically deleted after 90 days</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-4 w-4 text-[#006D77] mt-0.5 mr-2 flex-shrink-0" />
                            <span>You can request deletion of the recording at any time</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-4 bg-white">
                    <h4 className="text-sm font-medium mb-2">Telehealth Consent Form</h4>
                    <div className="text-xs text-gray-600 space-y-2">
                      <p>
                        I understand that telehealth involves the use of electronic communications to enable healthcare providers to share individual patient medical information for the purpose of improving patient care.
                      </p>
                      <p>
                        The information may be used for diagnosis, therapy, follow-up and/or education, and may include:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Patient medical records</li>
                        <li>Live two-way audio and video</li>
                        <li>Output data from medical devices and sound and video files</li>
                      </ul>
                      <p>
                        The laws that protect the confidentiality of medical information also apply to telehealth, and none of the information obtained in the use of telehealth will be disclosed without your consent.
                      </p>
                      <p>
                        I understand that there are risks and benefits associated with telehealth including, but not limited to:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Information transmitted may not be sufficient to allow for appropriate medical decision making by the physician.</li>
                        <li>Delays in medical evaluation and treatment could occur due to deficiencies or failures of the equipment.</li>
                        <li>Security protocols could fail, causing a breach of privacy of personal medical information.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="consent-check" className="mr-2" />
                    <Label htmlFor="consent-check">
                      I have read and understand the telehealth consent information
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2" />
            {activeTab === 'consent' ? (
              <span>Please review and accept the consent form</span>
            ) : (
              <span>Complete all checks for the best experience</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {activeTab === 'device-check' && (
              <Button 
                onClick={() => setActiveTab('connection-check')}
                className="bg-[#006D77] hover:bg-[#00565E]"
              >
                Continue
              </Button>
            )}
            
            {activeTab === 'connection-check' && (
              <Button 
                onClick={() => setActiveTab('language-check')}
                className="bg-[#006D77] hover:bg-[#00565E]"
              >
                Continue
              </Button>
            )}
            
            {activeTab === 'language-check' && (
              <Button 
                onClick={() => setActiveTab('consent')}
                className="bg-[#006D77] hover:bg-[#00565E]"
              >
                Continue
              </Button>
            )}
            
            {activeTab === 'consent' && (
              <Button
                onClick={onComplete}
                className="bg-[#006D77] hover:bg-[#00565E]"
              >
                Enter Waiting Room
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
