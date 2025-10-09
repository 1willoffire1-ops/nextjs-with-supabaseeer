import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'default'
  | 'outline'
  | 'high-priority'
  | 'medium-priority'
  | 'active'
  | 'pending'
  | 'overdue'
  | 'connected'
  | 'disconnected'
  | 'limited';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  default: 'bg-slate-700/50 text-slate-300 border-slate-600',
  outline: 'bg-transparent text-slate-300 border-slate-600',
  'high-priority': 'bg-red-500/20 text-red-300 border-red-500/40',
  'medium-priority': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  active: 'bg-green-500/20 text-green-300 border-green-500/40',
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  overdue: 'bg-red-500/20 text-red-300 border-red-500/40',
  connected: 'bg-green-500/20 text-green-300 border-green-500/40',
  disconnected: 'bg-red-500/20 text-red-300 border-red-500/40',
  limited: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
