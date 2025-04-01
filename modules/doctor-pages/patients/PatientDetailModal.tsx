import React, { useState } from "react";
import Image from "next/image";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Patient, PatientStatus } from "@/types/patient";
import { 
  Calendar, 
  MessageCircle, 
  Phone, 
  Download, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Activity,
  Mail,
  FileText,
  PlusCircle,
  Printer,
  ChevronDown
} from "lucide-react";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import QRCode from "react-qr-code";
import { formatDate } from "@/lib/utils";

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onScheduleAppointment: () => void;
  onSendMessage: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onScheduleAppointment,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "needs-attention":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getStatusLabel = (status: PatientStatus) => {
    switch (status) {
      case "stable":
        return "Stable";
      case "needs-attention":
        return "Needs Attention";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const toggleAppointmentDetails = (id: string) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  // Show upcoming appointments if any
  const hasUpcomingAppointments = patient.upcomingAppointments && patient.upcomingAppointments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto p-0 bg-white">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border border-[#E8F3F4]">
              <Image
                src={patient.profileImage || "/avatars/placeholder.png"}
                alt={patient.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{patient.name}</DialogTitle>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>ID: {patient.id}</span>
                <span>•</span>
                <Badge className={`${getStatusColor(patient.status)}`}>
                  {getStatusLabel(patient.status)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA]"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Patient Overview */}
              <Card className="mb-6 border-[#E8F3F4] bg-white">
                <CardHeader className="pb-3 border-b border-[#E8F3F4]">
                  <CardTitle className="text-lg">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Age</div>
                      <div>{patient.age} years</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Gender</div>
                      <div>{patient.gender}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Condition</div>
                      <div>{patient.condition}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Phone</div>
                      <div className="flex items-center">
                        {patient.contactInfo.phone}
                        <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Email</div>
                      <div className="flex items-center">
                        {patient.contactInfo.email}
                        <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[#006D77] font-medium">Last Visit</div>
                      <div>{formatDate(patient.lastVisit)}</div>
                    </div>
                    {patient.contactInfo.address && (
                      <div className="col-span-2">
                        <div className="text-sm text-[#006D77] font-medium">Address</div>
                        <div>{patient.contactInfo.address}</div>
                      </div>
                    )}
                    {patient.contactInfo.emergencyContact && (
                      <div className="col-span-2">
                        <div className="text-sm text-[#006D77] font-medium">Emergency Contact</div>
                        <div>{patient.contactInfo.emergencyContact}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              {hasUpcomingAppointments && (
                <Card className="mb-6 border-[#E8F3F4] bg-white">
                  <CardHeader className="pb-3 border-b border-[#E8F3F4]">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Upcoming Appointments</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#006D77] hover:bg-[#F0F9FA] p-1 h-7"
                        onClick={onScheduleAppointment}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Appointment
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {patient.upcomingAppointments!.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-blue-700 mr-3" />
                              <div>
                                <div className="font-medium">{formatDate(appointment.date)} • {appointment.time}</div>
                                <div className="text-sm text-gray-600">{appointment.type} with {appointment.doctorName}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="bg-white">
                                Reschedule
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-[#F0F9FA]">
                  <TabsTrigger 
                    value="summary"
                    className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white"
                  >
                    Health Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments"
                    className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tests"
                    className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white"
                  >
                    Test Results
                  </TabsTrigger>
                </TabsList>
                
                {/* Health Summary Tab */}
                <TabsContent value="summary" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-[#E8F3F4] bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Chronic Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center p-3 bg-[#F0F9FA] rounded-md mb-2">
                          <div className="w-3 h-3 rounded-full bg-[#006D77] mr-3"></div>
                          <span>{patient.condition}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-[#E8F3F4] bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Allergies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {patient.allergies && patient.allergies.length > 0 ? (
                          patient.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center p-3 bg-[#FFF5EB] rounded-md mb-2">
                              <div className="w-3 h-3 rounded-full bg-[#FF9500] mr-3"></div>
                              <span>{allergy}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 p-3">No known allergies</div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Medications */}
                    <Card className="md:col-span-2 border-[#E8F3F4] bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Current Medications</span>
                          <Button variant="ghost" size="sm" className="text-[#006D77] hover:bg-[#F0F9FA] p-1 h-7">
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Medication
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {patient.medications && patient.medications.map((medication, index) => (
                            <div key={index} className="bg-[#F0F9FA] rounded-md p-4">
                              <div className="font-medium mb-1">{medication.name}</div>
                              <div className="text-sm text-gray-600">
                                {medication.dosage} • {medication.frequency}
                              </div>
                              <div className="text-xs text-gray-500 mt-2">
                                Started: {formatDate(medication.startDate)}
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-7 text-[#006D77] hover:bg-[#E8F3F4]">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-red-500 hover:bg-red-50">
                                  Stop
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Health Metrics Chart */}
                    <Card className="md:col-span-2 border-[#E8F3F4] bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Health Metrics</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 bg-white">
                              Add Data Point
                            </Button>
                            <Select
                              defaultValue="3m"
                            >
                              <SelectTrigger className="w-24 h-8 text-xs bg-white">
                                <SelectValue placeholder="Time range" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="1m">1 Month</SelectItem>
                                <SelectItem value="3m">3 Months</SelectItem>
                                <SelectItem value="6m">6 Months</SelectItem>
                                <SelectItem value="1y">1 Year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {patient.healthMetrics && patient.healthMetrics.length > 0 && (
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart 
                                data={patient.healthMetrics[0].data.map((item, index) => {
                                  const dataPoint: any = { date: item.date };
                                  
                                  patient.healthMetrics!.forEach(metric => {
                                    if (metric.data[index]) {
                                      dataPoint[metric.name] = metric.data[index].value;
                                    }
                                  });
                                  
                                  return dataPoint;
                                })}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
                                <Legend />
                                {patient.healthMetrics.map((metric, index) => (
                                  <Line 
                                    key={index}
                                    type="monotone" 
                                    dataKey={metric.name} 
                                    stroke={index === 0 ? "#006D77" : index === 1 ? "#FF9500" : "#2D6A4F"} 
                                    activeDot={{ r: 8 }} 
                                  />
                                ))}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Appointments Tab */}
                <TabsContent value="appointments" className="mt-0">
                  <Card className="border-[#E8F3F4] bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Appointment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patient.appointments && patient.appointments.map((appointment) => (
                          <div key={appointment.id} className="border border-[#E8F3F4] rounded-lg hover:bg-[#F8FCFC] transition-colors">
                            <div 
                              className="p-4 cursor-pointer"
                              onClick={() => toggleAppointmentDetails(appointment.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="bg-[#F0F9FA] p-2 rounded-md mr-4">
                                    <Calendar className="h-5 w-5 text-[#006D77]" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{formatDate(appointment.date)} • {appointment.time}</div>
                                    <div className="text-sm text-gray-500">{appointment.type} with {appointment.doctorName}</div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`transition-transform ${expandedAppointment === appointment.id ? "rotate-180" : ""}`}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {expandedAppointment === appointment.id && (
                              <div className="border-t border-[#E8F3F4] p-4">
                                {appointment.notes && (
                                  <div className="bg-[#F8FCFC] rounded-md p-3 mb-4">
                                    <div className="text-sm font-medium mb-1">Doctor's Notes:</div>
                                    <div className="text-sm text-gray-600">{appointment.notes}</div>
                                  </div>
                                )}
                                
                                {appointment.prescriptions && appointment.prescriptions.length > 0 && (
                                  <div>
                                    <div className="text-sm font-medium mb-2">Prescriptions:</div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {appointment.prescriptions.map((prescription, idx) => (
                                        <Badge key={idx} variant="outline" className="bg-[#F0F9FA] border-[#006D77] text-[#006D77]">
                                          {prescription}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-white text-[#006D77]"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    View Full Report
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="bg-[#006D77] hover:bg-[#00585F]"
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Schedule Follow-up
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Test Results Tab */}
                <TabsContent value="tests" className="mt-0">
                  <Card className="border-[#E8F3F4] bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Recent Test Results</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#006D77] hover:bg-[#F0F9FA] p-1 h-7"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add Test Results
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-[#E8F3F4]">
                              <th className="pb-3 pr-4 font-medium">Test</th>
                              <th className="pb-3 pr-4 font-medium">Result</th>
                              <th className="pb-3 pr-4 font-medium">Normal Range</th>
                              <th className="pb-3 pr-4 font-medium">Date</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patient.testResults && patient.testResults.map((test, index) => {
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
                                <tr key={index} className="border-b border-[#E8F3F4]">
                                  <td className="py-4 pr-4">{test.name}</td>
                                  <td className="py-4 pr-4">
                                    {test.value} {test.unit}
                                  </td>
                                  <td className="py-4 pr-4">{test.normal}</td>
                                  <td className="py-4 pr-4">{formatDate(test.date)}</td>
                                  <td className="py-4">
                                    <Badge className={isNormal ? 
                                      "bg-emerald-100 text-emerald-800 border-emerald-200" : 
                                      "bg-amber-100 text-amber-800 border-amber-200"
                                    }>
                                      {isNormal ? "Normal" : "Abnormal"}
                                    </Badge>
                                  </td>
                                  <td className="py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 text-[#006D77]"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 w-8 p-0 text-[#006D77]"
                                      >
                                        <Activity className="h-4 w-4" />
                                      </Button>
                                    </div>
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

            {/* AI Insights & Actions Column */}
            <div>
              {/* AI Insights Panel */}
              <Card className="mb-6 bg-gradient-to-br from-[#F0F9FA] to-[#E8F3F4] border-[#006D77] border-l-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-[#006D77]">
                    <Activity className="mr-2 h-5 w-5" />
                    AI Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.condition === "Diabetes Type II" && (
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
                  )}
                  
                  {patient.condition === "Hypertension" && (
                    <div className="bg-white rounded-md p-4 border-l-4 border-amber-400">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-700 mb-1">Blood Pressure Alert</h4>
                          <p className="text-sm text-gray-600">
                            Blood pressure readings remain elevated despite medication. Consider therapy adjustment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {patient.condition === "Arthritis" && (
                    <div className="bg-white rounded-md p-4 border-l-4 border-amber-400">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-700 mb-1">Pain Management Alert</h4>
                          <p className="text-sm text-gray-600">
                            Pain scores have increased over last 3 months. Consider physical therapy referral.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {patient.condition === "Coronary Artery Disease" && (
                    <div className="bg-white rounded-md p-4 border-l-4 border-red-500">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-700 mb-1">Critical Cardiac Alert</h4>
                          <p className="text-sm text-gray-600">
                            Recent troponin levels indicate significant cardiac event. Immediate follow-up required.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-md p-4">
                    <h4 className="font-medium mb-2 text-[#006D77]">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                        Schedule follow-up appointment within 2 weeks
                      </li>
                      {patient.condition === "Diabetes Type II" && (
                        <>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Review medication adherence
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Consider nutrition counseling referral
                          </li>
                        </>
                      )}
                      {patient.condition === "Hypertension" && (
                        <>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Adjust medication dosage
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Recommend DASH diet and sodium restriction
                          </li>
                        </>
                      )}
                      {patient.condition === "Asthma" && (
                        <>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Review proper inhaler technique
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#006D77] mt-1.5 mr-2"></div>
                            Discuss environmental trigger management
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-md p-4">
                    <h4 className="font-medium mb-2 text-[#006D77]">Risk Assessment</h4>
                    <div className="space-y-3">
                      {patient.condition === "Diabetes Type II" && (
                        <>
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
                        </>
                      )}
                      
                      {patient.condition === "Coronary Artery Disease" && (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Cardiac Event Risk</span>
                              <span className="font-medium text-red-700">High</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Cholesterol Management</span>
                              <span className="font-medium text-amber-700">Needs Improvement</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {patient.condition === "Arthritis" && (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Mobility Risk</span>
                              <span className="font-medium text-amber-700">Moderate</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Pain Management</span>
                              <span className="font-medium text-amber-700">Needs Improvement</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="border-[#E8F3F4] bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-[#006D77] to-[#249EA0] hover:opacity-90 transition-all duration-300 justify-start"
                      onClick={onScheduleAppointment}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Follow-up
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] bg-white"
                      onClick={onSendMessage}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] bg-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Records
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-[#006D77] border-[#006D77] hover:bg-[#F0F9FA] bg-white"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code for quick access */}
              <Card className="mt-6 border-[#E8F3F4] bg-[#F8FCFC]">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="bg-white p-3 rounded-md mb-3 border border-[#E8F3F4]">
                    <QRCode 
                      value={`wellsphere://patient/${patient.id}`}
                      size={120}
                      level="H"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    Scan for quick access to medical records
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;