"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  PlusCircle, 
  Paperclip, 
  Send, 
  ChevronLeft, 
  Image, 
  Sparkles, 
  FileText, // Use FileText instead of Attachment which isn't exported
  Clock, 
  Calendar,
  MoreVertical,
  Phone,
  Video,
  Star,
  StarOff,
  Trash
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [activeChatId, setActiveChatId] = useState(selectedId || null);
  const [conversations, setConversations] = useState([]);
  const [showAIsuggestions, setShowAIsuggestions] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Mock conversations data
  const mockConversations = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      avatar: '/avatars/dr-johnson.png',
      lastMessage: 'Your blood test results look normal. Let me know if you have any questions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: true,
      isStarred: false,
      isOnline: false,
      role: 'Cardiologist',
      messages: [
        {
          id: '101',
          sender: 'doctor',
          content: 'Hello Emma, I hope you are feeling better today. Ive reviewed your test results.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          status: 'read'
        },
        {
          id: '102',
          sender: 'patient',
          content: 'Hi Dr. Johnson, thank you for checking. Im feeling much better, just a bit tired still.',
          timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
          status: 'sent'
        },
        {
          id: '103',
          sender: 'doctor',
          content: 'Your blood test results look normal. Let me know if you have any questions.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          status: 'read'
        }
      ]
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      avatar: '/avatars/dr-chen.png',
      lastMessage: 'Please make sure to take the medication as prescribed, and let me know if you experience any side effects.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unread: false,
      isStarred: true,
      isOnline: true,
      role: 'Primary Care',
      messages: [
        {
          id: '201',
          sender: 'doctor',
          content: 'Ive prescribed a new medication for your hypertension. Please see the attached prescription.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          status: 'read',
          attachment: {
            name: 'Prescription.pdf',
            type: 'application/pdf',
            size: '156 KB'
          }
        },
        {
          id: '202',
          sender: 'patient',
          content: 'Thank you, Dr. Chen. Ill pick it up today. How often should I take it?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
          status: 'sent'
        },
        {
          id: '203',
          sender: 'doctor',
          content: 'Please make sure to take the medication as prescribed, and let me know if you experience any side effects.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          status: 'read'
        }
      ]
    },
    {
      id: '3',
      name: 'Nurse Williams',
      avatar: '/avatars/nurse-williams.png',
      lastMessage: 'Your appointment with Dr. Johnson has been confirmed for tomorrow at 10:00 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      unread: false,
      isStarred: false,
      isOnline: true,
      role: 'Nurse Practitioner',
      messages: [
        {
          id: '301',
          sender: 'other',
          content: 'Hello Emma, I wanted to confirm your appointment with Dr. Johnson.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9), // 9 hours ago
          status: 'read'
        },
        {
          id: '302',
          sender: 'patient',
          content: 'Hi Nurse Williams, yes I can make it. What time is it again?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8.5), // 8.5 hours ago
          status: 'sent'
        },
        {
          id: '303',
          sender: 'other',
          content: 'Your appointment with Dr. Johnson has been confirmed for tomorrow at 10:00 AM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
          status: 'read'
        }
      ]
    }
  ];

  // AI-suggested responses
  const aiSuggestions = [
    "Yes, I can make it to the appointment tomorrow.",
    "Ive been experiencing some side effects from the medication.",
    "Thank you for the information, I'll follow the instructions.",
  ];

  // Load conversations data
  useEffect(() => {
    setConversations(mockConversations);
    
    // Set active chat from URL parameter if available
    if (selectedId) {
      setActiveChatId(selectedId);
    }
  }, [selectedId]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, conversations]);
  
  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                          (filter === 'unread' && conversation.unread) || 
                          (filter === 'starred' && conversation.isStarred);
    
    return matchesSearch && matchesFilter;
  });
  
  // Get active conversation
  const activeConversation = conversations.find(conv => conv.id === activeChatId);
  
  // Send message handler
  const handleSendMessage = () => {
    if (!messageText.trim() && !fileInputRef.current?.files?.length) return;
    
    const newMessage = {
      id: `new-${Date.now()}`,
      sender: 'patient',
      content: messageText,
      timestamp: new Date(),
      status: 'sending'
    };
    
    // Update conversations with the new message
    setConversations(conversations.map(conv => 
      conv.id === activeChatId 
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            timestamp: new Date()
          }
        : conv
    ));
    
    // Clear input field
    setMessageText('');
    setShowAIsuggestions(false);
    
    // Simulate message being sent
    setTimeout(() => {
      setConversations(conversations.map(conv => 
        conv.id === activeChatId 
          ? { 
              ...conv, 
              messages: conv.messages.map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
              )
            }
          : conv
      ));
    }, 1000);
  };
  
  // Toggle star status of a conversation
  const toggleStar = (id) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv
    ));
  };
  
  // Mark conversation as read
  const markAsRead = (id) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, unread: false } : conv
    ));
  };
  
  // Format timestamp for display
  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'h:mm a');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow flex flex-col md:flex-row h-full max-h-full overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r p-4 ${
          activeChatId && 'hidden md:block'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-[#006D77]">Messages</h1>
            <Link href="/patient/messages/new">
              <Button className="bg-[#006D77] hover:bg-[#00585F]">
                <PlusCircle size={16} className="mr-2" />
                New Message
              </Button>
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-4">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue={filter} value={filter} onValueChange={setFilter}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Conversation List */}
          <div className="overflow-y-auto h-full pb-20">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer ${
                    conversation.id === activeChatId 
                      ? 'bg-[#F0F9FA] border-[#006D77]/20' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => {
                    setActiveChatId(conversation.id);
                    if (conversation.unread) {
                      markAsRead(conversation.id);
                    }
                    
                    // Update URL without refresh
                    router.push(`/patient/messages?id=${conversation.id}`, { scroll: false });
                  }}
                >
                  <div className="flex items-start">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center">
                          <button 
                            className="p-1 text-gray-400 hover:text-amber-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(conversation.id);
                            }}
                          >
                            {conversation.isStarred ? (
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                            ) : (
                              <Star size={14} />
                            )}
                          </button>
                          <span className="text-xs text-gray-500 ml-1">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{conversation.role}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    
                    {conversation.unread && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-[#006D77]"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No conversations found</p>
                <Link href="/patient/messages/new">
                  <Button variant="outline" className="mt-2">
                    Start a new conversation
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {activeChatId ? (
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col h-full">
            {activeConversation && (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden mr-2"
                      onClick={() => {
                        setActiveChatId(null);
                        router.push('/patient/messages', { scroll: false });
                      }}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h2 className="font-medium">{activeConversation.name}</h2>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">{activeConversation.role}</span>
                        {activeConversation.isOnline && (
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Online</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Video size={18} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleStar(activeConversation.id)}>
                          {activeConversation.isStarred ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              <span>Unstar Conversation</span>
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              <span>Star Conversation</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete Conversation</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${
                          message.sender === 'patient' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender !== 'patient' && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage 
                              src={activeConversation.avatar} 
                              alt={activeConversation.name} 
                            />
                            <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] ${
                          message.sender === 'patient' 
                            ? 'bg-[#006D77] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                        } p-3 shadow-sm`}>
                          <div className="mb-1">{message.content}</div>
                          
                          {message.attachment && (
                            <div className="mt-2 bg-white/20 p-2 rounded flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2" />
                              <span>{message.attachment.name}</span>
                              <span className="ml-auto text-xs opacity-70">{message.attachment.size}</span>
                            </div>
                          )}
                          
                          <div className="text-right mt-1">
                            <span className={`text-xs ${
                              message.sender === 'patient' ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {format(message.timestamp, 'h:mm a')}
                              {message.sender === 'patient' && (
                                <span className="ml-1">
                                  {message.status === 'sending' ? '...' : 
                                   message.status === 'sent' ? '✓' : 
                                   message.status === 'delivered' ? '✓✓' : 
                                   '✓✓'}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* AI Suggestions */}
                {showAIsuggestions && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-[#006D77] mb-2">
                      <Sparkles size={16} className="mr-1" />
                      <span>AI-suggested responses:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="px-3 py-1.5 bg-[#F0F9FA] text-[#006D77] rounded-full text-sm hover:bg-[#E8F3F4]"
                          onClick={() => {
                            setMessageText(suggestion);
                            setShowAIsuggestions(false);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow relative">
                      <Input 
                        placeholder="Type a message..." 
                        className="pr-10 py-6"
                        value={messageText}
                        onChange={(e) => {
                          setMessageText(e.target.value);
                          // Show AI suggestions when user starts typing
                          if (e.target.value && !showAIsuggestions) {
                            setShowAIsuggestions(true);
                          } else if (!e.target.value) {
                            setShowAIsuggestions(false);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={18} />
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          multiple
                          onChange={(e) => {
                            // Handle file attachment
                            console.log('Files selected:', e.target.files);
                            // In a real app, you would upload the files here
                          }}
                        />
                      </button>
                    </div>
                    <Button 
                      className="bg-[#006D77] hover:bg-[#00585F] h-[44px] w-[44px] p-0"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full md:w-2/3 lg:w-3/4 hidden md:flex items-center justify-center bg-gray-50 text-center p-8">
            <div>
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h2>
              <p className="text-gray-500 mb-4">Choose a conversation from the list or start a new one</p>
              <Link href="/patient/messages/new">
                <Button className="bg-[#006D77] hover:bg-[#00585F]">
                  <PlusCircle size={16} className="mr-2" />
                  New Message
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
