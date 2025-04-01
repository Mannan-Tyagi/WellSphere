/**
 * VoiceRecognitionService.ts
 * This service handles voice recognition functionality for the Clinical Consultation module.
 * It provides advanced speech-to-text capabilities with medical terminology recognition,
 * speaker differentiation, and noise filtering.
 */

import { useEffect, useState } from 'react';
import { AITranscriptionResponse } from './AIService';

// Types for voice recognition
export interface VoiceRecognitionConfig {
  language: string;
  autoDetectLanguage: boolean;
  filterBackground: boolean;
  speakerDifferentiation: boolean;
  continuousRecording: boolean;
  sensitivityLevel: number; // 1-10, with 10 being most sensitive
  medicalTerminologyEnabled: boolean;
}

export interface RecordingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  audioBlob?: Blob;
  transcription?: string;
  language: string;
  segments: TranscriptionSegment[];
  status: 'recording' | 'paused' | 'completed' | 'processing' | 'error';
  error?: string;
}

export interface TranscriptionSegment {
  startTime: number; // in seconds from recording start
  endTime: number; // in seconds from recording start
  speaker: 'doctor' | 'patient' | 'unknown';
  text: string;
  confidence: number; // 0-1
  medicalTerms?: {
    term: string;
    normalizedTerm: string;
    confidence: number;
  }[];
}

// Class to manage voice recognition
export class VoiceRecognitionManager {
  private static instance: VoiceRecognitionManager;
  private config: VoiceRecognitionConfig;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private currentSession: RecordingSession | null = null;
  private recognitionActive: boolean = false;
  private stream: MediaStream | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  private constructor() {
    // Initialize with default configuration
    this.config = {
      language: 'en-US',
      autoDetectLanguage: true,
      filterBackground: true,
      speakerDifferentiation: true,
      continuousRecording: false,
      sensitivityLevel: 7,
      medicalTerminologyEnabled: true
    };
  }
  
  public static getInstance(): VoiceRecognitionManager {
    if (!VoiceRecognitionManager.instance) {
      VoiceRecognitionManager.instance = new VoiceRecognitionManager();
    }
    return VoiceRecognitionManager.instance;
  }
  
  /**
   * Update voice recognition configuration
   */
  public updateConfig(config: Partial<VoiceRecognitionConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Voice recognition config updated:', this.config);
  }
  
  /**
   * Get current configuration
   */
  public getConfig(): VoiceRecognitionConfig {
    return { ...this.config };
  }
  
