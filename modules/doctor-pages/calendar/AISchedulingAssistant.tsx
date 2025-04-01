import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface AISchedulingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISchedulingAssistant: React.FC<AISchedulingAssistantProps> = ({ isOpen, onClose }) => {
  const { 
    recommendations, 
    applyAIRecommendation, 
    dismissAIRecommendation 
  } = useCalendar();

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'scheduling':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        );
      case 'patient-risk':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        );
      case 'follow-up':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        );
      case 'optimization':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <SparklesIcon className="w-5 h-5 text-teal-600 mr-2" />
          <h2 className="text-lg font-serif text-slate-800">AI Assistant</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 h-full overflow-y-auto pb-20">
        <div className="flex flex-col space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map(recommendation => (
              <div 
                key={recommendation.id} 
                className={`p-4 rounded-lg border ${
                  recommendation.applied 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-white border-teal-100 shadow-sm'
                }`}
              >
                <div className="flex">
                  {getRecommendationIcon(recommendation.type)}
                  
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {recommendation.suggestion}
                    </p>
                    
                    <p className="text-xs text-slate-500 mt-1">
                      {recommendation.reason}
                    </p>
                    
                    {recommendation.efficiencyImprovement && (
                      <div className="mt-2 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-teal-500 h-full" 
                          style={{ width: `${recommendation.efficiencyImprovement}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {format(recommendation.timestamp, 'MMM d, h:mm a')}
                      </span>
                      
                      {!recommendation.applied && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => applyAIRecommendation(recommendation.id)}
                            className="text-xs flex items-center px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                          >
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Apply
                          </button>
                          
                          <button 
                            onClick={() => dismissAIRecommendation(recommendation.id)}
                            className="text-xs px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                      
                      {recommendation.applied && (
                        <span className="text-xs text-teal-600 flex items-center">
                          <CheckIcon className="w-3 h-3 mr-1" />
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-slate-700 font-medium">No recommendations</h3>
              <p className="mt-2 text-sm text-slate-500">
                AI recommendations will appear here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};