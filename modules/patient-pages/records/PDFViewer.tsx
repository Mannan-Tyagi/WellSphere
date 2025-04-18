"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share2, 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  X,
  PenTool
} from 'lucide-react';

interface PDFViewerProps {
  documentUrl: string;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  documentUrl,
  documentTitle,
  isOpen,
  onClose
}) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAnnotating, setIsAnnotating] = useState(false);
  
  const zoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };
  
  const zoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const toggleAnnotationMode = () => {
    setIsAnnotating(!isAnnotating);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 py-3 border-b flex flex-row justify-between items-center">
          <DialogTitle className="text-lg">{documentTitle}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {/* PDF Document would be rendered here using a library like react-pdf */}
          <div 
            className="bg-white shadow-md mx-auto transition-all" 
            style={{ 
              width: `${zoom}%`, 
              maxWidth: '2000px', 
              minHeight: '500px',
              position: 'relative'
            }}
          >
            {documentUrl ? (
              // Placeholder for PDF rendering
              <div className="w-full h-full flex items-center justify-center">
                <iframe src={`${documentUrl}#toolbar=0`} className="w-full h-[70vh]" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No document to display
              </div>
            )}
            
            {isAnnotating && (
              <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 p-2 rounded-md text-xs">
                Annotation mode: Click anywhere on the document to add notes
              </div>
            )}
          </div>
        </div>
        
        <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage <= 1}>
              <ArrowLeft size={16} />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage >= totalPages}>
              <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAnnotationMode}
              className={isAnnotating ? "bg-amber-100 text-amber-800 border-amber-300" : ""}
            >
              <PenTool size={16} className="mr-1" />
              {isAnnotating ? "Stop Annotating" : "Annotate"}
            </Button>
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 200}>
              <ZoomIn size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer size={16} className="mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
