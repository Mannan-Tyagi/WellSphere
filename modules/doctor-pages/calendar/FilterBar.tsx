import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APPOINTMENT_TYPES } from '@/app/calendar/page';

interface FilterBarProps {
  appointmentTypes: typeof APPOINTMENT_TYPES;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

export function FilterBar({
  appointmentTypes,
  activeFilters,
  setActiveFilters
}: FilterBarProps) {
  const toggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter(t => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(appointmentTypes).map(([type, details]) => (
          <Badge
            key={type}
            variant="outline"
            className={cn(
              "cursor-pointer hover:bg-muted/60 transition-colors",
              activeFilters.includes(type) && "bg-muted"
            )}
            style={{
              color: details.color,
              borderColor: activeFilters.includes(type) ? details.color : undefined,
              opacity: activeFilters.length > 0 && !activeFilters.includes(type) ? 0.6 : 1
            }}
            onClick={() => toggleFilter(type)}
          >
            <span 
              className="w-2 h-2 rounded-full mr-1.5 inline-block"
              style={{ backgroundColor: details.color }} 
            />
            {details.name}
            {activeFilters.includes(type) && (
              <Check className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>
      
      {activeFilters.length > 0 && (
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={clearFilters}
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Badge>
      )}
    </div>
  );
}