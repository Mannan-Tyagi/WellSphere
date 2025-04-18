"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Download, 
  FileText, 
  Filter, 
  Search, 
  Share2, 
  Stethoscope, 
  Pill, 
  Activity, 
  FlaskConical, 
  Image, 
  RefreshCw 
} from 'lucide-react';

// Mock data - would come from API in real implementation
const mockRecords = [
  {
    id: 'rec1',
    title: 'Complete Blood Count',
    date: '2024-03-15',
    provider: 'City General Hospital',
    type: 'lab',
    category: 'Hematology',
    tags: ['routine', 'annual', 'bloodwork'],
    confidence: 0.98,
    relatedConditions: ['Anemia'],
    summary: 'Results within normal range except for slightly elevated WBC count.'
  },
  {
    id: 'rec2',
    title: 'Lipid Panel',
    date: '2024-03-15',
    provider: 'City General Hospital',
    type: 'lab',
    category: 'Cardiovascular',
    tags: ['cholesterol', 'preventive', 'annual'],
    confidence: 0.96,
    relatedConditions: ['Hypertension'],
    summary: 'LDL slightly elevated, HDL within normal range. Triglycerides normal.'
  },
  {
    id: 'rec3',
    title: 'Chest X-Ray',
    date: '2024-02-10',
    provider: 'Westside Imaging Center',
    type: 'imaging',
    category: 'Radiology',
    tags: ['pulmonary', 'diagnostic'],
    confidence: 0.99,
    relatedConditions: ['Asthma'],
    summary: 'No acute cardiopulmonary process. Lungs clear.'
  },
  {
    id: 'rec4',
    title: 'Primary Care Checkup',
    date: '2024-01-22',
    provider: 'Dr. Johnson',
    type: 'visit',
    category: 'Primary Care',
    tags: ['annual', 'wellness', 'checkup'],
    confidence: 0.92,
    relatedConditions: ['Hypertension', 'Allergic Rhinitis'],
    summary: 'Blood pressure controlled. Continue current medication regimen.'
  },
  {
    id: 'rec5',
    title: 'Lisinopril Prescription',
    date: '2024-01-22',
    provider: 'Dr. Johnson',
    type: 'medication',
    category: 'Prescriptions',
    tags: ['hypertension', 'daily', 'ongoing'],
    confidence: 0.97,
    relatedConditions: ['Hypertension'],
    summary: '10mg daily for blood pressure management. 30-day supply with 3 refills.'
  },
  {
    id: 'rec6',
    title: 'Pulmonary Function Test',
    date: '2023-11-15',
    provider: 'Respiratory Specialists',
    type: 'lab',
    category: 'Pulmonary',
    tags: ['asthma', 'breathing', 'diagnostic'],
    confidence: 0.94,
    relatedConditions: ['Asthma'],
    summary: 'Mild obstructive pattern consistent with controlled asthma.'
  },
];

const RecordsCategorization = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lab':
        return <FlaskConical size={16} className="text-purple-500" />;
      case 'imaging':
        return <Image size={16} className="text-blue-500" />;
      case 'visit':
        return <Stethoscope size={16} className="text-green-500" />;
      case 'medication':
        return <Pill size={16} className="text-rose-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const getConditionColor = (condition) => {
    // Map conditions to colors for consistency
    const conditionColors = {
      'Hypertension': 'bg-red-100 text-red-800 border-red-200',
      'Asthma': 'bg-blue-100 text-blue-800 border-blue-200',
      'Anemia': 'bg-amber-100 text-amber-800 border-amber-200',
      'Allergic Rhinitis': 'bg-green-100 text-green-800 border-green-200',
      'Diabetes': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return conditionColors[condition] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleRefreshAI = () => {
    setAiAnalyzing(true);
    // In a real implementation, this would trigger re-analysis of the records
    setTimeout(() => {
      setAiAnalyzing(false);
    }, 2000);
  };

  const filteredRecords = mockRecords
    .filter(record => {
      // Filter by tab
      if (activeTab !== 'all' && record.type !== activeTab) return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          record.title.toLowerCase().includes(query) ||
          record.provider.toLowerCase().includes(query) ||
          record.category.toLowerCase().includes(query) ||
          record.tags.some(tag => tag.toLowerCase().includes(query)) ||
          record.relatedConditions.some(condition => condition.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search your records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={14} />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleRefreshAI}
          >
            {aiAnalyzing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Re-analyze
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lab">Labs</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="visit">Visits</TabsTrigger>
          <TabsTrigger value="medication">Meds</TabsTrigger>
        </TabsList>
        
        <div className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <Card 
                key={record.id} 
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedRecord?.id === record.id ? 'ring-1 ring-[#006D77] bg-[#F0F9FA]' : ''}`}
                onClick={() => setSelectedRecord(record)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(record.type)}
                        <h3 className="font-medium">{record.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{record.provider}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{record.summary}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {record.relatedConditions.map(condition => (
                          <Badge 
                            key={condition} 
                            variant="outline" 
                            className={`text-xs ${getConditionColor(condition)}`}
                          >
                            {condition}
                          </Badge>
                        ))}
                        
                        {record.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end ml-2">
                      <Badge className="mb-2 bg-[#006D77]">
                        {record.category}
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        AI Confidence: {Math.round(record.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  {selectedRecord?.id === record.id && (
                    <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        View Full Record
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No records found matching your criteria</p>
              <Button 
                variant="link" 
                className="mt-2 text-[#006D77]"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default RecordsCategorization;
