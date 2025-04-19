"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, FileText, ArrowRight, BarChart, DollarSign, Zap, 
  Upload, Plus, Clock, CheckCircle, AlertTriangle, Search, Coins
} from 'lucide-react';

import ClaimsManagement from './ClaimsManagement';
import CostTransparency from './CostTransparency';
import InstantReimbursements from './InstantReimbursements';
import InsuranceInfo from './InsuranceInfo';
import PaymentHistory from './PaymentHistory';

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock account summary data
  const accountSummary = {
    currentBalance: 320.75,
    pendingClaims: 3,
    approvedClaims: 8,
    deniedClaims: 1,
    inProcessPayments: 540.00,
    lastPaymentDate: '2025-03-15',
    lastPaymentAmount: 150.00
  };

  // Mock upcoming bills
  const upcomingBills = [
    {
      id: 'bill-001',
      provider: 'City Medical Center',
      dueDate: new Date('2025-04-10'),
      amount: 220.50,
      description: 'Lab work - Comprehensive Blood Panel',
      status: 'unpaid',
      insuranceStatus: 'pending',
      coverageEstimate: 180.40
    },
    {
      id: 'bill-002',
      provider: 'Dr. Robert Williams',
      dueDate: new Date('2025-04-15'),
      amount: 100.25,
      description: 'Follow-up Visit (3/22/2025)',
      status: 'unpaid',
      insuranceStatus: 'approved',
      coverageEstimate: 80.20
    }
  ];

  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#006D77]">Billing & Insurance</h1>
          <p className="text-gray-600 mt-1">Manage your healthcare finances in one place</p>
        </div>
        
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="border-[#006D77] text-[#006D77]"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Make a Payment
          </Button>
          <Button 
            className="bg-[#006D77] hover:bg-[#00585F]"
          >
            <FileText className="mr-2 h-4 w-4" />
            Submit Claim
          </Button>
        </div>
      </div>

      {/* Account Summary */}
      <Card className="mb-6 border-[#E8F3F4]">
        <CardHeader className="pb-2 bg-[#F0F9FA]">
          <CardTitle className="text-lg flex items-center text-[#006D77]">
            <DollarSign className="mr-2 h-5 w-5" />
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold text-[#006D77]">${accountSummary.currentBalance.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-500">Pending Claims</p>
              <p className="text-2xl font-bold text-amber-600">{accountSummary.pendingClaims}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-blue-600">${accountSummary.inProcessPayments.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-500">Last Payment</p>
              <p className="text-2xl font-bold text-green-600">${accountSummary.lastPaymentAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{accountSummary.lastPaymentDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Bills */}
      <h2 className="text-lg font-bold mb-3">Upcoming Bills</h2>
      <div className="space-y-3 mb-6">
        {upcomingBills.map(bill => (
          <Card key={bill.id} className="border-[#E8F3F4] hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium">{bill.provider}</h3>
                  <p className="text-sm text-gray-600">{bill.description}</p>
                  <div className="flex items-center mt-1">
                    <Clock size={14} className="text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Due: {bill.dueDate.toLocaleDateString()}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <div className={`h-2 w-2 rounded-full ${
                      bill.insuranceStatus === 'approved' ? 'bg-green-500' : 
                      bill.insuranceStatus === 'pending' ? 'bg-amber-500' : 
                      'bg-red-500'
                    } mr-1`}></div>
                    <span className="text-xs text-gray-500">
                      Insurance: {
                        bill.insuranceStatus === 'approved' ? 'Approved' : 
                        bill.insuranceStatus === 'pending' ? 'Pending' : 
                        'Denied'
                      }
                    </span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex flex-col items-end">
                  <div className="flex items-baseline">
                    <span className="text-xs text-gray-500 mr-2">Total:</span>
                    <span className="text-xl font-bold text-[#006D77]">${bill.amount.toFixed(2)}</span>
                  </div>
                  {bill.insuranceStatus !== 'denied' && (
                    <div className="flex items-baseline mt-1">
                      <span className="text-xs text-gray-500 mr-2">Est. Coverage:</span>
                      <span className="text-sm font-medium text-green-600">${bill.coverageEstimate.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                      Pay Bill
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button variant="outline" className="w-full border-dashed flex items-center justify-center">
          <Plus size={16} className="mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="claims" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="costs" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <BarChart className="h-4 w-4 mr-2" />
            Cost Transparency
          </TabsTrigger>
          <TabsTrigger value="reimbursements" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Zap className="h-4 w-4 mr-2" />
            Reimbursements
          </TabsTrigger>
          <TabsTrigger value="insurance" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Coins className="h-4 w-4 mr-2" />
            Insurance Info
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="claims">
          <ClaimsManagement />
        </TabsContent>
        
        <TabsContent value="costs">
          <CostTransparency />
        </TabsContent>
        
        <TabsContent value="reimbursements">
          <InstantReimbursements />
        </TabsContent>
        
        <TabsContent value="insurance">
          <InsuranceInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
