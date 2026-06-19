import React from 'react';
import { m as motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function AuthLoadingOverlay({ isVisible, message = "Authenticating..." }: AuthLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B192C]/95 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center max-w-[300px]"
          >
            {/* Custom 3D Logo / Spinner animation */}
            <div className="relative w-24 h-24 mb-10 perspective-1000">
              <motion.div
                animate={{ rotateY: 360, rotateX: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-full h-full preserve-3d"
              >
                <div className="absolute inset-0 border-4 border-[#febd69] rounded-2xl shadow-[0_0_30px_rgba(254,189,105,0.4)]" style={{ transform: 'translateZ(20px)' }} />
                <div className="absolute inset-0 border-4 border-red-500 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)]" style={{ transform: 'translateZ(-20px) rotate45' }} />
                <div className="absolute inset-x-0 top-1/4 bottom-1/4 border-2 border-white/50 rounded-full" style={{ transform: 'rotateX(90deg)' }} />
                <div className="absolute inset-y-0 left-1/4 right-1/4 border-2 border-white/50 rounded-full" style={{ transform: 'rotateY(90deg)' }} />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full h-full bg-slate-900/40 rounded-full blur-xl animate-pulse" />
            </div>
            
            <Logo dark={true} size="text-2xl" />

            <div className="mt-8 space-y-3 flex flex-col items-center">
              <p className="text-white font-black text-sm uppercase tracking-[0.3em] font-display animate-pulse">{message}</p>
              <div className="flex gap-1.5 justify-center">
                 <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-[#febd69] rounded-full" />
                 <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                 <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
