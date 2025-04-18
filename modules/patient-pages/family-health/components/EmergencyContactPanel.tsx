import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from './Dialog';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Label } from './Label';
import { Switch } from './Switch';
import { Badge } from './Badge';
import { Textarea } from './Textarea';
import { Phone, User, Shield, AlertTriangle, PlusCircle, Star, Edit, Trash2, Mail, MapPin, Check } from 'react-icons/all';

const EmergencyContactPanel = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    relationship: '',
    isPrimary: false,
    canMakeDecisions: false,
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const handleAddContact = () => {
    setEmergencyContacts([...emergencyContacts, { ...newContact, id: Date.now() }]);
    setShowAddDialog(false);
    setNewContact({
      name: '',
      phone: '',
      email: '',
      address: '',
      relationship: '',
      isPrimary: false,
      canMakeDecisions: false,
    });
  };

  const handleDeleteContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const handleSetPrimary = (id) => {
    setEmergencyContacts(emergencyContacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id,
    })));
  };

  const handleToggleDecisionMaker = (id) => {
    setEmergencyContacts(emergencyContacts.map(contact => ({
      ...contact,
      canMakeDecisions: contact.id === id ? !contact.canMakeDecisions : contact.canMakeDecisions,
    })));
  };

  return (
    <div className="space-y-6">
      <div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#006D77] hover:bg-[#005a66]">
          <PlusCircle size={16} className="mr-2" />
          Add Emergency Contact
        </Button>
        <Dialog isOpen={showAddDialog} onClose={() => setShowAddDialog(false)}>
          <DialogContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <input
                  id="name"
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <input
                  id="phone"
                  type="text"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <input
                  id="address"
                  type="text"
                  value={newContact.address}
                  onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <input
                  id="relationship"
                  type="text"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="input"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="primary-contact">Primary Contact</Label>
                  <div className="text-sm text-gray-500">
                    This contact will be your primary emergency contact
                  </div>
                </div>
                <Switch 
                  id="primary-contact"
                  checked={newContact.isPrimary || false}
                  onCheckedChange={(checked) => setNewContact({...newContact, isPrimary: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="decision-maker">Healthcare Decision Maker</Label>
                  <div className="text-sm text-gray-500">
                    Can make healthcare decisions on your behalf
                  </div>
                </div>
                <Switch 
                  id="decision-maker"
                  checked={newContact.canMakeDecisions || false}
                  onCheckedChange={(checked) => setNewContact({...newContact, canMakeDecisions: checked})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button 
                className="bg-[#006D77] hover:bg-[#005a66]"
                onClick={handleAddContact}
                disabled={!newContact.name || !newContact.phone}
              >
                Add Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
          <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
            <Phone className="mr-2 h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {emergencyContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={`border rounded-lg p-4 ${contact.isPrimary ? 'border-[#006D77] bg-[#F0F9FA]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        contact.isPrimary ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <User size={20} />
                      </div>
                      <div className="ml-3">
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
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center text-sm">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-start text-sm md:col-span-2">
                        <MapPin size={16} className="mr-2 text-gray-500 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm">Healthcare Decision Maker</span>
                      </div>
                      <Switch 
                        checked={contact.canMakeDecisions}
                        onCheckedChange={() => handleToggleDecisionMaker(contact.id)}
                      />
                    </div>
                    {contact.canMakeDecisions && (
                      <p className="text-sm text-gray-500 mt-1 ml-6">
                        This person can make healthcare decisions on your behalf if you are unable to.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-1">No emergency contacts</h3>
              <p className="text-gray-500 mb-4">
                Add emergency contacts who can be reached in case of a medical emergency.
              </p>
              <Button 
                className="bg-[#006D77] hover:bg-[#005a66]"
                onClick={() => setShowAddDialog(true)}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
          <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
            <Shield className="mr-2 h-5 w-5" />
            Healthcare Proxy & Advanced Directives
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-1">Healthcare Proxy Status</h3>
                <p className="text-sm text-gray-500">
                  A healthcare proxy allows someone to make medical decisions for you if you're unable to.
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="border-amber-200 text-amber-700 bg-amber-50"
              >
                Not Configured
              </Badge>
            </div>
            
            {emergencyContacts.some(contact => contact.canMakeDecisions) ? (
              <div className="mt-4 p-3 bg-[#F0F9FA] rounded-md border border-[#E8F3F4]">
                <h4 className="font-medium mb-1 flex items-center">
                  <Check size={16} className="mr-1 text-green-600" />
                  Designated Decision Maker
                </h4>
                {emergencyContacts.filter(contact => contact.canMakeDecisions).map(contact => (
                  <div key={contact.id} className="flex items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-[#006D77] text-white flex items-center justify-center mr-2">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.relationship}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                <p className="text-sm text-amber-700 flex items-start">
                  <AlertTriangle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                  You haven't designated anyone as your healthcare decision maker. This is recommended for emergency situations.
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Advanced Directives</h4>
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Living Will</p>
                    <p className="text-sm text-gray-500">Instructions for medical care if you're incapacitated</p>
                  </div>
                  <Badge variant="outline" className="text-amber-700">Not Uploaded</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">DNR Order</p>
                    <p className="text-sm text-gray-500">Do Not Resuscitate instructions</p>
                  </div>
                  <Badge variant="outline" className="text-amber-700">Not Uploaded</Badge>
                </div>
              </div>
              <Button className="w-full mt-3 bg-[#006D77] hover:bg-[#005a66]">
                Configure Advanced Directives
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-2 bg-[#F0F9FA] border-b">
          <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Emergency Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Medical Emergency Instructions</h3>
            <Textarea 
              placeholder="Add special instructions for emergency responders (allergies, medications, conditions they should be aware of)"
              className="min-h-[100px] my-2"
            />
            <div className="flex justify-end">
              <Button className="bg-[#006D77] hover:bg-[#005a66]">Save Instructions</Button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700 flex items-start">
                <Shield size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                These instructions will be accessible from your emergency screen, even when your phone is locked.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContactPanel;