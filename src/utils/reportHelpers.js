export const formatCurrency = (value, currency = 'EUR') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-GB').format(value);
};

export const getDateRangePresets = () => {
  const today = new Date();
  
  return {
    'today': {
      label: 'Today',
      start: new Date(today.setHours(0, 0, 0, 0)),
      end: new Date(today.setHours(23, 59, 59, 999)),
    },
    'yesterday': {
      label: 'Yesterday',
      start: new Date(new Date().setDate(today.getDate() - 1)),
      end: new Date(new Date().setDate(today.getDate() - 1)),
    },
    'last-7-days': {
      label: 'Last 7 Days',
      start: new Date(new Date().setDate(today.getDate() - 7)),
      end: new Date(),
    },
    'last-30-days': {
      label: 'Last 30 Days',
      start: new Date(new Date().setDate(today.getDate() - 30)),
      end: new Date(),
    },
    'last-3-months': {
      label: 'Last 3 Months',
      start: new Date(new Date().setMonth(today.getMonth() - 3)),
      end: new Date(),
    },
    'last-6-months': {
      label: 'Last 6 Months',
      start: new Date(new Date().setMonth(today.getMonth() - 6)),
      end: new Date(),
    },
    'last-12-months': {
      label: 'Last 12 Months',
      start: new Date(new Date().setMonth(today.getMonth() - 12)),
      end: new Date(),
    },
    'this-year': {
      label: 'This Year',
      start: new Date(today.getFullYear(), 0, 1),
      end: new Date(),
    },
    'last-year': {
      label: 'Last Year',
      start: new Date(today.getFullYear() - 1, 0, 1),
      end: new Date(today.getFullYear() - 1, 11, 31),
    },
  };
};

export const calculateGrowth = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

export const getColorByValue = (value) => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
};

export const getTrendIcon = (trend) => {
  return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
};