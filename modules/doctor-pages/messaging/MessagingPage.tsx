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
  Filter, 
  Star, 
  Clock, 
  Phone, 
  Video, 
  UserCircle, 
  Bell, 
  FileText, 
  Download, 
  CheckSquare, 
  MoreVertical, 
  Archive, 
  Trash2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Calendar, 
  FilePlus, 
  Pill, 
  ArrowLeft, 
  Mic, 
  Image, 
  Smile, 
  PlusCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';

// Import the MessagingWidget to reuse its data and functionality
import { conversations as initialConversations } from '../dashboard/MessagingWidget';

const MessagingPage = () => {
  // State for conversations (initialized from the widget data)
  const [conversations, setConversations] = useState(initialConversations || [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: null,
      lastMessage: 'Thank you for the prescription refill, Dr. Smith.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      unread: true,
      starred: false,
      status: 'patient',
      online: false
    },
    {
      id: 2,
      name: 'Dr. Jessica Lee',
      avatar: null,
      lastMessage: 'Could you review the lab results for patient #1042?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: true,
      starred: true,
      status: 'colleague',
      online: true
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      avatar: null,
      lastMessage: 'Is there anything I should do before my appointment tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      unread: false,
      starred: false,
      status: 'patient',
      online: false
    },
    {
      id: 4,
      name: 'Nurse Thompson',
      avatar: null,
      lastMessage: 'Patient in room 3 is ready for you',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      unread: false,
      starred: false,
      status: 'staff',
      online: true
    },
    {
      id: 5,
      name: 'David Chen',
      avatar: null,
      lastMessage: 'My symptoms have improved since starting the new medication',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: false,
      starred: false,
      status: 'patient',
      online: false
    }
  ]);

  // Mock message history for selected conversation
  const [messageHistory, setMessageHistory] = useState({});
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  
  // Refs
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Initialize message history for each conversation if not already present
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
            attachments: []
          }
        ];
        
        // Add some mock message history for the first conversation
        if (conv.id === 1) {
          initialMessageHistory[conv.id] = [
            {
              id: 1,
              sender: 'You',
              content: 'Hello Emma, how are you feeling today?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              status: 'read',
              attachments: []
            },
            {
              id: 2,
              sender: 'Emma Wilson',
              content: 'I\'m feeling much better, Dr. Smith. The new medication seems to be working well.',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
              status: 'delivered',
              attachments: []
            },
            {
              id: 3,
              sender: 'You',
              content: 'That\'s great to hear! Any side effects I should know about?',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
              status: 'read',
              attachments: []
            },
            {
              id: 4,
              sender: 'Emma Wilson',
              content: 'Just a bit of drowsiness in the morning, but it goes away after breakfast.',
              timestamp: new Date(Date.now() - 1000 * 60 * 45),
              status: 'delivered',
              attachments: []
            },
            {
              id: 5,
              sender: 'Emma Wilson',
              content: 'I\'ve also been tracking my blood pressure as you suggested.',
              timestamp: new Date(Date.now() - 1000 * 60 * 44),
              status: 'delivered',
              attachments: [
                {
                  id: 1,
                  name: 'blood_pressure_log.pdf',
                  type: 'pdf',
                  size: '245 KB',
                  url: '#'
                }
              ]
            },
            {
              id: 6,
              sender: 'You',
              content: 'Perfect. I\'ll review your blood pressure log and we can discuss it at your next appointment.',
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              status: 'read',
              attachments: []
            },
            {
              id: 7,
              sender: 'Emma Wilson',
              content: 'Thank you for the prescription refill, Dr. Smith.',
              timestamp: new Date(Date.now() - 1000 * 60 * 15),
              status: 'delivered',
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
  
  // Generate AI suggestions based on conversation context
  useEffect(() => {
    if (selectedConversation && replyText.length > 0) {
      // In a real app, this would call an AI service
      // For now, we'll use some mock suggestions
      const mockSuggestions = [
        'Would you like to schedule a follow-up appointment?',
        'I can send you a prescription refill if needed.',
        'Let me know if you have any questions about your medication.'
      ];
      
      setAiSuggestions(mockSuggestions);
      setShowAIAssistant(true);
    } else {
      setAiSuggestions([]);
      setShowAIAssistant(false);
    }
  }, [replyText, selectedConversation]);
  
  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'unread') return matchesSearch && conversation.unread;
    if (activeFilter === 'starred') return matchesSearch && conversation.starred;
    if (activeFilter === 'patients') return matchesSearch && conversation.status === 'patient';
    if (activeFilter === 'staff') return matchesSearch && (conversation.status === 'colleague' || conversation.status === 'staff');
    
    return matchesSearch;
  });
  
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
  
  // Send a reply
  const sendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    const newMessage = {
      id: messageHistory[selectedConversation.id].length + 1,
      sender: 'You',
      content: replyText,
      timestamp: new Date(),
      status: 'sent',
      attachments: []
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
        lastMessage: 'You: ' + replyText,
        timestamp: new Date(),
        unread: false
      } : conv
    ));
    
    setReplyText('');
    setShowAIAssistant(false);
    
    // Simulate reply after a delay (for demo purposes)
    if (Math.random() > 0.5) {
      setIsTyping(true);
      
      setTimeout(() => {
        const autoReply = {
          id: messageHistory[selectedConversation.id].length + 2,
          sender: selectedConversation.name,
          content: 'Thanks for your message. I will get back to you soon.',
          timestamp: new Date(),
          status: 'delivered',
          attachments: []
        };
        
        setMessageHistory(prev => ({
          ...prev,
          [selectedConversation.id]: [...prev[selectedConversation.id], autoReply]
        }));
        
        setConversations(conversations.map(conv => 
          conv.id === selectedConversation.id ? {
            ...conv,
            lastMessage: autoReply.content,
            timestamp: new Date()
          } : conv
        ));
        
        setIsTyping(false);
      }, 3000);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the file before sending
    setAttachmentPreview({
      name: file.name,
      type: file.type.split('/')[0],
      size: `${Math.round(file.size / 1024)} KB`,
      file
    });
  };
  
  // Send attachment
  const sendAttachment = () => {
    if (!attachmentPreview || !selectedConversation) return;
    
    const newMessage = {
      id: messageHistory[selectedConversation.id].length + 1,
      sender: 'You',
      content: 'I\'ve sent you an attachment.',
      timestamp: new Date(),
      status: 'sent',
      attachments: [
        {
          id: 1,
          name: attachmentPreview.name,
          type: attachmentPreview.type,
          size: attachmentPreview.size,
          url: URL.createObjectURL(attachmentPreview.file)
        }
      ]
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
        lastMessage: 'You: Attachment - ' + attachmentPreview.name,
        timestamp: new Date(),
        unread: false
      } : conv
    ));
    
    setAttachmentPreview(null);
  };
  
  // Cancel attachment
  const cancelAttachment = () => {
    setAttachmentPreview(null);
  };
  
  // Apply AI suggestion
  const applySuggestion = (suggestion) => {
    setReplyText(suggestion);
    setShowAIAssistant(false);
  };
  
  // Get avatar initials
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
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
  
  // Format timestamp
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
  
  // Mock tasks related to the selected conversation
  const getTasks = () => {
    if (!selectedConversation) return [];
    
    if (selectedConversation.status === 'patient') {
      return [
        {
          id: 1,
          title: `Review ${selectedConversation.name}'s lab results`,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
          priority: 'high',
          completed: false
        },
        {
          id: 2,
          title: `Schedule follow-up appointment with ${selectedConversation.name}`,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
          priority: 'medium',
          completed: false
        }
      ];
    }
    
    return [
      {
        id: 1,
        title: `Respond to ${selectedConversation.name}'s message`,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
        priority: 'medium',
        completed: false
      }
    ];
  };
  
  // Get all attachments from the conversation
  const getAllAttachments = () => {
    if (!selectedConversation || !messageHistory[selectedConversation.id]) return [];
    
    return messageHistory[selectedConversation.id]
      .filter(message => message.attachments && message.attachments.length > 0)
      .flatMap(message => message.attachments.map(attachment => ({
        ...attachment,
        sender: message.sender,
        timestamp: message.timestamp
      })));
  };
  
  // Get unread notifications
  const getUnreadNotifications = () => {
    return conversations.filter(conv => conv.unread).map(conv => ({
      id: conv.id,
      name: conv.name,
      message: conv.lastMessage,
      timestamp: conv.timestamp,
      status: conv.status
    }));
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    // In a real app, this would update the task in the database
    console.log(`Toggling task completion for task ${taskId}`);
  };
  
  // Create a new task
  const createTask = (title) => {
    // In a real app, this would create a new task in the database
    console.log(`Creating new task: ${title}`);
  };
  
  // Archive conversation
  const archiveConversation = (id) => {
    // In a real app, this would archive the conversation
    setConversations(conversations.filter(conv => conv.id !== id));
    setShowActionMenu(null);
  };
  
  // Delete conversation
  const deleteConversation = (id) => {
    // In a real app, this would delete the conversation
    setConversations(conversations.filter(conv => conv.id !== id));
    setShowActionMenu(null);
  };
  
  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Left Sidebar - Conversations List */}
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
              onClick={() => setActiveFilter('starred')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'starred' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Starred
            </button>
            <button 
              onClick={() => setActiveFilter('patients')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'patients' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Patients
            </button>
            <button 
              onClick={() => setActiveFilter('staff')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center ${activeFilter === 'staff' ? 'bg-[#006D77] text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              Staff
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
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center">
                          {conversation.name}
                          <span 
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(conversation.status)}`}
                          >
                            {conversation.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
                          {conversation.lastMessage}
                        </p>
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
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Unread indicator */}
                {conversation.unread && (
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-1.5 h-1.5 bg-[#FF9500] rounded-full"></div>
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
                        archiveConversation(conversation.id);
                      }}
                    >
                      <Archive size={14} className="mr-2" /> 
                      Archive
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
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
                    {selectedConversation.online ? (
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
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <Video size={20} />
                </button>
                {selectedConversation.status === 'patient' && (
                  <Link 
                    href={`/Doctor/Patients/${selectedConversation.id}`}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  >
                    <UserCircle size={20} />
                  </Link>
                )}
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {getUnreadNotifications().length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  onClick={() => setShowAttachments(!showAttachments)}
                >
                  <FileText size={20} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  onClick={() => setShowTaskPanel(!showTaskPanel)}
                >
                  <CheckSquare size={20} />
                </button>
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
                      {message.content}
                      
                      {message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map(attachment => (
                            <div 
                              key={attachment.id}
                              className="flex items-center p-2 bg-gray-50 rounded border"
                            >
                              <div className="p-2 bg-gray-100 rounded mr-2">
                                {getAttachmentIcon(attachment.type)}
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{attachment.size}</p>
                              </div>
                              <a 
                                href={attachment.url} 
                                download
                                className="p-1.5 text-[#006D77] hover:bg-[#F0F9FA] rounded-full"
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
              
              {/* Attachment Preview */}
              {attachmentPreview && (
                <div className="p-3 bg-gray-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded mr-2">
                        {getAttachmentIcon(attachmentPreview.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{attachmentPreview.name}</p>
                        <p className="text-xs text-gray-500">{attachmentPreview.size}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={cancelAttachment}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={sendAttachment}
                        className="p-1.5 text-[#006D77] hover:bg-[#F0F9FA] rounded-full"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Assistant */}
              {showAIAssistant && aiSuggestions.length > 0 && (
                <div className="p-3 bg-[#F0F9FA] border-t">
                  <div className="flex items-center mb-2">
                    <Sparkles size={16} className="text-[#006D77] mr-2" />
                    <p className="text-sm font-medium text-[#006D77]">AI Suggestions</p>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button 
                        key={index}
                        className="w-full text-left p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <div className="p-3 bg-white border-t">
                <div className="flex items-center">
                  <button 
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full mr-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={20} />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </button>
                  
                  <div className="relative flex-grow">
                    <textarea
                      placeholder="Type your message..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006D77] resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                    />
                    <button 
                      className="absolute right-2 bottom-2 p-1.5 text-gray-500 hover:bg-gray-100 rounded-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile size={20} />
                    </button>
                  </div>
                  
                  <div className="flex ml-2">
                    <button 
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full mr-1"
                      onClick={() => {/* Voice recording functionality */}}
                    >
                      <Mic size={20} />
                    </button>
                    <button 
                      className="p-2 bg-[#006D77] text-white rounded-full hover:bg-[#005A66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={sendReply}
                      disabled={!replyText.trim() && !attachmentPreview}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex mt-2 space-x-2 overflow-x-auto pb-1">
                  <button className="px-3 py-1.5 bg-[#F0F9FA] text-[#006D77] rounded-md text-xs whitespace-nowrap flex items-center">
                    <Calendar size={12} className="mr-1" /> Schedule Appointment
                  </button>
                  <button className="px-3 py-1.5 bg-[#F0F9FA] text-[#006D77] rounded-md text-xs whitespace-nowrap flex items-center">
                    <FilePlus size={12} className="mr-1" /> Send Document
                  </button>
                  <button className="px-3 py-1.5 bg-[#F0F9FA] text-[#006D77] rounded-md text-xs whitespace-nowrap flex items-center">
                    <Pill size={12} className="mr-1" /> Prescription
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 p-4">
              <div className="w-16 h-16 bg-[#F0F9FA] rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-[#006D77]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-500 text-center mb-4">
                Select a conversation from the list to start messaging
              </p>
              <button className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A66] transition-colors flex items-center">
                <PlusCircle size={16} className="mr-2" />
                New Message
              </button>
            </div>
          )}
        </div>
        
        {/* Right Sidebar - Contextual Information */}
        {selectedConversation && (
          <div className={`w-1/4 bg-white border-l overflow-hidden ${showNotifications || showAttachments || showTaskPanel ? 'block' : 'hidden md:block'}`}>
            {/* Notifications Panel */}
            {showNotifications && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Bell size={18} className="mr-2" />
                    Notifications
                  </h3>
                  <button 
                    className="text-sm text-[#006D77] hover:underline"
                    onClick={() => {
                      // Mark all as read
                      setConversations(conversations.map(conv => ({ ...conv, unread: false })));
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-3">
                  {getUnreadNotifications().length > 0 ? (
                    getUnreadNotifications().map(notification => (
                      <div 
                        key={notification.id}
                        className="p-3 border rounded-lg mb-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          const conversation = conversations.find(c => c.id === notification.id);
                          if (conversation) {
                            setSelectedConversation(conversation);
                            markAsRead(conversation.id);
                            setShowNotifications(false);
                          }
                        }}
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium mr-2 flex-shrink-0">
                            {getInitials(notification.name)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{notification.name}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No unread notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Attachments Panel */}
            {showAttachments && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <FileText size={18} className="mr-2" />
                    Shared Files
                  </h3>
                </div>
                
                <div className="flex-grow overflow-y-auto p-3">
                  {getAllAttachments().length > 0 ? (
                    getAllAttachments().map((attachment, index) => (
                      <div 
                        key={index}
                        className="p-3 border rounded-lg mb-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded mr-2">
                            {getAttachmentIcon(attachment.type)}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                              <p className="text-xs text-gray-500">
                                {format(attachment.timestamp, 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <a 
                            href={attachment.url} 
                            download
                            className="p-1.5 text-[#006D77] hover:bg-[#F0F9FA] rounded-full ml-2"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Shared by {attachment.sender}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No shared files</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Task Panel */}
            {showTaskPanel && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <CheckSquare size={18} className="mr-2" />
                    Related Tasks
                  </h3>
                  <button 
                    className="text-sm text-[#006D77] hover:underline flex items-center"
                    onClick={() => {
                      // Create new task functionality
                      const taskTitle = `Follow up with ${selectedConversation.name}`;
                      createTask(taskTitle);
                    }}
                  >
                    <PlusCircle size={14} className="mr-1" />
                    New Task
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-3">
                  {getTasks().length > 0 ? (
                    getTasks().map(task => (
                      <div 
                        key={task.id}
                        className="p-3 border rounded-lg mb-3 hover:bg-gray-50"
                      >
                        <div className="flex items-start">
                          <button 
                            className={`mr-2 p-1 rounded-full flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-[#006D77]'}`}
                            onClick={() => toggleTaskCompletion(task.id)}
                          >
                            {task.completed ? <CheckCircle size={18} /> : <div className="w-[18px] h-[18px] border-2 border-current rounded-full" />}
                          </button>
                          <div className="flex-grow">
                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                Due: {format(task.dueDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No related tasks</p>
                      <button 
                        className="mt-2 text-sm text-[#006D77] hover:underline flex items-center mx-auto justify-center"
                        onClick={() => {
                          const taskTitle = `Follow up with ${selectedConversation.name}`;
                          createTask(taskTitle);
                        }}
                      >
                        <PlusCircle size={14} className="mr-1" />
                        Create Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Default Patient/Staff Info */}
            {!showNotifications && !showAttachments && !showTaskPanel && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <UserCircle size={18} className="mr-2" />
                    {selectedConversation.status === 'patient' ? 'Patient Information' : 'Staff Information'}
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium mr-4">
                      {selectedConversation.avatar ? (
                        <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(selectedConversation.name)
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{selectedConversation.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{selectedConversation.status}</p>
                    </div>
                  </div>
                  
                  {selectedConversation.status === 'patient' && (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Patient ID</span>
                          <span className="text-sm font-medium">P-{1000 + selectedConversation.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Visit</span>
                          <span className="text-sm font-medium">
                            {format(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Next Appointment</span>
                          <span className="text-sm font-medium">
                            {format(new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <h5 className="font-medium text-sm mb-2">Recent Medical Records</h5>
                        <div className="space-y-2">
                          <button className="w-full text-left p-2 bg-gray-50 rounded border text-sm hover:bg-gray-100 flex items-center">
                            <FileText size={14} className="mr-2 text-gray-500" />
                            Lab Results (Blood Work)
                          </button>
                          <button className="w-full text-left p-2 bg-gray-50 rounded border text-sm hover:bg-gray-100 flex items-center">
                            <FileText size={14} className="mr-2 text-gray-500" />
                            Prescription History
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {(selectedConversation.status === 'colleague' || selectedConversation.status === 'staff') && (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Department</span>
                          <span className="text-sm font-medium">
                            {selectedConversation.status === 'colleague' ? 'Cardiology' : 'Nursing'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Role</span>
                          <span className="text-sm font-medium">
                            {selectedConversation.status === 'colleague' ? 'Physician' : 'Head Nurse'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <h5 className="font-medium text-sm mb-2">Shared Patients</h5>
                        <div className="space-y-2">
                          <button className="w-full text-left p-2 bg-gray-50 rounded border text-sm hover:bg-gray-100 flex items-center">
                            <User size={14} className="mr-2 text-gray-500" />
                            Emma Wilson
                          </button>
                          <button className="w-full text-left p-2 bg-gray-50 rounded border text-sm hover:bg-gray-100 flex items-center">
                            <User size={14} className="mr-2 text-gray-500" />
                            Michael Rodriguez
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-4">
                    <Link 
                      href={selectedConversation.status === 'patient' 
                        ? `/Doctor/Patients/P-${1000 + selectedConversation.id}` 
                        : `/Doctor/Staff/${selectedConversation.id}`
                      }
                      className="w-full py-2 bg-[#F0F9FA] text-[#006D77] rounded-lg hover:bg-[#E8F3F4] transition-colors flex items-center justify-center"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default MessagingPage;