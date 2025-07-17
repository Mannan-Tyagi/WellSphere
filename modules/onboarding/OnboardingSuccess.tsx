import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

interface OnboardingSuccessProps {
  userType: "doctor" | "patient";
  userName: string;
}

export function OnboardingSuccess({
  userType,
  userName,
}: OnboardingSuccessProps) {
  const router = useRouter();

  const handleDashboardRedirect = () => {
    router.push(`/${userType}/dashboard`);
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Welcome to WellSphere!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Hi {userName}! Your {userType} registration has been completed
            successfully.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleDashboardRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={handleHomeRedirect}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            You can now access all features and start your healthcare journey
            with us.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
