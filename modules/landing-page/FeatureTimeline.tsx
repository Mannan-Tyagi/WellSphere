"use client";

import React from "react";
import { Stethoscope, Users, Building2 } from "lucide-react";

function FeaturesTimeline() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Comprehensive Healthcare Solutions
        </h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

          {/* Doctor Features */}
          <div className="mb-16 relative">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:text-right">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Smart Patient Management
                  </h3>
                  <p className="text-gray-600">
                    AI-powered scheduling system that optimizes your daily
                    appointments. Automatically handle cancellations, reschedules,
                    and waiting lists. Reduce no-shows with reminders.
                  </p>
                </div>
              </div>
              <div></div>
              <div></div>
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Digital Health Records
                  </h3>
                  <p className="text-gray-600">
                    Access and manage patient records securely from anywhere.
                    Include detailed medical history, prescriptions, and test
                    results. Collaborate with other healthcare providers in
                    real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Features */}
          <div className="mb-16 relative">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:text-right">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    24/7 Care Access
                  </h3>
                  <p className="text-gray-600">
                    Round-the-clock access to healthcare professionals through
                    secure messaging. Book appointments instantly and receive
                    emergency care guidance. Access your complete medical history
                    anytime.
                  </p>
                </div>
              </div>
              <div></div>
              <div></div>
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Medication Management
                  </h3>
                  <p className="text-gray-600">
                    Smart medication reminders and refill tracking. Monitor side
                    effects and receive personalized dosage alerts. Direct
                    communication with pharmacies for prescriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Features */}
          <div className="relative">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:text-right">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Resource Optimization
                  </h3>
                  <p className="text-gray-600">
                    Advanced analytics for optimal resource allocation. Track
                    equipment usage, bed availability, and staff scheduling.
                    Reduce waiting times and improve patient flow management.
                  </p>
                </div>
              </div>
              <div></div>
              <div></div>
              <div>
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Integrated Analytics
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive reporting dashboard for hospital performance
                    metrics. Monitor patient satisfaction, treatment outcomes, and
                    operational efficiency. Data-driven insights for strategic
                    planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesTimeline;