/**
 * Medication-related services for the patient portal
 */

// Interface for medication interaction response
export interface MedicationInteraction {
  severity: 'high' | 'medium' | 'low';
  description: string;
  medications: string[];
  recommendation: string;
}

/**
 * Check for medication interactions
 * 
 * In a real implementation, this would call a medication interaction API
 * such as the one provided by the NIH or a commercial service.
 */
export async function checkMedicationInteractions(
  medications: string[]
): Promise<MedicationInteraction[]> {
  console.log('Checking interactions for medications:', medications);
  
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Define some known interactions for demo purposes
  const knownInteractions: Record<string, MedicationInteraction> = {
    'lisinopril_metformin': {
      severity: 'low',
      description: 'Lisinopril and Metformin may cause a mild increase in potassium levels.',
      medications: ['Lisinopril', 'Metformin'],
      recommendation: 'Monitor potassium levels during regular check-ups.'
    },
    'lisinopril_vitamin_d': {
      severity: 'low',
      description: 'No significant interaction between Lisinopril and Vitamin D supplements.',
      medications: ['Lisinopril', 'Vitamin D'],
      recommendation: 'Continue both as prescribed.'
    },
    'metformin_vitamin_d': {
      severity: 'low',
      description: 'Vitamin D may slightly improve the effectiveness of Metformin.',
      medications: ['Metformin', 'Vitamin D'],
      recommendation: 'Continue both as prescribed.'
    }
  };
  
  const results: MedicationInteraction[] = [];
  
  // Check for known interactions
  if (medications.includes('Lisinopril') && medications.includes('Metformin')) {
    results.push(knownInteractions['lisinopril_metformin']);
  }
  
  if (medications.includes('Lisinopril') && medications.includes('Vitamin D')) {
    results.push(knownInteractions['lisinopril_vitamin_d']);
  }
  
  if (medications.includes('Metformin') && medications.includes('Vitamin D')) {
    results.push(knownInteractions['metformin_vitamin_d']);
  }
  
  return results;
}

/**
 * Check for food and supplement interactions
 */
export async function checkFoodInteractions(
  medication: string
): Promise<{ food: string; severity: string; description: string }[]> {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const foodInteractions: Record<string, { food: string; severity: string; description: string }[]> = {
    'Lisinopril': [
      { 
        food: 'High potassium foods', 
        severity: 'medium', 
        description: 'Foods high in potassium (bananas, avocados) may increase potassium levels when taking Lisinopril.' 
      },
      { 
        food: 'Salt substitutes', 
        severity: 'high', 
        description: 'Many salt substitutes contain potassium which can be dangerous with Lisinopril.' 
      }
    ],
    'Metformin': [
      { 
        food: 'Alcohol', 
        severity: 'medium', 
        description: 'Alcohol may increase risk of lactic acidosis when taking Metformin.' 
      }
    ]
  };
  
  return foodInteractions[medication] || [];
}

/**
 * Predict medication adherence based on user patterns
 */
export function predictAdherence(
  medicationHistory: any[],
  userPatterns: any
): { predicted: number; factors: string[] } {
  // In a real implementation, this would use machine learning
  // Here's a simplified mock version
  
  // Base adherence from history
  const baseAdherence = medicationHistory.length > 0 
    ? medicationHistory.reduce((sum, record) => sum + record.adherence, 0) / medicationHistory.length
    : 80;
  
  // Factors that might affect adherence
  const factors: string[] = [];
  let adjustedAdherence = baseAdherence;
  
  // Time of day adjustment
  if (userPatterns.preferredTime === 'morning') {
    adjustedAdherence += 5;
    factors.push('Morning medications show better adherence');
  } else if (userPatterns.preferredTime === 'night') {
    adjustedAdherence -= 3;
    factors.push('Evening medications show lower adherence');
  }
  
  // Complexity adjustment
  if (userPatterns.medicationCount > 3) {
    adjustedAdherence -= 5;
    factors.push('Multiple medications can reduce adherence');
  }
  
  // Reminder adjustment
  if (userPatterns.usesReminders) {
    adjustedAdherence += 8;
    factors.push('Reminder usage improves adherence');
  }
  
  // Cap the result between 0 and 100
  const predicted = Math.min(100, Math.max(0, Math.round(adjustedAdherence)));
  
  return { predicted, factors };
}
