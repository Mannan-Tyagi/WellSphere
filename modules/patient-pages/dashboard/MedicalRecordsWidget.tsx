import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, QrCode, Upload, ChevronRight, Clock, Filter, FilePlus2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MedicalRecordsWidget = () => {
  // Mock recent medical records
  const records = [
    {
      id: 1,
      title: 'Blood Work Results',
      provider: 'General Hospital',
      date: 'June 4, 2023',
      type: 'lab',
      new: true
    },
    {
      id: 2,
      title: 'Chest X-Ray',
      provider: 'Radiology Center',
      date: 'May 22, 2023',
      type: 'imaging',
      new: false
    },
    {
      id: 3,
      title: 'Annual Physical Report',
      provider: 'Dr. Johnson',
      date: 'April 15, 2023',
      type: 'report',
      new: false
    }
  ];

  // Helper to get badge for record type
  const getTypeBadge = (type) => {
    switch (type) {
      case 'lab':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lab Results</Badge>;
      case 'imaging':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Imaging</Badge>;
      case 'report':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Report</Badge>;
      case 'prescription':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Prescription</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Document</Badge>;
    }
  };

  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <FileText className="mr-2 h-5 w-5" />
          Medical Records
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <QrCode size={16} className="mr-1" />
            Scan QR
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Upload size={16} className="mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Recent records</div>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500 h-8">
              <Filter size={14} className="mr-1" />
              Filter
            </Button>
          </div>
          
          {records.length > 0 ? (
            <div className="space-y-2">
              {records.map((record) => (
                <Link key={record.id} href={`/patient/records/${record.id}`}>
                  <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {record.title}
                          {record.new && (
                            <Badge className="ml-2 bg-blue-500 text-white">New</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{record.provider}</p>
                      </div>
                      {getTypeBadge(record.type)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {record.date}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-[#006D77]">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#006D77]">
                        Share
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FilePlus2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No records found</p>
              <Button variant="outline" className="mt-2">
                Upload a document
              </Button>
            </div>
          )}
          
          <Link href="/patient/records" className="text-sm text-[#006D77] hover:underline flex items-center justify-end">
            View All Records <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsWidget;
