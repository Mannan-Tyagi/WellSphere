import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  ArrowRight,
  FileText,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ClaimSubmissionFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    providerName: '',
    serviceDate: '',
    serviceType: '',
    totalAmount: '',
    insurancePlan: '',
    memberID: '',
    groupNumber: '',
    description: '',
    receiptFile: null,
    formFile: null,
    additionalDocuments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      if (name === 'additionalDocuments') {
        setFormData({
          ...formData,
          [name]: [...formData.additionalDocuments, ...Array.from(e.target.files)]
        });
      } else {
        setFormData({
          ...formData,
          [name]: e.target.files[0]
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Remove a file from additional documents
  const removeAdditionalFile = (index) => {
    setFormData({
      ...formData,
      additionalDocuments: formData.additionalDocuments.filter((_, i) => i !== index)
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };
  
  // Check if current step is valid
  const isStepValid = () => {
    if (step === 1) {
      return formData.providerName && 
             formData.serviceDate && 
             formData.serviceType && 
             formData.totalAmount;
    }
    
    if (step === 2) {
      return formData.insurancePlan && 
             formData.memberID && 
             formData.description;
    }
    
    if (step === 3) {
      return formData.receiptFile !== null;
    }
    
    return true;
  };

  return (
    <Card className="fixed inset-0 flex flex-col max-w-3xl mx-auto my-12 overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-[#F0F9FA]">
        <h2 className="text-xl font-bold text-[#006D77]">Submit New Claim</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Progress Steps */}
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
            <div className={`mx-2 h-px w-8 bg-gray-300 ${
              step > 1 ? 'bg-green-300' : 'bg-gray-300'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 2 ? 'bg-green-100 text-green-800' : 
              step === 2 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : '2'}
            </div>
            <div className={`mx-2 h-px w-8 bg-gray-300 ${
              step > 2 ? 'bg-green-300' : 'bg-gray-300'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step > 3 ? 'bg-green-100 text-green-800' : 
              step === 3 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              {step > 3 ? <CheckCircle size={16} /> : '3'}
            </div>
            <div className={`mx-2 h-px w-8 bg-gray-300 ${
              step > 3 ? 'bg-green-300' : 'bg-gray-300'
            }`}></div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step === 4 ? 'bg-[#006D77] text-white' : 
              'bg-gray-100 text-gray-500'
            }`}>
              4
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Service Details</span>
          <span>Insurance Info</span>
          <span>Documentation</span>
          <span>Review</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow p-5 overflow-y-auto">
        {/* Step 1: Service Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Service Details</h3>
            
            <div>
              <Label htmlFor="providerName">Provider Name *</Label>
              <Input 
                id="providerName" 
                name="providerName" 
                value={formData.providerName}
                onChange={handleInputChange}
                placeholder="Healthcare provider's name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="serviceDate">Service Date *</Label>
              <Input 
                id="serviceDate" 
                name="serviceDate" 
                type="date" 
                value={formData.serviceDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">Type of Service *</Label>
              <Select 
                value={formData.serviceType} 
                onValueChange={(value) => setFormData({...formData, serviceType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office-visit">Office Visit</SelectItem>
                  <SelectItem value="lab-test">Laboratory Test</SelectItem>
                  <SelectItem value="imaging">Imaging (X-ray, MRI, etc.)</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="totalAmount">Total Amount *</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</div>
                <Input 
                  id="totalAmount" 
                  name="totalAmount" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description of Services</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the healthcare services received"
                rows={3}
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Insurance Information */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Insurance Information</h3>
            
            <div>
              <Label htmlFor="insurancePlan">Insurance Plan *</Label>
              <Select 
                value={formData.insurancePlan} 
                onValueChange={(value) => setFormData({...formData, insurancePlan: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your insurance plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue-cross">Blue Cross Blue Shield PPO Family Plan</SelectItem>
                  <SelectItem value="delta-dental">Delta Dental Complete</SelectItem>
                  <SelectItem value="other">Other (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="memberID">Member ID / Policy Number *</Label>
              <Input 
                id="memberID" 
                name="memberID" 
                value={formData.memberID}
                onChange={handleInputChange}
                placeholder="Your insurance member ID"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="groupNumber">Group Number (if applicable)</Label>
              <Input 
                id="groupNumber" 
                name="groupNumber" 
                value={formData.groupNumber}
                onChange={handleInputChange}
                placeholder="Insurance group number"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-md mt-4">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-800">Smart Claim Tip</h4>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Including your complete insurance information speeds up claim processing time by up to 35%.
              </p>
            </div>
          </div>
        )}
        
        {/* Step 3: Documentation */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Documentation</h3>
            <p className="text-sm text-gray-600">
              Upload documents to support your claim. The receipt is required, but other documentation may help expedite your claim.
            </p>
            
            <div className="space-y-6">
              <div>
                <Label className="font-medium">Receipt / Invoice *</Label>
                <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                  {formData.receiptFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-[#006D77] mr-2" />
                        <div className="text-left">
                          <p className="font-medium">{formData.receiptFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(formData.receiptFile.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFormData({...formData, receiptFile: null})}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">Drag and drop or click to upload</p>
                      <Input
                        type="file"
                        id="receiptFile"
                        name="receiptFile"
                        className="hidden"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('receiptFile').click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="font-medium">Claim Form (if applicable)</Label>
                <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                  {formData.formFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-[#006D77] mr-2" />
                        <div className="text-left">
                          <p className="font-medium">{formData.formFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(formData.formFile.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFormData({...formData, formFile: null})}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">Insurance claim form from your provider</p>
                      <Input
                        type="file"
                        id="formFile"
                        name="formFile"
                        className="hidden"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('formFile').click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="font-medium">Additional Documents</Label>
                <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                  {formData.additionalDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {formData.additionalDocuments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-6 w-6 text-[#006D77] mr-2" />
                            <div className="text-left">
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {Math.round(file.size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeAdditionalFile(index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        onClick={() => document.getElementById('additionalDocuments').click()}
                      >
                        Add More Files
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">Supporting documents like referrals or EOBs</p>
                      <Input
                        type="file"
                        id="additionalDocuments"
                        name="additionalDocuments"
                        className="hidden"
                        onChange={handleInputChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('additionalDocuments').click()}
                      >
                        Select Files
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Review */}
        {step === 4 && !submitted && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Review and Submit</h3>
            <p className="text-sm text-gray-600">
              Please review the information below before submitting your claim.
            </p>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Service Details</h4>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{formData.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Date:</span>
                  <span className="font-medium">{formData.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium">{formData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${formData.totalAmount}</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="text-sm mt-1">{formData.description}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Insurance Information</h4>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance Plan:</span>
                  <span className="font-medium">{formData.insurancePlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium">{formData.memberID}</span>
                </div>
                {formData.groupNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Number:</span>
                    <span className="font-medium">{formData.groupNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h4 className="font-medium">Documents</h4>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-[#006D77] mr-2" />
                  <span className="font-medium">{formData.receiptFile?.name || "No receipt uploaded"}</span>
                </div>
                {formData.formFile && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-[#006D77] mr-2" />
                    <span>{formData.formFile.name}</span>
                  </div>
                )}
                {formData.additionalDocuments.length > 0 && (
                  <div>
                    <span className="text-gray-600">Additional Documents:</span>
                    <ul className="ml-6 mt-1 text-sm">
                      {formData.additionalDocuments.map((file, index) => (
                        <li key={index} className="list-disc">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-md mt-4">
              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 p-1 flex-shrink-0 mr-2">
                  <CreditCard className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Reimbursement Method</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Approved claims will be reimbursed via your preferred payment method on file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Submission Success */}
        {submitted && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-center">Claim Submitted Successfully!</h3>
            <p className="text-gray-600 text-center mt-2 max-w-md">
              Your claim has been submitted and will be processed within 5-7 business days. 
              You'll receive updates via email and notifications in your account.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mt-6 w-full max-w-md">
              <div className="flex justify-between">
                <span className="text-gray-600">Claim Reference:</span>
                <span className="font-medium">CLM-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Submission Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t flex justify-between">
        {!submitted ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </Button>
            
            <Button 
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
              disabled={!isStepValid() || submitting}
            >
              {step === 4 ? (
                submitting ? (
                  <>Submitting<span className="animate-pulse">...</span></>
                ) : (
                  'Submit Claim'
                )
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
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
}
