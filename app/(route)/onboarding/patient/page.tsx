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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Stepper } from "@/modules/onboarding/Stepper";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  User,
  FileText,
  CreditCard,
  Calendar as CalendarIcon,
  Save,
  X,
  Heart,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PatientFormData {
  // Basic Information
  fullName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  abhaId: string;
  aadhaar: string;
  mobile: string;
  email: string;
  emergencyContact: string;
  address: string;

  // Medical History
  allergies: string[];
  chronicConditions: string[];
  pastSurgeries: string;
  ongoingMedications: string;
  vaccinationRecords: File[];

  // Insurance & Financial
  insuranceProvider: string;
  policyNumber: string;
}

export default function PatientOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const steps = ["Basic Info", "Medical History", "Insurance"];

  const [formData, setFormData] = useState<PatientFormData>({
    fullName: "",
    dateOfBirth: undefined,
    gender: "",
    abhaId: "",
    aadhaar: "",
    mobile: "",
    email: "",
    emergencyContact: "",
    address: "",
    allergies: [],
    chronicConditions: [],
    pastSurgeries: "",
    ongoingMedications: "",
    vaccinationRecords: [],
    insuranceProvider: "",
    policyNumber: "",
  });

  // Auto-save functionality
  useEffect(() => {
    const saveToStorage = () => {
      localStorage.setItem(
        "patientOnboardingData",
        JSON.stringify({
          formData,
          currentStep,
          completedSteps,
          otpVerified,
        })
      );
    };

    const timeoutId = setTimeout(saveToStorage, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, completedSteps, otpVerified]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("patientOnboardingData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCurrentStep(parsed.currentStep || 0);
        setCompletedSteps(parsed.completedSteps || []);
        setOtpVerified(parsed.otpVerified || false);
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.aadhaar.trim())
          newErrors.aadhaar = "Aadhaar number is required";
        if (formData.aadhaar && formData.aadhaar.length !== 12) {
          newErrors.aadhaar = "Aadhaar must be 12 digits";
        }
        if (!formData.mobile.trim())
          newErrors.mobile = "Mobile number is required";
        if (!otpVerified) newErrors.mobile = "Please verify your mobile number";
        if (!formData.emergencyContact.trim())
          newErrors.emergencyContact = "Emergency contact is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
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
      console.log("Patient registration data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Registration Successful!",
        description:
          "Welcome to WellSphere! You'll be redirected to your dashboard.",
      });

      // Clear saved data
      localStorage.removeItem("patientOnboardingData");

      // Redirect to patient dashboard
      router.push("/patient/dashboard");
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

  const sendOtp = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP sending
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${formData.mobile}`,
    });
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP verification
    setOtpVerified(true);
    toast({
      title: "Mobile Verified",
      description: "Your mobile number has been successfully verified",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      vaccinationRecords: [...prev.vaccinationRecords, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vaccinationRecords: prev.vaccinationRecords.filter((_, i) => i !== index),
    }));
  };

  const addTag = (field: "allergies" | "chronicConditions", value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeTag = (
    field: "allergies" | "chronicConditions",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
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
              <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Basic Information
              </h3>
              <p className="text-gray-600">
                Tell us about yourself to create your health profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
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
                  placeholder="John Doe"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground",
                        errors.dateOfBirth && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth
                        ? format(formData.dateOfBirth, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="abhaId">ABHA ID (Ayushman Bharat)</Label>
                <Input
                  id="abhaId"
                  value={formData.abhaId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, abhaId: e.target.value }))
                  }
                  placeholder="14-1234-5678-9012"
                />
                <p className="text-xs text-gray-500">
                  Optional - helps access government health schemes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  id="aadhaar"
                  value={formData.aadhaar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12),
                    }))
                  }
                  placeholder="123456789012"
                  className={errors.aadhaar ? "border-red-500" : ""}
                />
                {errors.aadhaar && (
                  <p className="text-sm text-red-500">{errors.aadhaar}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number *
                  {otpVerified && (
                    <Check className="inline w-4 h-4 text-green-600 ml-1" />
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                      }));
                      setOtpVerified(false);
                      setOtpSent(false);
                    }}
                    placeholder="9876543210"
                    className={`flex-1 ${
                      errors.mobile ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendOtp}
                    disabled={otpSent || otpVerified}
                  >
                    {otpVerified
                      ? "Verified"
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </Button>
                </div>

                {otpSent && !otpVerified && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={otpCode}
                      onChange={(e) =>
                        setOtpCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      className="flex-1"
                    />
                    <Button type="button" onClick={verifyOtp}>
                      Verify
                    </Button>
                  </div>
                )}
                {errors.mobile && (
                  <p className="text-sm text-red-500">{errors.mobile}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                  placeholder="Name - Phone Number"
                  className={errors.emergencyContact ? "border-red-500" : ""}
                />
                {errors.emergencyContact && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContact}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Complete address with city, state, and pincode"
                  className={`min-h-[80px] ${
                    errors.address ? "border-red-500" : ""
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
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
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Medical History
              </h3>
              <p className="text-gray-600">
                Help us understand your health background
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {allergy}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTag("allergies", allergy)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="E.g. Penicillin, pollen, peanuts"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("allergies", e.currentTarget.value);
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
                        addTag("allergies", input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chronic Conditions</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.chronicConditions.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {condition}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          removeTag("chronicConditions", condition)
                        }
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="E.g. Diabetes, Hypertension, Asthma"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("chronicConditions", e.currentTarget.value);
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
                        addTag("chronicConditions", input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pastSurgeries">Past Surgeries</Label>
                <Textarea
                  id="pastSurgeries"
                  value={formData.pastSurgeries}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pastSurgeries: e.target.value,
                    }))
                  }
                  placeholder="List any previous surgeries with approximate dates"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ongoingMedications">Ongoing Medications</Label>
                <Textarea
                  id="ongoingMedications"
                  value={formData.ongoingMedications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ongoingMedications: e.target.value,
                    }))
                  }
                  placeholder="List current medications with dosage and frequency"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-4">
                <Label>Vaccination Records (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload vaccination certificates (PDF format)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="vaccination-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("vaccination-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {formData.vaccinationRecords.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    {formData.vaccinationRecords.map((file, index) => (
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
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Insurance & Financial
              </h3>
              <p className="text-gray-600">
                Set up your insurance and payment preferences
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Select
                  value={formData.insuranceProvider}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      insuranceProvider: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your insurance provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="star-health">Star Health</SelectItem>
                    <SelectItem value="religare">Religare</SelectItem>
                    <SelectItem value="icici-lombard">ICICI Lombard</SelectItem>
                    <SelectItem value="bajaj-allianz">Bajaj Allianz</SelectItem>
                    <SelectItem value="hdfc-ergo">HDFC ERGO</SelectItem>
                    <SelectItem value="none">No Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.insuranceProvider &&
                formData.insuranceProvider !== "none" && (
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          policyNumber: e.target.value,
                        }))
                      }
                      placeholder="Enter your policy number"
                    />
                  </div>
                )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Data Security
                    </h4>
                    <p className="text-sm text-blue-800">
                      Your personal and medical information is encrypted and
                      stored securely. We comply with HIPAA and other healthcare
                      privacy regulations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">
                      What&apos;s Next?
                    </h4>
                    <p className="text-sm text-green-800">
                      After registration, you&apos;ll be able to book
                      appointments, access your medical records, manage
                      medications, and connect with your healthcare providers.
                    </p>
                  </div>
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
              Patient Registration
            </h1>
            <p className="text-gray-600">
              Create your health profile to get started
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
