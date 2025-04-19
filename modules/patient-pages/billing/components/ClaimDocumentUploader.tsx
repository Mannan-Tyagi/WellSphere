import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';

interface ClaimDocumentUploaderProps {
  onDocumentsSelected: (documents: any[]) => void;
}

const ClaimDocumentUploader: React.FC<ClaimDocumentUploaderProps> = ({ onDocumentsSelected }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        file
      }));
      
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onDocumentsSelected(updatedFiles);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        file
      }));
      
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onDocumentsSelected(updatedFiles);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    
    // Revoke object URL to prevent memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    onDocumentsSelected(newFiles);
  };
  
  return (
    <div className="w-full">
      <div 
        className={`mt-3 border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? 'border-[#006D77] bg-[#F0F9FA]' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="fileUpload" 
          multiple 
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports: PDF, JPG, PNG
          </p>
        </label>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <File size={16} className="text-[#006D77] mr-2" />
                <div>
                  <p className="text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle2 size={16} className="text-green-600 mr-2" />
                <button 
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button className="w-full mt-3 bg-[#006D77] hover:bg-[#00585F]">
        <Upload size={16} className="mr-2" />
        Upload Files
      </Button>
    </div>
  );
};

export default ClaimDocumentUploader;
