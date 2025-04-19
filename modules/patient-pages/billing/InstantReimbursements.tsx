import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  QrCode, CreditCard, Zap, Upload, CheckCircle, 
  Camera, Clock, ArrowRight, Download, FileCheck, AlertTriangle,
  X, FileText, Mail, Share, Copy
} from 'lucide-react';

const InstantReimbursements = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showProcessing, setShowProcessing] = useState(false);
  
  // Mock reimbursement requests
  const reimbursements = [
    {
      id: 'reimb-1001',
      provider: 'City Medical Center',
      service: 'Specialist Consultation',
      serviceDate: '2025-03-15',
      amount: 250.00,
      status: 'approved',
      reimbursementAmount: 200.00,
      processedDate: '2025-03-18',
      paymentMethod: 'Direct Deposit',
      estimatedArrival: '1-2 business days'
    },
    {
      id: 'reimb-1002',
      provider: 'Neighborhood Pharmacy',
      service: 'Prescription Medication',
      serviceDate: '2025-03-10',
      amount: 85.75,
      status: 'processing',
      reimbursementAmount: 68.60,
      processedDate: null,
      paymentMethod: 'Direct Deposit',
      estimatedArrival: 'Pending'
    }
  ];
  
  const handleSubmit = () => {
    setShowProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setShowProcessing(false);
      setActiveStep(3);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#006D77]">Instant Reimbursements</h2>
          <p className="text-gray-600 text-sm">Get faster reimbursements with QR-based claim submission</p>
        </div>
        
        <Button className="bg-[#006D77] hover:bg-[#00585F]">
          <QrCode size={16} className="mr-2" />
          New Reimbursement Request
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Quick Reimbursement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
                    <h3 className="font-medium mb-3">Submit Reimbursement Request</h3>
                    <p className="text-sm text-gray-600">Choose how you'd like to submit your receipt or bill for reimbursement</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div 
                        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setActiveStep(2)}
                      >
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0">
                            <QrCode size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Scan QR Code</h4>
                            <p className="text-sm text-gray-600 mt-1">Scan the QR code on your medical bill or receipt</p>
                            <Button variant="link" className="p-0 h-auto text-blue-600 mt-1 text-sm">
                              Start Scanning <ArrowRight size={12} className="ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setActiveStep(2)}
                      >
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3 flex-shrink-0">
                            <Camera size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Upload Receipt</h4>
                            <p className="text-sm text-gray-600 mt-1">Take a photo or upload a digital copy of your receipt</p>
                            <Button variant="link" className="p-0 h-auto text-green-600 mt-1 text-sm">
                              Upload Files <ArrowRight size={12} className="ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Zap size={18} className="mr-2 text-amber-500" />
                      Why Use Instant Reimbursements?
                    </h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span>Faster processing with AI-powered code matching</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span>Direct deposit available for approved claims</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span>Automatically matches to your insurance policy</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5" />
                        <span>Track reimbursement status in real-time</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Receipt Analysis</h3>
                        <p className="text-sm text-gray-600">We've automatically extracted the following information</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveStep(1)}>
                        Back
                      </Button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-medium">City Medical Center</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Date</p>
                        <p className="font-medium">March 22, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-medium">Outpatient Visit</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">$175.00</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CPT Code</p>
                        <p className="font-medium">99213 (Office Visit, Established Patient)</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Diagnosis Code</p>
                        <p className="font-medium">J45.901 (Unspecified asthma)</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-start">
                      <CheckCircle size={18} className="text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Auto-matched to your insurance plan</p>
                        <p className="text-xs text-green-700">BlueCross Health PPO - Member ID: BC12345678</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Estimated Reimbursement:</p>
                        <p className="font-bold text-[#006D77]">$140.00 (80% of eligible amount)</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Final reimbursement amount may vary based on insurance processing</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <Button variant="outline" onClick={() => setActiveStep(1)}>
                        Edit Details
                      </Button>
                      <Button 
                        className="bg-[#006D77] hover:bg-[#00585F]"
                        onClick={handleSubmit}
                        disabled={showProcessing}
                      >
                        {showProcessing ? (
                          <>Processing<span className="animate-pulse">...</span></>
                        ) : (
                          <>Submit for Reimbursement</>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {showProcessing && (
                    <div className="mt-4 p-4 border rounded-lg bg-white text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full border-2 border-[#006D77] border-t-transparent animate-spin mb-3"></div>
                        <h3 className="font-medium text-[#006D77]">Processing Your Reimbursement</h3>
                        <p className="text-sm text-gray-600 mt-1">This will just take a moment...</p>
                        
                        <div className="w-full mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Validating receipt...</span>
                            <span>Complete</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                        
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Matching insurance codes...</span>
                            <span>Complete</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                        
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Calculating reimbursement...</span>
                            <span>Complete</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                        
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Submitting claim...</span>
                            <span>In progress</span>
                          </div>
                          <Progress value={60} className="h-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-medium text-[#006D77]">Reimbursement Request Submitted!</h3>
                    <p className="text-gray-600 mt-2">
                      Your request has been successfully submitted to BlueCross Health.
                    </p>
                    
                    <div className="mt-4 inline-block bg-white rounded-lg border p-4 text-left">
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div className="text-gray-600">Request ID:</div>
                        <div className="font-medium">REQ-238577</div>
                        
                        <div className="text-gray-600">Amount:</div>
                        <div className="font-medium">$175.00</div>
                        
                        <div className="text-gray-600">Expected Reimbursement:</div>
                        <div className="font-medium text-green-600">$140.00</div>
                        
                        <div className="text-gray-600">Status:</div>
                        <div className="font-medium text-blue-600">Processing</div>
                        
                        <div className="text-gray-600">Estimated Arrival:</div>
                        <div className="font-medium">3-5 business days</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-3 mt-6">
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download Receipt
                      </Button>
                      <Button className="bg-[#006D77] hover:bg-[#00585F]">
                        Track Reimbursement
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">What Happens Next?</h3>
                    <ol className="space-y-2 ml-5 list-decimal text-sm">
                      <li>Your request is being validated by our AI system</li>
                      <li>BlueCross Health will process your claim (typically 1-2 business days)</li>
                      <li>Once approved, reimbursement will be sent via your selected payment method</li>
                      <li>You'll receive notifications at each step of the process</li>
                    </ol>
                    
                    <Button variant="link" className="mt-2 p-0 h-auto text-[#006D77]" onClick={() => setActiveStep(1)}>
                      Submit another reimbursement request
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Reimbursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reimbursements.map(reimb => (
                  <div key={reimb.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{reimb.service}</h4>
                        <p className="text-sm text-gray-600">{reimb.provider}</p>
                        <p className="text-xs text-gray-500 mt-1">Service date: {reimb.serviceDate}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        reimb.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reimb.status === 'approved' ? 'Approved' : 'Processing'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-baseline mt-2 pt-2 border-t">
                      <div>
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="ml-1 font-medium">${reimb.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Reimbursed:</span>
                        <span className="ml-1 font-medium text-green-600">${reimb.reimbursementAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      {reimb.status === 'approved' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span>{reimb.paymentMethod}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Arrival:</span>
                          <span>{reimb.estimatedArrival}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  View All Reimbursements
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3 bg-[#F0F9FA]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 10H22V8H2V10ZM2 16H22V14H2V16Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Direct Deposit</p>
                        <p className="text-xs text-gray-600">Bank of America ****6789</p>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Default</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white mr-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 8v8h-2V8h2zm-4-4v16h-2V4h2zm-8 8v8H5v-8h2zm4-4v12H9V8h2z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Health Savings Account</p>
                      <p className="text-xs text-gray-600">HSA ****3456</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstantReimbursements;
