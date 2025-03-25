import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, AlertCircle, Users,  Wand2, MessageCircle, Phone, Mail, Calendar, Activity, User,  Edit,  X, ChevronRight, Stethoscope } from 'lucide-react';
import { Patient } from '.';
import { format } from 'date-fns';

interface ViewPatientButtonProps {
  patient: Patient;
  onClick: () => void;
  collaborators?: number;
  hasNewUpdates?: boolean;
  aiInsights?: string[];
  language?: 'en' | 'es' | 'fr';
}

const translations = {
  en: {
    viewPatient: 'View Patient',
    lastVisit: 'Last Visit',
    condition: 'Condition',
    status: 'Status',
    collaborating: 'collaborating now',
    newUpdates: 'new updates',
    aiInsights: 'AI Insights',
    loading: 'Loading...',
    medications: 'Medications',
    labReports: 'Lab Reports',
    consultations: 'Consultations',
    careTeam: 'Care Team',
    quickActions: 'Quick Actions',
    viewFull: 'View Full Profile',
    call: 'Call',
    message: 'Message',
    edit: 'Edit',
  },
  es: {
    viewPatient: 'Ver Paciente',
    lastVisit: 'Última Visita',
    condition: 'Condición',
    status: 'Estado',
    collaborating: 'colaborando ahora',
    newUpdates: 'nuevas actualizaciones',
    aiInsights: 'IA Insights',
    loading: 'Cargando...',
    medications: 'Medicamentos',
    labReports: 'Informes de Laboratorio',
    consultations: 'Consultas',
    careTeam: 'Equipo de Atención',
    quickActions: 'Acciones Rápidas',
    viewFull: 'Ver Perfil Completo',
    call: 'Llamar',
    message: 'Mensaje',
    edit: 'Editar',
  },
  fr: {
    viewPatient: 'Voir Patient',
    lastVisit: 'Dernière Visite',
    condition: 'État',
    status: 'Statut',
    collaborating: 'collaborent maintenant',
    newUpdates: 'nouvelles mises à jour',
    aiInsights: 'IA Aperçus',
    loading: 'Chargement...',
    medications: 'Médicaments',
    labReports: 'Rapports de Laboratoire',
    consultations: 'Consultations',
    careTeam: 'Équipe Soignante',
    quickActions: 'Actions Rapides',
    viewFull: 'Voir Profil Complet',
    call: 'Appeler',
    message: 'Message',
    edit: 'Modifier',
  },
};

const ViewPatientButton: React.FC<ViewPatientButtonProps> = ({
  patient,
  onClick,
  collaborators = 0,
  hasNewUpdates = false,
  aiInsights = [],
  language = 'en',
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[language];

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const handleFullProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    onClick();
  };

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    loading: {
      scale: 1,
      opacity: 0.8,
    },
  };

  const popupVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 10
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  const statusColors = {
    'Stable': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Follow-Up Needed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Recovering': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={isLoading ? "loading" : "initial"}
        onClick={handleClick}
        disabled={isLoading}
        className={`
          relative overflow-hidden
          px-4 py-2 rounded-lg
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white font-medium
          shadow-md hover:shadow-lg
          transition-shadow duration-200
          flex items-center justify-center
          min-w-[140px]
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
        `}
      >
        <Eye className="w-4 h-4 mr-2" />
        {t.viewPatient}
      </motion.button>

      {/* Enhanced Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 w-[480px] bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopup(false);
                }}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={20} />
              </motion.button>

              <div className="flex items-start">
                <div className="relative mr-4">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700"
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                    statusColors[patient.status]
                  }`} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {patient.id}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      statusColors[patient.status]
                    }`}>
                      {patient.status}
                    </span>
                    {hasNewUpdates && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                        New Updates
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${patient.contactNumber}`;
                    }}
                  >
                    <Phone size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${patient.email}`;
                    }}
                  >
                    <Mail size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    <Edit size={18} />
                  </motion.button>
                </div>

                <div className="flex items-center space-x-2">
                  {collaborators > 0 && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Users size={14} className="mr-1" />
                      {collaborators} active
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm">
                  <User size={14} className="mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {patient.age} yrs, {patient.gender}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Activity size={14} className="mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {patient.condition}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Last visit: {format(new Date(patient.lastVisit), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Stethoscope size={14} className="mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {patient.doctor}
                  </span>
                </div>
              </div>

              {/* AI Insights */}
              {aiInsights.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Wand2 size={16} className="mr-2" />
                    {t.aiInsights}
                  </h4>
                  <div className="bg-secondary-50 dark:bg-secondary-900/30 rounded-lg p-3 space-y-2">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <AlertCircle size={14} className="mr-2 mt-0.5 text-secondary-500" />
                        <span className="text-secondary-800 dark:text-secondary-200">
                          {insight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFullProfileClick}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center"
              >
                {t.viewFull}
                <ChevronRight size={16} className="ml-1" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicators */}
      {collaborators > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
        >
          <Users className="w-3 h-3 mr-1" />
          {collaborators}
        </motion.div>
      )}

      {hasNewUpdates && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          <span className="sr-only">New updates available</span>
        </motion.div>
      )}

      {aiInsights.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-2 -right-2 bg-secondary-500 text-white text-xs p-1 rounded-full"
        >
          <Wand2 className="w-3 h-3" />
        </motion.div>
      )}
    </div>
  );
};

export default ViewPatientButton;