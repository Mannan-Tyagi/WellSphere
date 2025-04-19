import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { PhoneCall, User, Trash2, Plus, Star, Edit, Ambulance, Bell, Mail, FileText } from 'lucide-react';

interface EmergencyContactsProps {
  onComplete: () => void;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ onComplete }) => {
  // Mock emergency contacts data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Cooper',
      relationship: 'Spouse',
      phone: '(555) 987-6543',
      email: 'john.cooper@example.com',
      isPrimary: true,
      photo: '/avatars/john.png',
      notifyOnEmergency: true,
      notifyOnAdmission: true,
      hasAccessToRecords: true
    },
    {
      id: 2,
      name: 'Emily Wilson',
      relationship: 'Sister',
      phone: '(555) 234-5678',
      email: 'emily.wilson@example.com',
      isPrimary: false,
      photo: null,
      notifyOnEmergency: true,
      notifyOnAdmission: false,
      hasAccessToRecords: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
    notifyOnEmergency: true,
    notifyOnAdmission: false,
    hasAccessToRecords: false
  });
  
  const handleSetPrimary = (id: number) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    })));
  };
  
  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };
  
  const handleAddContact = () => {
    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    setContacts([
      ...contacts, 
      {
        ...newContact,
        id: newId,
        photo: null
      }
    ]);
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
      notifyOnEmergency: true,
      notifyOnAdmission: false,
      hasAccessToRecords: false
    });
    setShowAddForm(false);
  };
  
  const handleToggleSwitch = (id: number, field: string, value: boolean) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? {...contact, [field]: value} : contact
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-[#006D77] flex items-center">
            <Ambulance className="mr-2 h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Emergency contacts can be reached in case of a medical emergency and may be given certain access to your health information.
            </p>
            
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`border rounded-lg p-4 ${contact.isPrimary ? 'border-[#006D77] bg-[#F0F9FA]' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={contact.photo || undefined} alt={contact.name} />
                      <AvatarFallback className={`${contact.isPrimary ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium flex items-center">
                        {contact.name}
                        {contact.isPrimary && (
                          <Badge className="ml-2 bg-[#006D77] text-white">Primary</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {!contact.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(contact.id)}
                        className="h-8 w-8 p-0 text-gray-500"
                        title="Set as primary"
                      >
                        <Star size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500"
                      title="Edit contact"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="h-8 w-8 p-0 text-gray-500"
                      title="Delete contact"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center text-sm">
                    <PhoneCall size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-700">{contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail size={14} className="text-gray-400 mr-1" />
                    <span className="text-gray-700">{contact.email}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`emergency-${contact.id}`} className="text-sm flex items-center cursor-pointer">
                        <Ambulance className="h-3.5 w-3.5 mr-2 text-red-600" />
                        Notify in medical emergencies
                      </Label>
                      <Switch 
                        id={`emergency-${contact.id}`} 
                        checked={contact.notifyOnEmergency} 
                        onCheckedChange={(checked) => handleToggleSwitch(contact.id, 'notifyOnEmergency', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`admission-${contact.id}`} className="text-sm flex items-center cursor-pointer">
                        <Bell className="h-3.5 w-3.5 mr-2 text-amber-600" />
                        Notify on hospital admissions
                      </Label>
                      <Switch 
                        id={`admission-${contact.id}`} 
                        checked={contact.notifyOnAdmission} 
                        onCheckedChange={(checked) => handleToggleSwitch(contact.id, 'notifyOnAdmission', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`records-${contact.id}`} className="text-sm flex items-center cursor-pointer">
                        <FileText className="h-3.5 w-3.5 mr-2 text-blue-600" />
                        Access to medical records
                      </Label>
                      <Switch 
                        id={`records-${contact.id}`} 
                        checked={contact.hasAccessToRecords} 
                        onCheckedChange={(checked) => handleToggleSwitch(contact.id, 'hasAccessToRecords', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {showAddForm ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Add New Contact
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="text-sm">Name</Label>
                      <Input 
                        id="contact-name" 
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-relationship" className="text-sm">Relationship</Label>
                      <Select 
                        value={newContact.relationship} 
                        onValueChange={(value) => setNewContact({...newContact, relationship: value})}
                      >
                        <SelectTrigger id="contact-relationship">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Partner">Partner</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contact-phone" className="text-sm">Phone</Label>
                      <Input 
                        id="contact-phone" 
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm">Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="contact-primary" 
                      checked={newContact.isPrimary} 
                      onCheckedChange={(checked) => setNewContact({...newContact, isPrimary: checked})}
                    />
                    <Label htmlFor="contact-primary" className="text-sm">Set as primary emergency contact</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-[#006D77] hover:bg-[#00585F]"
                      onClick={handleAddContact}
                      disabled={!newContact.name || !newContact.phone}
                    >
                      Add Contact
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center border-dashed" 
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} className="mr-1" /> Add Emergency Contact
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button className="bg-[#006D77] hover:bg-[#00585F]" onClick={onComplete}>
          Save Emergency Contacts
        </Button>
      </div>
    </div>
  );
};

export default EmergencyContacts;
