import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, X,  History, Wand2 } from 'lucide-react';
import { Patient } from '.';
import { useLocalStorage } from 'react-use';

interface SearchBarProps {
  patients: Patient[];
  onSearch: (results: Patient[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ patients, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);
  const [showRecent, setShowRecent] = useState(false);
  const [voiceSearchFeedback, setVoiceSearchFeedback] = useState('');
  const [isAISearching, setIsAISearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice search animation variants
  const pulseVariants = {
    active: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    inactive: {
      scale: 1,
      opacity: 1
    }
  };

  // Enhanced suggestions with AI
  const getAISuggestions = useCallback(async (searchTerm: string) => {
    setIsAISearching(true);
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions = [
      `Patients with ${searchTerm} condition`,
      `Recent visits related to ${searchTerm}`,
      `Critical cases involving ${searchTerm}`,
      `Follow-ups needed for ${searchTerm}`
    ];
    
    setIsAISearching(false);
    return suggestions;
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 1) {
      const patientNames = patients.map(p => p.name);
      const conditions = Array.from(new Set(patients.map(p => p.condition)));
      const statuses = Array.from(new Set(patients.map(p => p.status)));
      
      const allSuggestions = [...patientNames, ...conditions, ...statuses];
      
      const filtered = allSuggestions
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      
      setSuggestions(filtered);
      setShowRecent(false);

      // Get AI suggestions
      getAISuggestions(query).then(aiSuggestions => {
        setSuggestions(prev => [...prev, ...aiSuggestions]);
      });
    } else if (query.length === 0 && isFocused && recentSearches && recentSearches.length > 0) {
      setSuggestions([]);
      setShowRecent(true);
    } else {
      setSuggestions([]);
      setShowRecent(false);
    }
  }, [query, patients, isFocused, recentSearches, getAISuggestions]);

  // Enhanced voice search with feedback
  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceSearchFeedback('');
      return;
    }
    
    setIsListening(true);
    setVoiceSearchFeedback('Listening...');
    
    // Simulate voice recognition with progressive feedback
    setTimeout(() => setVoiceSearchFeedback('Processing speech...'), 1000);
    setTimeout(() => {
      const simulatedVoiceQueries = [
        "Show critical patients",
        "Find patients with diabetes",
        "List upcoming appointments"
      ];
      const randomQuery = simulatedVoiceQueries[Math.floor(Math.random() * simulatedVoiceQueries.length)];
      setQuery(randomQuery);
      setVoiceSearchFeedback(`Recognized: "${randomQuery}"`);
      if (recentSearches) {
        setRecentSearches([randomQuery, ...recentSearches.slice(0, 4)]);
      }
      setIsListening(false);
      setTimeout(() => setVoiceSearchFeedback(''), 2000);
    }, 2000);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'ring-2 ring-primary-500 shadow-lg' : 'shadow'
      } bg-white dark:bg-gray-800 rounded-full overflow-hidden`}>
        <div className="pl-4 text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.length === 0 && recentSearches && recentSearches.length > 0) {
              setShowRecent(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
              setShowRecent(false);
            }, 200);
          }}
          placeholder="Search patients by name, condition, or status..."
          className="w-full py-3 px-3 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none"
          aria-label="Search patients"
        />
        
        {voiceSearchFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
          >
            {voiceSearchFeedback}
          </motion.div>
        )}
        
        <AnimatePresence>
          {isAISearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mr-2"
            >
              <Wand2 size={18} className="text-primary-500 animate-pulse" />
            </motion.div>
          )}
          
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuery('')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.button
          variants={pulseVariants}
          animate={isListening ? 'active' : 'inactive'}
          whileTap={{ scale: 0.9 }}
          onClick={toggleVoiceSearch}
          className={`p-3 flex items-center justify-center ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          } rounded-r-full transition-colors duration-200`}
          aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
        >
          <Mic size={20} />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {(suggestions.length > 0 || showRecent) && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {showRecent && recentSearches && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  Recent Searches
                </div>
                <ul>
                  {recentSearches.map((term, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          setShowRecent(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <History size={14} className="mr-2 text-gray-400" />
                          {term}
                        </div>
                        <X 
                          size={14} 
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(recentSearches.filter(s => s !== term));
                          }}
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {suggestions.length > 0 && (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(suggestion);
                        if (recentSearches) {
                          setRecentSearches([suggestion, ...recentSearches.filter(s => s !== suggestion).slice(0, 4)]);
                        }
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center"
                    >
                      {suggestion.includes('AI:') ? (
                        <Wand2 size={14} className="mr-2 text-primary-500" />
                      ) : (
                        <Search size={14} className="mr-2 text-gray-400" />
                      )}
                      {suggestion}
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;