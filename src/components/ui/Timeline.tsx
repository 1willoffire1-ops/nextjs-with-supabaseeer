import React from 'react';

export interface TimelineItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  icon?: React.ReactNode;
  avatar?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          {/* Avatar/Icon */}
          <div className="flex-shrink-0">
            {item.avatar ? (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium border border-slate-600">
                {item.avatar}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-600">
                {item.icon || '📄'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-slate-200">{item.user}</span>
                </p>
                <p className="text-sm text-slate-400 mt-0.5">{item.action}</p>
              </div>
              <time className="text-xs text-slate-500 flex-shrink-0">
                {item.timestamp}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
