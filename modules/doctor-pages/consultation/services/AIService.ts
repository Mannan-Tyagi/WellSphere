/**
 * AIService.ts
 * This service handles all AI-related functionality for the Clinical Consultation module
 * including voice recognition, documentation generation, clinical decision support, and EHR integration.
 * 
 * Features:
 * - Smart Documentation Workflow: AI-powered documentation generation with context-aware templates
 * - Voice Recognition: Medical terminology recognition with speaker differentiation
 * - Clinical Decision Support: Evidence-based diagnosis and treatment suggestions
 * - EHR Integration: Seamless data exchange with electronic health record systems
 * - Offline Capabilities: Core functionality available without internet connection
 * - Real-time Analysis: Continuous analysis of consultation data for insights
 */

// Types for AI service responses
export interface AITranscriptionResponse {
  text: string;
  confidence: number;
  speakerType: 'doctor' | 'patient' | 'unknown';
  language: string;
}

export interface AIDiagnosisSuggestion {
  name: string;
  code: string; // ICD-10 code
  probability: number;
  evidencePoints: string[];
  references?: {
    title: string;
    url: string;
  }[];
}

export interface AITreatmentSuggestion {
  name: string;
  type: 'medication' | 'procedure' | 'lifestyle' | 'followup';
  description: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  contraindications?: string[];
  interactions?: {
    medication: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  references?: {
    title: string;
    url: string;
  }[];
}

export interface AIDocumentationTemplate {
  sections: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  suggestedBillingCodes: {
    code: string;
    description: string;
    confidence: number;
  }[];
}

// Mock implementation of AI service functions
// In a real implementation, these would call external AI services or APIs

/**
 * Transcribes audio to text with medical terminology recognition
 */
export async function transcribeAudio(audioBlob: Blob): Promise<AITranscriptionResponse> {
  // Mock implementation - in production would call a medical-specific speech-to-text API
  console.log('Transcribing audio of size:', audioBlob.size);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    text: 'Patient reports persistent headaches occurring 3-4 times per week for the past month.',
    confidence: 0.92,
    speakerType: 'patient',
    language: 'English'
  };
}

/**
 * Generates documentation template based on patient history and visit type
 */
