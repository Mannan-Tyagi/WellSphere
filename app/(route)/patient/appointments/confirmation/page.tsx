import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import { ChevronRight, FileText, CalendarPlus } from '@/components/icons';

export default function AppointmentConfirmationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Appointment Confirmation</h2>
          <p className="mb-4">Your appointment has been successfully scheduled.</p>
          <div className="space-y-4">
            <Link href="/patient/records/forms">
              <Button className="w-full justify-between" variant="outline">
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Complete Pre-Visit Forms
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button className="w-full justify-between" variant="outline">
              <span className="flex items-center">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add to Calendar
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/patient/dashboard')}
          className="text-[#006D77]"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}