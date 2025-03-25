import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APPOINTMENT_TYPES } from '@/app/(route)/Doctor/Calendar/page';

interface ScheduleFiltersProps {
  types: Array<keyof typeof APPOINTMENT_TYPES>;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  appointmentTypes: typeof APPOINTMENT_TYPES;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  types,
  activeFilters,
  setActiveFilters,
  appointmentTypes
}) => {
  const handleToggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter(t => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };
  
  const handleClearFilters = () => {
    setActiveFilters([]);
  };
  
  return (
    <div className="flex flex-wrap gap-2 items-center p-1">
      <span className="text-sm font-medium">Filter:</span>
      
      <div className="flex flex-wrap gap-1">
        {types.map(type => (
          <Badge
            key={type}
            variant="outline"
            className={cn(
              "cursor-pointer capitalize flex items-center gap-1 hover:bg-muted/60 transition-colors",
              activeFilters.includes(type) && "bg-muted"
            )}
            onClick={() => handleToggleFilter(type)}
            style={{ 
              borderColor: activeFilters.includes(type) ? appointmentTypes[type].color : undefined,
              color: appointmentTypes[type].color,
              opacity: activeFilters.length > 0 && !activeFilters.includes(type) ? 0.6 : 1
            }}
          >
            <div 
              className="w-2 h-2 rounded-full mr-1" 
              style={{ backgroundColor: appointmentTypes[type].color }}
            />
            {appointmentTypes[type].name}
            {activeFilters.includes(type) && (
              <Check className="h-3 w-3 ml-1" />
            )}
          </Badge>
        ))}
      </div>
      
      {activeFilters.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={handleClearFilters}
          >
            Clear
          </Badge>
        </>
      )}
    </div>
  );
};

export default ScheduleFilters;