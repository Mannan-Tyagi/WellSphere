"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText, PlusCircle, TrendingUp, TrendingDown, Activity, Pill, Image, Upload, AlertCircle } from 'lucide-react';

// Mock data for EHR components
const timelineData = [
  { date: '2023-10-15', type: 'visit', title: 'Primary Care Visit', provider: 'Dr. Emily Chen', details: 'Annual physical examination' },
  { date: '2023-09-02', type: 'lab', title: 'Blood Work', provider: 'Quest Diagnostics', details: 'CBC, Metabolic Panel, Lipid Panel' },
  { date: '2023-08-17', type: 'medication', title: 'Prescription Filled', provider: 'CVS Pharmacy', details: 'Lisinopril 10mg, 30-day supply' },
  { date: '2023-07-22', type: 'imaging', title: 'X-Ray', provider: 'City Radiology', details: 'Chest X-Ray, 2 views' },
  { date: '2023-06-10', type: 'visit', title: 'Neurology Consult', provider: 'Dr. James Wilson', details: 'Headache evaluation' },
];

const labResults = [
  { name: 'Hemoglobin', value: '13.2', unit: 'g/dL', range: '12.0-15.5', status: 'normal', trend: 'stable' },
  { name: 'White Blood Cells', value: '10.5', unit: 'K/uL', range: '4.5-11.0', status: 'normal', trend: 'up' },
  { name: 'Glucose', value: '118', unit: 'mg/dL', range: '70-99', status: 'high', trend: 'up' },
  { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high', trend: 'down' },
  { name: 'Blood Pressure', value: '128/82', unit: 'mmHg', range: '<120/80', status: 'elevated', trend: 'stable' },
];

const medications = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', prescribed: '2022-05-10', adherence: 0.95 },
  { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', prescribed: '2023-06-10', adherence: 0.8 },
  { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Daily', prescribed: '2022-01-15', adherence: 0.7 },
];

const imagingDocuments = [
  { type: 'X-Ray', name: 'Chest X-Ray', date: '2023-07-22', thumbnail: '/chest-xray-thumb.jpg' },
  { type: 'MRI', name: 'Brain MRI', date: '2023-01-05', thumbnail: '/brain-mri-thumb.jpg' },
  { type: 'Document', name: 'Neurology Report', date: '2023-06-12', thumbnail: null },
  { type: 'Document', name: 'Lab Results', date: '2023-09-05', thumbnail: null },
];

export function EHRIntegrationPanel() {
  const [activeTab, setActiveTab] = useState('timeline');
  
  // Get status color for lab results
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'elevated': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get trend icon for lab results
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-amber-500" />;
      case 'down': return <TrendingDown size={14} className="text-green-500" />;
      case 'stable': return <Activity size={14} className="text-blue-500" />;
      default: return null;
    }
  };
  
  // Get icon for timeline items
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Calendar size={16} className="text-blue-500" />;
      case 'lab': return <FileText size={16} className="text-purple-500" />;
      case 'medication': return <Pill size={16} className="text-green-500" />;
      case 'imaging': return <Image size={16} className="text-amber-500" />;
      default: return <Calendar size={16} className="text-gray-500" />;
    }
  };
  
  // Get adherence color
  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 0.9) return 'bg-green-100 text-green-800';
    if (adherence >= 0.7) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="medications">Meds</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>
        
        {/* Timeline View */}
        <TabsContent value="timeline" className="pt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {timelineData.map((item, index) => (
                <div key={index} className="relative pl-6 pb-4">
                  {/* Timeline connector */}
                  {index < timelineData.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-200"></div>
                  )}
                  
                  {/* Timeline item */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute left-[-24px] top-1 h-6 w-6 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      {getTimelineIcon(item.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{item.provider}</p>
                      <p className="text-xs mt-2">{item.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Lab Results */}
        <TabsContent value="labs" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Recent Lab Results</h3>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <PlusCircle size={14} />
              Order Labs
            </Button>
          </div>
          
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {labResults.map((lab, index) => (
                <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{lab.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-medium">{lab.value}</span>
                        <span className="text-xs text-gray-500">{lab.unit}</span>
                        <span className="text-xs text-gray-500">({lab.range})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(lab.status)}>
                        {lab.status}
                      </Badge>
                      {getTrendIcon(lab.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Medications */}
        <TabsContent value="medications" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Current Medications</h3>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <PlusCircle size={14} />
              New Prescription
            </Button>
          </div>
          
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {medications.map((med, index) => (
                <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{med.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{med.dosage}, {med.frequency}</p>
                      <p className="text-xs text-gray-500 mt-1">Prescribed: {new Date(med.prescribed).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Badge className={getAdherenceColor(med.adherence)}>
                        {Math.round(med.adherence * 100)}% adherence
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Interaction warning example */}
                  {med.name === 'Sumatriptan' && (
                    <div className="mt-2 p-2 bg-amber-50 rounded text-xs flex items-start gap-1">
                      <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>Potential interaction with Propranolol (if prescribed)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Imaging & Documents */}
        <TabsContent value="imaging" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Imaging & Documents</h3>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Upload size={14} />
              Upload
            </Button>
          </div>
          
          <ScrollArea className="h-[350px] pr-4">
            <div className="grid grid-cols-2 gap-3">
              {imagingDocuments.map((doc, index) => (
                <div key={index} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                  {/* Thumbnail or placeholder */}
                  <div className="h-24 bg-gray-100 flex items-center justify-center">
                    {doc.thumbnail ? (
                      <img src={doc.thumbnail} alt={doc.name} className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={24} className="text-gray-400" />
                    )}
                  </div>
                  
                  {/* Document info */}
                  <div className="p-2">
                    <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {doc.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}