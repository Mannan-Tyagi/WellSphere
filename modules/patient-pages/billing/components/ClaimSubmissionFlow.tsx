import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, Upload, ArrowRight, CheckCircle, FileText, Clipboard, 
  Pencil, FileCheck, QrCode, Scan, Camera, CheckCircle2
} from 'lucide-react';

import ClaimDocumentUploader from './ClaimDocumentUploader';

interface ClaimSubmissionFlowProps {
  onClose: () => void;
}

const ClaimSubmissionFlow: React.FC<ClaimSubmissionFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [claimData, setClaimData] = useState({
    provider: '',
    serviceDate: '',
    cptCodes: '',
    diagnosis: '',
    amount: '',
    selectedDocuments: [],
    selectedInsurance: ''
  });
  
  // Mock insurance options
  const insuranceOptions = [
    { id: 'ins1', name: 'BlueCross Health', plan: 'PPO 1500', memberID: 'BC12345678' },
    { id: 'ins2', name: 'Medicare', plan: 'Part B', memberID: 'M987654321' }
  ];
  
  const handleChange = (field, value) => {
    setClaimData({
      ...claimData,
      [field]: value
    });
  };
  
  const handleDocumentsSelected = (documents) => {
    setClaimData({
      ...claimData,
      selectedDocuments: documents
    });
  };
  
  const handleSubmit = () => {
    // Submit claim data to backend
    console.log('Submitting claim:', claimData);
    // Move to confirmation step
    setStep(5);
  };

  return (
    <Card className="border-[#E8F3F4]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#006D77]">Submit New Claim</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Step indicators */}
      <div className="p-4 border-b bg-[#F0F9FA]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 1 ? 'bg-green-100 text-green-800' : 
              step === 1 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 1 ? <CheckCircle size={16} /> : '1'}
            </div>
            <div className="mx-2 h-px w-8 bg-gray-300"></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 2 ? 'bg-green-100 text-green-800' : 
              step === 2 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : '2'}
            </div>
            <div className="mx-2 h-px w-8 bg-gray-300"></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 3 ? 'bg-green-100 text-green-800' : 
              step === 3 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 3 ? <CheckCircle size={16} /> : '3'}
            </div>
            <div className="mx-2 h-px w-8 bg-gray-300"></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 4 ? 'bg-green-100 text-green-800' : 
              step === 4 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 4 ? <CheckCircle size={16} /> : '4'}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Step {step} of 4: {
              step === 1 ? 'Upload Bill' : 
              step === 2 ? 'AI Audit' : 
              step === 3 ? 'Insurance Matching' : 
              step === 4 ? 'E-Sign & Submit' : 
              'Confirmation'
            }
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Step 1: Upload Bill */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload your medical bill</h3>
            <p className="text-gray-600">Upload a bill or enter the bill details manually</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-[#F0F9FA] flex items-center justify-center text-[#006D77] mb-2">
                  <QrCode size={24} />
                </div>
                <h3 className="font-medium">Scan QR Code</h3>
                <p className="text-xs text-gray-500 mt-1">Use your camera to scan the QR code on your bill</p>
                <Button className="mt-3 bg-[#006D77] hover:bg-[#00585F]">
                  <Camera size={16} className="mr-2" />
                  Scan Now
                </Button>
              </div>
              
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-[#F0F9FA] flex items-center justify-center text-[#006D77] mb-2">
                  <Upload size={24} />
                </div>
                <h3 className="font-medium">Upload Files</h3>
                <p className="text-xs text-gray-500 mt-1">Upload bill PDFs or images</p>
                <ClaimDocumentUploader onDocumentsSelected={handleDocumentsSelected} />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">Or enter bill details manually</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="provider">Healthcare Provider</Label>
                  <Input 
                    id="provider" 
                    placeholder="Provider or facility name"
                    value={claimData.provider}
                    onChange={(e) => handleChange('provider', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="serviceDate">Service Date</Label>
                    <Input 
                      id="serviceDate" 
                      type="date"
                      value={claimData.serviceDate}
                      onChange={(e) => handleChange('serviceDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Total Amount</Label>
                    <Input 
                      id="amount" 
                      placeholder="$0.00"
                      value={claimData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cptCodes">CPT/HCPCS Codes</Label>
                  <Input 
                    id="cptCodes" 
                    placeholder="e.g. 99214, 85025"
                    value={claimData.cptCodes}
                    onChange={(e) => handleChange('cptCodes', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple codes with commas</p>
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis (ICD-10)</Label>
                  <Input 
                    id="diagnosis" 
                    placeholder="e.g. J45.901"
                    value={claimData.diagnosis}
                    onChange={(e) => handleChange('diagnosis', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: AI Audit */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">AI-powered Bill Audit</h3>
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle size={16} className="mr-1" />
                <span className="text-sm font-medium">Audit Complete</span>
              </div>
            </div>
            
            <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{claimData.provider || 'City Medical Center'}</h4>
                  <p className="text-sm text-gray-600">{claimData.serviceDate || '2025-03-22'}</p>
                </div>
                <div className="text-lg font-bold">${claimData.amount || '320.75'}</div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="text-sm">All charges appear reasonable</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="text-sm">CPT codes match provided services</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="text-sm">No duplicate charges detected</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="text-sm">ICD-10 diagnosis codes are valid</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Insurance Coverage Estimate</h4>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="text-sm">BlueCross Health PPO</span>
                </div>
                <div className="text-sm font-medium">Coverage: 80%</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Estimated out-of-pocket:</div>
                <div className="font-medium">${(parseFloat(claimData.amount || '320.75') * 0.2).toFixed(2)}</div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Required Documentation</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileCheck size={16} className="mr-2 text-green-600" />
                    <span className="text-sm">Itemized Bill</span>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Detected</div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileCheck size={16} className="mr-2 text-green-600" />
                    <span className="text-sm">Insurance Card</span>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">On File</div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-amber-600" />
                    <span className="text-sm">Proof of Payment</span>
                  </div>
                  <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Optional</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Insurance Matching */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Insurance Plan</h3>
            <p className="text-gray-600">Choose the insurance plan for this claim</p>
            
            <div className="space-y-3">
              {insuranceOptions.map(insurance => (
                <div 
                  key={insurance.id}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                    claimData.selectedInsurance === insurance.id ? 'border-[#006D77] bg-[#F0F9FA]' : ''
                  }`}
                  onClick={() => handleChange('selectedInsurance', insurance.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{insurance.name}</h4>
                      <p className="text-sm text-gray-600">{insurance.plan}</p>
                      <p className="text-xs text-gray-500 mt-1">Member ID: {insurance.memberID}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      claimData.selectedInsurance === insurance.id 
                        ? 'border-[#006D77] bg-[#006D77] text-white' 
                        : 'border-gray-300'
                    }`}>
                      {claimData.selectedInsurance === insurance.id && <CheckCircle size={12} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2">Auto-Matched Insurance Codes</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#006D77] text-white rounded-full flex items-center justify-center mr-2">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">CPT Codes Matched</p>
                      <p className="text-xs text-gray-600">99214: Office Visit, Established Patient</p>
                    </div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    100% Match
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#006D77] text-white rounded-full flex items-center justify-center mr-2">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ICD-10 Diagnosis Matched</p>
                      <p className="text-xs text-gray-600">J45.901: Unspecified asthma with (acute) exacerbation</p>
                    </div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    100% Match
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: E-Sign & Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review & Submit Claim</h3>
            <p className="text-gray-600">Please review your claim information and sign to submit</p>
            
            <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
              <h4 className="font-medium mb-3">Claim Summary</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-600">Healthcare Provider:</div>
                <div className="font-medium">{claimData.provider || 'City Medical Center'}</div>
                
                <div className="text-gray-600">Service Date:</div>
                <div className="font-medium">{claimData.serviceDate || '2025-03-22'}</div>
                
                <div className="text-gray-600">Total Amount:</div>
                <div className="font-medium">${claimData.amount || '320.75'}</div>
                
                <div className="text-gray-600">Insurance Plan:</div>
                <div className="font-medium">
                  {insuranceOptions.find(i => i.id === claimData.selectedInsurance)?.name || 'BlueCross Health'} - 
                  {insuranceOptions.find(i => i.id === claimData.selectedInsurance)?.plan || 'PPO 1500'}
                </div>
                
                <div className="text-gray-600">Member ID:</div>
                <div className="font-medium">
                  {insuranceOptions.find(i => i.id === claimData.selectedInsurance)?.memberID || 'BC12345678'}
                </div>
                
                <div className="text-gray-600">Estimated Coverage:</div>
                <div className="font-medium text-green-600">
                  $256.60 (80%)
                </div>
                
                <div className="text-gray-600">Estimated Out-of-Pocket:</div>
                <div className="font-medium">
                  $64.15 (20%)
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Documentation</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-[#006D77]" />
                    <span className="text-sm">Itemized Bill.pdf</span>
                  </div>
                  <div className="text-xs text-green-600">Uploaded</div>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-[#006D77]" />
                    <span className="text-sm">Insurance Card.jpg</span>
                  </div>
                  <div className="text-xs text-green-600">On File</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-start mb-4">
                <div className="border border-dashed rounded w-40 h-24 flex items-center justify-center mr-4">
                  <p className="text-sm text-gray-500">Sign here</p>
                </div>
                <div>
                  <h4 className="font-medium">Electronic Signature</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    By signing, I certify that the information provided is true and accurate to the best of my knowledge.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Pencil size={14} className="mr-1" /> Clear Signature
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" id="agreement" className="mr-2" />
                <Label htmlFor="agreement" className="text-sm">
                  I authorize the release of any medical information necessary to process this claim.
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-4 text-center">
            <div className="py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-medium">Claim Submitted Successfully!</h3>
              <p className="text-gray-600 mt-2">
                Your claim has been submitted to BlueCross Health for processing.
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium">Claim ID: CL-25863149</p>
                <p className="text-sm text-gray-600">Submitted on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">What Happens Next?</h4>
              <ol className="text-sm space-y-2 list-decimal pl-5">
                <li>Your claim is being processed by BlueCross Health</li>
                <li>You'll receive notifications as your claim progresses</li>
                <li>Typical processing time is 2-4 weeks</li>
                <li>Once approved, reimbursement will be issued based on your plan benefits</li>
              </ol>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="p-4 border-t flex justify-between">
        {step < 5 ? (
          <>
            <Button 
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button 
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            >
              {step === 4 ? 'Submit Claim' : 'Continue'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </>
        ) : (
          <Button 
            className="bg-[#006D77] hover:bg-[#00585F] w-full"
            onClick={onClose}
          >
            Back to Dashboard
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ClaimSubmissionFlow;
