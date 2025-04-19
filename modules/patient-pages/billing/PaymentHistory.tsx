import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, ChevronsUpDown, Download, Filter, Search, 
  Calendar, ArrowUpDown, CheckCircle, FileText, X
} from 'lucide-react';

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  
  // Mock payment data
  const payments = [
    {
      id: 'pay-1001',
      date: '2025-03-18',
      provider: 'City Medical Center',
      description: 'Specialist Consultation',
      totalAmount: 350.00,
      insurancePaid: 280.00,
      yourPayment: 70.00,
      paymentMethod: 'Credit Card (****4321)',
      status: 'completed',
      receiptAvailable: true
    },
    {
      id: 'pay-1002',
      date: '2025-03-03',
      provider: 'Express Care Clinic',
      description: 'Urgent Care Visit',
      totalAmount: 175.00,
      insurancePaid: 140.00,
      yourPayment: 35.00,
      paymentMethod: 'Health Savings Account',
      status: 'completed',
      receiptAvailable: true
    },
    {
      id: 'pay-1003',
      date: '2025-02-15',
      provider: 'Neighborhood Pharmacy',
      description: 'Prescription Medications',
      totalAmount: 120.50,
      insurancePaid: 96.40,
      yourPayment: 24.10,
      paymentMethod: 'Credit Card (****4321)',
      status: 'completed',
      receiptAvailable: true
    },
    {
      id: 'pay-1004',
      date: '2025-02-01',
      provider: 'City Medical Center',
      description: 'Lab Tests - Blood Work',
      totalAmount: 280.00,
      insurancePaid: 224.00,
      yourPayment: 56.00,
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      receiptAvailable: true
    }
  ];
  
  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => 
    payment.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalPaid = payments.reduce((sum, payment) => sum + payment.yourPayment, 0);
  const insuranceCovered = payments.reduce((sum, payment) => sum + payment.insurancePaid, 0);
  const totalBilled = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-[#006D77]">${totalPaid.toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Your Total Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-green-600">${insuranceCovered.toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Insurance Covered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold">${totalBilled.toFixed(2)}</h3>
              <p className="text-sm text-gray-600">Total Billed Amount</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment History
            </CardTitle>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  className="pl-8 pr-4 py-2 text-sm w-[220px]"
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
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter options - shown conditionally */}
          {showFilter && (
            <div className="bg-[#F0F9FA] p-3 rounded-md mb-4 border border-[#E8F3F4]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filter Payments</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowFilter(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Date Range</label>
                  <select className="p-2 text-sm border rounded-md w-full">
                    <option value="">All Time</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Provider</label>
                  <select className="p-2 text-sm border rounded-md w-full">
                    <option value="">All Providers</option>
                    <option value="City Medical Center">City Medical Center</option>
                    <option value="Express Care Clinic">Express Care Clinic</option>
                    <option value="Neighborhood Pharmacy">Neighborhood Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Payment Method</label>
                  <select className="p-2 text-sm border rounded-md w-full">
                    <option value="">All Methods</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Health Savings Account">Health Savings Account</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-700 mb-1 block">Amount Range</label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Min" size={4} className="text-sm" />
                    <span>-</span>
                    <Input placeholder="Max" size={4} className="text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button size="sm" variant="outline" className="mr-2">Clear Filters</Button>
                <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">Apply Filters</Button>
              </div>
            </div>
          )}
          
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b bg-[#F0F9FA]">
                    <th className="h-10 px-4 text-left font-medium text-gray-700 flex items-center">
                      Date
                      <ArrowUpDown size={14} className="ml-1" />
                    </th>
                    <th className="h-10 px-4 text-left font-medium text-gray-700">Provider / Description</th>
                    <th className="h-10 px-4 text-right font-medium text-gray-700">Amount</th>
                    <th className="h-10 px-4 text-right font-medium text-gray-700">Insurance</th>
                    <th className="h-10 px-4 text-right font-medium text-gray-700">Your Payment</th>
                    <th className="h-10 px-4 text-right font-medium text-gray-700">Receipt</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">{new Date(payment.date).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.provider}</span>
                          <span className="text-xs text-gray-500">{payment.description}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right font-medium">
                        ${payment.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-right text-green-600">
                        ${payment.insurancePaid.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-right font-bold">
                        ${payment.yourPayment.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {payment.receiptAvailable ? (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download size={16} />
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No payments found matching your search</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Year-to-Date Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="mb-3">
                <h3 className="font-medium">Healthcare Spending</h3>
                <p className="text-sm text-gray-600">Total spending: ${totalPaid.toFixed(2)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Spending by Provider</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">City Medical Center</span>
                      <span className="text-sm font-medium">$126.00</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#006D77] h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Express Care Clinic</span>
                      <span className="text-sm font-medium">$35.00</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#006D77] h-2 rounded-full" style={{ width: '19%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Neighborhood Pharmacy</span>
                      <span className="text-sm font-medium">$24.10</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-[#006D77] h-2 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Spending by Category</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Office Visits</span>
                      <span className="text-sm font-medium">$105.00</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lab Tests</span>
                      <span className="text-sm font-medium">$56.00</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prescriptions</span>
                      <span className="text-sm font-medium">$24.10</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '13%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F0F9FA] rounded-md border border-[#E8F3F4] p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2 h-5 w-5" />
                <h3 className="font-medium">Tax Deduction Information</h3>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                Your qualified medical expenses may be tax-deductible. Access your annual healthcare spending report for tax purposes.
              </p>
              
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="text-sm">
                  <FileText size={14} className="mr-1" />
                  2024 Expense Report
                </Button>
                <Button variant="outline" size="sm" className="text-sm">
                  <FileText size={14} className="mr-1" />
                  2023 Expense Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
