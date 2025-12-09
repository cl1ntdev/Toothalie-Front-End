import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const alertConfig = {
  success: {
    icon: CheckCircle2,
    styles: "bg-emerald-50 border-emerald-100 text-emerald-800",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    styles: "bg-rose-50 border-rose-100 text-rose-800",
    iconColor: "text-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    styles: "bg-amber-50 border-amber-100 text-amber-800",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    styles: "bg-blue-50 border-blue-100 text-blue-800",
    iconColor: "text-blue-500",
  },
};

export default function Alert({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message, 
  autoClose = true,
  duration = 4000 
}) {
  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto relative flex items-start gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${config.styles}`}
          >
            {/* Icon */}
            <div className={`mt-0.5 p-1.5 bg-white rounded-full shadow-sm ${config.iconColor}`}>
              <Icon size={18} strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
              <p className="text-sm opacity-90 leading-relaxed font-medium">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} className="opacity-60" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}