export async function generateDocumentationTemplate(
  patientId: string,
  visitType: string,
  existingConditions: string[],
  patientContext?: any
): Promise<AIDocumentationTemplate> {
  // Mock implementation - would call an AI service with patient context
  console.log(`Generating template for patient ${patientId}, visit type: ${visitType}`);
  
  // Check if we're offline and have cached models
  const isOffline = !navigator.onLine;
  if (isOffline) {
    console.log('Using offline AI model for documentation generation');
    // In a real implementation, this would use TensorFlow.js or a similar library
    // to run a smaller, locally cached model
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate more personalized content if patient context is provided
  let subjectiveContent = 'Patient reports persistent headaches occurring 3-4 times per week for the past month.';
  let objectiveContent = 'BP: 128/82, HR: 76, RR: 16, Temp: 98.6°F, SpO2: 99%\nGeneral: Alert and oriented x3';
  let assessmentContent = 'Migraine without aura (G43.009)';
  let planContent = '1. Start Sumatriptan 50mg at onset of headache\n2. Lifestyle modifications';
  
  if (patientContext) {
    // Use patient context to generate more personalized documentation
    const { patientName, patientAge, patientGender, currentMedications, allergies, lastVisitDate, lastVisitDiagnosis } = patientContext;
    
    // Enhanced subjective section with patient context
    subjectiveContent = `${patientName}, a ${patientAge}-year-old ${patientGender}, presents for ${visitType} visit regarding headaches. `;
    subjectiveContent += `Patient reports persistent headaches occurring 3-4 times per week for the past month. `;
    
    if (lastVisitDate && lastVisitDiagnosis) {
      subjectiveContent += `At last visit on ${lastVisitDate}, patient was diagnosed with ${lastVisitDiagnosis}. `;
    }
    
    if (currentMedications && currentMedications.length > 0) {
      const medicationList = currentMedications.map((med: any) => `${med.name} ${med.dosage} ${med.frequency}`).join(', ');
      subjectiveContent += `\n\nCurrent medications: ${medicationList}. `;
    }
    
    if (allergies && allergies.length > 0) {
      subjectiveContent += `\n\nAllergies: ${allergies.join(', ')}. `;
    }
    
    // Enhanced assessment with existing conditions
    if (existingConditions && existingConditions.length > 0) {
      assessmentContent = `Primary: Migraine without aura (G43.009)\n\nOther active conditions: ${existingConditions.join(', ')}`;
    }
    
    // Enhanced plan with more detailed recommendations
    planContent = `1. Start Sumatriptan 50mg at onset of headache, may repeat after 2 hours if needed, not to exceed 200mg/day\n`;
    planContent += `2. Lifestyle modifications: regular sleep schedule, stress reduction techniques, identify and avoid triggers\n`;
    planContent += `3. Maintain headache diary\n`;
    planContent += `4. Follow-up in 4 weeks to assess response to treatment\n`;
    planContent += `5. If symptoms worsen or change in character, return sooner`;
  }
  
  return {
    sections: {
      subjective: subjectiveContent,
      objective: objectiveContent,
      assessment: assessmentContent,
      plan: planContent
    },
    suggestedBillingCodes: [
      { code: '99214', description: 'Office/outpatient visit, established patient, moderate complexity', confidence: 0.85 },
      { code: '99213', description: 'Office/outpatient visit, established patient, low complexity', confidence: 0.65 }
    ]
  };
}

/**
 * Generates differential diagnosis suggestions based on patient data
 */
export async function generateDifferentialDiagnosis(
  symptoms: string[],
  patientData: any
): Promise<AIDiagnosisSuggestion[]> {
  // Mock implementation - would call a clinical decision support AI
  console.log('Generating differential diagnosis for symptoms:', symptoms);
  
  // Check if we're offline and have cached models
  const isOffline = !navigator.onLine;
  if (isOffline) {
    console.log('Using offline AI model for differential diagnosis');
    // In a real implementation, this would use TensorFlow.js or a similar library
    // to run a smaller, locally cached model
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Enhanced differential diagnosis with more evidence-based suggestions
  // and tailored to patient context
  const diagnoses: AIDiagnosisSuggestion[] = [
    {
      name: 'Migraine without aura',
      code: 'G43.009',
      probability: 0.85,
      evidencePoints: [
        'Recurring headaches 3-4 times per week',
        'Throbbing pain quality',
        'Associated photophobia',
        'Nausea during episodes'
      ],
      references: [
        {
          title: 'International Classification of Headache Disorders, 3rd edition',
          url: 'https://ichd-3.org/'
        },
        {
          title: 'American Headache Society Guidelines (2021)',
          url: 'https://americanheadachesociety.org/guidelines/'
        }
      ]
    },
    {
      name: 'Tension-type headache',
      code: 'G44.209',
      probability: 0.65,
      evidencePoints: [
        'Bilateral location',
        'Pressing quality',
        'Mild to moderate intensity'
      ],
      references: [
        {
          title: 'International Classification of Headache Disorders, 3rd edition',
          url: 'https://ichd-3.org/'
        }
      ]
    },
    {
      name: 'Medication overuse headache',
      code: 'G44.41',
      probability: 0.40,
      evidencePoints: [
        'Regular use of pain medication',
        'Increased headache frequency'
      ],
      references: [
        {
          title: 'Medication-Overuse Headache: Clinical Features, Pathophysiology, and Management',
          url: 'https://pubmed.ncbi.nlm.nih.gov/'
        }
      ]
    }
  ];
  
  // Add more specific diagnoses based on symptoms
  if (symptoms.includes('aura') || symptoms.includes('visual changes')) {
    diagnoses.push({
      name: 'Migraine with aura',
      code: 'G43.109',
      probability: 0.72,
      evidencePoints: [
        'Visual disturbances preceding headache',
        'Throbbing pain quality',
        'Associated photophobia',
        'Nausea during episodes'
      ],
      references: [
        {
          title: 'International Classification of Headache Disorders, 3rd edition',
          url: 'https://ichd-3.org/'
        }
      ]
    });
  }
  
  if (symptoms.includes('neck pain') || symptoms.includes('stiff neck')) {
    diagnoses.push({
      name: 'Cervicogenic headache',
      code: 'G44.841',
      probability: 0.55,
      evidencePoints: [
        'Pain originating from neck',
        'Reduced neck mobility',
        'Unilateral pain without side shift'
      ],
      references: [
        {
          title: 'Cervicogenic Headache: A Review of Diagnostic and Treatment Strategies',
          url: 'https://pubmed.ncbi.nlm.nih.gov/'
        }
      ]
    });
  }
  
  // Consider patient context for more personalized diagnoses
  if (patientData) {
    // Check age for age-specific conditions
    if (patientData.patientAge > 50) {
      diagnoses.push({
        name: 'Giant cell arteritis',
        code: 'M31.6',
        probability: 0.25,
        evidencePoints: [
          'Age > 50 years',
          'New-onset headache',
          'Potential vision changes'
        ],
        references: [
          {
            title: 'Giant Cell Arteritis: Diagnosis and Management',
            url: 'https://pubmed.ncbi.nlm.nih.gov/'
          }
        ]
      });
    }
    
    // Check for hypertension
    if (patientData.vitalSigns && patientData.vitalSigns.bloodPressure) {
      const bp = patientData.vitalSigns.bloodPressure;
      const systolic = parseInt(bp.split('/')[0]);
      if (systolic > 140) {
        diagnoses.push({
          name: 'Hypertensive headache',
          code: 'R51',
          probability: 0.30,
          evidencePoints: [
            `Elevated blood pressure (${bp})`,
            'Bilateral throbbing headache',
            'Worse with exertion'
          ],
          references: [
            {
              title: 'Secondary Headaches Attributed to Arterial Hypertension',
              url: 'https://pubmed.ncbi.nlm.nih.gov/'
            }
          ]
        });
      }
    }
  }
  
  // Sort by probability
  return diagnoses.sort((a, b) => b.probability - a.probability);
}

/**
 * Generates treatment suggestions based on diagnosis
 */
export async function generateTreatmentSuggestions(
  diagnosis: string,
  patientData: any
): Promise<AITreatmentSuggestion[]> {
  // Mock implementation - would call a treatment recommendation AI
  console.log('Generating treatment suggestions for diagnosis:', diagnosis);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      name: 'Sumatriptan',
      type: 'medication',
      description: '50mg at onset of headache, may repeat after 2 hours if needed, not to exceed 200mg/day',
      evidenceLevel: 'A',
      contraindications: [
        'Ischemic heart disease',
        'Cerebrovascular disease',
        'Uncontrolled hypertension'
      ],
      interactions: [
        {
          medication: 'MAO inhibitors',
          severity: 'high',
          description: 'Concurrent use contraindicated'
        }
      ],
      references: [
        {
          title: 'American Headache Society Guidelines (2021)',
          url: 'https://americanheadachesociety.org/guidelines/'
        }
      ]
    },
    {
      name: 'Lifestyle modifications',
      type: 'lifestyle',
      description: 'Regular sleep schedule, stress reduction techniques, identify and avoid triggers',
      evidenceLevel: 'B'
    },
    {
      name: 'Headache diary',
      type: 'followup',
      description: 'Maintain headache diary to track frequency, severity, and potential triggers',
      evidenceLevel: 'B'
    }
  ];
}

