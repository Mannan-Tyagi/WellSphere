import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Menu,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CalendarToolbarProps {
  date: Date;
  view: string;
  views: string[];
  onView: (view: string) => void;
  onNavigate: (action: 'PREV' | 'TODAY' | 'NEXT') => void;
  onCreateAppointment: () => void;
  onToggleSidebar: () => void;
  onToggleFilters: () => void;
  isMobile: boolean;
}

export function CalendarToolbar({
  date,
  view,
  views,
  onView,
  onNavigate,
  onCreateAppointment,
  onToggleSidebar,
  onToggleFilters,
  isMobile
}: CalendarToolbarProps) {
  const viewLabels: Record<string, string> = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda'
  };
  
  return (
    <div className="p-3 border-b flex flex-wrap items-center justify-between gap-2">
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onToggleSidebar} className="h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-semibold">
            {format(date, view === 'month' ? 'MMMM yyyy' : view === 'week' ? "'Week of' MMM d, yyyy" : 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
      )}
      
      {isMobile && (
        <h2 className="text-base font-medium">
          {format(date, view === 'month' ? 'MMMM yyyy' : view === 'week' ? "'Week of' MMM d" : 'EEE, MMM d')}
        </h2>
      )}
      
      <div className="flex items-center gap-2">
        {/* Navigation controls */}
        <div className="flex rounded-md overflow-hidden border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('PREV')}
            className="rounded-none px-2 h-9 border-r"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('TODAY')}
            className="rounded-none px-3 h-9 border-r"
          >
            Today
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            className="rounded-none px-2 h-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* View selector */}
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-1.5" />
                {viewLabels[view] || view}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {views.map(viewName => (
                <DropdownMenuItem 
                  key={viewName} 
                  onClick={() => onView(viewName)}
                  className={view === viewName ? "bg-muted" : ""}
                >
                  {viewLabels[viewName] || viewName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex rounded-md overflow-hidden border">
            {views.map(viewName => (
              <Button
                key={viewName}
                variant={view === viewName ? "default" : "ghost"}
                size="sm"
                onClick={() => onView(viewName)}
                className={`rounded-none h-9 px-3 ${viewName !== views[views.length - 1] ? 'border-r' : ''}`}
              >
                {viewLabels[viewName] || viewName}
              </Button>
            ))}
          </div>
        )}
        
        {!isMobile && (
          <>
            <Button variant="outline" size="sm" onClick={onToggleFilters} className="h-9">
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
            </Button>
            
            <Button size="sm" onClick={onCreateAppointment} className="h-9">
              <Plus className="h-4 w-4 mr-1.5" />
              New Appointment
            </Button>
          </>
        )}
      </div>
    </div>
  );
}