import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Activity, HeartPulse, Brain, Calendar, 
  AlertCircle, CheckCircle, Smartphone, MapPin, Bell, 
  Clock,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ElderlyMonitoring = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for the elderly person being monitored
  const elderlyMember = {
    id: 1,
    name: 'Rose Wilson',
    age: 73,
    relationship: 'Mother',
    avatar: '/avatars/rose.png',
    location: 'Home',
    lastCheckin: '10 minutes ago',
    emergencyContacts: [
      { name: 'Diana Cooper', relationship: 'Daughter', phone: '(555) 123-4567' },
      { name: 'Community Care', type: 'Service', phone: '(555) 987-6543' }
    ]
  };
  
  // Mock fall detection data
  const fallDetectionData = {
    enabled: true,
    lastChecked: '2025-03-25 08:42 AM',
    sensitivity: 'medium',
    history: [
      { date: '2025-03-15', time: '09:30 AM', type: 'Possible fall detected', severity: 'medium', resolved: true },
      { date: '2025-02-28', time: '07:15 PM', type: 'Fall detected', severity: 'high', resolved: true },
      { date: '2025-02-10', time: '11:20 AM', type: 'Movement anomaly', severity: 'low', resolved: true }
    ],
    movements: [
      { hour: '6AM', value: 10 },
      { hour: '7AM', value: 25 },
      { hour: '8AM', value: 40 },
      { hour: '9AM', value: 30 },
      { hour: '10AM', value: 45 },
      { hour: '11AM', value: 20 },
      { hour: '12PM', value: 35 },
      { hour: '1PM', value: 15 },
      { hour: '2PM', value: 10 },
      { hour: '3PM', value: 30 },
      { hour: '4PM', value: 25 },
      { hour: '5PM', value: 40 }
    ]
  };
  
  // Mock cognitive assessment data
  const cognitiveData = {
    lastAssessment: '2025-03-20',
    nextScheduled: '2025-04-20',
    overallScore: 85,
    trend: 'stable',
    categories: [
      { name: 'Memory', score: 80, change: -2 },
      { name: 'Attention', score: 90, change: 0 },
      { name: 'Language', score: 88, change: +1 },
      { name: 'Problem Solving', score: 82, change: -1 },
      { name: 'Orientation', score: 95, change: +2 }
    ],
    history: [
      { date: '2025-01-20', score: 84 },
      { date: '2025-02-20', score: 86 },
      { date: '2025-03-20', score: 85 }
    ]
  };
  
  // Mock medication reminders
  const medicationReminders = [
    { 
      time: '8:00 AM', 
      medications: [
        { name: 'Metformin', dosage: '500mg', taken: true, takenAt: '8:05 AM' },
        { name: 'Lisinopril', dosage: '10mg', taken: true, takenAt: '8:05 AM' }
      ]
    },
    { 
      time: '12:00 PM', 
      medications: [
        { name: 'Amlodipine', dosage: '5mg', taken: false, dueIn: '15 minutes' }
      ]
    },
    { 
      time: '6:00 PM', 
      medications: [
        { name: 'Metformin', dosage: '500mg', taken: false, upcoming: true },
        { name: 'Metoprolol', dosage: '50mg', taken: false, upcoming: true }
      ]
    }
  ];
  
  // Get status color based on trend
  const getTrendColor = (trend) => {
    switch(trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-rose-600';
      default:
        return 'text-blue-600';
    }
  };
  
  // Get status badge for severity
  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 text-gray-500" 
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-[#006D77]">Elderly Monitoring</h1>
      </div>
      
      {/* Status Overview Card */}
      <Card className="bg-[#F0F9FA] border-[#E8F3F4] mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Avatar className="h-16 w-16 border-2 border-[#006D77]">
              <AvatarImage src={elderlyMember.avatar} alt={elderlyMember.name} />
              <AvatarFallback className="bg-[#E8F3F4] text-[#006D77] text-xl">
                {elderlyMember.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#006D77] flex items-center">
                    {elderlyMember.name}
                    <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                      <CheckCircle size={10} className="mr-1" />
                      Active
                    </Badge>
                  </h2>
                  <p className="text-gray-600">{elderlyMember.relationship}, {elderlyMember.age} years old</p>
                </div>
                
                <div className="mt-2 md:mt-0 flex items-center">
                  <MapPin size={16} className="text-[#006D77] mr-1" />
                  <span className="font-medium text-[#006D77]">{elderlyMember.location}</span>
                  <span className="text-gray-500 ml-2">• Last check-in: {elderlyMember.lastCheckin}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap mt-3 gap-2">
                <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                  <Smartphone className="mr-1 h-4 w-4" />
                  Call Now
                </Button>
                <Button size="sm" variant="outline" className="border-[#006D77] text-[#006D77]">
                  <Bell className="mr-1 h-4 w-4" />
                  Send Reminder
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  Emergency Services
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main monitoring tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fall-detection">Fall Detection</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Medication Reminders */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-[#006D77]">
                  <Activity className="mr-2 h-5 w-5" />
                  Today's Medication Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {medicationReminders.map((reminder, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-gray-700 flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {reminder.time}
                      </h3>
                      
                      <div className="space-y-2">
                        {reminder.medications.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{med.name} {med.dosage}</p>
                            </div>
                            <div>
                              {med.taken ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle size={12} className="mr-1" />
                                  Taken {med.takenAt}
                                </Badge>
                              ) : med.dueIn ? (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                  <Clock size={12} className="mr-1" />
                                  Due in {med.dueIn}
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  <Clock size={12} className="mr-1" />
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {reminder.medications.some(med => !med.taken && med.dueIn) && (
                        <Button size="sm" className="mt-3 w-full justify-center bg-[#006D77] hover:bg-[#00585F]">
                          <Bell className="h-4 w-4 mr-1" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Fall Detection Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-[#006D77]">
                  <HeartPulse className="mr-2 h-5 w-5" />
                  Fall Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Status</p>
                      <p className="text-sm text-gray-600">Last checked: {fallDetectionData.lastChecked}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle size={12} className="mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Recent Movement Activity</p>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fallDetectionData.movements}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#006D77" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Recent Alerts</p>
                    {fallDetectionData.history.length > 0 ? (
                      <div className="space-y-2">
                        {fallDetectionData.history.slice(0, 2).map((event, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium">{event.type}</p>
                              <p className="text-xs text-gray-600">{event.date} • {event.time}</p>
                            </div>
                            {getSeverityBadge(event.severity)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No recent alerts detected</p>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full justify-center">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Cognitive Assessment Overview */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-[#006D77]">
                  <Brain className="mr-2 h-5 w-5" />
                  Cognitive Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-medium">Overall Cognitive Score</p>
                        <p className="text-sm text-gray-600">
                          Last assessment: {new Date(cognitiveData.lastAssessment).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={`${
                          cognitiveData.trend === 'improving' ? 'bg-green-100 text-green-800 border-green-200' : 
                          cognitiveData.trend === 'declining' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                          'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {cognitiveData.trend.charAt(0).toUpperCase() + cognitiveData.trend.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center">
                        <svg className="w-24 h-24">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                          />
                          <circle
                            className={`${
                              cognitiveData.overallScore >= 90 ? 'text-green-500' : 
                              cognitiveData.overallScore >= 75 ? 'text-blue-500' : 
                              cognitiveData.overallScore >= 60 ? 'text-amber-500' : 
                              'text-rose-500'
                            }`}
                            strokeWidth="8"
                            strokeDasharray={`${cognitiveData.overallScore * 2.51} 251`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                            transform="rotate(-90 48 48)"
                          />
                        </svg>
                        <span className="absolute text-2xl font-bold">
                          {cognitiveData.overallScore}%
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Cognitive Function</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-center">
                        Next assessment scheduled for{" "}
                        <span className="font-medium">{new Date(cognitiveData.nextScheduled).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Category Breakdown</h3>
                    <div className="space-y-3">
                      {cognitiveData.categories.map((category, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm">{category.name}</p>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{category.score}%</span>
                              <span className={`text-xs ${category.change > 0 ? 'text-green-600' : category.change < 0 ? 'text-rose-600' : 'text-gray-500'}`}>
                                {category.change > 0 ? `+${category.change}` : category.change}
                              </span>
                            </div>
                          </div>
                          <Progress 
                            value={category.score} 
                            className="h-2"
                            indicator={`bg-${
                              category.score >= 90 ? 'green' : 
                              category.score >= 75 ? 'blue' : 
                              category.score >= 60 ? 'amber' : 
                              'rose'
                            }-500`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" size="sm" className="text-[#006D77] border-[#006D77]">
                        View History
                      </Button>
                      <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="fall-detection">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center text-[#006D77]">
                  <HeartPulse className="mr-2 h-5 w-5" />
                  Fall Detection System
                </div>
                <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                  Configure Settings
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-6">
                {/* System status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-[#F0F9FA] rounded-lg">
                  <div>
                    <h3 className="font-medium">System Status</h3>
                    <p className="text-sm text-gray-600">Using smartphone accelerometer and gyroscope</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle size={12} className="mr-1" />
                      Active & Monitoring
                    </Badge>
                  </div>
                </div>
                
                {/* Fall detection history */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Detection History</h3>
                    <Badge className="bg-[#F0F9FA] text-[#006D77] border-[#006D77]">
                      Sensitivity: {fallDetectionData.sensitivity.charAt(0).toUpperCase() + fallDetectionData.sensitivity.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {fallDetectionData.history.map((event, idx) => (
                      <div key={idx} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{event.type}</p>
                            <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                          </div>
                          {getSeverityBadge(event.severity)}
                        </div>
                        
                        <div className="mt-3 pt-2 border-t flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            {event.resolved ? 'Resolved' : 'Unresolved'}
                          </p>
                          
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              View Details
                            </Button>
                            {!event.resolved && (
                              <Button size="sm" className="h-7 bg-[#006D77] hover:bg-[#00585F] text-xs">
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Movement activity chart */}
                <div>
                  <h3 className="font-medium mb-3">Daily Movement Activity</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fallDetectionData.movements}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#006D77" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Movement activity tracked throughout the day
                  </p>
                </div>
                
                {/* Emergency contacts */}
                <div>
                  <h3 className="font-medium mb-3">Emergency Contacts</h3>
                  <div className="space-y-2">
                    {elderlyMember.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">
                            {contact.relationship || contact.type}
                          </p>
                        </div>
                        <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                          <Smartphone className="h-4 w-4 mr-1" />
                          {contact.phone}
                        </Button>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full justify-center">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Emergency Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cognitive">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center text-[#006D77]">
                  <Brain className="mr-2 h-5 w-5" />
                  Cognitive Health Monitoring
                </div>
                <Button size="sm" className="bg-[#006D77] hover:bg-[#00585F]">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Assessment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-6">
                {/* Cognitive trend chart */}
                <div>
                  <h3 className="font-medium mb-3">Cognitive Score Trend</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cognitiveData.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short' })} 
                        />
                        <YAxis domain={[60, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#006D77" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Monthly cognitive assessment scores
                  </p>
                </div>
                
                {/* Category breakdown detail */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Cognitive Categories Detail</h3>
                    <Badge 
                      className={`${
                        cognitiveData.trend === 'improving' ? 'bg-green-100 text-green-800 border-green-200' : 
                        cognitiveData.trend === 'declining' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {cognitiveData.trend.charAt(0).toUpperCase() + cognitiveData.trend.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {cognitiveData.categories.map((category, idx) => (
                      <div key={idx} className="border rounded-md p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-600">
                              {category.name === 'Memory' ? 'Short and long-term recall ability' :
                               category.name === 'Attention' ? 'Focus and concentration on tasks' :
                               category.name === 'Language' ? 'Communication and comprehension' :
                               category.name === 'Problem Solving' ? 'Logic and reasoning skills' :
                               'Awareness of time, place, and self'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <span className="text-xl font-bold mr-2">{category.score}</span>
                              <span className={`text-sm ${
                                category.change > 0 ? 'text-green-600' : 
                                category.change < 0 ? 'text-rose-600' : 
                                'text-gray-500'
                              }`}>
                                {category.change > 0 ? `+${category.change}` : category.change}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {category.score >= 90 ? 'Excellent' :
                               category.score >= 80 ? 'Good' :
                               category.score >= 70 ? 'Average' :
                               category.score >= 60 ? 'Fair' : 'Needs Attention'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Progress 
                            value={category.score} 
                            className="h-2"
                            indicator={`bg-${
                              category.score >= 90 ? 'green' : 
                              category.score >= 80 ? 'blue' : 
                              category.score >= 70 ? 'teal' : 
                              category.score >= 60 ? 'amber' : 
                              'rose'
                            }-500`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recommended activities */}
                <div>
                  <h3 className="font-medium mb-3">Recommended Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <p className="font-medium">Memory Games</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Activities to improve recall and memory function
                      </p>
                      <Button size="sm" className="w-full justify-center bg-[#006D77] hover:bg-[#00585F]">
                        View Exercises
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <p className="font-medium">Daily Journaling</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Writing exercises to maintain language skills
                      </p>
                      <Button size="sm" className="w-full justify-center bg-[#006D77] hover:bg-[#00585F]">
                        Start Journal
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <p className="font-medium">Problem Solving Puzzles</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Puzzles to enhance logical thinking and reasoning
                      </p>
                      <Button size="sm" className="w-full justify-center bg-[#006D77] hover:bg-[#00585F]">
                        Try Puzzles
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 hover:bg-gray-50">
                      <p className="font-medium">Social Engagement</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Regular conversations to maintain cognitive function
                      </p>
                      <Button size="sm" className="w-full justify-center bg-[#006D77] hover:bg-[#00585F]">
                        Find Activities
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElderlyMonitoring;
