import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Download, Upload, AlertTriangle } from 'lucide-react';
import { usePrivacySettings } from './hooks/usePrivacySettings';

const PrivacyControls: React.FC = () => {
  const { privacySettings, handleSelectChange, onComplete } = usePrivacySettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-[#F0F9FA] border border-[#E8F3F4] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#006D77]">Health Data Export</h3>
                <Badge className={privacySettings.dataExport.exportReady ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-700'}>
                  {privacySettings.dataExport.exportReady ? 'Ready to Download' : 'Preparing'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                Export your complete health record in a standard format that can be imported into other healthcare systems or saved for your personal records.
              </p>
              
              <div className="flex items-center text-sm space-x-1 mb-4">
                <Clock size={14} className="text-gray-500 mr-1" />
                <span className="text-gray-600">Last exported:</span>
                <span className="font-medium">{privacySettings.dataExport.lastExported}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="export-format" className="text-sm">Export Format</Label>
                  <Select 
                    value={privacySettings.dataExport.format} 
                    onValueChange={(value) => handleSelectChange('dataExport', 'format', value)}
                  >
                    <SelectTrigger id="export-format" className="w-40">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fhir">FHIR (Healthcare Standard)</SelectItem>
                      <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                      <SelectItem value="pdf">PDF (Document)</SelectItem>
                      <SelectItem value="json">JSON (Data)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Export Health Records
                </Button>
                
                <div className="flex items-center justify-between text-sm border-t border-[#E8F3F4] pt-3">
                  <span className="flex items-center text-gray-600">
                    <Upload size={14} className="mr-1" />
                    Export to National Health Data Stack
                  </span>
                  <Button variant="outline" size="sm" className="h-8">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
              <AlertTriangle size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Data Privacy Notice</p>
                <p className="text-xs text-amber-700 mt-1">
                  When you export your health data, you become responsible for protecting that information. 
                  Store exported health records securely and be careful when sharing them with third parties.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button className="bg-[#006D77] hover:bg-[#00585F]" onClick={onComplete}>
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacyControls;