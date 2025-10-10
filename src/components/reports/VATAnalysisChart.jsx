import { useState } from 'react';
import GlassCard from '../common/GlassCard';
import LineChart from '../charts/LineChart';
import { reportsData } from '../../data/reportsData';

const VATAnalysisChart = () => {
  const { vatAnalysis } = reportsData;
  const [chartType, setChartType] = useState('line');

  const dataKeys = [
    { dataKey: 'outputVAT', name: 'Output VAT' },
    { dataKey: 'inputVAT', name: 'Input VAT' },
    { dataKey: 'netVAT', name: 'Net VAT' },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            VAT Analysis Over Time
          </h3>
          <p className="text-sm text-gray-400">
            Monthly breakdown of VAT activity
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="glass-button text-sm"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>

      <div className="h-96">
        <LineChart 
          data={vatAnalysis.monthly} 
          dataKeys={dataKeys}
          colors={['#00D9B4', '#14F195', '#00BFA6']}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Avg Output VAT</div>
          <div className="text-xl font-bold text-primary">
            €{(vatAnalysis.monthly.reduce((sum, m) => sum + m.outputVAT, 0) / vatAnalysis.monthly.length / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Avg Input VAT</div>
          <div className="text-xl font-bold text-primary-light">
            €{(vatAnalysis.monthly.reduce((sum, m) => sum + m.inputVAT, 0) / vatAnalysis.monthly.length / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Avg Net VAT</div>
          <div className="text-xl font-bold gradient-text">
            €{(vatAnalysis.monthly.reduce((sum, m) => sum + m.netVAT, 0) / vatAnalysis.monthly.length / 1000).toFixed(0)}K
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default VATAnalysisChart;