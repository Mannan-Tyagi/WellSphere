import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/types/patient";
import { X } from "lucide-react";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Patient, 'id'>) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    profileImage: "/avatars/placeholder.png",
    lastVisit: new Date().toISOString().split('T')[0],
    condition: "",
    status: "stable",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
    allergies: "",
    medications: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    }
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      // If there are errors, switch to the relevant tab
      if (errors.name || errors.age || errors.gender || errors.condition) {
        setActiveTab("basic");
      } else {
        setActiveTab("contact");
      }
      return;
    }
    
    const allergiesArray = formData.allergies
      ? formData.allergies.split(',').map(item => item.trim())
      : [];
    
    const medicationsArray = formData.medications
      ? formData.medications.split(';').map(med => {
          const [name, dosage = "", frequency = "", startDate = ""] = med.split(',').map(item => item.trim());
          return { name, dosage, frequency, startDate: startDate || new Date().toISOString().split('T')[0] };
        })
      : [];
    
    const patientData: Omit<Patient, 'id'> = {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      profileImage: formData.profileImage,
      lastVisit: formData.lastVisit,
      condition: formData.condition,
      status: formData.status as any,
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact
      },
      allergies: allergiesArray.length > 0 ? allergiesArray : [],
      medications: medicationsArray.length > 0 ? medicationsArray : []
    };
    
    onSubmit(patientData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Medical Condition <span className="text-red-500">*</span></Label>
                <Input 
                  id="condition" 
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className={errors.condition ? "border-red-500" : ""}
                  placeholder="e.g. Diabetes Type II"
                />
                {errors.condition && <p className="text-red-500 text-xs">{errors.condition}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={() => setActiveTab("contact")} className="w-full bg-[#006D77]">
              Continue
            </Button>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input 
                  id="emergency" 
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  placeholder="Name (Relationship) - Phone"
                />
              </div>
            </div>
            
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("basic")} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setActiveTab("medical")} 
                className="flex-1 bg-[#006D77]"
              >
                Continue
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="medical" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input 
                  id="allergies" 
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="Separate with commas: Penicillin, Peanuts, etc."
                />
                <p className="text-xs text-gray-500">Separate multiple allergies with commas</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea 
                  id="medications" 
                  value={formData.medications}
                  onChange={(e) => handleChange('medications', e.target.value)}
                  rows={3}
                  placeholder="Format: Name, Dosage, Frequency, Start Date; Next medication..."
                />
                <p className="text-xs text-gray-500">
                  Format: Name, Dosage, Frequency, Start Date; Next medication...
                  <br />
                  Example: Metformin, 500mg, Twice daily, 2024-01-15; Lisinopril, 10mg, Once daily, 2024-02-01
                </p>
              </div>
            </div>
            
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("contact")} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-[#006D77]"
              >
                Add Patient
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientModal;