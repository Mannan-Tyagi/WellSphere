"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Stepper } from "@/modules/onboarding/Stepper";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Stethoscope,
  Shield,
  Calendar,
  DollarSign,
  Users,
  Save,
  FileText,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorFormData {
  // Personal Information
  fullName: string;
  registrationNumber: string;
  specialization: string;
  yearsExperience: number;
  contactPhone: string;
  contactEmail: string;

  // Credential Verification
  uploadDocuments: File[];
  videoKyc: boolean;
  hospitalPrivileges: string[];

  // Work Schedule
  preferredWorkingHours: string;
  leavePreferences: string[];

  // Compensation
  paymentMode: string;
  compensationAmount: number;

  // Mentorship
  willingToMentor: boolean;
  mentorshipSlots: number;
  pastMentorshipExperience: string;
  expertiseAreas: string[];
}

export default function DoctorOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    "Personal Info",
    "Credentials",
    "Schedule",
    "Compensation",
    "Mentorship",
  ];

  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: "",
    registrationNumber: "",
    specialization: "",
    yearsExperience: 0,
    contactPhone: "",
    contactEmail: "",
    uploadDocuments: [],
    videoKyc: false,
    hospitalPrivileges: [],
    preferredWorkingHours: "",
    leavePreferences: [],
    paymentMode: "",
    compensationAmount: 0,
    willingToMentor: false,
    mentorshipSlots: 0,
    pastMentorshipExperience: "",
    expertiseAreas: [],
  });

  // Auto-save functionality
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem(
        "doctorOnboardingData",
        JSON.stringify({
          formData,
          currentStep,
          completedSteps,
        })
      );
    };

    const timeoutId = setTimeout(saveToStorage, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, completedSteps]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("doctorOnboardingData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCurrentStep(parsed.currentStep || 0);
        setCompletedSteps(parsed.completedSteps || []);
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.registrationNumber.trim())
          newErrors.registrationNumber = "Registration number is required";
        if (!formData.specialization)
          newErrors.specialization = "Specialization is required";
        if (formData.yearsExperience < 0)
          newErrors.yearsExperience = "Years of experience must be positive";
        if (!formData.contactPhone.trim())
          newErrors.contactPhone = "Phone number is required";
        if (!formData.contactEmail.trim())
          newErrors.contactEmail = "Email is required";
        if (
          formData.contactEmail &&
          !/\S+@\S+\.\S+/.test(formData.contactEmail)
        ) {
          newErrors.contactEmail = "Please enter a valid email address";
        }
        break;

      case 1: // Credentials
        if (formData.uploadDocuments.length === 0)
          newErrors.uploadDocuments = "Please upload your certificates";
        if (formData.hospitalPrivileges.length === 0)
          newErrors.hospitalPrivileges = "Please select at least one privilege";
        break;

      case 2: // Schedule
        if (!formData.preferredWorkingHours)
          newErrors.preferredWorkingHours = "Please select working hours";
        break;

      case 3: // Compensation
        if (!formData.paymentMode)
          newErrors.paymentMode = "Please select payment mode";
        if (formData.compensationAmount <= 0)
          newErrors.compensationAmount = "Please enter compensation amount";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      console.log("Doctor registration data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Registration Successful!",
        description:
          "Welcome to WellSphere! You'll be redirected to your dashboard.",
      });

      // Clear saved data
      localStorage.removeItem("doctorOnboardingData");

      // Redirect to doctor dashboard
      router.push("/doctor/dashboard");
    } catch {
      toast({
        title: "Registration Failed",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      uploadDocuments: [...prev.uploadDocuments, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      uploadDocuments: prev.uploadDocuments.filter((_, i) => i !== index),
    }));
  };

  const addExpertiseArea = (area: string) => {
    if (area.trim() && !formData.expertiseAreas.includes(area.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, area.trim()],
      }));
    }
  };

  const removeExpertiseArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.filter((a) => a !== area),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Personal Information
              </h3>
              <p className="text-gray-600">
                Tell us about yourself and your medical practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Dr. John Smith"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Medical Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationNumber: e.target.value,
                    }))
                  }
                  placeholder="MR123456789"
                  className={errors.registrationNumber ? "border-red-500" : ""}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-500">
                    {errors.registrationNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, specialization: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.specialization ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Practice</SelectItem>
                    <SelectItem value="pediatrician">Pediatrician</SelectItem>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                    <SelectItem value="surgeon">Surgeon</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-sm text-red-500">
                    {errors.specialization}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsExperience: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="5"
                  className={errors.yearsExperience ? "border-red-500" : ""}
                />
                {errors.yearsExperience && (
                  <p className="text-sm text-red-500">
                    {errors.yearsExperience}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPhone: e.target.value,
                    }))
                  }
                  placeholder="+91 9876543210"
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-500">{errors.contactPhone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  placeholder="doctor@example.com"
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Credential Verification
              </h3>
              <p className="text-gray-600">
                Upload your certificates and verify your credentials
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>MBBS/MD/MS Certificates *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your medical certificates (PDF, DOCX)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {formData.uploadDocuments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    {formData.uploadDocuments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.uploadDocuments && (
                  <p className="text-sm text-red-500">
                    {errors.uploadDocuments}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="videoKyc"
                  checked={formData.videoKyc}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, videoKyc: checked }))
                  }
                />
                <Label htmlFor="videoKyc">
                  Video KYC (If remote verification needed)
                </Label>
              </div>

              <div className="space-y-4">
                <Label>Hospital Privileges *</Label>
                <div className="grid grid-cols-2 gap-4">
                  {["OPD", "IPD", "Emergency", "ICU", "Surgery"].map(
                    (privilege) => (
                      <div
                        key={privilege}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={privilege}
                          checked={formData.hospitalPrivileges.includes(
                            privilege
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                hospitalPrivileges: [
                                  ...prev.hospitalPrivileges,
                                  privilege,
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                hospitalPrivileges:
                                  prev.hospitalPrivileges.filter(
                                    (p) => p !== privilege
                                  ),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={privilege}>{privilege}</Label>
                      </div>
                    )
                  )}
                </div>
                {errors.hospitalPrivileges && (
                  <p className="text-sm text-red-500">
                    {errors.hospitalPrivileges}
                  </p>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    License validation will be performed via NMC/State Medical
                    Council
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Work Schedule Setup
              </h3>
              <p className="text-gray-600">
                Configure your availability and working preferences
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="preferredWorkingHours">
                  Preferred Working Hours *
                </Label>
                <Select
                  value={formData.preferredWorkingHours}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredWorkingHours: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={
                      errors.preferredWorkingHours ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select working hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opd">
                      OPD (Out-Patient Department)
                    </SelectItem>
                    <SelectItem value="ipd">
                      IPD (In-Patient Department)
                    </SelectItem>
                    <SelectItem value="on-call">On-call</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredWorkingHours && (
                  <p className="text-sm text-red-500">
                    {errors.preferredWorkingHours}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Leave Preferences (Optional)</Label>
                <p className="text-sm text-gray-600">
                  Select dates when you will not be available
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">
                    Calendar integration will be available in the dashboard
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Compensation Details
              </h3>
              <p className="text-gray-600">
                Set up your payment preferences and compensation
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode *</Label>
                <Select
                  value={formData.paymentMode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, paymentMode: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.paymentMode ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMode && (
                  <p className="text-sm text-red-500">{errors.paymentMode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="compensationAmount">
                  Compensation Amount (₹) *
                </Label>
                <Input
                  id="compensationAmount"
                  type="number"
                  min="0"
                  value={formData.compensationAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      compensationAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="50000"
                  className={errors.compensationAmount ? "border-red-500" : ""}
                />
                {errors.compensationAmount && (
                  <p className="text-sm text-red-500">
                    {errors.compensationAmount}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Mentorship & Collaboration
              </h3>
              <p className="text-gray-600">
                Share your expertise and collaborate with others
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="willingToMentor"
                  checked={formData.willingToMentor}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      willingToMentor: checked,
                    }))
                  }
                />
                <Label htmlFor="willingToMentor">
                  Available for Mentoring?
                </Label>
              </div>

              {formData.willingToMentor && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentorshipSlots">
                      Surgical Mentoring Slots
                    </Label>
                    <Input
                      id="mentorshipSlots"
                      type="number"
                      min="0"
                      value={formData.mentorshipSlots}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mentorshipSlots: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pastMentorshipExperience">
                      Past Mentorship Experience
                    </Label>
                    <Textarea
                      id="pastMentorshipExperience"
                      value={formData.pastMentorshipExperience}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pastMentorshipExperience: e.target.value,
                        }))
                      }
                      placeholder="Describe your mentoring experience..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Expertise Areas</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.expertiseAreas.map((area, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {area}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeExpertiseArea(area)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add expertise area"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExpertiseArea(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      if (input) {
                        addExpertiseArea(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/onboarding/select-role")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Role Selection
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Doctor Registration
            </h1>
            <p className="text-gray-600">
              Complete your profile to join our healthcare network
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="pb-6">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </CardHeader>

          <CardContent className="pt-0">
            <div className="min-h-[500px]">{renderStepContent()}</div>

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Progress Saved",
                      description:
                        "Your progress has been saved automatically.",
                    });
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
