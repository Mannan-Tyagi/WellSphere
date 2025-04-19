import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, ChevronRight, Clock, Plus, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MessageNotificationsWidget = () => {
  // Mock messages
  const messages = [
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      avatar: '/avatars/dr-johnson.png',
      preview: 'Your blood pressure looks great! Keep up the good work with...',
      time: '2 hours ago',
      unread: true,
      appointment: true
    },
    {
      id: 2,
      sender: 'Dr. Robert Chen',
      avatar: '/avatars/dr-chen.png',
      preview: 'Please remember to take your medication regularly as prescribed...',
      time: 'Yesterday',
      unread: false,
      appointment: false
    },
    {
      id: 3,
      sender: 'Nurse Williams',
      avatar: '/avatars/nurse-williams.png',
      preview: 'Your test results have been added to your medical records...',
      time: '3 days ago',
      unread: false,
      appointment: false
    }
  ];

  return (
    <Card className="border-[#E8F3F4] shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center text-[#006D77]">
          <MessageSquare className="mr-2 h-5 w-5" />
          Messages
          {messages.filter(m => m.unread).length > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">{messages.filter(m => m.unread).length}</Badge>
          )}
        </CardTitle>
        <Link href="/patient/messages/new">
          <Button className="bg-[#006D77] hover:bg-[#00585F]">
            <Plus className="h-4 w-4 mr-1" />
            New Message
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search messages..." 
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
          
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message) => (
                <Link key={message.id} href={`/patient/messages/${message.id}`}>
                  <div 
                    className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors flex items-start ${
                      message.unread ? 'bg-[#F0F9FA] border-[#006D77]/20' : ''
                    }`}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={message.avatar} alt={message.sender} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate">{message.sender}</div>
                        <div className="text-xs text-gray-500 flex items-center whitespace-nowrap ml-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {message.time}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                      {message.appointment && (
                        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                          Appointment Related
                        </Badge>
                      )}
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 bg-[#006D77] rounded-full ml-2 mt-1"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No messages</p>
              <Link href="/patient/messages/new">
                <Button variant="outline" className="mt-2">
                  Start a conversation
                </Button>
              </Link>
            </div>
          )}
          
          <Link href="/patient/messages" className="text-sm text-[#006D77] hover:underline flex items-center justify-end">
            View All Messages <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageNotificationsWidget;
