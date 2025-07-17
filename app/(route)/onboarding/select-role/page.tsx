"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Stethoscope,
  Heart,
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function SelectRolePage() {
  const router = useRouter();

  const roles = [
    {
      id: "doctor",
      title: "Doctor",
      description:
        "Healthcare providers, specialists, and medical professionals",
      icon: Stethoscope,
      route: "/onboarding/doctor",
      color: "from-blue-500 to-blue-600",
      features: [
        "Manage patient records",
        "Schedule consultations",
        "Access medical history",
        "Collaborate with colleagues",
        "Mentorship opportunities",
      ],
    },
    {
      id: "patient",
      title: "Patient",
      description: "Individuals seeking healthcare services and medical care",
      icon: Heart,
      route: "/onboarding/patient",
      color: "from-green-500 to-green-600",
      features: [
        "Book appointments",
        "Access health records",
        "Manage medications",
        "Track vital signs",
        "Family health management",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to WellSphere
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose your role to get started with our comprehensive
                healthcare platform
              </p>
            </motion.div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg`}
                    >
                      <role.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {role.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      {role.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-600" />
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => router.push(role.route)}
                      className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      Continue as {role.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-blue-600" />
                <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                <p className="text-sm text-gray-600">
                  HIPAA compliant with end-to-end encryption for all your
                  medical data
                </p>
              </div>

              <div className="space-y-2">
                <Users className="w-8 h-8 mx-auto text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  Collaborative Care
                </h3>
                <p className="text-sm text-gray-600">
                  Connect patients and healthcare providers for better health
                  outcomes
                </p>
              </div>

              <div className="space-y-2">
                <Heart className="w-8 h-8 mx-auto text-red-500" />
                <h3 className="font-semibold text-gray-900">
                  Comprehensive Health
                </h3>
                <p className="text-sm text-gray-600">
                  Complete health management from appointments to medication
                  tracking
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
