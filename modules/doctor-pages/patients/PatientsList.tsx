import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Filter, ArrowUpDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import PatientCard from './PatientCard';
import { FilterOption, Patient, SortOption } from '.';

interface PatientsListProps {
  patients: Patient[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filterOption: FilterOption;
  setFilterOption: (option: FilterOption) => void;
  onPatientSelect: (patient: Patient) => void;
}

const PatientsList: React.FC<PatientsListProps> = ({
  patients,
  sortOption,
  setSortOption,
  filterOption,
  setFilterOption,
  onPatientSelect
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Filter patients based on selected filter
  const filteredPatients = React.useMemo(() => {
    if (filterOption === 'All') return patients;
    
    if (filterOption === 'High-Risk') {
      return patients.filter(p => p.status === 'Critical');
    }
    
    if (filterOption === 'Follow-Up') {
      return patients.filter(p => p.status === 'Follow-Up Needed');
    }
    
    if (filterOption === 'Inpatient') {
      return patients.filter(p => p.status === 'Critical' || p.status === 'Recovering');
    }
    
    if (filterOption === 'Outpatient') {
      return patients.filter(p => p.status === 'Stable' || p.status === 'Follow-Up Needed');
    }
    
    return patients;
  }, [patients, filterOption]);
  
  // Sort patients based on selected sort option
  const sortedPatients = React.useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      
      if (sortOption === 'lastVisit') {
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      }
      
      if (sortOption === 'status') {
        const statusOrder = {
          'Critical': 0,
          'Follow-Up Needed': 1,
          'Recovering': 2,
          'Stable': 3
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      if (sortOption === 'age') {
        return b.age - a.age;
      }
      
      return 0;
    });
  }, [filteredPatients, sortOption]);

  // Featured patients (for highlighting)
  const featuredPatients = sortedPatients.filter(p => p.isFeatured);
  const regularPatients = sortedPatients.filter(p => !p.isFeatured);
  
  // Combine featured patients at the top
  const displayPatients = [...featuredPatients, ...regularPatients];
  
  // Pagination with infinite scroll
  const paginatedPatients = displayPatients.slice(0, displayCount);
  
  // Load more patients when scrolling to the bottom
  useEffect(() => {
    if (inView && displayCount < displayPatients.length) {
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + 4, displayPatients.length));
      }, 300);
    }
  }, [inView, displayCount, displayPatients.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center border border-gray-200 dark:border-gray-700"
          >
            <Filter size={16} className="mr-2" />
            Filters
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const nextOption = sortOption === 'name' ? 'lastVisit' : 
                              sortOption === 'lastVisit' ? 'status' : 
                              sortOption === 'status' ? 'age' : 'name';
              setSortOption(nextOption);
            }}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center border border-gray-200 dark:border-gray-700"
          >
            <ArrowUpDown size={16} className="mr-2" />
            <span className="hidden sm:inline">Sort by:</span>
            <span className="font-medium ml-1">
              {sortOption === 'name' ? 'Name' : 
               sortOption === 'lastVisit' ? 'Recent Visit' : 
               sortOption === 'status' ? 'Status' : 'Age'}
            </span>
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter Patients</h3>
              <div className="flex flex-wrap gap-2">
                {['All', 'Inpatient', 'Outpatient', 'High-Risk', 'Follow-Up'].map((filter) => (
                  <motion.button
                    key={filter}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterOption(filter as FilterOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterOption === filter
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter}
                    {filter !== 'All' && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                        {filteredPatients.length}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {paginatedPatients.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedPatients.map((patient) => (
            <motion.div key={patient.id} variants={itemVariants}>
              <PatientCard 
                patient={patient}
                onSelect={onPatientSelect}
              />
            </motion.div>
          ))}
          
          {/* Loading indicator */}
          {displayCount < displayPatients.length && (
            <div 
              ref={ref} 
              className="col-span-full flex justify-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5
                }}
                className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600"
              />
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-full mb-4">
            <AlertTriangle size={32} className="text-yellow-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No patients found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            No patients match your current search criteria. Try adjusting your filters or search terms.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PatientsList;