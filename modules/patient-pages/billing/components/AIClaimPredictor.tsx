import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Brain, FileSearch, CheckCircle, Search, AlertCircle, 
  FileText, X, ChevronDown, ChevronUp, FileCheck,
  Badge
} from 'lucide-react';

const AIClaimPredictor = () => {
  const [expanded, setExpanded] = useState(false);
  const [inputCPT, setInputCPT] = useState('');
  const [predictResults, setPredictResults] = useState(null);
  
  // Mock prediction data
  const mockPredictions = {
    '70450': {
      description: 'CT scan of head/brain without contrast material',
      coverageLikelihood: 92,
      estimatedReimbursement: 380.50,
      outOfPocketEstimate: 75.00,
      requiresPreAuth: true,
      requiredDocuments: [
        { name: 'Physician Referral', status: 'required' },
        { name: 'Medical Necessity Form', status: 'required' },
        { name: 'Prior Authorization', status: 'required' },
        { name: 'Patient History', status: 'recommended' }
      ],
      commonDenialReasons: [
        'Lack of medical necessity documentation',
        'Missing pre-authorization'
      ]
    },
    '99214': {
      description: 'Office/outpatient visit, established patient, moderate complexity',
      coverageLikelihood: 98,
      estimatedReimbursement: 120.75,
      outOfPocketEstimate: 25.00,
      requiresPreAuth: false,
      requiredDocuments: [
        { name: 'Provider Notes', status: 'required' },
        { name: 'Patient History', status: 'recommended' }
      ],
      commonDenialReasons: [
        'Insufficient documentation of medical necessity',
        'Incorrect patient information'
      ]
    }
  };
  
  const handlePredict = () => {
    // Simulate API call to AI prediction service
    if (inputCPT && mockPredictions[inputCPT]) {
      setPredictResults(mockPredictions[inputCPT]);
    } else {
      // Show "not found" or default data
      setPredictResults({
        description: 'Unknown procedure code',
        coverageLikelihood: 50,
        estimatedReimbursement: 0,
        outOfPocketEstimate: 0,
        requiresPreAuth: false,
        requiredDocuments: [
          { name: 'Standard Claim Form', status: 'required' }
        ],
        commonDenialReasons: [
          'Invalid procedure code',
          'Service not covered under plan'
        ]
      });
    }
  };
  
  return (
    <Card className="border-[#E8F3F4]">
      <CardHeader className="pb-2 bg-[#F0F9FA] flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center text-[#006D77]">
          <Brain className="mr-2 h-5 w-5" />
          AI Claim Predictor
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="h-8 w-8 p-0"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          Predict insurance coverage and required documentation for medical procedures before submitting a claim.
        </p>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Input
                placeholder="Enter CPT/HCPCS code (e.g. 99214)"
                value={inputCPT}
                onChange={(e) => setInputCPT(e.target.value)}
              />
            </div>
            <Button className="bg-[#006D77] hover:bg-[#00585F]" onClick={handlePredict}>
              <Search size={16} className="mr-2" />
              Predict
            </Button>
          </div>
          
          {/* Examples for easy testing */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setInputCPT('99214')}
            >
              99214 (Office Visit)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => setInputCPT('70450')}
            >
              70450 (CT Scan)
            </Button>
          </div>
        </div>
        
        {/* Prediction Results */}
        {predictResults && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-[#F0F9FA] rounded-lg border border-[#E8F3F4]">
              <h3 className="font-medium">{predictResults.description}</h3>
              
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Coverage Likelihood</span>
                    <span className="font-medium text-sm">{predictResults.coverageLikelihood}%</span>
                  </div>
                  <Progress 
                    value={predictResults.coverageLikelihood} 
                    className="h-2" 
                    indicatorClassName={`${
                      predictResults.coverageLikelihood >= 80 ? 'bg-green-500' :
                      predictResults.coverageLikelihood >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Est. Reimbursement:</span>
                    <span className="font-medium ml-1">${predictResults.estimatedReimbursement}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Out of Pocket:</span>
                    <span className="font-medium ml-1">${predictResults.outOfPocketEstimate}</span>
                  </div>
                </div>
                {predictResults.requiresPreAuth && (
                  <div className="flex items-center text-amber-700 bg-amber-50 p-2 rounded-md text-sm">
                    <AlertCircle size={16} className="mr-2" />
                    <span>Requires pre-authorization</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Required Documentation Checklist */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <FileCheck size={16} className="mr-2" />
                Required Documentation
              </h3>
              <div className="space-y-2">
                {predictResults.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      {doc.status === 'required' ? (
                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 mr-2">
                          <AlertCircle size={14} />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mr-2">
                          <FileText size={14} />
                        </div>
                      )}
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Badge className={doc.status === 'required' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}>
                      {doc.status === 'required' ? 'Required' : 'Recommended'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional information shown when expanded */}
            {expanded && (
              <div>
                <h3 className="text-sm font-medium mb-2">Common Denial Reasons</h3>
                <div className="space-y-1">
                  {predictResults.commonDenialReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start">
                      <X size={14} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIClaimPredictor;
