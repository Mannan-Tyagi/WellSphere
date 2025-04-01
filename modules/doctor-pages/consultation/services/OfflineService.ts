/**
 * OfflineService.ts
 * This service handles offline functionality and data synchronization for the Clinical Consultation module.
 * It ensures that doctors can continue working even when internet connection is lost,
 * and synchronizes data when connection is restored.
 */

import { useEffect, useState } from 'react';
import { AIDocumentationTemplate } from './AIService';

// Types for offline data storage
export interface OfflineConsultation {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime?: Date;
  status: 'draft' | 'completed' | 'pending_sync';
  documentation: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  billingCodes: {
    code: string;
    description: string;
  }[];
  audioRecordings?: Blob[];
  lastModified: Date;
  syncStatus: 'synced' | 'pending' | 'failed';
  syncError?: string;
}

// Enum for connection status
export enum ConnectionStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  RECONNECTING = 'reconnecting'
}

// Class to manage offline functionality
export class OfflineManager {
  private static instance: OfflineManager;
  private connectionStatus: ConnectionStatus = ConnectionStatus.ONLINE;
  private offlineConsultations: Map<string, OfflineConsultation> = new Map();
  private syncQueue: string[] = [];
  private listeners: ((status: ConnectionStatus) => void)[] = [];
  
  private constructor() {
    // Initialize connection listeners
    this.initConnectionListeners();
    
    // Load any saved offline consultations from IndexedDB
    this.loadOfflineConsultations();
  }
  
  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }
  
  /**
   * Initialize connection status listeners
   */
  private initConnectionListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Connection restored');
      this.setConnectionStatus(ConnectionStatus.ONLINE);
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost');
      this.setConnectionStatus(ConnectionStatus.OFFLINE);
    });
    
    // Initial status check
    this.setConnectionStatus(navigator.onLine ? ConnectionStatus.ONLINE : ConnectionStatus.OFFLINE);
  }
  
  /**
   * Set connection status and notify listeners
   */
  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.notifyListeners();
  }
  
  /**
   * Notify all listeners of connection status change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.connectionStatus));
  }
  
  /**
   * Add a connection status listener
   */
  public addConnectionListener(listener: (status: ConnectionStatus) => void): void {
    this.listeners.push(listener);
    // Immediately notify with current status
    listener(this.connectionStatus);
  }
  
  /**
   * Remove a connection status listener
   */
  public removeConnectionListener(listener: (status: ConnectionStatus) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
  
  /**
   * Get current connection status
   */
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }
  
  /**
   * Load offline consultations from IndexedDB
   */
  private async loadOfflineConsultations(): Promise<void> {
    try {
      // In a real implementation, this would load from IndexedDB
      console.log('Loading offline consultations from storage');
      
      // For demo purposes, we'll just initialize with empty data
      this.offlineConsultations = new Map();
      this.syncQueue = [];
    } catch (error) {
      console.error('Failed to load offline consultations:', error);
    }
  }
  
  /**
   * Save a consultation for offline use
   */
  public async saveConsultation(consultation: OfflineConsultation): Promise<void> {
    try {
      // Save to local storage
      this.offlineConsultations.set(consultation.id, consultation);
      
      // If we're offline, add to sync queue
      if (this.connectionStatus === ConnectionStatus.OFFLINE) {
        consultation.syncStatus = 'pending';
        if (!this.syncQueue.includes(consultation.id)) {
          this.syncQueue.push(consultation.id);
        }
      } else {
        // Try to sync immediately if online
        await this.syncConsultation(consultation.id);
      }
      
      // In a real implementation, save to IndexedDB
      console.log(`Saved consultation ${consultation.id} locally`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save consultation locally:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Get a consultation from local storage
   */
  public getConsultation(consultationId: string): OfflineConsultation | undefined {
    return this.offlineConsultations.get(consultationId);
  }
  
  /**
   * Sync a specific consultation with the server
   */
  private async syncConsultation(consultationId: string): Promise<void> {
    const consultation = this.offlineConsultations.get(consultationId);
    if (!consultation) {
      return Promise.reject(new Error(`Consultation ${consultationId} not found`));
    }
    
    try {
      // In a real implementation, this would send data to the server
      console.log(`Syncing consultation ${consultationId} with server`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update sync status
      consultation.syncStatus = 'synced';
      this.offlineConsultations.set(consultationId, consultation);
      
      // Remove from sync queue
      const index = this.syncQueue.indexOf(consultationId);
      if (index !== -1) {
        this.syncQueue.splice(index, 1);
      }
      
      console.log(`Successfully synced consultation ${consultationId}`);
      return Promise.resolve();
    } catch (error) {
      console.error(`Failed to sync consultation ${consultationId}:`, error);
      
      // Update sync status with error
      consultation.syncStatus = 'failed';
      consultation.syncError = error instanceof Error ? error.message : 'Unknown error';
      this.offlineConsultations.set(consultationId, consultation);
      
      return Promise.reject(error);
    }
  }
  
  /**
   * Sync all pending consultations with the server
   */
  public async syncOfflineData(): Promise<void> {
    if (this.connectionStatus !== ConnectionStatus.ONLINE) {
      return Promise.reject(new Error('Cannot sync while offline'));
    }
    
    console.log(`Attempting to sync ${this.syncQueue.length} consultations`);
    
    const syncPromises = this.syncQueue.map(consultationId => 
      this.syncConsultation(consultationId)
        .catch(error => console.error(`Failed to sync consultation ${consultationId}:`, error))
    );
    
    try {
      await Promise.all(syncPromises);
      console.log('Completed sync process');
      return Promise.resolve();
    } catch (error) {
      console.error('Error during sync process:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Get all consultations that need syncing
   */
  public getPendingSyncConsultations(): OfflineConsultation[] {
    return this.syncQueue
      .map(id => this.offlineConsultations.get(id))
      .filter((consultation): consultation is OfflineConsultation => consultation !== undefined);
  }
  
  /**
   * Check if there are any pending syncs
   */
  public hasPendingSyncs(): boolean {
    return this.syncQueue.length > 0;
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();

/**
 * Hook to use the offline manager in React components
 */
export function useOfflineStatus() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    offlineManager.getConnectionStatus()
  );
  
  useEffect(() => {
    const handleStatusChange = (status: ConnectionStatus) => {
      setConnectionStatus(status);
    };
    
    offlineManager.addConnectionListener(handleStatusChange);
    
    return () => {
      offlineManager.removeConnectionListener(handleStatusChange);
    };
  }, []);
  
  return {
    isOnline: connectionStatus === ConnectionStatus.ONLINE,
    isOffline: connectionStatus === ConnectionStatus.OFFLINE,
    isReconnecting: connectionStatus === ConnectionStatus.RECONNECTING,
    connectionStatus,
    pendingSyncs: offlineManager.hasPendingSyncs(),
    syncData: () => offlineManager.syncOfflineData(),
  };
}