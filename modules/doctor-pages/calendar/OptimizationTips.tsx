import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AISuggestion } from '@/app/calendar/page';
import { Sparkles, Check, X, Clock, CalendarRange, Lightbulb, Battery, ArrowRight } from 'lucide-react';

interface OptimizationTipsProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: AISuggestion[];
  onAcceptSuggestion: (suggestion: AISuggestion) => void;
  onRejectSuggestion: (suggestion: AISuggestion) => void;
}

const OptimizationTips: React.FC<OptimizationTipsProps> = ({
  isOpen,
  onClose,
  suggestions,
  onAcceptSuggestion,
  onRejectSuggestion
}) => {
  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, AISuggestion[]>);
  
  // Get icon based on suggestion type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'duration':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'buffer':
        return <Battery className="h-5 w-5 text-green-500" />;
      case 'reschedule':
        return <CalendarRange className="h-5 w-5 text-purple-500" />;
      case 'optimization':
        return <Lightbulb className="h-5 w-5 text-amber-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get friendly name for suggestion type
  const getTypeName = (type: string) => {
    switch (type) {
      case 'duration':
        return 'Appointment Duration';
      case 'buffer':
        return 'Buffer Time';
      case 'reschedule':
        return 'Rescheduling';
      case 'optimization':
        return 'Schedule Optimization';
      default:
        return 'Suggestion';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>AI Schedule Optimization</span>
          </DialogTitle>
          <DialogDescription>
            Recommendations to improve your scheduling efficiency and patient experience
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(type)}
                  <h3 className="text-lg font-semibold">{getTypeName(type)}</h3>
                </div>
                
                <div className="space-y-3 pl-7">
                  {typeSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg p-4 bg-muted/20">
                      <div className="font-medium">{suggestion.message}</div>
                      
                      <div className="mt-1.5 text-sm text-muted-foreground">
                        {suggestion.details}
                      </div>
                      
                      {/* Show before and after if available */}
                      {suggestion.oldValue && suggestion.newValue && (
                        <div className="mt-3 bg-muted/30 rounded-md p-2.5 flex items-center justify-between">
                          <div className="text-sm">
                            <div className="text-muted-foreground text-xs">Current:</div>
                            <div className="font-medium">
                              {typeof suggestion.oldValue === 'object' 
                                ? `Before: ${suggestion.oldValue.before}min, After: ${suggestion.oldValue.after}min`
                                : `${suggestion.oldValue} minutes`}
                            </div>
                          </div>
                          
                          <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                          
                          <div className="text-sm">
                            <div className="text-muted-foreground text-xs">Recommended:</div>
                            <div className="font-medium text-primary">
                              {typeof suggestion.newValue === 'object'
                                ? `Before: ${suggestion.newValue.before}min, After: ${suggestion.newValue.after}min`
                                : `${suggestion.newValue} minutes`}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {suggestion.impact && (
                        <div className="mt-3 text-xs bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-2 rounded">
                          <span className="font-medium">Predicted Impact:</span> {suggestion.impact}
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-muted-foreground"
                          onClick={() => onRejectSuggestion(suggestion)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => onAcceptSuggestion(suggestion)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Apply Change
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between mt-2">
          <div className="text-sm text-muted-foreground">
            AI learns from your schedule patterns and patient interactions
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationTips;