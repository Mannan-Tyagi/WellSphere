import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Patient } from '.';
import { format } from 'date-fns';
import ViewPatientButton from './ViewPatientButton';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

const statusColors = {
  'Stable': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Follow-Up Needed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Recovering': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(patient.isFeatured || false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        patient.isFeatured ? 'ring-2 ring-accent-400 dark:ring-accent-600' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFavorite && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 z-10 bg-accent-500 text-white p-1 rounded-full"
        >
          <Heart size={16} fill="white" />
        </motion.div>
      )}
      
      <div className="relative pt-6 px-6 pb-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" 
            />
            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
              patient.status === 'Critical' ? 'bg-red-500' : 
              patient.status === 'Follow-Up Needed' ? 'bg-yellow-500' : 
              patient.status === 'Recovering' ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="absolute -top-1 -right-1 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md"
            >
              <Heart size={14} className={isFavorite ? "text-accent-500" : "text-gray-400"} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-white text-center">{patient.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">ID: {patient.id}</p>
          
          <span className={`text-xs px-2 py-1 rounded-full mb-3 ${statusColors[patient.status]}`}>
            {patient.status}
          </span>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Condition:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{patient.condition}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Last Visit:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(patient.lastVisit)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Age/Gender:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{patient.age} yrs, {patient.gender}</span>
            </div>
            
            {patient.upcomingAppointment && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Next Appt:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(patient.upcomingAppointment)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isHovered ? 'auto' : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 dark:bg-gray-700 px-6 py-3 overflow-hidden"
      >
        <div className="flex justify-center">
          <ViewPatientButton
            patient={patient}
            onClick={() => onSelect(patient)}
            collaborators={2}
            hasNewUpdates={true}
            aiInsights={[
              "High risk of medication interaction detected",
              "Follow-up recommended within 7 days"
            ]}
            language="en"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatientCard;