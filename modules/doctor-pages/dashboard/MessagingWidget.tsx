import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Search, Send, Paperclip, User, Check, CheckCheck, Filter, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Export conversations to be used by the MessagingPage
export const conversations = [
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
];

const MessagingWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localConversations, setLocalConversations] = useState(conversations);
  
  // Filter conversations based on search
  const filteredConversations = localConversations
    .filter(conversation => 
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3); // Show only 3 conversations in the widget
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Mark as read
  const markAsRead = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalConversations(localConversations.map(conv => 
      conv.id === id ? { ...conv, unread: false } : conv
    ));
  };
  
  // Count unread messages
  const unreadCount = localConversations.filter(conv => conv.unread).length;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <MessageCircle className="mr-2" size={20} />
          Messages
          {unreadCount > 0 && (
            <span className="ml-2 bg-[#FF9500] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </h2>
        <Link href="/Doctor/Messaging" className="p-1.5 rounded-full bg-[#F0F9FA] text-[#006D77] hover:bg-[#E8F3F4] transition-colors">
          <ChevronRight size={16} />
        </Link>
      </div>
      
      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
        />
      </div>
      
      {/* Messages List */}
      <div className="space-y-3">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <Link 
              key={conversation.id}
              href={`/Doctor/Messaging?conversation=${conversation.id}`}
              className="block p-3 border border-gray-100 rounded-lg hover:bg-[#F0F9FA] transition-colors relative"
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-medium">
                    {conversation.avatar ? (
                      <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(conversation.name)
                    )}
                  </div>
                  {conversation.online && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                      )}
                                    </div>
                                    
                                    <div className="ml-3 flex-grow">
                                      <div className="flex justify-between">
                                        <p className="font-medium text-gray-800">
                                          {conversation.name}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                          {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-1">{conversation.lastMessage}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Unread indicator */}
                                  {conversation.unread && (
                                    <>
                                      <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-1.5 h-1.5 bg-[#FF9500] rounded-full"></div>
                                      <button 
                                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                                        onClick={(e) => markAsRead(conversation.id, e)}
                                      >
                                        <Check size={14} />
                                      </button>
                                    </>
                                  )}
                                </Link>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <p>No messages found</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 text-center">
                            <Link href="/Doctor/Messaging" className="text-[#006D77] text-sm hover:underline flex items-center justify-center">
                              View All Messages <ChevronRight size={16} />
                            </Link>
                          </div>
                        </div>
                      );
                    };
                    
                    export default MessagingWidget;