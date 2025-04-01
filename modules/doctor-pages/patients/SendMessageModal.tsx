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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Paperclip, X } from "lucide-react";
import { Patient } from "@/types/patient";
import { cn } from "@/lib/utils";

interface SendMessageModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ 
  patient, 
  isOpen, 
  onClose,
  onSubmit 
}) => {
  const [subject, setSubject] = useState("");
  const [messageType, setMessageType] = useState("general");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!subject) newErrors.subject = "Subject is required";
    if (!message) newErrors.message = "Message content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttachment = () => {
    // This would normally handle file selection
    // For this demo, we'll just simulate adding a file
    const newAttachment = `document_${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments(prev => [...prev, newAttachment]);
  };

  const removeAttachment = (file: string) => {
    setAttachments(prev => prev.filter(f => f !== file));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const messageData = {
      recipient: patient.name,
      recipientId: patient.id,
      recipientEmail: patient.contactInfo.email,
      subject,
      messageType,
      message,
      attachments,
      date: new Date().toISOString(),
    };
    
    onSubmit(messageData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <div className="text-sm text-gray-500">
            To: <span className="font-medium">{patient.name}</span> ({patient.contactInfo.email})
          </div>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
              <Input 
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
                className={cn(
                  "bg-white",
                  errors.subject && "border-red-500"
                )}
              />
              {errors.subject && <p className="text-red-500 text-xs">{errors.subject}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Message Type</Label>
              <Select
                value={messageType}
                onValueChange={setMessageType}
              >
                <SelectTrigger id="type" className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="appointment">Appointment Info</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="lab_results">Lab Results</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className={cn(
                "bg-white min-h-[200px]",
                errors.message && "border-red-500"
              )}
            />
            {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Attachments</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAttachment}
                className="bg-white"
              >
                <Paperclip className="h-4 w-4 mr-1" />
                Add File
              </Button>
            </div>
            
            {attachments.length > 0 ? (
              <div className="space-y-2 mt-2">
                {attachments.map((file) => (
                  <div key={file} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-[#006D77] text-white text-xs p-1 rounded mr-2">PDF</div>
                      <span className="text-sm">{file}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAttachment(file)}
                      className="h-8 w-8 p-0 text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">No attachments added</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#006D77]">
            <Check className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </DialogFooter>

        <DialogClose className="absolute right-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageModal;