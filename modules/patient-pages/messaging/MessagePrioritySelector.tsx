"use client";

import React from 'react';
import { AlertTriangle, Clock, Pill, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessagePrioritySelectorProps {
  onSelectPriority: (priority: string) => void;
}

export default function MessagePrioritySelector({ onSelectPriority }: MessagePrioritySelectorProps) {
  // Define priority levels
  const priorities = [
    {
      id: 'normal',
      name: 'Normal Message',
      description: 'General inquiries, follow-ups, or non-urgent updates',
      icon: <Info size={16} className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'medication',
      name: 'Medication Question',
      description: 'Questions about medication dosage, side effects, or renewals',
      icon: <Pill size={16} className="text-amber-500" />,
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
      id: 'time-sensitive',
      name: 'Time Sensitive',
      description: 'Matters requiring attention in the next 1-2 days',
      icon: <Clock size={16} className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    },
    {
      id: 'urgent',
      name: 'Urgent',
      description: 'Important issues requiring prompt attention (not for emergencies)',
      icon: <AlertTriangle size={16} className="text-red-500" />,
      color: 'bg-red-50 border-red-200 text-red-700'
    }
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center text-sm text-gray-600 p-2 hover:bg-gray-100 rounded-md">
          <Info size={16} className="mr-1" />
          <span>Set Priority</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Message Priority</h3>
          <p className="text-xs text-gray-500">
            Select a priority level for your message to help your provider understand its urgency.
            <span className="block mt-1 text-red-600 font-medium">
              For medical emergencies, call 911 or go to the nearest emergency room.
            </span>
          </p>
          
          <div className="mt-3 space-y-2">
            {priorities.map(priority => (
              <button
                key={priority.id}
                className={`w-full flex items-start p-2 border rounded-md ${priority.color} hover:opacity-90 transition-opacity text-left`}
                onClick={() => onSelectPriority(priority.id)}
              >
                <div className="mr-2 mt-0.5 flex-shrink-0">
                  {priority.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{priority.name}</p>
                  <p className="text-xs">{priority.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
