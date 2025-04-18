"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, X, AlertCircle, FileText, Brain, CheckCircle2 } from 'lucide-react';

interface PreConsultationQuestionnaireProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function PreConsultationQuestionnaire({ onClose, onComplete }: PreConsultationQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [answers, setAnswers] = useState({
    symptoms: '',
    symptomDuration: '',
    painLevel: '',
    medicationsTaken: '',
    allergies: '',
    medicalHistory: [] as string[],
    questions: ''
  });
  
  const totalSteps = 3;
  
  const handleAnswerChange = (field: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      setAnswers(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], value]
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
      }));
    }
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };
  
  const suggestMedicalTerms = () => {
    setShowAISuggestions(true);
  };
  
  const addSuggestion = (suggestion: string) => {
    setAnswers(prev => ({
      ...prev,
      symptoms: prev.symptoms + (prev.symptoms ? '. ' : '') + suggestion
    }));
    setShowAISuggestions(false);
  };
  
  // Mock AI suggestions based on user input
  const getAISuggestions = () => {
    const userInput = answers.symptoms.toLowerCase();
    
    if (userInput.includes('head') && userInput.includes('pain')) {
      return [
        "Experiencing tension headache with bilateral temporal pressure",
        "Suffering from migraine with aura, photophobia, and nausea",
        "Having cluster headache with severe unilateral orbital pain"
      ];
    }
    
    if (userInput.includes('stomach') || userInput.includes('nausea')) {
      return [
        "Experiencing epigastric discomfort with occasional nausea",
        "Having intermittent abdominal cramping and loose stools",
        "Suffering from dyspepsia with postprandial fullness"
      ];
    }
    
    if (userInput.includes('breath') || userInput.includes('cough')) {
      return [
        "Experiencing dyspnea on exertion with nonproductive cough",
        "Having productive cough with yellowish sputum",
        "Suffering from paroxysmal nocturnal dyspnea and orthopnea"
      ];
    }
    
    return [
      "Experiencing persistent fatigue and malaise",
      "Having intermittent pain with movement",
      "Noticing progressive symptoms over the past few days"
    ];
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileText className="h-5 w-5 mr-2 text-[#006D77]" />
            Pre-Consultation Questionnaire
          </DialogTitle>
          <DialogDescription>
            This information will help your doctor prepare for your visit
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-[#006D77] h-2 rounded-full" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium">{currentStep}/{totalSteps}</span>
          </div>
          
          {/* Step 1: Current Symptoms */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Symptoms</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symptoms" className="mb-1 block">
                      What symptoms are you experiencing today?
                    </Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={suggestMedicalTerms} 
                      className="flex items-center text-xs text-[#006D77]"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Suggest medical terms
                    </Button>
                  </div>
                  <Textarea 
                    id="symptoms" 
                    placeholder="Describe your symptoms in detail"
                    value={answers.symptoms}
                    onChange={(e) => handleAnswerChange('symptoms', e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  {/* AI Suggestions */}
                  {showAISuggestions && (
                    <div className="mt-2 border rounded-lg p-3 bg-[#F0F9FA]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#006D77] flex items-center">
                          <Brain className="h-4 w-4 mr-1" />
                          Suggested Medical Descriptions
                        </h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAISuggestions(false)} 
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {getAISuggestions().map((suggestion, index) => (
                          <div 
                            key={index} 
                            className="text-sm p-2 bg-white border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => addSuggestion(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500 flex items-start">
                        <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>
                          These are suggestions only. Please review for accuracy before adding to your description.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="symptomDuration" className="mb-1 block">
                    How long have you been experiencing these symptoms?
                  </Label>
                  <RadioGroup 
                    id="symptomDuration"
                    value={answers.symptomDuration}
                    onValueChange={(value) => handleAnswerChange('symptomDuration', value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="less-than-day" id="less-than-day" />
                      <Label htmlFor="less-than-day">Less than a day</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-3-days" id="1-3-days" />
                      <Label htmlFor="1-3-days">1-3 days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4-7-days" id="4-7-days" />
                      <Label htmlFor="4-7-days">4-7 days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2-weeks" id="1-2-weeks" />
                      <Label htmlFor="1-2-weeks">1-2 weeks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="more-than-2-weeks" id="more-than-2-weeks" />
                      <Label htmlFor="more-than-2-weeks">More than 2 weeks</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="painLevel" className="mb-1 block">
                    If you are experiencing pain, rate it from 0 (no pain) to 10 (worst pain)
                  </Label>
                  <Input 
                    id="painLevel" 
                    type="number" 
                    min="0" 
                    max="10"
                    value={answers.painLevel}
                    onChange={(e) => handleAnswerChange('painLevel', e.target.value)}
                    className="max-w-[100px]"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Medications & Allergies */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medications & Allergies</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicationsTaken" className="mb-1 block">
                    What medications have you taken for this condition?
                  </Label>
                  <Textarea 
                    id="medicationsTaken" 
                    placeholder="Include prescription and over-the-counter medications"
                    value={answers.medicationsTaken}
                    onChange={(e) => handleAnswerChange('medicationsTaken', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="allergies" className="mb-1 block">
                    Do you have any allergies to medications?
                  </Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="List all medication allergies and reactions"
                    value={answers.allergies}
                    onChange={(e) => handleAnswerChange('allergies', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Medical History & Questions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical History & Questions</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-1 block">
                    Do you have any of the following conditions?
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer', 'Arthritis', 'Depression/Anxiety', 'Thyroid Disorder'].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox 
                          id={condition.toLowerCase().replace(/\s+/g, '-')} 
                          checked={answers.medicalHistory.includes(condition)}
                          onCheckedChange={(checked) => handleCheckboxChange('medicalHistory', condition, checked as boolean)}
                        />
                        <Label htmlFor={condition.toLowerCase().replace(/\s+/g, '-')}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="questions" className="mb-1 block">
                    What questions do you have for the doctor today?
                  </Label>
                  <Textarea 
                    id="questions" 
                    placeholder="List any specific questions or concerns"
                    value={answers.questions}
                    onChange={(e) => handleAnswerChange('questions', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <Button 
            type="button" 
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-[#006D77] hover:bg-[#00565E]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : currentStep === totalSteps ? (
              'Submit'
            ) : (
              'Continue'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
