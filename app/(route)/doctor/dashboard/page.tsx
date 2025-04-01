"use client";
import React, { useState, useEffect } from 'react';
import CalendarWidget from '@/modules/doctor-pages/dashboard/CalendarWidget';
import PatientOverviewWidget from '@/modules/doctor-pages/dashboard/PatientOverviewWidget';
import MessagingWidget from '@/modules/doctor-pages/dashboard/MessagingWidget';
import NotificationsWidget from '@/modules/doctor-pages/dashboard/NotificationsWidget';
import AIInsightsWidget from '@/modules/doctor-pages/dashboard/AIInsightsWidget';
import AnalyticsSummaryWidget from '@/modules/doctor-pages/dashboard/AnalyticsSummaryWidget';
import TaskManagementWidget from '@/modules/doctor-pages/dashboard/TaskManagementWidget';
import { 
  PlusIcon, Calendar, Users, MessageCircle, Bell, Sparkles, 
  BarChart2, CheckSquare, Settings, Maximize2, Minimize2, X, 
  ArrowUpRight, RefreshCw, ChevronDown, Sliders
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Widget configuration type
type WidgetConfig = {
  id: string;
  component: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  refreshInterval?: number;
  lastRefreshed?: Date;
  minimized?: boolean;
};

const Dashboard = () => {
  // State for quick action dropdown
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Doctor info
  const doctorInfo = {
    name: 'Dr. Smith',
    appointments: 8,
    messages: 5,
    tasks: 3
  };

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Initial widget configuration
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      id: 'calendar',
      component: <CalendarWidget />,
      title: 'Calendar',
      icon: <Calendar className="h-5 w-5" />,
      enabled: true,
      size: 'large',
      refreshInterval: 300000, // 5 minutes
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'patients',
      component: <PatientOverviewWidget />,
      title: 'Patients',
      icon: <Users className="h-5 w-5" />,
      enabled: true,
      size: 'medium',
      refreshInterval: 600000, // 10 minutes
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'messages',
      component: <MessagingWidget />,
      title: 'Messages',
      icon: <MessageCircle className="h-5 w-5" />,
      enabled: true,
      size: 'small',
      refreshInterval: 60000, // 1 minute
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'notifications',
      component: <NotificationsWidget />,
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      enabled: true,
      size: 'small',
      refreshInterval: 60000, // 1 minute
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'ai-insights',
      component: <AIInsightsWidget />,
      title: 'AI Insights',
      icon: <Sparkles className="h-5 w-5" />,
      enabled: true,
      size: 'small',
      refreshInterval: 900000, // 15 minutes
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'analytics',
      component: <AnalyticsSummaryWidget />,
      title: 'Analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      enabled: true,
      size: 'large',
      refreshInterval: 1800000, // 30 minutes
      lastRefreshed: new Date(),
      minimized: false
    },
    {
      id: 'tasks',
      component: <TaskManagementWidget />,
      title: 'Tasks',
      icon: <CheckSquare className="h-5 w-5" />,
      enabled: true,
      size: 'small',
      refreshInterval: 300000, // 5 minutes
      lastRefreshed: new Date(),
      minimized: false
    }
  ]);

  // Toggle widget visibility
  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  // Toggle widget minimized state
  const toggleMinimize = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, minimized: !widget.minimized } : widget
    ));
  };

  // Change widget size
  const changeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    ));
  };

  // Refresh all widgets
  const refreshAllWidgets = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setWidgets(widgets.map(widget => ({
        ...widget,
        lastRefreshed: new Date()
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
  };

  // Get column span based on widget size
  const getColSpan = (size: string) => {
    switch(size) {
      case 'large': return 'lg:col-span-2';
      case 'medium': return 'lg:col-span-1';
      case 'small': return 'lg:col-span-1';
      default: return 'lg:col-span-1';
    }
  };

  // Format time since last refresh
  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] p-6">
      {/* Welcome Banner */}
      <AnimatePresence>
        {showWelcomeBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-[#006D77] to-[#2A9D8F] rounded-xl p-6 mb-6 text-white shadow-lg relative overflow-hidden"
          >
            <button 
              onClick={() => setShowWelcomeBanner(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-serif">{greeting}, {doctorInfo.name}</h1>
                <p className="text-white/80 mt-1">Here's your day at a glance</p>
              </div>
              
              <div className="flex space-x-6 mt-4 md:mt-0">
                <div className="text-center">
                  <p className="text-2xl font-bold">{doctorInfo.appointments}</p>
                  <p className="text-sm text-white/80">Appointments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{doctorInfo.messages}</p>
                  <p className="text-sm text-white/80">Messages</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{doctorInfo.tasks}</p>
                  <p className="text-sm text-white/80">Tasks</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dashboard Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Dashboard</h2>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={refreshAllWidgets}
            className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center">
              <Sliders size={16} className="mr-1" />
              <span>Customize</span>
              <ChevronDown size={14} className="ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Widget Visibility</DropdownMenuLabel>
              {widgets.map(widget => (
                <DropdownMenuItem key={widget.id} onSelect={(e) => {
                  e.preventDefault();
                  toggleWidget(widget.id);
                }}>
                  <div className="flex items-center w-full">
                    {widget.icon}
                    <span className="ml-2">{widget.title}</span>
                    <div className={`ml-auto w-3 h-3 rounded-full ${widget.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {}}>
                <Settings size={16} className="mr-2" />
                <span>Dashboard Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Widgets Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets" direction="horizontal">
          {(provided) => (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {widgets.filter(widget => widget.enabled).map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${getColSpan(widget.size)} transition-all duration-300`}
                    >
                      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
                        {/* Widget Header */}
                        <div 
                          className="flex justify-between items-center p-4 border-b"
                          {...provided.dragHandleProps}
                        >
                          <div className="flex items-center">
                            <div className="p-1.5 rounded-md bg-[#F0F9FA] text-[#006D77] mr-2">
                              {widget.icon}
                            </div>
                            <h3 className="font-medium text-gray-800">{widget.title}</h3>
                            <span className="text-xs text-gray-500 ml-2">
                              Updated {formatTimeSince(widget.lastRefreshed)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => toggleMinimize(widget.id)}
                              className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                              aria-label={widget.minimized ? "Maximize" : "Minimize"}
                            >
                              {widget.minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                            </button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
                                <Settings size={14} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Widget Settings</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => changeWidgetSize(widget.id, 'small')}>
                                  Small Size
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => changeWidgetSize(widget.id, 'medium')}>
                                  Medium Size
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => changeWidgetSize(widget.id, 'large')}>
                                  Large Size
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => toggleWidget(widget.id)}>
                                  Hide Widget
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        {/* Widget Content */}
                        <AnimatePresence>
                          {!widget.minimized && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {widget.component}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* Floating Quick Action Button */}
      <DropdownMenu open={quickActionOpen} onOpenChange={setQuickActionOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="fixed bottom-6 right-6 bg-[#006D77] text-white rounded-full p-4 shadow-lg hover:bg-[#004D57] transition-colors"
            aria-label="Quick Actions"
          >
            <PlusIcon size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-[#F0F9FA] rounded-md">
            <Calendar className="mr-2 h-4 w-4 text-[#006D77]" />
            <span>New Appointment</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-[#F0F9FA] rounded-md">
            <Users className="mr-2 h-4 w-4 text-[#006D77]" />
            <span>Add Patient</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-[#F0F9FA] rounded-md">
            <MessageCircle className="mr-2 h-4 w-4 text-[#006D77]" />
            <span>Send Message</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-[#F0F9FA] rounded-md">
            <CheckSquare className="mr-2 h-4 w-4 text-[#006D77]" />
            <span>Create Task</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center p-2 cursor-pointer hover:bg-[#F0F9FA] rounded-md">
            <ArrowUpRight className="mr-2 h-4 w-4 text-[#006D77]" />
            <span>View All Actions</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dashboard;