/**
 * Generates billing codes based on documentation content
 */
export async function generateBillingCodes(
  documentationText: string
): Promise<{code: string, description: string, confidence: number}[]> {
  // Mock implementation - would call a medical coding AI
  console.log('Generating billing codes based on documentation');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { code: '99214', description: 'Office/outpatient visit, established patient, moderate complexity', confidence: 0.85 },
    { code: '99213', description: 'Office/outpatient visit, established patient, low complexity', confidence: 0.65 }
  ];
}

/**
 * Checks for drug interactions in proposed treatment plan
 */
export async function checkDrugInteractions(
  medications: string[],
  patientCurrentMedications: string[]
): Promise<{severity: 'high' | 'medium' | 'low', description: string}[]> {
  // Mock implementation - would call a drug interaction API
  console.log('Checking drug interactions for medications:', medications);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      severity: 'medium',
      description: 'Potential interaction between Sumatriptan and Sertraline may increase risk of serotonin syndrome'
    }
  ];
}

/**
 * Generates patient education materials based on diagnosis and treatment
 */
export async function generatePatientEducation(
  diagnosis: string,
  treatment: string
): Promise<{title: string, content: string, url?: string}[]> {
  // Mock implementation - would call a content generation AI
  console.log('Generating patient education for diagnosis:', diagnosis);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      title: 'Understanding Migraines',
      content: 'Migraines are severe headaches that can cause throbbing pain, nausea, and sensitivity to light and sound...',
      url: 'https://wellsphere.com/patient-education/migraines'
    },
    {
      title: 'Sumatriptan: Usage and Side Effects',
      content: 'Sumatriptan is a medication used to treat migraine headaches. It works by narrowing blood vessels around the brain...',
      url: 'https://wellsphere.com/patient-education/sumatriptan'
    }
  ];
}

