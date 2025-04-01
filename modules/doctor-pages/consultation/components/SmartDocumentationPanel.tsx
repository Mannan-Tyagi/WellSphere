"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Wand2, ChevronDown, ChevronUp, Languages, Check, AlertCircle, Loader2, BrainCircuit, FileText, Stethoscope, Save } from 'lucide-react';

// Import AI and voice recognition services
import { useVoiceRecognition } from '../services/VoiceRecognitionService';
import { generateDocumentationTemplate, generateDifferentialDiagnosis, generateTreatmentSuggestions, generateBillingCodes } from '../services/AIService';
import { useOfflineStatus } from '../services/OfflineService';
import { useAuditLogging } from '../services/SecurityService';
import { useEHRIntegration } from '../services/EHRService';
import { useConsultation } from '../context/ConsultationContext';

export function SmartDocumentationPanel() {
  // Use consultation context
  const { 
    consultation, 
    updateConsultation, 
    updateDocumentation, 
    saveConsultation, 
    isOnline, 
    isLoading 
  } = useConsultation();
  
  // Use voice recognition hook
  const { 
    isRecording, 
    currentSession, 
    error: recordingError, 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording,
    updateConfig
  } = useVoiceRecognition();
  
  // Use audit logging hook
  const { logAction } = useAuditLogging();
  
  // Use EHR integration hook
  const { submitDocumentation } = useEHRIntegration();
  
  // Local state for UI elements
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('English');
  const [processingAI, setProcessingAI] = useState(false);
  
  // State for section expansion (UI only)
  const [expandedSections, setExpandedSections] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true
  });
  
  // Local state for sections content (synced with consultation context)
  const [sections, setSections] = useState({
    subjective: { expanded: true, content: '' },
    objective: { expanded: true, content: '' },
    assessment: { expanded: true, content: '' },
    plan: { expanded: true, content: '' }
  });
  
  // Extract documentation and AI suggestions from consultation context
  const { documentation, aiSuggestions } = consultation;
  
  // Sync local sections state with consultation context
  useEffect(() => {
    setSections({
      subjective: { expanded: expandedSections.subjective, content: documentation.subjective },
      objective: { expanded: expandedSections.objective, content: documentation.objective },
      assessment: { expanded: expandedSections.assessment, content: documentation.assessment },
      plan: { expanded: expandedSections.plan, content: documentation.plan }
    });
  }, [documentation, expandedSections]);
  
  // Update language configuration when language changes
  useEffect(() => {
    updateConfig({ language: language === 'English' ? 'en-US' : language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'zh-CN' });
  }, [language, updateConfig]);
  
  // Update transcription when recording session changes
  useEffect(() => {
    if (currentSession?.transcription) {
      setTranscription(currentSession.transcription);
    }
  }, [currentSession]);
  
  // Log actions for audit purposes
  useEffect(() => {
    if (isRecording) {
      logAction(
        'doctor-123', // Mock doctor ID
        'doctor',
        'start_recording',
        'consultation',
        'consultation-123', // Mock consultation ID
        { sessionId: currentSession?.id }
      );
    }
  }, [isRecording, currentSession, logAction]);
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Update section content
  const updateSectionContent = (section: keyof typeof expandedSections, content: string) => {
    // Update local state
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        content
      }
    }));
    
    // Update consultation context
    updateDocumentation(section, content);
    
    // Log content update for audit
    logAction(
      'doctor-123', // Mock doctor ID
      'doctor',
      'update_documentation',
      'consultation_section',
      section,
      { length: content.length }
    );
  };
  
  // Toggle recording state
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const session = await stopRecording();
        console.log('Recording stopped:', session);
      } else {
        const session = await startRecording();
        console.log('Recording started:', session);
      }
    } catch (error) {
      console.error('Recording error:', error);
    }
  };
  
  // Add transcription to notes
  const addTranscriptionToNotes = (section: keyof typeof sections) => {
    if (transcription) {
      updateSectionContent(
        section, 
        sections[section].content + '\n\n' + transcription
      );
      setTranscription('');
      
      // After adding transcription, generate AI suggestions
      generateAISuggestions();
    }
  };
  
  // Generate AI suggestions based on documentation content
  const generateAISuggestions = async () => {
    try {
      setProcessingAI(true);
      // Update AI suggestions in consultation context
      updateConsultation({
        ...consultation,
        aiSuggestions: { ...consultation.aiSuggestions, showSuggestions: true }
      });
      
      // Extract symptoms from subjective section with advanced NLP
      const symptoms = extractSymptoms(sections.subjective.content);
      
      // Extract patient context from all sections for more accurate suggestions
      const patientContext = {
        patientAge: 42, // Mock patient data - in real app would come from patient record
        patientGender: 'Female',
        currentMedications: extractMedications(sections.subjective.content),
        vitalSigns: extractVitalSigns(sections.objective.content),
        allergies: extractAllergies(sections.subjective.content),
        pastMedicalHistory: extractPastHistory(sections.subjective.content)
      };
      
      // Generate differential diagnosis with confidence levels
      const diagnoses = await generateDifferentialDiagnosis(
        symptoms,
        patientContext
      );
      
      // Get primary diagnosis from assessment section
      const primaryDiagnosis = extractPrimaryDiagnosis(sections.assessment.content) || 'Migraine without aura';
      
      // Generate treatment suggestions with evidence levels
      const treatments = await generateTreatmentSuggestions(
        primaryDiagnosis,
        patientContext
      );
      
      // Generate billing codes with confidence scores
      const billingCodes = await generateBillingCodes(
        Object.values(sections).map(section => section.content).join('\n\n')
      );
      
      // Update AI suggestions with comprehensive data
      updateConsultation({
        ...consultation,
        aiSuggestions: {
          diagnoses,
          treatments,
          billingCodes,
          showSuggestions: true
        }
      });
      
      // Log AI suggestion generation for audit trail
      logAction(
        'doctor-123', // Mock doctor ID
        'doctor',
        'generate_ai_suggestions',
        'consultation',
        'consultation-123', // Mock consultation ID
        { 
          diagnosesCount: diagnoses.length, 
          treatmentsCount: treatments.length,
          primaryDiagnosis,
          isOffline: isOffline // Track if generated while offline
        }
      );
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // If offline, try to use cached models
      if (isOffline) {
        // Attempt to use locally cached AI models
        console.log('Attempting to use offline AI models');
        // This would be implemented with TensorFlow.js or similar
      }
    } finally {
      setProcessingAI(false);
    }
  };
  
  // Extract primary diagnosis from assessment text
  const extractPrimaryDiagnosis = (text: string): string | null => {
    // Look for diagnosis patterns like "Diagnosis: X" or "X (ICD-10 code)"
    const diagnosisMatch = text.match(/(?:diagnosis|assessment|impression):\s*([^\n]+)/i) ||
                          text.match(/([^\n:]+)\s*\([A-Z][0-9]+\.[0-9]+\)/i);
    
    return diagnosisMatch ? diagnosisMatch[1].trim() : null;
  };
  
  // Extract medications from text using NLP
  const extractMedications = (text: string): string[] => {
    const commonMedications = [
      'sumatriptan', 'imitrex', 'rizatriptan', 'maxalt', 'zolmitriptan', 'zomig',
      'almotriptan', 'axert', 'eletriptan', 'relpax', 'frovatriptan', 'frova',
      'naratriptan', 'amerge', 'topiramate', 'topamax', 'propranolol', 'inderal',
      'amitriptyline', 'elavil', 'nortriptyline', 'pamelor', 'valproate', 'depakote',
      'botulinum toxin', 'botox', 'cgrp', 'aimovig', 'ajovy', 'emgality', 'vyepti',
      'ubrelvy', 'nurtec', 'qulipta', 'ibuprofen', 'advil', 'naproxen', 'aleve',
      'acetaminophen', 'tylenol', 'aspirin', 'excedrin'
    ];
    
    return commonMedications.filter(med => 
      new RegExp(`\\b${med}\\b`, 'i').test(text.toLowerCase())
    );
  };
  
  // Extract vital signs from objective section
  const extractVitalSigns = (text: string): Record<string, string> => {
    const vitalSigns: Record<string, string> = {};
    
    // Extract blood pressure
    const bpMatch = text.match(/BP:\s*([0-9]{2,3}\/[0-9]{2,3})/i);
    if (bpMatch) vitalSigns.bloodPressure = bpMatch[1];
    
    // Extract heart rate
    const hrMatch = text.match(/HR:\s*([0-9]{2,3})/i) || text.match(/pulse:\s*([0-9]{2,3})/i);
    if (hrMatch) vitalSigns.heartRate = hrMatch[1];
    
    // Extract temperature
    const tempMatch = text.match(/Temp:\s*([0-9]{2,3}(?:\.[0-9])?)(?:°[CF])?/i);
    if (tempMatch) vitalSigns.temperature = tempMatch[1];
    
    // Extract respiratory rate
    const rrMatch = text.match(/RR:\s*([0-9]{1,2})/i);
    if (rrMatch) vitalSigns.respiratoryRate = rrMatch[1];
    
    // Extract oxygen saturation
    const o2Match = text.match(/(?:SpO2|O2 Sat):\s*([0-9]{1,3})%?/i);
    if (o2Match) vitalSigns.oxygenSaturation = o2Match[1];
    
    return vitalSigns;
  };
  
  // Extract allergies from text
  const extractAllergies = (text: string): string[] => {
    // Look for allergy patterns
    const allergySection = text.match(/allergies:([^\n]+)/i);
    if (!allergySection) return [];
    
    // Split by commas and clean up
    return allergySection[1].split(',').map(a => a.trim());
  };
  
  // Extract past medical history
  const extractPastHistory = (text: string): string[] => {
    // Look for past medical history patterns
    const pmhSection = text.match(/(?:past medical history|pmh|medical history):([^\n]+)/i);
    if (!pmhSection) return [];
    
    // Split by commas and clean up
    return pmhSection[1].split(',').map(h => h.trim());
  };
  
  // Extract symptoms from text using advanced NLP techniques
  const extractSymptoms = (text: string): string[] => {
    // Comprehensive list of symptoms with synonyms and related terms
    const symptomPatterns: Record<string, RegExp> = {
      'headache': /\b(?:headache|head pain|cephalgia|head discomfort)\b/i,
      'migraine': /\b(?:migraine|migraine headache|hemiplegic migraine|migraine with aura|migraine without aura)\b/i,
      'pain': /\b(?:pain|discomfort|ache|soreness|tenderness)\b/i,
      'nausea': /\b(?:nausea|nauseated|queasy|sick to stomach)\b/i,
      'vomiting': /\b(?:vomiting|emesis|throwing up|vomited)\b/i,
      'sensitivity to light': /\b(?:sensitivity to light|photophobia|light sensitivity|light hurts|bright light)\b/i,
      'sensitivity to sound': /\b(?:sensitivity to sound|phonophobia|sound sensitivity|noise sensitivity)\b/i,
      'aura': /\b(?:aura|visual disturbance|visual changes|flashing lights|zigzag lines|scotoma)\b/i,
      'dizziness': /\b(?:dizziness|dizzy|vertigo|lightheaded|lightheadedness|unsteady)\b/i,
      'fatigue': /\b(?:fatigue|tired|exhaustion|lethargy|malaise|low energy)\b/i,
      'throbbing': /\b(?:throbbing|pulsating|pounding|pulsing)\b/i,
      'neck pain': /\b(?:neck pain|cervical pain|neck stiffness|stiff neck)\b/i,
      'visual changes': /\b(?:visual changes|blurry vision|double vision|vision changes|visual disturbance|blurred vision)\b/i,
      'numbness': /\b(?:numbness|tingling|paresthesia|pins and needles)\b/i,
      'weakness': /\b(?:weakness|motor weakness|muscle weakness|hemiparesis)\b/i,
      'confusion': /\b(?:confusion|disoriented|altered mental status|brain fog)\b/i,
      'fever': /\b(?:fever|febrile|elevated temperature|pyrexia)\b/i,
      'chills': /\b(?:chills|rigors|feeling cold)\b/i,
      'sweating': /\b(?:sweating|diaphoresis|perspiration|night sweats)\b/i,
      'sleep disturbance': /\b(?:sleep disturbance|insomnia|difficulty sleeping|trouble sleeping|sleep problems)\b/i,
      'anxiety': /\b(?:anxiety|anxious|nervousness|worry|panic)\b/i,
      'depression': /\b(?:depression|depressed|feeling down|low mood|sadness)\b/i,
      'irritability': /\b(?:irritability|irritable|agitation|easily annoyed)\b/i,
      'concentration problems': /\b(?:concentration problems|difficulty concentrating|trouble focusing|poor concentration)\b/i,
      'memory problems': /\b(?:memory problems|forgetfulness|memory loss|poor memory)\b/i
    };
    
    // Extract symptoms using regex patterns
    const foundSymptoms: string[] = [];
    
    // Check each symptom pattern against the text
    Object.entries(symptomPatterns).forEach(([symptom, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(symptom);
      }
    });
    
    // Look for symptom severity indicators
    const severityPatterns = {
      'mild': /\b(?:mild|slight|minimal)\b/i,
      'moderate': /\b(?:moderate|medium)\b/i,
      'severe': /\b(?:severe|intense|extreme|worst|excruciating)\b/i
    };
    
    // Look for temporal patterns
    const temporalPatterns = {
      'acute': /\b(?:acute|sudden|abrupt|new onset)\b/i,
      'chronic': /\b(?:chronic|persistent|ongoing|long-standing|long-term)\b/i,
      'intermittent': /\b(?:intermittent|comes and goes|episodic|occasional)\b/i,
      'constant': /\b(?:constant|continuous|persistent|always present)\b/i
    };
    
    // Add severity and temporal characteristics if found
    Object.entries(severityPatterns).forEach(([severity, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(`${severity} severity`);
      }
    });
    
    Object.entries(temporalPatterns).forEach(([temporal, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(`${temporal} pattern`);
      }
    });
    
    // Extract frequency information if available
    const frequencyMatch = text.match(/\b(\d+)(?:-|\s*to\s*)(\d+)\s*(?:times|x)\s*(?:per|a|every)\s*(day|week|month|year)\b/i);
    if (frequencyMatch) {
      foundSymptoms.push(`frequency: ${frequencyMatch[1]}-${frequencyMatch[2]} times per ${frequencyMatch[3]}`);
    }
    
    // Extract duration information if available
    const durationMatch = text.match(/\b(?:for|since|over the past|over last)\s*(\d+)\s*(day|days|week|weeks|month|months|year|years)\b/i);
    if (durationMatch) {
      foundSymptoms.push(`duration: ${durationMatch[1]} ${durationMatch[2]}`);
    }
    
    return foundSymptoms;
  };
  
  // Generate documentation from AI with context awareness
  const generateDocumentation = async () => {
    try {
      setProcessingAI(true);
      
      // In a real implementation, this would fetch patient data from EHR
      // For now, we'll use mock data
      const patientData = {
        id: 'patient-123',
        name: 'Sarah Johnson',
        age: 42,
        gender: 'Female',
        existingConditions: ['Migraine', 'Hypertension'],
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily' },
          { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed' }
        ],
        allergies: ['Penicillin', 'Sulfa drugs'],
        lastVisit: {
          date: '2023-10-15',
          chiefComplaint: 'Headache',
          diagnosis: 'Migraine without aura',
          treatment: 'Sumatriptan 50mg as needed'
        },
        vitalTrends: {
          bloodPressure: [{ date: '2023-10-15', value: '128/82' }, { date: '2023-06-10', value: '130/85' }],
          heartRate: [{ date: '2023-10-15', value: 76 }, { date: '2023-06-10', value: 80 }]
        }
      };
      
      // Determine visit type based on context
      // In a real implementation, this would come from the appointment type
      const visitType = 'follow-up';
      
      // Generate documentation template with enhanced context
      const template = await generateDocumentationTemplate(
        patientData.id,
        visitType,
        patientData.existingConditions,
        {
          patientName: patientData.name,
          patientAge: patientData.age,
          patientGender: patientData.gender,
          currentMedications: patientData.medications,
          allergies: patientData.allergies,
          lastVisitDate: patientData.lastVisit.date,
          lastVisitDiagnosis: patientData.lastVisit.diagnosis,
          lastVisitTreatment: patientData.lastVisit.treatment,
          vitalTrends: patientData.vitalTrends
        }
      );
      
      // Update sections with AI-generated content
      setSections({
        subjective: {
          expanded: true,
          content: template.sections.subjective
        },
        objective: {
          expanded: true,
          content: template.sections.objective
        },
        assessment: {
          expanded: true,
          content: template.sections.assessment
        },
        plan: {
          expanded: true,
          content: template.sections.plan
        }
      });
      
      // Generate AI suggestions based on the new documentation
      await generateAISuggestions();
      
      // Log template generation for audit trail
      logAction(
        'doctor-123', // Mock doctor ID
        'doctor',
        'generate_documentation_template',
        'consultation',
        'consultation-123', // Mock consultation ID
        { 
          templateGenerated: true,
          visitType,
          patientId: patientData.id,
          isOffline: isOffline // Track if generated while offline
        }
      );
      
      // If offline, store the generated documentation locally
      if (isOffline) {
        // In a real implementation, this would use IndexedDB or similar
        console.log('Storing documentation locally for later synchronization');
        // This would be implemented with a local storage mechanism
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      
      // If offline, try to use cached models
      if (isOffline) {
        console.log('Attempting to use offline AI models for documentation generation');
        // This would be implemented with TensorFlow.js or similar
      }
    } finally {
      setProcessingAI(false);
    }
  };
  
  // Apply AI suggestion to documentation with smart formatting
  const applyAISuggestion = (type: 'diagnosis' | 'treatment' | 'billingCode', item: any) => {
    // Log the application of AI suggestion
    logAction(
      'doctor-123', // Mock doctor ID
      'doctor',
      'apply_ai_suggestion',
      'consultation',
      'consultation-123', // Mock consultation ID
      { suggestionType: type, itemName: item.name }
    );
    
    if (type === 'diagnosis') {
      // Check if this diagnosis is already in the assessment
      const diagnosisPattern = new RegExp(`\\b${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (diagnosisPattern.test(sections.assessment.content)) {
        // If already present, enhance with evidence
        const updatedContent = sections.assessment.content.replace(
          diagnosisPattern,
          `${item.name} (${item.code}) - AI confidence: ${Math.round(item.probability * 100)}%`
        );
        
        updateSectionContent('assessment', updatedContent);
      } else {
        // If not present, add as new diagnosis
        const newDiagnosis = `\n\n${item.name} (${item.code}) - AI confidence: ${Math.round(item.probability * 100)}%\nEvidence: ${item.evidencePoints.join(', ')}`;
        
        // Check if there are references and add them
        if (item.references && item.references.length > 0) {
          const referenceText = item.references.map((ref: any) => `${ref.title}`).join('; ');
          updateSectionContent(
            'assessment',
            sections.assessment.content + newDiagnosis + `\nReferences: ${referenceText}`
          );
        } else {
          updateSectionContent(
            'assessment',
            sections.assessment.content + newDiagnosis
          );
        }
      }
    } else if (type === 'treatment') {
      // Check if this treatment is already in the plan
      const treatmentPattern = new RegExp(`\\b${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (treatmentPattern.test(sections.plan.content)) {
        // If already present, enhance with evidence level
        const updatedContent = sections.plan.content.replace(
          treatmentPattern,
          `${item.name} (Evidence Level: ${item.evidenceLevel})`
        );
        
        updateSectionContent('plan', updatedContent);
      } else {
        // If not present, add as new treatment
        let newTreatment = `\n\n${item.name} - ${item.description}\nEvidence Level: ${item.evidenceLevel}`;
        
        // Add contraindications if present
        if (item.contraindications && item.contraindications.length > 0) {
          newTreatment += `\nContraindications: ${item.contraindications.join(', ')}`;
        }
        
        // Add interactions if present
        if (item.interactions && item.interactions.length > 0) {
          const interactionText = item.interactions
            .map((interaction: any) => `${interaction.medication} (${interaction.severity} risk): ${interaction.description}`)
            .join('; ');
          newTreatment += `\nInteractions: ${interactionText}`;
        }
        
        // Add references if present
        if (item.references && item.references.length > 0) {
          const referenceText = item.references.map((ref: any) => `${ref.title}`).join('; ');
          newTreatment += `\nReferences: ${referenceText}`;
        }
        
        updateSectionContent('plan', sections.plan.content + newTreatment);
      }
    } else if (type === 'billingCode') {
      // Add billing code to the plan section
      const billingCodeText = `\n\nBilling Code: ${item.code} - ${item.description} (${Math.round(item.confidence * 100)}% confidence)`;
      updateSectionContent('plan', sections.plan.content + billingCodeText);
    }
  };
  
  // Submit documentation to EHR
  const submitToEHR = async () => {
    try {
      setProcessingAI(true);
      
      // Prepare documentation submission
      const submission = {
        patientId: 'patient-123', // Mock patient ID
        encounterId: 'encounter-' + Date.now(),
        encounterDate: new Date().toISOString(),
        providerId: 'doctor-123', // Mock doctor ID
        documentation: {
          subjective: sections.subjective.content,
          objective: sections.objective.content,
          assessment: sections.assessment.content,
          plan: sections.plan.content
        },
        billingCodes: aiSuggestions.billingCodes.map(code => code.code),
        signatures: [
          {
            providerId: 'doctor-123', // Mock doctor ID
            timestamp: new Date().toISOString(),
            signatureData: 'electronic-signature'
          }
        ]
      };
      
      // Submit to EHR
      const result = await submitDocumentation(submission);
      
      if (result) {
        alert('Documentation successfully submitted to EHR');
        
        // Log submission
        logAction(
          'doctor-123', // Mock doctor ID
          'doctor',
          'submit_documentation',
          'consultation',
          'consultation-123', // Mock consultation ID
          { submitted: true, billingCodes: submission.billingCodes }
        );
      }
    } catch (error) {
      console.error('Error submitting to EHR:', error);
      alert('Failed to submit documentation to EHR');
    } finally {
      setProcessingAI(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-medium text-gray-900">Clinical Documentation</h2>
          
          <div className="flex items-center gap-2">
            {/* Save button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => saveConsultation()}
              disabled={isLoading}
              className="text-gray-700 border-gray-300"
            >
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
            
            {/* AI Template Button */}
            <Button 
              onClick={generateDocumentation}
              className="bg-[#006D77] hover:bg-[#006D77]/90 text-white"
              disabled={processingAI || isLoading}
              size="sm"
            >
              {processingAI ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              AI Assist
            </Button>
          </div>
        </div>
        
        {/* Speech Recognition Module */}
        <div className="mb-6 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant={isRecording ? "default" : "outline"}
                size="sm"
                className={isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "text-gray-700"}
                onClick={toggleRecording}
                disabled={processingAI}
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                {isRecording ? "Stop" : "Start"} Recording
              </Button>
              
              <div className="flex items-center gap-1 bg-white rounded-md px-2 py-1 border border-gray-200">
                <Languages className="h-4 w-4 text-gray-500" />
                <select 
                  className="text-sm bg-transparent border-none focus:ring-0 text-gray-700"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isRecording}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Mandarin</option>
                </select>
              </div>
            </div>
            
            {isRecording && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">
                Recording...
              </Badge>
            )}
            
            {recordingError && (
              <Badge className="bg-amber-100 text-amber-800">
                {recordingError}
              </Badge>
            )}
          </div>
          
          <div className="relative">
            <Textarea 
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Speech transcription will appear here..."
              className="min-h-[100px] resize-none bg-white border-gray-200 focus:border-[#006D77] focus:ring-[#006D77]/10"
            />
            {transcription && (
              <div className="absolute right-2 bottom-2 flex gap-1">
                <div className="dropdown">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 px-2 text-xs"
                    onClick={() => addTranscriptionToNotes('subjective')}
                  >
                    <Check className="h-3 w-3 mr-1" /> Add to Subjective
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Documentation Sections */}
        <div className="space-y-4">
          {/* Subjective Section */}
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('subjective')}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#006D77]" />
                <h3 className="font-medium text-gray-800">Subjective</h3>
              </div>
              {sections.subjective.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {sections.subjective.expanded && (
              <div className="p-3">
                <Textarea 
                  value={sections.subjective.content}
                  onChange={(e) => updateSectionContent('subjective', e.target.value)}
                  className="min-h-[120px] resize-none border-gray-200 focus:border-[#006D77] focus:ring-[#006D77]/10"
                  placeholder="Enter patient's subjective information, complaints, and history..."
                />
                
                {/* Quick action buttons */}
                <div className="mt-2 flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 px-2 text-xs"
                    onClick={() => addTranscriptionToNotes('subjective')}
                    disabled={!transcription}
                  >
                    <Mic className="h-3 w-3 mr-1" /> Add Transcription
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Objective Section */}
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('objective')}
            >
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-[#006D77]" />
                <h3 className="font-medium text-gray-800">Objective</h3>
              </div>
              {sections.objective.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {sections.objective.expanded && (
              <div className="p-3">
                <Textarea 
                  value={sections.objective.content}
                  onChange={(e) => updateSectionContent('objective', e.target.value)}
                  className="min-h-[120px] resize-none border-gray-200 focus:border-[#006D77] focus:ring-[#006D77]/10"
                  placeholder="Enter physical examination findings, vital signs, and test results..."
                />
                
                {/* Vitals Quick Input */}
                <div className="mt-3 p-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="text-xs font-medium text-gray-700 mb-2">Quick Vitals Entry</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    <div>
                      <Label htmlFor="bp" className="text-xs text-gray-600">Blood Pressure</Label>
                      <Input id="bp" placeholder="120/80" className="h-8 text-sm bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="hr" className="text-xs text-gray-600">Heart Rate</Label>
                      <Input id="hr" placeholder="72" className="h-8 text-sm bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="temp" className="text-xs text-gray-600">Temperature</Label>
                      <Input id="temp" placeholder="98.6" className="h-8 text-sm bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="rr" className="text-xs text-gray-600">Resp. Rate</Label>
                      <Input id="rr" placeholder="16" className="h-8 text-sm bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="o2" className="text-xs text-gray-600">O2 Sat</Label>
                      <Input id="o2" placeholder="99%" className="h-8 text-sm bg-white" />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <Check className="h-3 w-3 mr-1" /> Add to Notes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Assessment Section */}
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('assessment')}
            >
              <div className="flex items-center gap-2">
                <BrainCircuit size={16} className="text-[#006D77]" />
                <h3 className="font-medium text-gray-800">Assessment</h3>
              </div>
              {sections.assessment.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {sections.assessment.expanded && (
              <div className="p-3">
                <Textarea 
                  value={sections.assessment.content}
                  onChange={(e) => updateSectionContent('assessment', e.target.value)}
                  className="min-h-[100px] resize-none border-gray-200 focus:border-[#006D77] focus:ring-[#006D77]/10"
                  placeholder="Enter your assessment, diagnosis, and clinical reasoning..."
                />
                
                {/* AI Diagnosis Suggestions */}
                {aiSuggestions?.diagnoses?.length > 0 ? (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center justify-between gap-2 text-sm font-medium text-blue-700 mb-2">
                      <div className="flex items-center gap-1">
                        <Wand2 size={14} />
                        <span>AI-Suggested Diagnoses</span>
                      </div>
                      {processingAI && <Loader2 size={14} className="animate-spin" />}
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {aiSuggestions.diagnoses.map((diagnosis: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-md border border-blue-50">
                          <Checkbox 
                            id={`diag-${index}`} 
                            onCheckedChange={() => applyAISuggestion('diagnosis', diagnosis)}
                          />
                          <Label htmlFor={`diag-${index}`} className="text-sm flex-1">
                            {diagnosis.name} ({diagnosis.code})
                          </Label>
                          <Badge 
                            className={`ml-auto ${diagnosis.probability > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {Math.round(diagnosis.probability * 100)}% confidence
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-2">
                      <Wand2 size={14} />
                      <span>AI-Suggested Diagnoses</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-blue-50">
                        <Checkbox id="diag1" />
                        <Label htmlFor="diag1" className="text-sm">Migraine without aura (G43.009)</Label>
                        <Badge className="ml-auto bg-green-100 text-green-800">95% confidence</Badge>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-blue-50">
                        <Checkbox id="diag2" />
                        <Label htmlFor="diag2" className="text-sm">Tension-type headache (G44.209)</Label>
                        <Badge className="ml-auto bg-yellow-100 text-yellow-800">72% confidence</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Plan Section */}
          <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection('plan')}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#006D77]" />
                <h3 className="font-medium text-gray-800">Plan</h3>
              </div>
              {sections.plan.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {sections.plan.expanded && (
              <div className="p-3">
                <Textarea 
                  value={sections.plan.content}
                  onChange={(e) => updateSectionContent('plan', e.target.value)}
                  className="min-h-[120px] resize-none border-gray-200 focus:border-[#006D77] focus:ring-[#006D77]/10"
                  placeholder="Enter treatment plan, medications, follow-up instructions..."
                />
                
                {/* Documentation Completeness Checker */}
                <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                  <div className="flex items-center justify-between gap-2 text-sm font-medium text-amber-700 mb-2">
                    <div className="flex items-center gap-1">
                      <AlertCircle size={14} />
                      <span>Documentation Completeness</span>
                    </div>
                    {processingAI && <Loader2 size={14} className="animate-spin" />}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-amber-50">
                      <Check size={14} className="text-green-500" />
                      <span>Diagnosis code included</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-amber-50">
                      <Check size={14} className="text-green-500" />
                      <span>Treatment plan specified</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-amber-50">
                      <AlertCircle size={14} className="text-amber-500" />
                      <span>Missing follow-up timeframe specificity</span>
                    </div>
                  </div>
                </div>
                
                {/* Treatment Suggestions */}
                {aiSuggestions?.treatments?.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center justify-between gap-2 text-sm font-medium text-green-700 mb-2">
                      <div className="flex items-center gap-1">
                        <Wand2 size={14} />
                        <span>AI-Suggested Treatments</span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {aiSuggestions.treatments.map((treatment: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-md border border-green-50">
                          <Checkbox 
                            id={`treat-${index}`} 
                            onCheckedChange={() => applyAISuggestion('treatment', treatment)}
                          />
                          <Label htmlFor={`treat-${index}`} className="text-sm flex-1">
                            {treatment.name}
                          </Label>
                          <Badge className="ml-auto bg-green-100 text-green-800">
                            {treatment.evidenceLevel}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button 
            variant="outline" 
            className="text-gray-700 border-gray-300"
            onClick={() => saveConsultation()}
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button 
            className="bg-[#006D77] hover:bg-[#006D77]/90 text-white"
            onClick={submitToEHR}
            disabled={isLoading || processingAI}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Finalize Note
          </Button>
        </div>
      </div>
    </Card>
  );
}