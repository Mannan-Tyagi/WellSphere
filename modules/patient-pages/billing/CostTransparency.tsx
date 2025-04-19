import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, BarChart, DollarSign, Coins, 
  CalendarClock, Calculator, Globe, ArrowUpDown, Map
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CostTransparency = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  
  // Mock procedure data for price comparison
  const procedures = [
    {
      id: 'proc1',
      name: 'MRI - Brain (without contrast)',
      cptCode: '70551',
      averagePrice: 1250.00,
      providers: [
        { name: 'City Medical Center', price: 1450.00, distance: '2.3 miles', waitTime: '3-5 days' },
        { name: 'University Hospital', price: 1250.00, distance: '5.7 miles', waitTime: '1-2 days' },
        { name: 'Westside Imaging', price: 950.00, distance: '8.2 miles', waitTime: '1 day' },
        { name: 'Metro Radiology', price: 1100.00, distance: '4.1 miles', waitTime: '2-3 days' }
      ]
    },
    {
      id: 'proc2',
      name: 'Physical Therapy - Initial Evaluation',
      cptCode: '97161',
      averagePrice: 150.00,
      providers: [
        { name: 'City Physical Therapy', price: 175.00, distance: '1.8 miles', waitTime: '1 day' },
        { name: 'Premier Rehabilitation', price: 150.00, distance: '3.2 miles', waitTime: 'Same day' },
        { name: 'Active Health PT', price: 125.00, distance: '7.5 miles', waitTime: 'Same day' }
      ]
    },
    {
      id: 'proc3',
      name: 'Annual Physical Examination',
      cptCode: '99395',
      averagePrice: 200.00,
      providers: [
        { name: 'Dr. Robert Williams', price: 220.00, distance: '2.1 miles', waitTime: '5-7 days' },
        { name: 'Family Care Clinic', price: 195.00, distance: '4.3 miles', waitTime: '3-4 days' },
        { name: 'Wellness Medical Group', price: 185.00, distance: '6.8 miles', waitTime: '2-3 days' }
      ]
    }
  ];
  
  // Mock payment plan data
  const paymentPlans = [
    {
      id: 'plan1',
      name: 'Standard Monthly Plan',
      details: 'Equal installments over 12 months, no interest',
      interestRate: 0,
      duration: 12,
      monthlyPayment: 104.17,
      totalCost: 1250.00
    },
    {
      id: 'plan2',
      name: 'Extended Plan',
      details: '24 monthly payments with 3% interest',
      interestRate: 3,
      duration: 24,
      monthlyPayment: 53.82,
      totalCost: 1291.68
    },
    {
      id: 'plan3',
      name: 'Healthcare Credit Card',
      details: 'No interest if paid within 18 months',
      interestRate: 0,
      duration: 18,
      monthlyPayment: 69.44,
      totalCost: 1250.00,
      promotionalPeriod: true
    }
  ];

  // Filter procedures based on search term
  const filteredProcedures = procedures.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.cptCode.includes(searchTerm)
  );
  
  const getPriceDisplay = (price, isLowest) => {
    if (isLowest) {
      return <span className="font-bold text-green-600">${price.toFixed(2)}</span>;
    }
    return <span className="font-bold">${price.toFixed(2)}</span>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#006D77]">Cost Transparency</h2>
          <p className="text-gray-600 text-sm">Compare prices and find the best value for healthcare services</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search for a procedure..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="priceComparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="priceComparison" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <BarChart size={16} className="mr-2" />
            Price Comparison
          </TabsTrigger>
          <TabsTrigger value="paymentPlans" className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white">
            <Calculator size={16} className="mr-2" />
            Payment Optimizer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="priceComparison">
          {selectedService ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedService.name}</h3>
                <Button variant="outline" size="sm" onClick={() => setSelectedService(null)}>
                  Back to List
                </Button>
              </div>
              
              <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-600">CPT Code: {selectedService.cptCode}</p>
                    <p className="font-medium">Average Price: ${selectedService.averagePrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <Globe size={14} className="mr-1" />
                    In-Network Providers
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="font-medium">Provider</span>
                    <div className="flex items-center gap-6">
                      <span className="w-16 text-right">Price</span>
                      <span className="w-20 text-right">Distance</span>
                      <span className="w-20 text-right">Wait Time</span>
                    </div>
                  </div>
                  
                  {selectedService.providers
                    .sort((a, b) => a.price - b.price)
                    .map((provider, idx) => {
                      const isLowestPrice = idx === 0;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-3 rounded-md ${
                            isLowestPrice ? 'bg-green-50 border border-green-100' : 'bg-white border'
                          }`}
                        >
                          <div className="flex items-center">
                            {isLowestPrice && (
                              <div className="text-xs bg-green-600 text-white px-2 py-0.5 rounded mr-2">
                                Best Value
                              </div>
                            )}
                            <span>{provider.name}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="w-16 text-right font-medium">
                              {getPriceDisplay(provider.price, isLowestPrice)}
                            </span>
                            <span className="w-20 text-right text-gray-600">{provider.distance}</span>
                            <span className="w-20 text-right text-gray-600">{provider.waitTime}</span>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Potential Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Highest Price:</span>
                        <span className="font-medium">
                          ${Math.max(...selectedService.providers.map(p => p.price)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lowest Price:</span>
                        <span className="font-medium text-green-600">
                          ${Math.min(...selectedService.providers.map(p => p.price)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-medium">You Could Save:</span>
                        <span className="font-bold text-green-600">
                          ${(Math.max(...selectedService.providers.map(p => p.price)) - 
                            Math.min(...selectedService.providers.map(p => p.price))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      Location & Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center text-sm text-gray-500">
                      Map view would be displayed here
                    </div>
                    <div className="mt-2 text-sm">
                      <Button variant="outline" size="sm" className="text-xs h-7 w-full">
                        Schedule at Best Value Provider
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map(procedure => (
                  <div 
                    key={procedure.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedService(procedure)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium">{procedure.name}</h3>
                        <p className="text-sm text-gray-600">CPT Code: {procedure.cptCode}</p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center">
                        <div className="mr-4">
                          <p className="text-sm text-gray-600">Price Range:</p>
                          <p className="font-medium">
                            ${Math.min(...procedure.providers.map(p => p.price)).toFixed(2)} - 
                            ${Math.max(...procedure.providers.map(p => p.price)).toFixed(2)}
                          </p>
                        </div>
                        <ArrowUpDown size={16} className="text-[#006D77]" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <span className="mr-3">{procedure.providers.length} providers available</span>
                      <span>Savings up to ${(Math.max(...procedure.providers.map(p => p.price)) - 
                        Math.min(...procedure.providers.map(p => p.price))).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No procedures found matching your search</p>
                  <p className="text-sm mt-1">Try searching for "MRI", "Physical Therapy", or a CPT code like "99395"</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="paymentPlans">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Payment Plan Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-[#F0F9FA] p-4 rounded-lg border border-[#E8F3F4]">
                  <h3 className="font-medium mb-3">Customize Your Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Total Bill Amount</label>
                      <div className="flex mt-1">
                        <span className="bg-gray-100 flex items-center justify-center px-3 border border-r-0 rounded-l-md">$</span>
                        <Input 
                          type="number" 
                          defaultValue="1250.00" 
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Monthly Budget</label>
                      <div className="flex mt-1">
                        <span className="bg-gray-100 flex items-center justify-center px-3 border border-r-0 rounded-l-md">$</span>
                        <Input 
                          type="number" 
                          defaultValue="100.00" 
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Credit Score Range</label>
                      <Select defaultValue="good">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select credit range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (720+)</SelectItem>
                          <SelectItem value="good">Good (680-719)</SelectItem>
                          <SelectItem value="fair">Fair (620-679)</SelectItem>
                          <SelectItem value="poor">Poor (619 or less)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-[#006D77] hover:bg-[#00585F]">
                    Find Best Payment Plan
                  </Button>
                </div>
                
                <h3 className="font-medium">Recommended Payment Plans</h3>
                
                <div className="space-y-3">
                  {paymentPlans.map((plan, idx) => (
                    <div 
                      key={plan.id} 
                      className={`border rounded-lg p-4 ${idx === 0 ? 'border-[#006D77] bg-[#F0F9FA]' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{plan.name}</h3>
                            {idx === 0 && (
                              <div className="ml-2 px-2 py-0.5 text-xs bg-[#006D77] text-white rounded-full">
                                Recommended
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{plan.details}</p>
                        </div>
                        <div className="mt-3 md:mt-0">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-[#006D77]">${plan.monthlyPayment.toFixed(2)}</span>
                            <span className="text-sm text-gray-600 ml-1">/month</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Total: ${plan.totalCost.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">Interest Rate</p>
                          <p className="font-medium">{plan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium">{plan.duration} months</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Interest</p>
                          <p className="font-medium">${(plan.totalCost - 1250).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <Button size="sm" className={idx === 0 ? "bg-[#006D77] hover:bg-[#00585F]" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                          Select Plan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostTransparency;