/**
 * Performs real-time analysis of ongoing consultation
 */
export async function analyzeConsultationInRealTime(
  transcription: string,
  patientContext?: any,
  timeElapsed?: number
): Promise<AIRealTimeAnalysis> {
  console.log('Analyzing consultation in real-time');
  
  // Check if we're offline and have cached models
  const isOffline = !navigator.onLine;
  if (isOffline) {
    console.log('Using offline AI model for real-time analysis');
    // In a real implementation, this would use TensorFlow.js or a similar library
  }
  
  // Simulate API call delay (shorter for real-time analysis)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Extract key phrases and medical terms from transcription
  const keyPhrases = extractKeyPhrases(transcription);
  const medicalTerms = extractMedicalTerms(transcription);
  
  // Generate suggested follow-up questions based on context
  const suggestedQuestions = generateSuggestedQuestions(transcription, patientContext);
  
  // Identify potential concerns that might need immediate attention
  const potentialConcerns = identifyPotentialConcerns(transcription, medicalTerms, patientContext);
  
  return {
    keyPhrases,
    medicalTerms,
    suggestedQuestions,
    potentialConcerns,
    timeElapsed: timeElapsed || 0
  };
}

/**
 * Provides context-aware suggestions during consultation
 */
export async function getContextAwareSuggestions(
  transcription: string,
  patientContext: any,
  currentSection: 'subjective' | 'objective' | 'assessment' | 'plan'
): Promise<AIContextAwareSuggestion[]> {
  console.log(`Getting context-aware suggestions for ${currentSection} section`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const suggestions: AIContextAwareSuggestion[] = [];
  const timestamp = Date.now();
  
  // Generate different suggestions based on the current documentation section
  switch (currentSection) {
    case 'subjective':
      suggestions.push({
        type: 'question',
        text: 'Consider asking about sleep patterns and their relation to headache frequency',
        confidence: 0.87,
        reasoning: 'Sleep disturbances are common triggers for migraines',
        source: 'Clinical Practice Guidelines for Headache Management',
        timestamp
      });
      break;
    case 'objective':
      suggestions.push({
        type: 'documentation',
        text: 'Document neurological examination findings including cranial nerve assessment',
        confidence: 0.92,
        reasoning: 'Complete neurological examination is recommended for all headache evaluations',
        source: 'American Academy of Neurology Guidelines',
        timestamp
      });
      break;
    case 'assessment':
      suggestions.push({
        type: 'diagnosis',
        text: 'Consider chronic migraine if headaches occur ≥15 days/month for >3 months',
        confidence: 0.78,
        reasoning: 'Patient reports headache frequency of 3-4 times per week',
        source: 'International Classification of Headache Disorders, 3rd edition',
        timestamp
      });
      break;
    case 'plan':
      suggestions.push({
        type: 'treatment',
        text: 'Consider adding prophylactic therapy such as topiramate if acute treatments are insufficient',
        confidence: 0.83,
        reasoning: 'Frequency of headaches suggests need for preventive treatment',
        source: 'American Headache Society Guidelines (2021)',
        timestamp
      });
      break;
  }
  
  // Add an alert if relevant to patient safety
  if (patientContext?.allergies?.includes('NSAIDs')) {
    suggestions.push({
      type: 'alert',
      text: 'Patient has documented NSAID allergy - avoid recommending ibuprofen or naproxen',
      confidence: 0.98,
      reasoning: 'Patient safety concern based on documented allergies',
      timestamp
    });
  }
  
  return suggestions;
}

/**
 * Manages offline AI models for use without internet connection
 */
export async function manageOfflineModels(): Promise<AIOfflineModelInfo[]> {
  console.log('Managing offline AI models');
  
  // In a real implementation, this would check for available models in IndexedDB or similar
  // and download/update models as needed when online
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      modelName: 'Clinical-Transcription-Lite',
      version: '1.2.0',
      lastUpdated: new Date('2023-09-15'),
      capabilities: ['transcription'],
      sizeInMB: 45,
      accuracy: 0.88,
      status: 'ready'
    },
    {
      modelName: 'Documentation-Assistant-Basic',
      version: '2.0.1',
      lastUpdated: new Date('2023-10-20'),
      capabilities: ['documentation'],
      sizeInMB: 120,
      accuracy: 0.85,
      status: 'ready'
    },
    {
      modelName: 'Clinical-Decision-Support-Core',
      version: '1.5.2',
      lastUpdated: new Date('2023-11-05'),
      capabilities: ['diagnosis', 'treatment'],
      sizeInMB: 250,
      accuracy: 0.82,
      status: 'ready'
    }
  ];
}

