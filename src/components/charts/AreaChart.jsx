import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/reportHelpers';

const AreaChart = ({ data, dataKey, color = '#00D9B4' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4">
          <p className="text-white font-semibold mb-2">{label}</p>
          <p className="text-sm" style={{ color }}>
            {payload[0].name}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsArea data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 180, 0.1)" />
        <XAxis 
          dataKey="quarter" 
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          fill="url(#colorGradient)"
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
};

export default AreaChart;