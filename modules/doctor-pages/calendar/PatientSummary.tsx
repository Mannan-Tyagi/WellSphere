import React from 'react';
import { Patient } from '@/app/(route)/Doctor/Calendar/page';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Heart,
  Activity,
  Footprints,
  Moon,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface PatientSummaryProps {
  patient: Patient;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ patient }) => {
  const {
    name,
    dob,
    phone,
    email,
    insuranceProvider,
    insuranceNumber,
    wearableData,
    alerts,
    previousVisits,
    lastVisit
  } = patient;
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const age = dob ? calculateAge(dob) : 'N/A';
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <User className="h-3.5 w-3.5" />
            <span>{age} years old</span>
            {dob && (
              <>
                <span>•</span>
                <span>DOB: {formatDate(dob)}</span>
              </>
            )}
          </div>
        </div>
        
        {previousVisits !== undefined && (
          <Badge variant="outline" className="text-xs">
            {previousVisits} previous {previousVisits === 1 ? 'visit' : 'visits'}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{phone}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{email}</span>
        </div>
        
        {insuranceProvider && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>
              {insuranceProvider}
              {insuranceNumber && ` • ${insuranceNumber}`}
            </span>
          </div>
        )}
        
        {lastVisit && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last visit: {formatDate(lastVisit)}</span>
          </div>
        )}
      </div>
      
      {/* Patient Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Alerts</h4>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-2 rounded-md text-sm flex items-start gap-2 
                  ${alert.severity === 'high' 
                    ? 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' 
                    : alert.severity === 'medium'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
              >
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                  alert.severity === 'high' 
                    ? 'text-red-500' 
                    : alert.severity === 'medium'
                    ? 'text-amber-500'
                    : 'text-blue-500'
                }`} />
                <div>
                  <div className="font-medium capitalize">{alert.type}</div>
                  <div>{alert.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Wearable Device Data */}
      {wearableData && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Wearable Device Data</h4>
            {wearableData.lastSynced && (
              <span className="text-xs text-muted-foreground">
                Last synced: {formatDate(wearableData.lastSynced)}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Steps */}
            {wearableData.steps !== undefined && (
              <Card>
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Steps</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold">{wearableData.steps.toLocaleString()}</span>
                    <div className="text-xs text-muted-foreground">Goal: 10,000</div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Heart Rate */}
            {wearableData.heartRate !== undefined && (
              <Card>
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold">{wearableData.heartRate}</span>
                    <span className="text-sm ml-1">bpm</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Blood Pressure */}
            {wearableData.bloodPressure && (
              <Card>
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Blood Pressure</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold">
                      {wearableData.bloodPressure.systolic}/{wearableData.bloodPressure.diastolic}
                    </span>
                    <span className="text-sm ml-1">mmHg</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Sleep */}
            {wearableData.sleep && (
              <Card>
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">Sleep</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold">{wearableData.sleep.duration}</span>
                    <span className="text-sm ml-1">hours</span>
                    <div className="text-xs text-muted-foreground">{wearableData.sleep.quality}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSummary;