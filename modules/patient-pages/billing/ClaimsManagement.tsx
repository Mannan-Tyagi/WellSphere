import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, Clock, 
  FileQuestion, Filter, Search, Download, ChevronRight, 
  ArrowRight, X, AlertCircle, FilePlus 
} from 'lucide-react';

import AIClaimPredictor from './components/AIClaimPredictor';
import ClaimDocumentUploader from './components/ClaimDocumentUploader';
import ClaimSubmissionFlow from './components/ClaimSubmissionFlow';

const ClaimsManagement = () => {
  const [claimsTab, setClaimsTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showClaimFlow, setShowClaimFlow] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  
  // Mock claims data
  const claims = {
    active: [
      {
        id: 'claim-1001',
        provider: 'City Medical Center',
        service: 'MRI Scan - Lower Back',
        serviceDate: '2025-03-15',
        submissionDate: '2025-03-18',
        amount: 1250.00,
        status: 'processing',
        insuranceCompany: 'BlueCross Health',
        coverageLikelihood: 85,
        estimatedReimbursement: 950.00,
        documentationComplete: 90,
        claimNumber: 'INS-483921',
        history: [
          { date: '2025-03-18', status: 'submitted', note: 'Claim submitted to BlueCross Health' },
          { date: '2025-03-19', status: 'received', note: 'Claim received by insurance' },
          { date: '2025-03-22', status: 'processing', note: 'Claim in processing' }
        ],
        missingDocuments: ['Referral Documentation']
      },
      {
        id: 'claim-1002',
        provider: 'Dr. Robert Williams',
        service: 'Specialist Consultation',
        serviceDate: '2025-03-10',
        submissionDate: '2025-03-12',
        amount: 350.00,
        status: 'pending',
        insuranceCompany: 'BlueCross Health',
        coverageLikelihood: 95,
        estimatedReimbursement: 280.00,
        documentationComplete: 100,
        claimNumber: 'INS-482715',
        history: [
          { date: '2025-03-12', status: 'submitted', note: 'Claim submitted to BlueCross Health' },
          { date: '2025-03-14', status: 'received', note: 'Claim received by insurance' },
          { date: '2025-03-17', status: 'pending', note: 'Additional review required' }
        ],
        missingDocuments: []
      }
    ],
    completed: [
      {
        id: 'claim-0985',
        provider: 'Neighborhood Pharmacy',
        service: 'Prescription Medications',
        serviceDate: '2025-02-25',
        submissionDate: '2025-02-27',
        amount: 120.25,
        status: 'approved',
        insuranceCompany: 'BlueCross Health',
        paidAmount: 96.20,
        outOfPocket: 24.05,
        paymentDate: '2025-03-10',
        claimNumber: 'INS-479320',
        history: [
          { date: '2025-02-27', status: 'submitted', note: 'Claim submitted to BlueCross Health' },
          { date: '2025-03-02', status: 'processing', note: 'Claim in processing' },
          { date: '2025-03-08', status: 'approved', note: 'Claim approved' },
          { date: '2025-03-10', status: 'paid', note: 'Payment processed' }
        ]
      },
      {
        id: 'claim-0972',
        provider: 'City Medical Center',
        service: 'Annual Physical',
        serviceDate: '2025-02-10',
        submissionDate: '2025-02-12',
        amount: 450.00,
        status: 'denied',
        insuranceCompany: 'BlueCross Health',
        denialReason: 'Service not covered under current plan',
        appealStatus: 'eligible',
        appealDeadline: '2025-05-12',
        claimNumber: 'INS-476842',
        history: [
          { date: '2025-02-12', status: 'submitted', note: 'Claim submitted to BlueCross Health' },
          { date: '2025-02-15', status: 'processing', note: 'Claim in processing' },
          { date: '2025-03-01', status: 'denied', note: 'Claim denied - Service not covered under current plan' }
        ]
      }
    ]
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Denied</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const startNewClaim = () => {
    setShowClaimFlow(true);
  };

  return (
    <div className="space-y-6">
      {showClaimFlow ? (
        <ClaimSubmissionFlow onClose={() => setShowClaimFlow(false)} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-[#006D77]">Claims Management</h2>
              <p className="text-gray-600 text-sm">Track and manage your insurance claims</p>
            </div>
            <Button 
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={startNewClaim}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Submit New Claim
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center text-[#006D77]">
                    <FileText className="mr-2 h-5 w-5" />
                    Your Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Tabs value={claimsTab} onValueChange={setClaimsTab} className="w-[300px]">
                      <TabsList>
                        <TabsTrigger value="active" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
                          Active ({claims.active.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
                          Completed ({claims.completed.length})
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="flex items-center">
                      <div className="relative mr-2">
                        <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search claims..."
                          className="pl-8 pr-4 py-2 text-sm border rounded-md w-[180px]"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilter(!showFilter)}
                        className={showFilter ? 'bg-[#F0F9FA] text-[#006D77] border-[#006D77]' : ''}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Filter options - shown conditionally */}
                  {showFilter && (
                    <div className="bg-[#F0F9FA] p-3 rounded-md mb-4 border border-[#E8F3F4]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Filter Claims</h3>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowFilter(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select className="p-2 text-sm border rounded-md">
                          <option value="">All Providers</option>
                          <option value="City Medical Center">City Medical Center</option>
                          <option value="Dr. Robert Williams">Dr. Robert Williams</option>
                        </select>
                        <select className="p-2 text-sm border rounded-md">
                          <option value="">All Insurance</option>
                          <option value="BlueCross Health">BlueCross Health</option>
                        </select>
                        <select className="p-2 text-sm border rounded-md">
                          <option value="">All Time</option>
                          <option value="last30">Last 30 Days</option>
                          <option value="last90">Last 90 Days</option>
                          <option value="thisYear">This Year</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <TabsContent value="active" className="m-0">
                    <div className="space-y-3">
                      {claims.active.map(claim => (
                        <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-medium">{claim.service}</h3>
                              <p className="text-sm text-gray-600">{claim.provider}</p>
                              <div className="flex items-center mt-1">
                                <Clock size={14} className="text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  Submitted: {claim.submissionDate}
                                </span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-xs text-gray-500">Claim #{claim.claimNumber}</span>
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 flex flex-col items-end">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="text-sm text-right">Amount: <span className="font-medium">${claim.amount.toFixed(2)}</span></p>
                                  <p className="text-xs text-gray-500 text-right">Est. Coverage: ${claim.estimatedReimbursement.toFixed(2)}</p>
                                </div>
                                {getStatusBadge(claim.status)}
                              </div>
                              
                              <div className="w-full mt-2 flex items-center">
                                <span className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                                  Coverage Likelihood: {claim.coverageLikelihood}%
                                </span>
                                <Progress 
                                  value={claim.coverageLikelihood} 
                                  className="h-2"
                                  indicatorClassName={`${
                                    claim.coverageLikelihood > 70 ? 'bg-green-500' : 
                                    claim.coverageLikelihood > 40 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Missing documentation warning */}
                          {claim.missingDocuments && claim.missingDocuments.length > 0 && (
                            <div className="mt-3 flex items-start p-2 rounded-md bg-amber-50 border border-amber-100">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-amber-800">Missing documentation may delay processing</p>
                                <p className="text-xs text-amber-700">
                                  Required: {claim.missingDocuments.join(', ')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed" className="m-0">
                    <div className="space-y-3">
                      {claims.completed.map(claim => (
                        <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="font-medium">{claim.service}</h3>
                              <p className="text-sm text-gray-600">{claim.provider}</p>
                              <div className="flex items-center mt-1">
                                <Clock size={14} className="text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">Service: {claim.serviceDate}</span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-xs text-gray-500">Claim #{claim.claimNumber}</span>
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 flex flex-col items-end">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="text-sm text-right">Amount: <span className="font-medium">${claim.amount.toFixed(2)}</span></p>
                                  {claim.status === 'approved' && (
                                    <p className="text-xs text-green-600 text-right">Reimbursed: ${claim.paidAmount.toFixed(2)}</p>
                                  )}
                                </div>
                                {getStatusBadge(claim.status)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Denial reason & appeal info */}
                          {claim.status === 'denied' && (
                            <div className="mt-3 flex items-start p-2 rounded-md bg-red-50 border border-red-100">
                              <AlertCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-red-800">Reason: {claim.denialReason}</p>
                                {claim.appealStatus === 'eligible' && (
                                  <div className="flex items-center mt-1">
                                    <p className="text-xs text-red-700">
                                      Appeal by: {claim.appealDeadline}
                                    </p>
                                    <Button 
                                      variant="link" 
                                      className="text-xs text-red-700 p-0 h-auto ml-2 underline"
                                    >
                                      File Appeal
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-1/3">
              <AIClaimPredictor />
            </div>
          </div>
          
          {/* Claim Detail Modal - would show when a claim is selected */}
          {selectedClaim && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
                  <h3 className="text-lg font-medium">Claim Details</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedClaim(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{selectedClaim.service}</h2>
                      <p className="text-gray-600">{selectedClaim.provider}</p>
                      <p className="text-sm text-gray-500">Claim #{selectedClaim.claimNumber}</p>
                    </div>
                    <div>
                      {getStatusBadge(selectedClaim.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Service Date</p>
                      <p className="font-medium">{selectedClaim.serviceDate}</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="font-medium">{selectedClaim.submissionDate}</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">${selectedClaim.amount.toFixed(2)}</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Insurance</p>
                      <p className="font-medium">{selectedClaim.insuranceCompany}</p>
                    </div>
                  </div>
                  
                  {/* Status history timeline */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Claim History</h3>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-4">
                        {selectedClaim.history.map((event, idx) => (
                          <div key={idx} className="flex items-start ml-6 relative">
                            <div className="absolute -left-9 top-0">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                event.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                event.status === 'received' ? 'bg-purple-100 text-purple-800' :
                                event.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                event.status === 'paid' ? 'bg-green-100 text-green-800' :
                                event.status === 'denied' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.status === 'submitted' ? <Upload size={14} /> :
                                 event.status === 'received' ? <FileText size={14} /> :
                                 event.status === 'processing' ? <Clock size={14} /> :
                                 event.status === 'approved' ? <CheckCircle size={14} /> :
                                 event.status === 'paid' ? <CheckCircle size={14} /> :
                                 event.status === 'denied' ? <X size={14} /> :
                                 <FileQuestion size={14} />
                                }
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <p className="font-medium text-sm capitalize">{event.status}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                              <p className="text-sm text-gray-600">{event.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <Button variant="outline" className="flex items-center text-sm">
                      <Download size={14} className="mr-2" />
                      Download EOB
                    </Button>
                    
                    {selectedClaim.status === 'approved' ? (
                      <Button className="bg-[#006D77] hover:bg-[#00585F] flex items-center text-sm">
                        View Payment Details
                        <ChevronRight size={14} className="ml-2" />
                      </Button>
                    ) : selectedClaim.status === 'denied' ? (
                      <Button className="bg-red-600 hover:bg-red-700 flex items-center text-sm">
                        File Appeal
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    ) : (
                      <Button className="bg-[#006D77] hover:bg-[#00585F] flex items-center text-sm">
                        Check Status
                        <ChevronRight size={14} className="ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClaimsManagement;
