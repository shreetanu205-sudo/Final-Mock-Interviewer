import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onDismiss, className = '' }) => {
  if (!message) return null;

  const config = {
    info: {
      bg: 'bg-orbit-lavender/30 border-orbit-lavender',
      text: 'text-plum',
      icon: Info,
      iconColor: 'text-orbit-purple',
    },
    success: {
      bg: 'bg-orbit-mint/40 border-orbit-mint',
      text: 'text-[#123E24]',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-orbit-peach/40 border-orbit-peach',
      text: 'text-[#4A1D0E]',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
  };

  const style = config[type] || config.info;
  const IconComponent = style.icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.text} text-sm ${className}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 font-medium leading-relaxed">{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-plum/50 hover:text-plum p-1 -mr-1 -mt-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
