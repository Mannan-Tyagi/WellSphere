"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Pill, Camera, ArrowLeft } from 'lucide-react';

const AddMedicationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once-daily',
    timeOfDay: [],
    withFood: false,
    notes: '',
    startDate: '',
    prescribedBy: '',
    refillsRemaining: '0'
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleTimeOfDayChange = (time: string) => {
    const updatedTimeOfDay = formData.timeOfDay.includes(time) 
      ? formData.timeOfDay.filter(t => t !== time)
      : [...formData.timeOfDay, time];

    setFormData({
      ...formData,
      timeOfDay: updatedTimeOfDay
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this to your backend
    console.log('Saving medication:', formData);
    // Redirect back to medications page
    router.push('/patient/medications');
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#006D77]">Add Medication</h1>
        <Button className="bg-[#006D77]" onClick={() => router.push('/patient/medications/scan')}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Prescription
        </Button>
      </div>

      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
            <Pill className="mr-2 h-5 w-5" />
            Medication Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Medication Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter medication name" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input 
                    id="dosage" 
                    placeholder="e.g., 10mg, 500mg" 
                    value={formData.dosage}
                    onChange={(e) => handleChange('dosage', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={formData.frequency}
                    onValueChange={(value) => handleChange('frequency', value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once-daily">Once Daily</SelectItem>
                      <SelectItem value="twice-daily">Twice Daily</SelectItem>
                      <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                      <SelectItem value="every-other-day">Every Other Day</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time of Day</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="morning" 
                        checked={formData.timeOfDay.includes('morning')}
                        onCheckedChange={() => handleTimeOfDayChange('morning')}
                      />
                      <Label htmlFor="morning" className="cursor-pointer">Morning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="afternoon" 
                        checked={formData.timeOfDay.includes('afternoon')}
                        onCheckedChange={() => handleTimeOfDayChange('afternoon')}
                      />
                      <Label htmlFor="afternoon" className="cursor-pointer">Afternoon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="evening" 
                        checked={formData.timeOfDay.includes('evening')}
                        onCheckedChange={() => handleTimeOfDayChange('evening')}
                      />
                      <Label htmlFor="evening" className="cursor-pointer">Evening</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bedtime" 
                        checked={formData.timeOfDay.includes('bedtime')}
                        onCheckedChange={() => handleTimeOfDayChange('bedtime')}
                      />
                      <Label htmlFor="bedtime" className="cursor-pointer">Bedtime</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="prescribedBy">Prescribed By</Label>
                  <Input 
                    id="prescribedBy" 
                    placeholder="e.g., Dr. Smith" 
                    value={formData.prescribedBy}
                    onChange={(e) => handleChange('prescribedBy', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="refillsRemaining">Refills Remaining</Label>
                  <Input 
                    id="refillsRemaining" 
                    type="number" 
                    min="0"
                    value={formData.refillsRemaining}
                    onChange={(e) => handleChange('refillsRemaining', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="withFood" 
                    checked={formData.withFood}
                    onCheckedChange={(checked) => handleChange('withFood', checked)}
                  />
                  <Label htmlFor="withFood" className="cursor-pointer">Take with food</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (e.g., special instructions)</Label>
              <Textarea 
                id="notes" 
                placeholder="Any special instructions for taking this medication" 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#006D77]">
                Save Medication
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMedicationPage;
