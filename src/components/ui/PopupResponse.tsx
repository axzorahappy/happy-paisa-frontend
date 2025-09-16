import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PopupResponseProps {
  message: string;
  emoji: string;
  onClose: () => void;
}

export const PopupResponse: React.FC<PopupResponseProps> = ({ message, emoji, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.7, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-gradient-to-br from-purple-800/80 to-blue-900/80 border border-white/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
        >
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
          <motion.div 
            className="text-7xl mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 10 }}
          >
            {emoji}
          </motion.div>
          <p className="text-lg text-white font-medium">{message}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
