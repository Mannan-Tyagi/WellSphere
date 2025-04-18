"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  X, 
  Check, 
  RotateCcw, 
  Eye, 
  FlaskConical, 
  Pill, 
  AlertCircle, 
  Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PillIdentificationARProps {
  medicationId?: string;  // Optional - if identifying a specific medication
  onIdentified?: (result: PillIdentificationResult) => void;
  onClose?: () => void;
}

interface PillIdentificationResult {
  name: string;
  dosage: string;
  color: string;
  shape: string;
  markings: string;
  confidence: number;
  matchesPrescription?: boolean;
}

const PillIdentificationAR: React.FC<PillIdentificationARProps> = ({ 
  medicationId, 
  onIdentified,
  onClose 
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PillIdentificationResult | null>(null);
  const [arActive, setArActive] = useState(false);
  const [overlayInfo, setOverlayInfo] = useState<{x: number, y: number, text: string}[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Activate camera
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Show fallback UI for camera access error
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  // Take photo and analyze
  const captureAndAnalyze = () => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame on canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Start analysis
    setAnalyzing(true);
    
    // Simulate API call to pill identification service
    setTimeout(() => {
      // Mock result for demonstration
      const mockResult: PillIdentificationResult = {
        name: "Lisinopril",
        dosage: "10mg",
        color: "White",
        shape: "Round",
        markings: "L10",
        confidence: 92,
        matchesPrescription: true
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      
      if (onIdentified) {
        onIdentified(mockResult);
      }
    }, 2000);
  };
  
  // Start AR demonstration
  const startARDemo = () => {
    setArActive(true);
    
    // Set overlay information points
    setOverlayInfo([
      { x: 50, y: 30, text: "Markings indicate 10mg dosage" },
      { x: 30, y: 60, text: "White color confirms this is Lisinopril" },
      { x: 70, y: 70, text: "Round shape is consistent with prescription" }
    ]);
  };
  
  // Reset everything
  const resetIdentification = () => {
    setResult(null);
    setArActive(false);
    setOverlayInfo([]);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="overflow-hidden">
        <div className="relative bg-black aspect-square">
          {/* Video preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
          />
          
          {/* Canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Non-active state */}
          {!cameraActive && !result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
              <Camera className="h-12 w-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Pill Identification</h3>
              <p className="text-sm text-gray-300 text-center max-w-xs mb-6">
                Scan your medication to verify and learn how to take it properly
              </p>
              <Button onClick={activateCamera} className="bg-[#006D77] hover:bg-[#00585F]">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}
          
          {/* Analyzing overlay */}
          {analyzing && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
              <FlaskConical className="h-10 w-10 mb-4 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Analyzing Pill</h3>
              <div className="w-48 mb-4">
                <Progress value={65} className="h-1" />
              </div>
              <p className="text-sm text-gray-300">Comparing with database...</p>
            </div>
          )}
          
          {/* Result overlay */}
          {result && !arActive && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
              <div className="w-full max-w-xs bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-[#006D77]" />
                    <h3 className="text-lg font-medium">{result.name}</h3>
                  </div>
                  <Badge className={result.matchesPrescription ? "bg-green-500" : "bg-amber-500"}>
                    {result.matchesPrescription ? "Match" : "Verify"}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dosage:</span>
                    <span className="font-medium">{result.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Color:</span>
                    <span>{result.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shape:</span>
                    <span>{result.shape}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Markings:</span>
                    <span>{result.markings}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                  <span>Confidence:</span>
                  <span>{result.confidence}%</span>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#006D77] hover:bg-[#00585F]" onClick={startARDemo}>
                    <Eye className="h-4 w-4 mr-1" />
                    AR Demo
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={resetIdentification}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Rescan
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* AR Demonstration overlay */}
          {arActive && (
            <div className="absolute inset-0">
              {/* Overlay information points */}
              {overlayInfo.map((info, index) => (
                <div 
                  key={index}
                  className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded-md"
                  style={{ left: `${info.x}%`, top: `${info.y}%` }}
                >
                  <div className="relative">
                    <div className="absolute w-2 h-2 bg-[#006D77] rounded-full -left-3 top-1/2 transform -translate-y-1/2"></div>
                    {info.text}
                  </div>
                </div>
              ))}
              
              {/* AR controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button variant="outline" className="bg-black/50 text-white border-white"
                  onClick={() => setArActive(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Exit AR Mode
                </Button>
              </div>
            </div>
          )}
          
          {/* Camera active controls */}
          {cameraActive && !analyzing && !result && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button variant="outline" className="bg-black/50 text-white border-white" onClick={stopCamera}>
                <X className="h-5 w-5" />
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200" size="lg" onClick={captureAndAnalyze}>
                <Camera className="h-6 w-6" />
              </Button>
              <Button variant="outline" className="bg-black/50 text-white border-white invisible">
                <Check className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        {cameraActive && !analyzing && !result && (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs flex items-start">
            <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <p>
              Center the pill in the frame. Ensure good lighting for best results.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PillIdentificationAR;
