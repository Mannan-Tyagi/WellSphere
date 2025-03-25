import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '.';

interface ThemeToggleProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none overflow-hidden relative"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'dark' ? 0 : 100,
          opacity: theme === 'dark' ? 0 : 0.15
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-yellow-400 rounded-full"
        style={{ transformOrigin: 'center' }}
      />
      
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'light' ? 0 : 100,
          opacity: theme === 'light' ? 0 : 0.1
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-blue-900 rounded-full"
        style={{ transformOrigin: 'center' }}
      />
    </motion.button>
  );
};

export default ThemeToggle;