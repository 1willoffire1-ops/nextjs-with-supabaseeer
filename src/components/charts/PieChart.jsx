import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../utils/reportHelpers';

const PieChart = ({ data, colors }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4">
          <p className="text-white font-semibold mb-2">{data.rate}</p>
          <p className="text-sm text-gray-300">
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-gray-300">
            Percentage: {formatPercentage(data.percentage, 1)}
          </p>
          <p className="text-sm text-gray-300">
            Transactions: {data.transactions.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show labels for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={CustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="percentage"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index] || entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#94A3B8', fontSize: '12px' }}
          iconType="circle"
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>
              {value}
            </span>
          )}
        />
      </RechartsPie>
    </ResponsiveContainer>
  );
};

export default PieChart;