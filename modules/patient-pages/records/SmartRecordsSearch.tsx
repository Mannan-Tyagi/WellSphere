"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList,
  Calendar,
  Search,
  AlertCircle,
  Lightbulb,
  FileText,
  FlaskConical,
  Image,
  Pill,
  Stethoscope,
  ArrowRight,
  Clock,
  X,
  ActivitySquare
} from 'lucide-react';

const SmartRecordsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'diabetes labs from 2023',
    'chest x-ray results',
    'cardiology appointments'
  ]);
  const [suggestions, setSuggestions] = useState([
    'Show all medication prescriptions from 2024',
    'Find lab results related to cholesterol',
    'Show my recent imaging studies',
    'Doctor visits with Dr. Johnson'
  ]);

  const mockResults = {
    'diabetes labs from 2023': [
      {
        id: 'res1',
        title: 'Hemoglobin A1C Test',
        date: '2023-10-15',
        provider: 'City General Hospital',
        type: 'lab',
        result: '6.4%',
        highlight: 'Result indicates prediabetes (5.7% - 6.4%)',
        note: 'Recommended lifestyle modifications and follow-up in 3 months'
      },
      {
        id: 'res2',
        title: 'Fasting Blood Glucose',
        date: '2023-07-22',
        provider: 'City General Hospital',
        type: 'lab',
        result: '118 mg/dL',
        highlight: 'Result is elevated (normal <100 mg/dL)',
        note: 'Consistent with prediabetes. Continue monitoring.'
      },
      {
        id: 'res3',
        title: 'Comprehensive Metabolic Panel',
        date: '2023-04-10',
        provider: 'City General Hospital',
        type: 'lab',
        result: 'Multiple values',
        highlight: 'Glucose: 115 mg/dL (high)',
        note: 'Other values within normal range'
      }
    ],
    'chest x-ray results': [
      {
        id: 'res4',
        title: 'Chest X-Ray (2 views)',
        date: '2024-02-10',
        provider: 'Westside Imaging Center',
        type: 'imaging',
        result: 'Normal',
        highlight: 'No acute cardiopulmonary process',
        note: 'Heart size normal. Lungs clear. No pleural effusion.'
      },
      {
        id: 'res5',
        title: 'Chest X-Ray (PA and Lateral)',
        date: '2022-11-05',
        provider: 'City General Hospital',
        type: 'imaging',
        result: 'Normal',
        highlight: 'No acute findings',
        note: 'Performed for annual tuberculosis screening. Negative for TB.'
      }
    ],
    'cardiology appointments': [
      {
        id: 'res6',
        title: 'Cardiology Consultation',
        date: '2023-09-15',
        provider: 'Dr. Sarah Reynolds, Cardiology Associates',
        type: 'visit',
        result: 'Follow-up',
        highlight: 'Blood pressure well-controlled on current medication',
        note: 'Continue Lisinopril 10mg daily. Follow up in 6 months.'
      },
      {
        id: 'res7',
        title: 'Cardiology Consultation',
        date: '2023-03-22',
        provider: 'Dr. Sarah Reynolds, Cardiology Associates',
        type: 'visit',
        result: 'Initial consultation',
        highlight: 'Mild hypertension diagnosed',
        note: 'Started on Lisinopril 5mg daily. Diet and exercise counseling provided.'
      }
    ]
  };

  const getDefaultResults = [
    {
      id: 'def1',
      title: 'Recent Lab Results',
      date: '2024-03-15',
      provider: 'City General Hospital',
      type: 'lab',
      result: 'Multiple values',
      highlight: 'All values within normal range',
      note: 'Complete blood count, metabolic panel, lipid panel'
    },
    {
      id: 'def2',
      title: 'Primary Care Visit',
      date: '2024-01-22',
      provider: 'Dr. Johnson, Family Medical Group',
      type: 'visit',
      result: 'Annual physical',
      highlight: 'Overall good health',
      note: 'Continue current medications. Recommended routine screenings.'
    },
    {
      id: 'def3',
      title: 'Lisinopril Prescription',
      date: '2024-01-22',
      provider: 'Dr. Johnson, Family Medical Group',
      type: 'medication',
      result: '10mg daily',
      highlight: '30-day supply with 3 refills',
      note: 'For blood pressure management'
    }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // In a real implementation, this would call an AI-powered search API
    setTimeout(() => {
      if (mockResults[query]) {
        setSearchResults(mockResults[query]);
      } else if (query.trim()) {
        // Simulate AI understanding of natural language queries by doing fuzzy matching
        if (query.toLowerCase().includes('diabetes') || query.toLowerCase().includes('glucose')) {
          setSearchResults(mockResults['diabetes labs from 2023']);
        } else if (query.toLowerCase().includes('x-ray') || query.toLowerCase().includes('chest')) {
          setSearchResults(mockResults['chest x-ray results']);
        } else if (query.toLowerCase().includes('cardio') || query.toLowerCase().includes('heart')) {
          setSearchResults(mockResults['cardiology appointments']);
        } else {
          setSearchResults(getDefaultResults);
        }
        
        // Add to recent searches if not already there
        if (!recentSearches.includes(query)) {
          setRecentSearches(prev => [query, ...prev.slice(0, 2)]);
        }
      } else {
        setSearchResults(getDefaultResults);
      }
      
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lab':
        return <FlaskConical size={18} className="text-purple-500" />;
      case 'imaging':
        return <Image size={18} className="text-blue-500" />;
      case 'visit':
        return <Stethoscope size={18} className="text-green-500" />;
      case 'medication':
        return <Pill size={18} className="text-rose-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
    }
  };

  const removeRecentSearch = (search) => {
    setRecentSearches(prev => prev.filter(item => item !== search));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search using natural language (e.g., 'Show my diabetes labs from 2023')"
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button 
            onClick={() => handleSearch(searchQuery)} 
            className="bg-[#006D77] hover:bg-[#005A64]"
            disabled={isSearching}
          >
            <Search size={18} className="mr-2" />
            Search
          </Button>
        </div>
        
        {!showResults && (
          <>
            <div className="mt-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock size={16} className="mr-2" />
                <h3 className="font-medium">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full pl-3 pr-1 py-1"
                  >
                    <span 
                      className="text-sm cursor-pointer" 
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-1 text-gray-500 rounded-full"
                      onClick={() => removeRecentSearch(search)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Lightbulb size={16} className="mr-2" />
                <h3 className="font-medium">Suggested Searches</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start h-auto py-2 px-3 text-sm font-normal"
                    onClick={() => handleSearch(suggestion)}
                  >
                    <Search size={14} className="mr-2 text-gray-500" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[#F0F9FA] p-3 rounded-md border border-[#E8F3F4] mt-6">
              <div className="flex items-center">
                <ActivitySquare size={18} className="text-[#006D77] mr-2" />
                <span className="text-sm font-medium">AI-powered search detects medical context</span>
              </div>
              <Badge className="bg-[#006D77]">Enhanced</Badge>
            </div>
          </>
        )}
      </div>
      
      {isSearching && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-48" />
                      </div>
                      <div className="flex items-center mt-2">
                        <Skeleton className="h-4 w-24 mr-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {showResults && !isSearching && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <h3 className="font-medium">Results for "{searchQuery || 'recent records'}"</h3>
              <span className="text-sm text-gray-500">{searchResults.length} records found</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResults(false)}
              className="text-xs"
            >
              New Search
            </Button>
          </div>
          
          <div className="space-y-3">
            {searchResults.map((result) => (
              <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{result.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                          <span className="mx-1">•</span>
                          <span>{result.provider}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(result.type)}
                        <Badge className="ml-2" variant="outline">
                          {result.result}
                        </Badge>
                      </div>
                    </div>
                    
                    {result.highlight && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-md text-sm">
                        <span className="font-medium">Highlight: </span>
                        {result.highlight}
                      </div>
                    )}
                    
                    {result.note && (
                      <div className="mt-1 text-xs text-gray-600">
                        {result.note}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 border-t pt-6">
        <h3 className="font-medium text-sm text-gray-700 mb-4 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
          Try these natural language queries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleSearch("Show my blood tests from last year")}>
            "Show my blood tests from last year"
          </div>
          <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleSearch("All medications prescribed in 2023")}>
            "All medications prescribed in 2023"
          </div>
          <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleSearch("Find records related to my hypertension")}>
            "Find records related to my hypertension"
          </div>
          <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleSearch("What did Dr. Johnson tell me at my last visit?")}>
            "What did Dr. Johnson tell me at my last visit?"
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecordsSearch;