/**
 * Downloads or updates an offline AI model
 */
export async function downloadOfflineModel(
  modelName: string
): Promise<{success: boolean, progress: number, error?: string}> {
  console.log(`Downloading offline model: ${modelName}`);
  
  // In a real implementation, this would use service workers and IndexedDB
  // to download and store model files for offline use
  
  // Simulate download progress
  let progress = 0;
  const downloadInterval = setInterval(() => {
    progress += 0.1;
    console.log(`Download progress: ${Math.round(progress * 100)}%`);
    
    if (progress >= 1) {
      clearInterval(downloadInterval);
      console.log('Download complete');
    }
  }, 500);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  clearInterval(downloadInterval);
  
  return {
    success: true,
    progress: 1.0
  };
}

// Helper functions for real-time analysis
function extractKeyPhrases(text: string): string[] {
  // In a real implementation, this would use NLP techniques to extract key phrases
  const phrases = [
    'persistent headaches',
    '3-4 times per week',
    'throbbing pain',
    'sensitivity to light'
  ];
  
  return phrases;
}

function extractMedicalTerms(text: string): {
  term: string;
  normalizedTerm: string;
  category: 'symptom' | 'medication' | 'procedure' | 'condition' | 'anatomy' | 'other';
}[] {
  // In a real implementation, this would use a medical terminology database
  return [
    {
      term: 'headaches',
      normalizedTerm: 'headache',
      category: 'symptom'
    },
    {
      term: 'throbbing',
      normalizedTerm: 'throbbing pain',
      category: 'symptom'
    },
    {
      term: 'photophobia',
      normalizedTerm: 'sensitivity to light',
      category: 'symptom'
    }
  ];
}

function generateSuggestedQuestions(text: string, patientContext?: any): string[] {
  // In a real implementation, this would analyze the conversation and suggest relevant follow-up questions
  return [
    'How long do the headaches typically last?',
    'Are there any specific triggers you have noticed?',
    'Have you tried any over-the-counter medications?',
    'Do you experience any nausea with the headaches?'
  ];
}

function identifyPotentialConcerns(
  text: string,
  medicalTerms: any[],
  patientContext?: any
): {description: string, severity: 'high' | 'medium' | 'low'}[] {
  // In a real implementation, this would identify potential red flags or concerns
  const concerns = [];
  
  // Check for red flags in headache presentation
  if (text.includes('worst headache') || text.includes('thunderclap')) {
    concerns.push({
      description: 'Patient described "worst headache of life'
    });
  }
  
  return concerns;
}

export interface AIRealTimeAnalysis {
  keyPhrases: string[];
  medicalTerms: {
    term: string;
    normalizedTerm: string;
    category: 'symptom' | 'medication' | 'procedure' | 'condition' | 'anatomy' | 'other';
  }[];
  suggestedQuestions: string[];
  potentialConcerns: {
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  timeElapsed: number; // in seconds
}

export interface AIContextAwareSuggestion {
  type: 'question' | 'documentation' | 'diagnosis' | 'treatment' | 'alert';
  text: string;
  confidence?: number;
  reasoning?: string;
  source?: string;
  timestamp: number;
}

export interface AIOfflineModelInfo {
  modelName: string;
  version: string;
  lastUpdated: Date;
  capabilities: ('transcription' | 'documentation' | 'diagnosis' | 'treatment')[];
  sizeInMB: number;
  accuracy: number;
  status: 'ready' | 'downloading' | 'updating' | 'error';
  error?: string;
}