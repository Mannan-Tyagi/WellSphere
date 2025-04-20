"use client";

import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ClaimSubmissionFlowProps {
  onClose: () => void;
}

const ClaimSubmissionFlow: React.FC<ClaimSubmissionFlowProps> = ({
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    provider: "",
    service: "",
    date: "",
    amount: "",
    insuranceProvider: "",
    policyNumber: "",
    description: "",
    files: [] as File[],
  });

  const totalSteps = 4;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...fileArray],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit the form data to an API
    console.log("Submitting claim:", formData);

    // Move to confirmation step
    setStep(totalSteps);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === step
                  ? "bg-[#006D77] text-white"
                  : index + 1 < step
                  ? "bg-[#E6F2F3] text-[#006D77] border border-[#006D77]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {index + 1 < step ? <CheckCircle size={16} /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-1 ${
                  index + 1 < step ? "bg-[#006D77]" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {step === totalSteps ? "Claim Submitted" : "Submit Insurance Claim"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {renderStepIndicator()}

          {step === 1 && (
            <div>
              <h3 className="font-medium mb-4">Claim Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="provider">Healthcare Provider</Label>
                  <Input
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    placeholder="Provider name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) =>
                      handleSelectChange("service", value)
                    }
                  >
                    <SelectTrigger id="service" className="mt-1">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consult">Consultation</SelectItem>
                      <SelectItem value="test">Diagnostic Test</SelectItem>
                      <SelectItem value="procedure">
                        Medical Procedure
                      </SelectItem>
                      <SelectItem value="therapy">Physical Therapy</SelectItem>
                      <SelectItem value="other">Other Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Service Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full mt-1 justify-start text-left font-normal ${
                          !date ? "text-muted-foreground" : ""
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="amount">Claim Amount ($)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <DollarSign size={16} />
                    </span>
                    <Input
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="pl-10"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-medium mb-4">Insurance Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Select
                    value={formData.insuranceProvider}
                    onValueChange={(value) =>
                      handleSelectChange("insuranceProvider", value)
                    }
                  >
                    <SelectTrigger id="insuranceProvider" className="mt-1">
                      <SelectValue placeholder="Select insurance provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="bluecross">
                        Blue Cross Blue Shield
                      </SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="unitedhealth">
                        UnitedHealthcare
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    placeholder="Policy number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Claim Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the reason for this claim"
                    className="mt-1 h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-medium mb-4">Upload Documents</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className="bg-[#006D77] hover:bg-[#00585F]"
                  >
                    Browse Files
                  </Button>
                </div>

                {formData.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                    <ul className="space-y-2">
                      {formData.files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm"
                        >
                          <div className="flex items-center">
                            <FileText
                              size={16}
                              className="text-gray-500 mr-2"
                            />
                            <span>{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Claim Submitted Successfully
              </h3>
              <p className="text-gray-600 mb-6">
                Your claim has been submitted and will be processed within 5-7
                business days. You'll receive updates via email and in your
                claims dashboard.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Claim Reference: #CL-
                {Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}
              </p>
              <Button
                onClick={onClose}
                className="bg-[#006D77] hover:bg-[#00585F]"
              >
                Return to Dashboard
              </Button>
            </div>
          )}

          {step < totalSteps && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < totalSteps - 1 ? (
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={nextStep}
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={handleSubmit}
                >
                  Submit Claim
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimSubmissionFlow;
