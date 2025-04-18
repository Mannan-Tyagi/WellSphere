"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Paperclip, 
  User, 
  Check, 
  CheckCheck, 
  Star, 
  Clock, 
  Phone, 
  Video, 
  FileText, 
  Download, 
  MoreVertical, 
  Archive, 
  Trash2, 
  ArrowLeft, 
  Mic, 
  Image, 
  Smile, 
  AlertTriangle,
  Calendar,
  Shield,
  Lock,
  PlusCircle,
  Sparkles,
  Globe,
  X
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import AIMessageAssistant from './AIMessageAssistant';
import TranslationToggle from './TranslationToggle';
import SmartAttachmentHandler from './SmartAttachmentHandler';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Mock providers data
const providers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    avatar: null,
    specialty: 'Family Medicine',
    lastMessage: 'Your latest test results look good. Let me know if you have any questions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: true,
    isUrgent: false,
    hasAttachments: true,
    isOnline: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    avatar: null,
    specialty: 'Cardiology',
    lastMessage: 'Remember to take your medication as prescribed and monitor your blood pressure.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: false,
    isUrgent: false,
    hasAttachments: false,
    isOnline: false
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    avatar: null,
    specialty: 'Dermatology',
    lastMessage: 'The skin condition appears to be improving based on the photos you sent.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    unread: false,
    isUrgent: false,
    hasAttachments: true,
    isOnline: false
  }
];

