"use client";

import React, { useState } from 'react';
import { 
  File, 
  Image, 
  FileText, 
  X, 
  CheckCircle, 
  Shield, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SmartAttachmentHandlerProps {
  files: File[];
  onProcessComplete: (processedFiles: any[]) => void;
  onCancel: () => void;
}

export default function SmartAttachmentHandler({ 
  files, 
  onProcessComplete, 
  onCancel 
}: SmartAttachmentHandlerProps) {
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);
  
  // Simulate file processing on component mount
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const processFiles = async () => {
      // Reset state
      setProcessing(true);
      setProgress(0);
      
      // For each file, simulate processing
      const processed: any[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Update progress based on current file
        const fileProgress = (i / files.length) * 100;
        setProgress(fileProgress);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a processed file object
        const processedFile = {
          id: `file-${Date.now()}-${i}`,
          originalFile: file,
          name: file.name,
          type: file.type.split('/')[0],
          size: file.size > 1000000 
            ? `${(file.size / 1000000).toFixed(1)} MB (compressed)` 
            : `${Math.round(file.size / 1000)} KB`,
          url: URL.createObjectURL(file),
          compressed: file.type.includes('image') && file.size > 500000,
          
          // For images, set additional metadata
          metadata: file.type.includes('image') ? {
            dimensions: '1200x800 (resized)', // This would be extracted from the actual image
            hasPatientInfo: Math.random() > 0.5, // In a real app, this would use OCR
            ehrLinked: Math.random() > 0.7 // In a real app, this would check EHR
          } : null
        };
        
        processed.push(processedFile);
      }
      
      // Complete processing
      setProgress(100);
      setProcessedFiles(processed);
      
      // Simulate a small delay before finishing
      timer = setTimeout(() => {
        setProcessing(false);
      }, 500);
    };
    
    if (files.length > 0) {
      processFiles();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [files]);
  
  // Handle completion
  const handleComplete = () => {
    onProcessComplete(processedFiles);
  };
  
  return (
    <div className="bg-white border-t p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {processing ? (
            <Loader2 size={18} className="text-[#006D77] mr-2 animate-spin" />
          ) : (
            <CheckCircle size={18} className="text-green-500 mr-2" />
          )}
          <h3 className="font-medium text-gray-900">
            {processing ? "Processing Attachments" : "Attachments Ready"}
          </h3>
        </div>
        <button 
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <X size={16} />
        </button>
      </div>
      
      {processing && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Preparing files...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">
            Optimizing images and checking for sensitive information...
          </p>
        </div>
      )}
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto">
        {processedFiles.map(file => (
          <div key={file.id} className="border rounded-md p-3">
            <div className="flex items-start">
              <div className="p-2 bg-gray-100 rounded mr-3 flex-shrink-0">
                {file.type === 'image' && <Image size={20} className="text-blue-500" />}
                {file.type === 'application' && <FileText size={20} className="text-orange-500" />}
                {!['image', 'application'].includes(file.type) && <File size={20} className="text-gray-500" />}
              </div>
              
              <div className="flex-grow">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
                
                {file.compressed && (
                  <span className="inline-flex items-center text-xs text-green-600 mt-1">
                    <CheckCircle size={12} className="mr-1" />
                    Auto-compressed for secure sharing
                  </span>
                )}
                
                {file.type === 'image' && file.metadata?.hasPatientInfo && (
                  <div className="flex items-center mt-1">
                    <AlertTriangle size={12} className="text-amber-500 mr-1" />
                    <span className="text-xs text-amber-600">Contains patient information</span>
                  </div>
                )}
                
                {file.metadata?.ehrLinked && (
                  <div className="flex items-center mt-1">
                    <Shield size={12} className="text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600">Linked to health record</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!processing && (
        <div className="mt-4 pt-3 border-t flex justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <Shield size={12} className="mr-1" />
            All files are encrypted and HIPAA-compliant
          </div>
          
          <button
            onClick={handleComplete}
            className="px-3 py-1.5 bg-[#006D77] text-white text-sm rounded-md hover:bg-[#005A66]"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
