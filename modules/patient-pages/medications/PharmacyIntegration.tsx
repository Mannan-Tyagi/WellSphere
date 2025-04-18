"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Store, 
  MapPin, 
  Clock, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2, 
  DollarSign,
  Star,
  Truck,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  hours: string;
  rating: number;
  hasDelivery: boolean;
  prices: {
    originalPrice: number;
    discountPrice?: number;
    hasGeneric: boolean;
    genericPrice?: number;
  };
}

interface PharmacyIntegrationProps {
  medicationId: string;
  medicationName: string;
  prescriptionDetails: {
    dosage: string;
    quantity: number;
    refills: number;
  };
  onRequestRefill?: (pharmacyId: string, useGeneric: boolean) => void;
}

const PharmacyIntegration: React.FC<PharmacyIntegrationProps> = ({
  medicationId,
  medicationName,
  prescriptionDetails,
  onRequestRefill
}) => {
  const [zipCode, setZipCode] = useState('');
  const [activeTab, setActiveTab] = useState('nearby');
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [useGeneric, setUseGeneric] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Fetch nearby pharmacies
  const fetchNearbyPharmacies = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for nearby pharmacies
      const mockPharmacies: Pharmacy[] = [
        {
          id: 'pharm1',
          name: 'QuickCare Pharmacy',
          address: '123 Main St, Anytown',
          distance: 0.8,
          hours: 'Open until 9 PM',
          rating: 4.5,
          hasDelivery: true,
          prices: {
            originalPrice: 45.99,
            discountPrice: 32.99,
            hasGeneric: true,
            genericPrice: 12.99
          }
        },
        {
          id: 'pharm2',
          name: 'City Drugs',
          address: '456 Oak Ave, Anytown',
          distance: 1.2,
          hours: 'Open until 8 PM',
          rating: 4.2,
          hasDelivery: false,
          prices: {
            originalPrice: 43.99,
            hasGeneric: true,
            genericPrice: 10.99
          }
        },
        {
          id: 'pharm3',
          name: 'SuperHealth Pharmacy',
          address: '789 Pine Blvd, Anytown',
          distance: 2.5,
          hours: 'Open 24 hours',
          rating: 4.8,
          hasDelivery: true,
          prices: {
            originalPrice: 47.99,
            discountPrice: 38.99,
            hasGeneric: false
          }
        },
        {
          id: 'pharm4',
          name: 'ValueMeds',
          address: '321 Cedar Ln, Anytown',
          distance: 3.1,
          hours: 'Open until 10 PM',
          rating: 3.9,
          hasDelivery: true,
          prices: {
            originalPrice: 40.99,
            discountPrice: 35.99,
            hasGeneric: true,
            genericPrice: 8.99
          }
        }
      ];
      
      // Sort by distance
      const sorted = [...mockPharmacies].sort((a, b) => a.distance - b.distance);
      setNearbyPharmacies(sorted);
      setLoading(false);
    }, 1500);
  };
  
  // Automatically fetch on initial render
  useEffect(() => {
    fetchNearbyPharmacies();
  }, []);
  
  // Handle refill request
  const handleRefillRequest = () => {
    if (!selectedPharmacy) return;
    
    if (onRequestRefill) {
      onRequestRefill(selectedPharmacy, useGeneric);
    }
    
    setShowConfirmation(true);
  };
  
  // Render pharmacy price information
  const renderPriceInfo = (pharmacy: Pharmacy) => {
    const { prices } = pharmacy;
    const finalPrice = useGeneric && prices.hasGeneric && prices.genericPrice
      ? prices.genericPrice
      : prices.discountPrice || prices.originalPrice;
      
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-500 text-sm">Price:</span>
          <div className="flex flex-col items-end">
            {prices.originalPrice !== finalPrice && (
              <span className="text-xs text-gray-400 line-through">${prices.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-lg font-medium text-[#006D77]">${finalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        {prices.hasGeneric && (
          <div className="flex items-center justify-end mt-1">
            <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
              Generic Available
            </Badge>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="border-[#E8F3F4] shadow-sm">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <Store className="mr-2 h-5 w-5" />
          Pharmacy Refill Options
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Prescription details */}
        <div className="p-3 bg-[#F0F9FA] rounded-md mb-4">
          <h3 className="text-sm font-medium text-[#006D77] mb-2">Prescription Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Medication:</span>
              <div className="font-medium">{medicationName}</div>
            </div>
            <div>
              <span className="text-gray-500">Dosage:</span>
              <div className="font-medium">{prescriptionDetails.dosage}</div>
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>
              <div className="font-medium">{prescriptionDetails.quantity} pills</div>
            </div>
            <div>
              <span className="text-gray-500">Refills:</span>
              <div className="font-medium">{prescriptionDetails.refills} remaining</div>
            </div>
          </div>
        </div>
        
        {/* Generic preference */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Generic Preference</h3>
          <RadioGroup defaultValue="generic" className="flex gap-4" onValueChange={(val) => setUseGeneric(val === 'generic')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="generic" id="generic" checked={useGeneric} />
              <Label htmlFor="generic">Use generic when available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="brand" id="brand" checked={!useGeneric} />
              <Label htmlFor="brand">Use brand name only</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Pharmacy finder */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Find Pharmacies</h3>
            
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter ZIP code"
                className="h-8 w-28 text-sm"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <Button 
                size="sm"
                className="h-8 bg-[#006D77]"
                onClick={fetchNearbyPharmacies}
              >
                Search
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3">
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="savings">Best Price</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-[#006D77] border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Finding pharmacies...</p>
              </div>
            ) : (
              <>
                <TabsContent value="nearby">
                  <div className="space-y-3">
                    {nearbyPharmacies.map(pharmacy => (
                      <div 
                        key={pharmacy.id} 
                        className={`border rounded-md p-3 cursor-pointer transition-colors ${
                          selectedPharmacy === pharmacy.id ? 'border-[#006D77] bg-[#F0F9FA]' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPharmacy(pharmacy.id)}
                      >
                        <div className="flex justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{pharmacy.name}</h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin size={12} className="mr-1" />
                              <span>{pharmacy.address}</span>
                              <span className="mx-1">•</span>
                              <span>{pharmacy.distance.toFixed(1)} km</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {pharmacy.hours}
                            </div>
                            <div className="flex items-center mt-1">
                              <Star size={12} className="text-amber-500" />
                              <span className="text-xs ml-1">{pharmacy.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          {pharmacy.hasDelivery && (
                            <Badge variant="outline" className="text-xs">
                              <Truck size={10} className="mr-1" />
                              Delivery
                            </Badge>
                          )}
                          
                          {renderPriceInfo(pharmacy)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="savings">
                  <div className="space-y-3">
                    {[...nearbyPharmacies]
                      .sort((a, b) => {
                        const aPrice = useGeneric && a.prices.hasGeneric && a.prices.genericPrice
                          ? a.prices.genericPrice
                          : a.prices.discountPrice || a.prices.originalPrice;
                          
                        const bPrice = useGeneric && b.prices.hasGeneric && b.prices.genericPrice
                          ? b.prices.genericPrice
                          : b.prices.discountPrice || b.prices.originalPrice;
                          
                        return aPrice - bPrice;
                      })
                      .map(pharmacy => (
                        <div 
                          key={pharmacy.id} 
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            selectedPharmacy === pharmacy.id ? 'border-[#006D77] bg-[#F0F9FA]' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedPharmacy(pharmacy.id)}
                        >
                          {/* Pharmacy info similar to nearby tab */}
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{pharmacy.name}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPin size={12} className="mr-1" />
                                <span>{pharmacy.address}</span>
                                <span className="mx-1">•</span>
                                <span>{pharmacy.distance.toFixed(1)} km</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-gray-500 flex items-center">
                                <DollarSign size={12} className="mr-1 text-green-600" />
                                Best price
                              </div>
                              <div className="flex items-center mt-1">
                                <Star size={12} className="text-amber-500" />
                                <span className="text-xs ml-1">{pharmacy.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            {pharmacy.hasDelivery && (
                              <Badge variant="outline" className="text-xs">
                                <Truck size={10} className="mr-1" />
                                Delivery
                              </Badge>
                            )}
                            
                            {renderPriceInfo(pharmacy)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </TabsContent>
                
                <TabsContent value="delivery">
                  <div className="space-y-3">
                    {nearbyPharmacies
                      .filter(pharmacy => pharmacy.hasDelivery)
                      .map(pharmacy => (
                        <div 
                          key={pharmacy.id} 
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            selectedPharmacy === pharmacy.id ? 'border-[#006D77] bg-[#F0F9FA]' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedPharmacy(pharmacy.id)}
                        >
                          {/* Pharmacy info similar to nearby tab */}
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{pharmacy.name}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPin size={12} className="mr-1" />
                                <span>{pharmacy.address}</span>
                                <span className="mx-1">•</span>
                                <span>{pharmacy.distance.toFixed(1)} km</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-gray-500 flex items-center">
                                <Truck size={12} className="mr-1 text-[#006D77]" />
                                Delivery available
                              </div>
                              <div className="flex items-center mt-1">
                                <Star size={12} className="text-amber-500" />
                                <span className="text-xs ml-1">{pharmacy.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              <Clock size={10} className="mr-1" />
                              Same day delivery
                            </Badge>
                            
                            {renderPriceInfo(pharmacy)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
        
        {/* Action buttons */}
        <div className="border-t pt-4 mt-4">
          {showConfirmation ? (
            <div className="p-4 bg-green-50 rounded-md border border-green-100 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-green-800 mb-1">Refill Request Sent!</h3>
              <p className="text-sm text-green-700 mb-3">
                Your refill request has been sent to {nearbyPharmacies.find(p => p.id === selectedPharmacy)?.name}.
                You'll receive a notification when it's ready.
              </p>
              <Button variant="outline" className="mt-2" onClick={() => setShowConfirmation(false)}>
                Done
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#006D77] hover:bg-[#00585F]"
                disabled={!selectedPharmacy}
                onClick={handleRefillRequest}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Request Refill
              </Button>
              <Button variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Check Insurance
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PharmacyIntegration;
