import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/reportHelpers';

const BarChart = ({ data, dataKeys, colors = ['#00D9B4', '#14F195'] }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 180, 0.1)" />
        <XAxis 
          dataKey="name" 
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#94A3B8"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#94A3B8' }}
          iconType="circle"
        />
        {dataKeys.map((key, index) => (
          <Bar
            key={key.dataKey}
            dataKey={key.dataKey}
            name={key.name}
            fill={colors[index] || colors[0]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChart;