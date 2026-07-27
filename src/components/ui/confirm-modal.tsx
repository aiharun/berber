import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: 'danger' | 'success' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'warning',
  confirmText = 'Onayla',
  cancelText = 'İptal',
  showCancelButton = true
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div key="modal-wrapper" className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Background Overlay */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          
          {/* Modal Box */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden w-full max-w-md relative z-10 mx-4"
          >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    type === 'danger' ? 'bg-red-50 text-red-600' :
                    type === 'success' ? 'bg-green-50 text-green-600' :
                    'bg-gold-500/10 text-gold-600'
                  }`}>
                    {type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <button onClick={onClose} className="text-muted-foreground hover:bg-secondary p-2 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground font-medium mb-8">
                  {description}
                </p>
                
                <div className="flex justify-end space-x-3">
                  {cancelText !== '' && (
                    <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold px-6">
                      {cancelText}
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`rounded-xl font-bold px-6 ${
                      type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      'bg-gold-500 hover:bg-gold-600 text-white'
                    }`}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
