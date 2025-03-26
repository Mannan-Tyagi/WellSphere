"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Patient, PatientStatus, Appointment, Medication, TestResult } from "@/types/patient";
import { Calendar, MessageCircle, Phone, Download, ArrowLeft, ChevronRight, AlertTriangle, Activity } from "lucide-react";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import QRCode from "react-qr-code";
import HealthMetricChart from "@/modules/doctor-pages/patients/HealthMetricChart";
import AppointmentHistoryItem from "@/modules/doctor-pages/patients/AppointmentHistoryItem";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    setLoading(true);
    const mockPatient: Patient = {
      id: patientId,
      name: "Diana Cooper",
      age: 42,
      gender: "Female",
      profileImage: "/avatars/patient-1.jpg",
      lastVisit: "2025-03-20",
      condition: "Diabetes Type II",
      status: "stable",
      contactInfo: {
        email: "diana.cooper@example.com",
        phone: "555-123-4567",
        address: "123 Main St, Anytown, USA",
        emergencyContact: "John Cooper (Husband) - 555-987-6543"
      },
      allergies: ["Penicillin", "Shellfish"],
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2024-06-15" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", startDate: "2024-08-22" }
      ],
      appointments: [
        { 
          id: "A001", 
          date: "2025-03-20", 
          time: "10:30 AM", 
          type: "Check-up", 
          doctorName: "Dr. Julia Smith",
          notes: "Patient reported improved energy levels. Blood sugar levels are stabilizing. Continue with current medication regimen.",
          prescriptions: ["Metformin 500mg", "Lisinopril 10mg"]
        },
        { 
          id: "A002", 
          date: "2025-02-15", 
          time: "2:00 PM", 
          type: "Consultation", 
          doctorName: "Dr. Julia Smith",
          notes: "Patient experiencing occasional dizziness. Adjusted medication dosage to address side effects.",
          prescriptions: ["Metformin 500mg", "Lisinopril 5mg"]
        },
        { 
          id: "A003", 
          date: "2025-01-05", 
          time: "9:15 AM", 
          type: "Emergency", 
          doctorName: "Dr. Robert Williams",
          notes: "Patient admitted with high blood sugar levels. Started on insulin temporarily. Need follow-up in 2 weeks.",
          prescriptions: ["Insulin Glargine", "Metformin 500mg"]
        }
      ],
      testResults: [
        { name: "Blood Sugar", value: 145, unit: "mg/dL", date: "2025-03-20", normal: "70-120" },
        { name: "HbA1c", value: 7.2, unit: "%", date: "2025-03-20", normal: "<6.5" },
        { name: "Blood Pressure", value: "132/85", unit: "mmHg", date: "2025-03-20", normal: "<120/80" },
        { name: "Cholesterol", value: 195, unit: "mg/dL", date: "2025-03-20", normal: "<200" }
      ],
      healthMetrics: [
        { name: "Blood Sugar", data: [
          { date: "Jan", value: 165 },
          { date: "Feb", value: 155 },
          { date: "Mar", value: 145 },
        ] },
        { name: "Blood Pressure", data: [
          { date: "Jan", value: 140 },
          { date: "Feb", value: 135 },
          { date: "Mar", value: 132 },
        ] },
        { name: "Weight", data: [
          { date: "Jan", value: 78 },
          { date: "Feb", value: 76 },
          { date: "Mar", value: 75 },
        ] }
      ]
    };
    
    setTimeout(() => {
      setPatient(mockPatient);
      setLoading(false);
    }, 500);
  }, [patientId]);

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs-attention":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006D77] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <h2 className="text-2xl font-medium mb-2">Patient Not Found</h2>
          <p className="text-gray-500 mb-6">The patient you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/Doctor/Patients')}>
            Back to Patients List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => router.push('/Doctor/Patients')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
        <h1 className="text-2xl font-medium text-gray-900">Patient Details</h1>
      </div>

      {/* Patient Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="relative h-24 w-24 rounded-full overflow-hidden mr-6 border border-gray-200">
                <Image
                  src={patient.profileImage || "/avatars/placeholder.png"}
                  alt={patient.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-medium">{patient.name}</h2>
                    <div className="text-gray-500">ID: {patient.id}</div>
                  </div>
                  <Badge className={`${getStatusColor(patient.status)} text-sm px-3 py-1`}>
                    {patient.status === "stable" ? "Stable" : 
                     patient.status === "needs-attention" ? "Needs Attention" : "Critical"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                  <div>
                    <div className="text-sm text-gray-500">Age</div>
                    <div>{patient.age} years</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Gender</div>
                    <div>{patient.gender}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div>{patient.contactInfo.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{patient.contactInfo.email}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Address</div>
                    <div>{patient.contactInfo.address}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Emergency Contact</div>
                    <div>{patient.contactInfo.emergencyContact}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
            <CardDescription>Scan for medical records</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-6">
            <div className="bg-white p-3 rounded-md mb-4">
              <QRCode 
                value={`wellsphere://patient/${patient.id}`}
                size={150}
                level="H"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <MessageCircle className="h-4 w-4 mb-1" />
                <span className="text-xs">Message</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col h-auto py-3">
                <Phone className="h-4 w-4 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="summary">Health Summary</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="tests">Test Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chronic Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center p-3 bg-[#F0F9FA] rounded-md mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#006D77] mr-3"></div>
                      <span>{patient.condition}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center p-3 bg-[#FFF5EB] rounded-md mb-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF9500] mr-3"></div>
                        <span>{allergy}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {patient.medications.map((medication, index) => (
                        <div key={index} className="bg-white border rounded-md p-4">
                          <div className="font-medium mb-1">{medication.name}</div>
                          <div className="text-sm text-gray-500">
                            {medication.dosage} • {medication.frequency}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Started: {formatDate(medication.startDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { date: "Jan", bloodSugar: 165, bloodPressure: 140, weight: 78 },
                          { date: "Feb", bloodSugar: 155, bloodPressure: 135, weight: 76 },
                          { date: "Mar", bloodSugar: 145, bloodPressure: 132, weight: 75 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="bloodSugar" stroke="#006D77" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="bloodPressure" stroke="#FF9500" />
                          <Line type="monotone" dataKey="weight" stroke="#2D6A4F" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patient.appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-[#F0F9FA] p-2 rounded-md mr-4">
                              <Calendar className="h-5 w-5 text-[#006D77]" />
                            </div>
                            <div>
                              <div className="font-medium">{formatDate(appointment.date)} • {appointment.time}</div>
                              <div className="text-sm text-gray-500">{appointment.type} with {appointment.doctorName}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-md p-3 mt-3">
                          <div className="text-sm font-medium mb-1">Doctor's Notes:</div>
                          <div className="text-sm text-gray-600">{appointment.notes}</div>
                        </div>
                        
                        {appointment.prescriptions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-medium mb-1">Prescriptions:</div>
                            <div className="flex flex-wrap gap-2">
                              {appointment.prescriptions.map((prescription, idx) => (
                                <Badge key={idx} variant="outline" className="bg-gray-50">
                                  {prescription}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tests" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 pr-4 font-medium">Test</th>
                          <th className="pb-3 pr-4 font-medium">Result</th>
                          <th className="pb-3 pr-4 font-medium">Normal Range</th>
                          <th className="pb-3 pr-4 font-medium">Date</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.testResults.map((test, index) => {
                          // Simplified logic to determine if test is normal
                          let isNormal = true;
                          if (test.name === "Blood Sugar") {
                            isNormal = test.value >= 70 && test.value <= 120;
                          } else if (test.name === "HbA1c") {
                            isNormal = test.value < 6.5;
                          } else if (test.name === "Cholesterol") {
                            isNormal = test.value < 200;
                          } else if (test.name === "Blood Pressure") {
                            const parts = (test.value as string).split('/');
                            isNormal = parseInt(parts[0]) < 120 && parseInt(parts[1]) < 80;
                          }
                          
                          return (
                            <tr key={index} className="border-b">
                              <td className="py-4 pr-4">{test.name}</td>
                              <td className="py-4 pr-4">
                                {test.value} {test.unit}
                              </td>
                              <td className="py-4 pr-4">{test.normal}</td>
                              <td className="py-4 pr-4">{formatDate(test.date)}</td>
                              <td className="py-4">
                                <Badge className={isNormal ? 
                                  "bg-green-100 text-green-800 border-green-200" : 
                                  "bg-amber-100 text-amber-800 border-amber-200"
                                }>
                                  {isNormal ? "Normal" : "Abnormal"}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Insights Panel */}
        <div>
          <Card className="bg-[#F0F9FA] border-[#006D77] mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Activity className="mr-2 h-5 w-5 text-[#006D77]" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-md p-4 border-l-4 border-amber-400">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-700 mb-1">Blood Sugar Alert</h4>
                    <p className="text-sm text-gray-600">
                      Recent readings show blood sugar levels above normal range. Consider adjusting medication dosage.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-md p-4">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                    Schedule follow-up appointment within 2 weeks
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                    Adjust diet to reduce carbohydrate intake
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                    Consider increasing physical activity to 30 minutes daily
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-md p-4">
                <h4 className="font-medium mb-2">Risk Assessment</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Diabetes Complications</span>
                      <span className="font-medium text-amber-700">Moderate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cardiovascular Risk</span>
                      <span className="font-medium text-amber-700">Moderate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Kidney Function</span>
                      <span className="font-medium text-green-700">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-[#006D77] hover:bg-[#00585F] justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#006D77]">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#006D77]">
                    <Download className="mr-2 h-4 w-4" />
                    Download Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}