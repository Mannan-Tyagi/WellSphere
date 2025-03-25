import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface ScheduleHeaderProps {
  label: string;
  onNavigate: (action: 'PREV' | 'TODAY' | 'NEXT') => void;
  onView: (view: string) => void;
  views: string[];
  view: string;
  date: Date;
  onAddAppointment: () => void;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
  onAddAppointment,
  onToggleSidebar,
  isMobile
}) => {
  const viewNames: Record<string, string> = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'List',
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-3 gap-2 border-b">
      <div className="flex items-center gap-2">
        {/* Sidebar toggle button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-1"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        
        {/* Current date display */}
        <div className="hidden sm:block">
          <h2 className="text-xl font-semibold">
            {format(date, 'MMMM yyyy')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {format(date, 'EEEE, MMMM do')}
          </p>
        </div>
        
        {/* Mobile date display */}
        <h2 className="text-lg font-semibold sm:hidden">
          {format(date, 'MMM d, yyyy')}
        </h2>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {/* Navigation buttons */}
        <div className="flex items-center bg-muted/30 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('PREV')}
            className="h-9 w-9 rounded-r-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('TODAY')}
            className="h-9 rounded-none px-3"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('NEXT')}
            className="h-9 w-9 rounded-l-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* View selector */}
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {viewNames[view]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {views.map(name => (
                <DropdownMenuItem 
                  key={name}
                  onClick={() => onView(name)}
                  className={view === name ? "bg-muted" : ""}
                >
                  {viewNames[name]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex overflow-hidden rounded-md">
            {views.map(name => (
              <Button
                key={name}
                variant={view === name ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onView(name)}
                className="rounded-none h-9 px-3 first:rounded-l-md last:rounded-r-md"
              >
                {viewNames[name]}
              </Button>
            ))}
          </div>
        )}
        
        {/* Add appointment button */}
        <Button
          size="sm"
          className="h-9"
          onClick={onAddAppointment}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className={isMobile ? "sr-only" : ""}>New Appointment</span>
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;