export default function PatientMessagingPage() {
  // State for conversations
  const [conversations, setConversations] = useState(providers);
  
  // State for active conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('en');
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  // Mock message history
  const [messageHistory, setMessageHistory] = useState({});
  
  // Refs
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize message history for each provider
  useEffect(() => {
    const initialMessageHistory = {};
    
    conversations.forEach(conv => {
      if (!messageHistory[conv.id]) {
        initialMessageHistory[conv.id] = [
          {
            id: 1,
            sender: conv.name,
            content: conv.lastMessage,
            timestamp: conv.timestamp,
            status: 'delivered',
            priority: conv.isUrgent ? 'urgent' : 'normal',
            attachments: conv.hasAttachments ? [
              {
                id: 1,
                name: 'Medical_Report.pdf',
                type: 'pdf',
                size: '1.2 MB',
                url: '#'
              }
            ] : []
          }
        ];
        
        // Add mock message history for Dr. Sarah Johnson
        if (conv.id === 1) {
          initialMessageHistory[conv.id] = [
            {
              id: 1,
              sender: 'Dr. Sarah Johnson',
              content: 'Hello! How have you been feeling since our last appointment?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
              status: 'read',
              priority: 'normal',
              attachments: []
            },
            {
              id: 2,
              sender: 'You',
              content: 'I\'ve been feeling much better. The new medication has helped with my symptoms.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
              status: 'read',
              priority: 'normal',
              attachments: []
            },
            {
              id: 3,
              sender: 'Dr. Sarah Johnson',
              content: 'That\'s great to hear! I\'ve reviewed your latest labs and everything looks good.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
              status: 'read',
              priority: 'normal',
              attachments: [
                {
                  id: 1,
                  name: 'Lab_Results.pdf',
                  type: 'pdf',
                  size: '850 KB',
                  url: '#'
                }
              ]
            },
            {
              id: 4,
              sender: 'Dr. Sarah Johnson',
              content: 'Your latest test results look good. Let me know if you have any questions.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              status: 'delivered',
              priority: 'normal',
              attachments: []
            }
          ];
        }
      }
    });
    
    if (Object.keys(initialMessageHistory).length > 0) {
      setMessageHistory(prev => ({ ...prev, ...initialMessageHistory }));
    }
  }, [conversations]);

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation, messageHistory]);

  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'unread') return matchesSearch && conversation.unread;
    if (activeFilter === 'urgent') return matchesSearch && conversation.isUrgent;
    if (activeFilter === 'attachments') return matchesSearch && conversation.hasAttachments;
    
    return matchesSearch;
  });

  // Get avatar initials
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Mark conversation as read
  const markAsRead = (id) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, unread: false } : conv
    ));
  };

  // Toggle star status
  const toggleStar = (id, e) => {
    e.stopPropagation();
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, starred: !conv.starred } : conv
    ));
  };

  // Send a message
  const sendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;
    
    const newMessage = {
      id: messageHistory[selectedConversation.id].length + 1,
      sender: 'You',
      content: messageText,
      timestamp: new Date(),
      status: 'sent',
      priority: 'normal',
      attachments: [...attachments]
    };
    
    // Update message history
    setMessageHistory(prev => ({
      ...prev,
      [selectedConversation.id]: [...prev[selectedConversation.id], newMessage]
    }));
    
    // Update conversation preview
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? {
        ...conv,
        lastMessage: messageText || 'Sent an attachment',
        timestamp: new Date(),
        unread: false
      } : conv
    ));
    
    setMessageText('');
    setAttachments([]);
    
    // Simulate doctor typing and response (for demo purposes)
    simulateDoctorResponse();
  };

  // Simulate doctor response
  const simulateDoctorResponse = () => {
    if (!selectedConversation) return;
    
    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      
      // Simulate response after a delay
      setTimeout(() => {
        const doctorResponse = {
          id: messageHistory[selectedConversation.id].length + 2,
          sender: selectedConversation.name,
          content: 'Thank you for the update. I\'ll make a note in your chart. Do you have any other concerns?',
          timestamp: new Date(),
          status: 'delivered',
          priority: 'normal',
          attachments: []
        };
        
        setMessageHistory(prev => ({
          ...prev,
          [selectedConversation.id]: [...prev[selectedConversation.id], doctorResponse]
        }));
        
        setConversations(conversations.map(conv => 
          conv.id === selectedConversation.id ? {
            ...conv,
            lastMessage: doctorResponse.content,
            timestamp: new Date(),
            hasAttachments: false
          } : conv
        ));
        
        setIsTyping(false);
      }, 3000);
    }, 1500);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Add file to attachments
    const newAttachment = {
      id: Date.now(),
      name: file.name,
      type: file.type.split('/')[0],
      size: `${Math.round(file.size / 1024)} KB`,
      url: URL.createObjectURL(file)
    };
    
    setAttachments([...attachments, newAttachment]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    return format(timestamp, 'h:mm a');
  };

  // Get attachment icon
  const getAttachmentIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image size={20} />;
      case 'pdf':
        return <FileText size={20} />;
      default:
        return <Paperclip size={20} />;
    }
  };

  // Get message status icon
  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-[#006D77]" />;
      default:
        return null;
    }
  };

  // Toggle AI message assistant
  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  // Apply AI suggestion
  const applyAISuggestion = (suggestion) => {
    setMessageText(suggestion);
    setShowAIAssistant(false);
  };

  // Toggle translation
  const toggleTranslation = () => {
    setTranslationEnabled(!translationEnabled);
  };

  // Change translation language
  const changeTranslationLanguage = (language) => {
    setTranslationLanguage(language);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Left Sidebar - Conversation List */}
      <div className="w-1/4 bg-white border-r overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-[#006D77] mb-4 flex items-center">
            <MessageCircle className="mr-2" size={24} />
            Messages
          </h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 text-sm">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeFilter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'unread' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Unread
            </button>
            <button 
              onClick={() => setActiveFilter('urgent')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'urgent' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Urgent
            </button>
            <button 
              onClick={() => setActiveFilter('attachments')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'attachments' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Attachments
            </button>
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-grow overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer relative ${selectedConversation?.id === conversation.id ? 'bg-[#F0F9FA]' : ''}`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  markAsRead(conversation.id);
                  setShowActionMenu(null);
                }}
              >
                <div className="flex items-start">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium">
                      {conversation.avatar ? (
                        <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(conversation.name)
                      )}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center">
                          {conversation.name}
                          {conversation.isUrgent && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Urgent</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{conversation.specialty}</p>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{conversation.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <button 
                          onClick={(e) => toggleStar(conversation.id, e)}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <Star 
                            size={16} 
                            fill={conversation.starred ? "currentColor" : "none"} 
                            className={conversation.starred ? "text-yellow-500" : ""}
                          />
                        </button>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                        </span>
                        {conversation.hasAttachments && (
                          <div className="flex items-center mt-1">
                            <Paperclip size={12} className="text-gray-400 mr-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Unread indicator */}
                {conversation.unread && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-1.5 h-1.5 bg-[#006D77] rounded-full"></div>
                )}
                
                {/* Action button */}
                <button 
                  className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionMenu(showActionMenu === conversation.id ? null : conversation.id);
                  }}
                >
                  <MoreVertical size={16} />
                </button>
                
                {/* Action menu */}
                {showActionMenu === conversation.id && (
                  <div className="absolute right-8 top-2 bg-white border rounded-md shadow-md z-10 w-40">
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(conversation.id);
                        setShowActionMenu(null);
                      }}
                    >
                      <Check size={14} className="mr-2" /> 
                      Mark as read
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Archive functionality would go here
                        setShowActionMenu(null);
                      }}
                    >
                      <Archive size={14} className="mr-2" /> 
                      Archive
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Delete functionality would go here
                        setShowActionMenu(null);
                      }}
                    >
                      <Trash2 size={14} className="mr-2" /> 
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations found</p>
            </div>
          )}
        </div>
        
        {/* New Message Button */}
        <div className="p-4 border-t">
          <button className="w-full bg-[#006D77] text-white py-2 rounded-lg hover:bg-[#005A66] transition-colors flex items-center justify-center">
            <PlusCircle size={18} className="mr-2" />
            New Message
          </button>
        </div>
      </div>
      
      {/* Main Content - Messaging Area */}
      <div className="flex-grow flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2 p-1.5 rounded-full hover:bg-gray-100"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium">
                  {selectedConversation.avatar ? (
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedConversation.name)
                  )}
                </div>
                
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{selectedConversation.name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {selectedConversation.isOnline ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                        Online
                      </>
                    ) : (
                      'Last active ' + formatDistanceToNow(selectedConversation.timestamp, { addSuffix: true })
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Encryption Status Badge */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        <Lock className="h-3 w-3 mr-1" />
                        <span>Encrypted</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End-to-end encrypted and HIPAA compliant</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Video size={20} />
                </button>
                <Link 
                  href={`/patient/appointments/schedule?providerId=${selectedConversation.id}`}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                  <Calendar size={20} />
                </Link>
              </div>
            </div>
            
            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
              {messageHistory[selectedConversation.id]?.map((message, index) => (
                <div 
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== 'You' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium mr-2 flex-shrink-0">
                      {getInitials(message.sender)}
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${message.sender === 'You' ? 'bg-[#006D77] text-white' : 'bg-white border'} rounded-lg p-3 shadow-sm`}>
                    {/* Priority Tag */}
                    {message.priority === 'urgent' && (
                      <div className="mb-1 flex items-center">
                        <AlertTriangle size={12} className="text-red-500 mr-1" />
                        <span className="text-xs text-red-500 font-medium">Urgent</span>
                      </div>
                    )}
                    
                    {message.priority === 'medication' && (
                      <div className="mb-1 flex items-center">
                        <AlertTriangle size={12} className="text-amber-500 mr-1" />
                        <span className="text-xs text-amber-500 font-medium">Medication Question</span>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div>
                      {message.content}
                      
                      {/* Translation (if enabled) */}
                      {translationEnabled && message.sender !== 'You' && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-600">
                          <span className="text-xs font-medium text-blue-600 mr-1">Translated:</span>
                          {message.content} {/* In a real app, this would be the translated text */}
                        </div>
                      )}
                    </div>
                    
                    {/* Attachments */}
                    {message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map(attachment => (
                          <div 
                            key={attachment.id}
                            className={`flex items-center p-2 ${message.sender === 'You' ? 'bg-[#005A66] text-white' : 'bg-gray-50 border'} rounded`}
                          >
                            <div className="p-2 bg-gray-100 rounded mr-2 text-gray-600">
                              {getAttachmentIcon(attachment.type)}
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs opacity-70">{attachment.size}</p>
                            </div>
                            <a 
                              href={attachment.url} 
                              download
                              className={`p-1.5 ${message.sender === 'You' ? 'text-white hover:bg-[#004A56]' : 'text-[#006D77] hover:bg-[#F0F9FA]'} rounded-full`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-1 flex justify-end items-center space-x-1">
                      <span className="text-xs opacity-70">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.sender === 'You' && (
                        <span>{getMessageStatusIcon(message.status)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium mr-2">
                    {getInitials(selectedConversation.name)}
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
            
            {/* AI Message Assistant */}
            {showAIAssistant && (
              <AIMessageAssistant 
                onSelectSuggestion={applyAISuggestion}
                onClose={() => setShowAIAssistant(false)}
              />
            )}
            
            {/* Translation Toggle */}
            {translationEnabled && (
              <TranslationToggle 
                selectedLanguage={translationLanguage}
                onLanguageChange={changeTranslationLanguage}
                onClose={() => setTranslationEnabled(false)}
              />
            )}
            
            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="p-3 bg-gray-50 border-t">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Attachments</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setAttachments([])}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center bg-white border rounded p-2">
                      <div className="p-2 bg-gray-100 rounded mr-2">
                        {getAttachmentIcon(attachment.type)}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{attachment.size}</p>
                      </div>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message Input */}
            <div className="p-3 bg-white border-t">
              <div className="flex items-center">
                <div className="flex space-x-2 mr-2">
                  {/* AI Assistant Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className={`p-2 text-gray-500 hover:bg-gray-100 rounded-full ${showAIAssistant ? 'bg-[#F0F9FA] text-[#006D77]' : ''}`}
                          onClick={toggleAIAssistant}
                        >
                          <Sparkles size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI Message Assistant</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Translation Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className={`p-2 text-gray-500 hover:bg-gray-100 rounded-full ${translationEnabled ? 'bg-[#F0F9FA] text-[#006D77]' : ''}`}
                          onClick={toggleTranslation}
                        >
                          <Globe size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Translation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Attachment Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
                          onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        >
                          <Paperclip size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach Files</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Attachment Options Dropdown */}
                  {showAttachmentOptions && (
                    <div className="absolute bottom-16 left-4 bg-white border rounded-md shadow-md z-10 w-48">
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachmentOptions(false);
                        }}
                      >
                        <Image size={16} className="mr-2" />
                        Upload Photo
                      </button>
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          // Document selection would go here
                          setShowAttachmentOptions(false);
                        }}
                      >
                        <FileText size={16} className="mr-2" />
                        Share Document
                      </button>
                      <button 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
                        onClick={() => {
                          // Health record selection would go here
                          setShowAttachmentOptions(false);
                        }}
                      >
                        <FileText size={16} className="mr-2" />
                        Share Health Record
                      </button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </div>
                  )}
                </div>
                
                <div className="relative flex-grow">
                  <textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button 
                    className="absolute right-2 bottom-2 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                    onClick={() => {/* Emoji picker would go here */}}
                  >
                    <Smile size={20} />
                  </button>
                </div>
                
                <div className="ml-2">
                  <Button
                    onClick={sendMessage}
                    disabled={!messageText.trim() && attachments.length === 0}
                    className="bg-[#006D77] hover:bg-[#005A66] text-white px-4"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                <Shield className="h-3 w-3 mr-1" />
                Your messages are encrypted and protected under HIPAA guidelines
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-16 h-16 bg-[#F0F9FA] rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-[#006D77]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
            <p className="text-gray-500 text-center mb-4 max-w-md">
              Communicate securely with your healthcare providers. All messages are encrypted and HIPAA-compliant.
            </p>
            <button className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A66] transition-colors flex items-center">
              <PlusCircle size={16} className="mr-2" />
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