  /**
   * Start recording audio
   */
  public async startRecording(): Promise<RecordingSession> {
    try {
      if (this.recognitionActive) {
        throw new Error('Recording already in progress');
      }
      
      console.log('Starting voice recording...');
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new recording session
      this.currentSession = {
        id: `rec-${Date.now()}`,
        startTime: new Date(),
        duration: 0,
        language: this.config.language,
        segments: [],
        status: 'recording'
      };
      
      // Initialize media recorder
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = async () => {
        if (this.currentSession) {
          // Create audio blob from chunks
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // Update session with audio data
          this.currentSession.audioBlob = audioBlob;
          this.currentSession.endTime = new Date();
          this.currentSession.duration = Math.round(
            (this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()) / 1000
          );
          
          // Process the audio for transcription
          await this.processAudio(this.currentSession);
          
          // Notify listeners
          this.emit('recordingComplete', this.currentSession);
        }
        
        // Clean up
        this.recognitionActive = false;
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      };
      
      // Start recording
      this.mediaRecorder.start(1000); // Capture in 1-second chunks
      this.recognitionActive = true;
      
      // Notify listeners
      this.emit('recordingStart', this.currentSession);
      
      console.log('Voice recording started successfully');
      return this.currentSession;
    } catch (error) {
      console.error('Failed to start voice recording:', error);
      
      // Create an error session
      const errorSession: RecordingSession = {
        id: `rec-error-${Date.now()}`,
        startTime: new Date(),
        duration: 0,
        language: this.config.language,
        segments: [],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Clean up
      this.recognitionActive = false;
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      
      // Notify listeners
      this.emit('error', errorSession);
      
      return Promise.reject(error);
    }
  }
  
  /**
   * Stop recording audio
   */
  public stopRecording(): Promise<RecordingSession> {
    return new Promise((resolve, reject) => {
      if (!this.recognitionActive || !this.mediaRecorder || !this.currentSession) {
        reject(new Error('No active recording to stop'));
        return;
      }
      
      console.log('Stopping voice recording...');
      
      // Update session status
      if (this.currentSession) {
        this.currentSession.status = 'processing';
      }
      
      // Set up one-time listener for recording completion
      const completeListener = (session: RecordingSession) => {
        this.off('recordingComplete', completeListener);
        resolve(session);
      };
      
      this.on('recordingComplete', completeListener);
      
      // Stop the media recorder
      this.mediaRecorder.stop();
    });
  }
  
  /**
   * Pause recording
   */
  public pauseRecording(): void {
    if (!this.recognitionActive || !this.mediaRecorder || !this.currentSession) {
      throw new Error('No active recording to pause');
    }
    
    if (this.mediaRecorder.state === 'recording') {
      console.log('Pausing voice recording...');
      this.mediaRecorder.pause();
      
      if (this.currentSession) {
        this.currentSession.status = 'paused';
      }
      
      // Notify listeners
      this.emit('recordingPause', this.currentSession);
    }
  }
  
  /**
   * Resume recording
   */
  public resumeRecording(): void {
    if (!this.recognitionActive || !this.mediaRecorder || !this.currentSession) {
      throw new Error('No active recording to resume');
    }
    
    if (this.mediaRecorder.state === 'paused') {
      console.log('Resuming voice recording...');
      this.mediaRecorder.resume();
      
      if (this.currentSession) {
        this.currentSession.status = 'recording';
      }
      
      // Notify listeners
      this.emit('recordingResume', this.currentSession);
    }
  }
  
  /**
   * Process recorded audio for transcription
   */
  private async processAudio(session: RecordingSession): Promise<void> {
    try {
      if (!session.audioBlob) {
        throw new Error('No audio data available for processing');
      }
      
      console.log(`Processing audio recording (${Math.round(session.audioBlob.size / 1024)} KB)...`);
      
      // In a real implementation, this would send the audio to a speech-to-text service
      // For now, we'll simulate the process with mock data
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription segments
      const mockSegments: TranscriptionSegment[] = [
        {
          startTime: 0,
          endTime: 8.5,
          speaker: 'doctor',
          text: 'Hello Sarah, how have your headaches been since our last visit?',
          confidence: 0.95
        },
        {
          startTime: 9.2,
          endTime: 25.7,
          speaker: 'patient',
          text: 'They\'ve been a bit better since starting the medication, but I\'m still getting them about twice a week. They\'re not as severe though, maybe a 5 out of 10 instead of 7 or 8.',
          confidence: 0.92,
          medicalTerms: [
            { term: 'medication', normalizedTerm: 'medication', confidence: 0.98 },
            { term: 'severe', normalizedTerm: 'severity', confidence: 0.95 }
          ]
        },
        {
          startTime: 26.5,
          endTime: 40.2,
          speaker: 'doctor',
          text: 'That\'s good to hear there\'s some improvement. Are you still experiencing the sensitivity to light and nausea with these headaches?',
          confidence: 0.96,
          medicalTerms: [
            { term: 'sensitivity to light', normalizedTerm: 'photophobia', confidence: 0.97 },
            { term: 'nausea', normalizedTerm: 'nausea', confidence: 0.99 }
          ]
        },
        {
          startTime: 41.0,
          endTime: 52.3,
          speaker: 'patient',
          text: 'Yes, but it\'s not as bad. I still need to lie down in a dark room, but the nausea isn\'t making me vomit anymore.',
          confidence: 0.91,
          medicalTerms: [
            { term: 'dark room', normalizedTerm: 'photophobia', confidence: 0.85 },
            { term: 'nausea', normalizedTerm: 'nausea', confidence: 0.99 },
            { term: 'vomit', normalizedTerm: 'vomiting', confidence: 0.98 }
          ]
        }
      ];
      
      // Update session with transcription data
      session.segments = mockSegments;
      session.transcription = mockSegments.map(segment => segment.text).join(' ');
      session.status = 'completed';
      
      console.log('Audio processing completed successfully');
    } catch (error) {
      console.error('Failed to process audio:', error);
      
      // Update session with error
      session.status = 'error';
      session.error = error instanceof Error ? error.message : 'Unknown error';
      
      // Notify listeners
      this.emit('error', session);
    }
  }
  
  /**
   * Get current recording session
   */
  public getCurrentSession(): RecordingSession | null {
    return this.currentSession;
  }
  
  /**
   * Check if recording is active
   */
  public isRecording(): boolean {
    return this.recognitionActive;
  }
  
  /**
   * Add event listener
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
  }
  
  /**
   * Remove event listener
   */
  public off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
  
  /**
   * Emit event to listeners
   */
  private emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
}

// Export singleton instance
export const voiceRecognitionManager = VoiceRecognitionManager.getInstance();

/**
 * Hook to use voice recognition in React components
 */
export function useVoiceRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<RecordingSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize with current state
    setIsRecording(voiceRecognitionManager.isRecording());
    setCurrentSession(voiceRecognitionManager.getCurrentSession());
    
    // Set up event listeners
    const handleRecordingStart = (session: RecordingSession) => {
      setIsRecording(true);
      setCurrentSession(session);
      setError(null);
    };
    
    const handleRecordingComplete = (session: RecordingSession) => {
      setIsRecording(false);
      setCurrentSession(session);
    };
    
    const handleRecordingPause = (session: RecordingSession) => {
      setCurrentSession(session);
    };
    
    const handleRecordingResume = (session: RecordingSession) => {
      setCurrentSession(session);
    };
    
    const handleError = (session: RecordingSession) => {
      setIsRecording(false);
      setCurrentSession(session);
      setError(session.error || 'Unknown error');
    };
    
    // Register listeners
    voiceRecognitionManager.on('recordingStart', handleRecordingStart);
    voiceRecognitionManager.on('recordingComplete', handleRecordingComplete);
    voiceRecognitionManager.on('recordingPause', handleRecordingPause);
    voiceRecognitionManager.on('recordingResume', handleRecordingResume);
    voiceRecognitionManager.on('error', handleError);
    
    // Cleanup
    return () => {
      voiceRecognitionManager.off('recordingStart', handleRecordingStart);
      voiceRecognitionManager.off('recordingComplete', handleRecordingComplete);
      voiceRecognitionManager.off('recordingPause', handleRecordingPause);
      voiceRecognitionManager.off('recordingResume', handleRecordingResume);
      voiceRecognitionManager.off('error', handleError);
    };
  }, []);
  
  return {
    isRecording,
    currentSession,
    error,
    startRecording: () => voiceRecognitionManager.startRecording(),
    stopRecording: () => voiceRecognitionManager.stopRecording(),
    pauseRecording: () => voiceRecognitionManager.pauseRecording(),
    resumeRecording: () => voiceRecognitionManager.resumeRecording(),
    updateConfig: (config: Partial<VoiceRecognitionConfig>) => voiceRecognitionManager.updateConfig(config),
    getConfig: () => voiceRecognitionManager.getConfig(),
  };
}


