import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Clock, Calendar, Users, ArrowRight } from 'lucide-react';
import { Patient } from '.';
import { useInView } from 'react-intersection-observer';

interface SmartFeaturesProps {
  patients: Patient[];
}

const SmartFeatures: React.FC<SmartFeaturesProps> = ({ patients }) => {
  // Calculate statistics
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const followUpCount = patients.filter(p => p.status === 'Follow-Up Needed').length;
  const upcomingAppointments = patients.filter(p => p.upcomingAppointment).length;
  
  // Simulate AI recommendations
  const recommendations = [
    {
      id: 1,
      title: 'Critical Patients',
      description: 'Review critical patients requiring immediate attention',
      icon: <AlertCircle className="text-red-500" />,
      count: criticalCount,
      action: 'Review Now',
      color: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      id: 2,
      title: 'Follow-ups',
      description: 'Patients requiring follow-up consultations',
      icon: <Clock className="text-yellow-500" />,
      count: followUpCount,
      action: 'Schedule',
      color: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      id: 3,
      title: 'Appointments',
      description: 'Upcoming appointments this week',
      icon: <Calendar className="text-blue-500" />,
      count: upcomingAppointments,
      action: 'View Calendar',
      color: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 4,
      title: 'Patient Trends',
      description: 'View patient admission trends and analytics',
      icon: <TrendingUp className="text-green-500" />,
      count: patients.length,
      action: 'View Analytics',
      color: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10',
      textColor: 'text-green-600 dark:text-green-400'
    }
  ];

  // Animation with intersection observer
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="mb-8" ref={ref}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          AI-Powered Insights
        </h2>
        <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
          <Users size={16} className="mr-1" />
          <span>{patients.length} Total Patients</span>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {recommendations.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className={`bg-gradient-to-br ${item.color} rounded-lg p-5 shadow-sm transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                {item.icon}
              </div>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                className={`text-2xl font-bold ${item.textColor}`}
              >
                {item.count}
              </motion.div>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.description}</p>
            <motion.button 
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-2 px-3 text-sm font-medium ${item.textColor} bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center`}
            >
              {item.action}
              <ArrowRight size={14} className="ml-1" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SmartFeatures;