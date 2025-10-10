export const getStatusColor = (status) => {
  const statusColors = {
    'in-progress': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    'ready': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    'urgent': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    'submitted': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    'approved': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    'rejected': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  };
  return statusColors[status] || statusColors['in-progress'];
};

export const getStatusLabel = (status) => {
  const statusLabels = {
    'in-progress': 'In Progress',
    'ready': 'Ready to Submit',
    'urgent': 'Action Required',
    'submitted': 'Submitted',
    'approved': 'Approved',
    'rejected': 'Rejected',
  };
  return statusLabels[status] || status;
};

export const getPriorityColor = (priority) => {
  const priorityColors = {
    'critical': '#FF4757',
    'high': '#FF6B7A',
    'medium': '#FFB800',
    'low': '#94A3B8',
  };
  return priorityColors[priority] || '#94A3B8';
};

export const getDaysRemainingColor = (days) => {
  if (days < 7) return 'text-red-400';
  if (days < 14) return 'text-yellow-400';
  return 'text-green-400';
};

export const getPendingItemType = (type) => {
  const types = {
    'error': { icon: 'AlertTriangle', bg: 'bg-red-500/5', border: 'border-red-500' },
    'warning': { icon: 'AlertCircle', bg: 'bg-yellow-500/5', border: 'border-yellow-500' },
    'info': { icon: 'Info', bg: 'bg-blue-500/5', border: 'border-blue-500' },
  };
  return types[type] || types['info'];
};