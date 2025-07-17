"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
}

export function Stepper({ steps, currentStep, completedSteps }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  {
                    "bg-blue-600 text-white": currentStep === index,
                    "bg-green-600 text-white": completedSteps.includes(index),
                    "bg-gray-200 text-gray-500":
                      currentStep !== index && !completedSteps.includes(index),
                  }
                )}
              >
                {completedSteps.includes(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3">
                <div
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    {
                      "text-blue-600": currentStep === index,
                      "text-green-600": completedSteps.includes(index),
                      "text-gray-500":
                        currentStep !== index &&
                        !completedSteps.includes(index),
                    }
                  )}
                >
                  {step}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn("h-0.5 transition-all duration-300", {
                    "bg-green-600": completedSteps.includes(index),
                    "bg-gray-200": !completedSteps.includes(index),
                  })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile-friendly stepper for smaller screens
export function MobileStepper({
  steps,
  currentStep,
  completedSteps,
}: StepperProps) {
  return (
    <div className="w-full md:hidden">
      <div className="flex items-center justify-center mb-6">
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                {
                  "bg-blue-600": currentStep === index,
                  "bg-green-600": completedSteps.includes(index),
                  "bg-gray-300":
                    currentStep !== index && !completedSteps.includes(index),
                }
              )}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          {steps[currentStep]}
        </h3>
      </div>
    </div>
  );
}
