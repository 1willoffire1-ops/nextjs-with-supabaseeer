import { getStatusColor, getStatusLabel } from '../../utils/filingHelpers';

const StatusBadge = ({ status, className = '' }) => {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
      ${colors.bg} ${colors.text} border ${colors.border}
      ${status === 'ready' ? 'animate-pulse' : ''}
      ${className}
    `}>
      {status === 'ready' && (
        <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;