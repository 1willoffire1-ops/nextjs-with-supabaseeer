import React from 'react';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, { bg: string; border: string }> = {
  success: { bg: 'bg-green-500', border: 'border-green-500' },
  warning: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
  error: { bg: 'bg-red-500', border: 'border-red-500' },
  info: { bg: 'bg-blue-500', border: 'border-blue-500' },
  neutral: { bg: 'bg-slate-500', border: 'border-slate-500' },
};

const sizeStyles = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const { bg, border } = statusStyles[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`rounded-full ${bg} ${sizeStyles[size]} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
        {pulse && (
          <div
            className={`absolute inset-0 rounded-full ${border} border-2 animate-ping opacity-75`}
          />
        )}
      </div>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </div>
  );
};
