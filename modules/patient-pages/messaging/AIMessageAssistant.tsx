"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  X, 
  Search, 
  CheckCircle, 
  HelpCircle,
  PlusCircle,
  Pill,
  ClipboardList,
  Clock,
  Activity,
  Heart
} from 'lucide-react';
import BodyMapSelector from './BodyMapSelector';

interface AIMessageAssistantProps {
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export default function AIMessageAssistant({ onSelectSuggestion, onClose }: AIMessageAssistantProps) {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'templates' | 'body'>('symptoms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  // Symptom categories with medical terminology
  const symptomCategories = [
    {
      title: 'Pain',
      symptoms: [
        'Sharp pain', 'Dull pain', 'Throbbing pain', 'Stabbing pain', 
        'Burning sensation', 'Aching', 'Cramping', 'Tender to touch'
      ]
    },
    {
      title: 'Respiratory',
      symptoms: [
        'Shortness of breath', 'Wheezing', 'Productive cough with yellow sputum', 
        'Dry cough', 'Chest tightness', 'Difficulty breathing when lying flat'
      ]
    },
    {
      title: 'Gastrointestinal',
      symptoms: [
        'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain',
        'Bloating', 'Loss of appetite', 'Difficulty swallowing'
      ]
    },
    {
      title: 'Neurological',
      symptoms: [
        'Headache', 'Dizziness', 'Blurred vision', 'Lightheadedness', 
        'Numbness', 'Tingling sensation', 'Balance problems', 'Confusion'
      ]
    }
  ];
  
  // Common message templates
  const messageTemplates = [
    {
      category: 'Medication',
      templates: [
        'I need a refill for my prescription of [medication name].',
        'Im experiencing side effects from [medication name] including [symptoms].',
        'Is it safe to take [medication] with [other medication/food]?',
        'I missed a dose of my medication. What should I do?'
      ]
    },
    {
      category: 'Appointment',
      templates: [
        'I need to reschedule my upcoming appointment on [date].',
        'Id like to schedule a follow-up appointment in [timeframe].',
        'What should I prepare for my upcoming appointment?',
        'Do I need to fast before my upcoming lab work?'
      ]
    },
    {
      category: 'Symptom Updates',
      templates: [
        'My symptoms have [improved/worsened] since our last appointment.',
        'Ive been monitoring my [blood pressure/blood sugar/etc.] and noticed [observation].',
        'The treatment plan has been [helping/not helping] with my condition.',
        'Ive completed the prescribed treatment but still have [symptoms].'
      ]
    },
    {
      category: 'Questions',
      templates: [
        'Could you explain the results of my recent [test/lab work]?',
        'What lifestyle changes would you recommend for my condition?',
        'Should I be concerned about [symptom] that started [timeframe]?',
        'Is it safe for me to [activity] with my current condition?'
      ]
    }
  ];
  
  // Handle symptom selection
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  // Generate a description based on selected symptoms and body part
  const generateDescription = () => {
    if (selectedSymptoms.length === 0) return '';
    
    const bodyPartText = selectedBodyPart ? ` in my ${selectedBodyPart}` : '';
    const symptomsText = selectedSymptoms.join(', ');
    
    // Create a medically-formatted description
    let description = `Ive been experiencing ${symptomsText}${bodyPartText}`;
    
    if (selectedSymptoms.length > 1) {
      description += '. These symptoms began approximately [timeframe] ago';
    } else {
      description += '. This symptom began approximately [timeframe] ago';
    }
    
    description += ' and occurs [frequency]. The severity is [mild/moderate/severe] and it [improves/worsens] with [activity/medication/rest].';
    
    return description;
  };
  
  // Filter symptoms based on search term
  const filterSymptoms = (symptoms: string[]) => {
    if (!searchTerm) return symptoms;
    return symptoms.filter(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Handle body part selection from the body map
  const handleBodyPartSelect = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setActiveTab('symptoms');
  };
  
  return (
    <div className="bg-white border-t p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles size={18} className="text-[#006D77] mr-2" />
          <h3 className="font-medium text-gray-900">AI Message Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'symptoms' ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('symptoms')}
        >
          <div className="flex items-center">
            <Activity size={16} className="mr-1" />
            Symptoms
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'templates' ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('templates')}
        >
          <div className="flex items-center">
            <ClipboardList size={16} className="mr-1" />
            Templates
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'body' ? 'text-[#006D77] border-b-2 border-[#006D77]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('body')}
        >
          <div className="flex items-center">
            <Heart size={16} className="mr-1" />
            Body Map
          </div>
        </button>
      </div>
      
      {/* Search Box (for symptoms tab) */}
      {activeTab === 'symptoms' && (
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search symptoms..." 
            className="w-full p-2 pl-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006D77]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      {/* Symptoms Tab Content */}
      {activeTab === 'symptoms' && (
        <div className="max-h-[300px] overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Symptoms</h4>
              <button 
                className="text-xs text-[#006D77] hover:underline"
                onClick={() => setSelectedSymptoms([])}
              >
                Clear all
              </button>
            </div>
            
            {selectedSymptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSymptoms.map(symptom => (
                  <div 
                    key={symptom} 
                    className="bg-[#F0F9FA] text-[#006D77] px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {symptom}
                    <button 
                      className="ml-1 text-[#006D77] hover:text-[#004A56]"
                      onClick={() => toggleSymptom(symptom)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mb-2">No symptoms selected</p>
            )}
            
            {selectedBodyPart && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs inline-flex items-center mb-2">
                Body part: {selectedBodyPart}
                <button 
                  className="ml-1 text-blue-700 hover:text-blue-900"
                  onClick={() => setSelectedBodyPart(null)}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            {selectedSymptoms.length > 0 && (
              <button 
                className="w-full bg-[#006D77] text-white py-2 rounded-md hover:bg-[#005A66] transition-all text-sm mt-2"
                onClick={() => onSelectSuggestion(generateDescription())}
              >
                Generate Description
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {symptomCategories.map(category => (
              <div key={category.title}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category.title}</h4>
                <div className="space-y-1">
                  {filterSymptoms(category.symptoms).map(symptom => (
                    <div 
                      key={symptom}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        selectedSymptoms.includes(symptom) 
                          ? 'bg-[#F0F9FA] text-[#006D77]' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleSymptom(symptom)}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                        selectedSymptoms.includes(symptom) 
                          ? 'border-[#006D77] bg-[#006D77] text-white' 
                          : 'border-gray-300'
                      }`}>
                        {selectedSymptoms.includes(symptom) && <CheckCircle size={14} />}
                      </div>
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Templates Tab Content */}
      {activeTab === 'templates' && (
        <div className="max-h-[300px] overflow-y-auto">
          <div className="space-y-4">
            {messageTemplates.map(category => (
              <div key={category.category}>
                <div className="flex items-center mb-2">
                  {category.category === 'Medication' && <Pill size={16} className="mr-2 text-[#006D77]" />}
                  {category.category === 'Appointment' && <Clock size={16} className="mr-2 text-[#006D77]" />}
                  {category.category === 'Symptom Updates' && <Activity size={16} className="mr-2 text-[#006D77]" />}
                  {category.category === 'Questions' && <HelpCircle size={16} className="mr-2 text-[#006D77]" />}
                  <h4 className="text-sm font-medium text-gray-700">{category.category}</h4>
                </div>
                <div className="space-y-2">
                  {category.templates.map((template, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => onSelectSuggestion(template)}
                    >
                      {template}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Body Map Tab Content */}
      {activeTab === 'body' && (
        <div className="max-h-[300px] overflow-y-auto">
          <BodyMapSelector onSelectBodyPart={handleBodyPartSelect} />
        </div>
      )}
      
      <div className="mt-4 pt-2 border-t flex items-center text-xs text-gray-500">
        <Brain size={12} className="mr-1" />
        Powered by medical AI to help you communicate effectively with your provider
      </div>
    </div>
  );
}
