import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { filingData } from '../../data/filingData';

const FilingHistory = () => {
  const { filingHistory } = filingData;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Filing History</h2>
        <div className="flex gap-3">
          <select className="glass-button">
            <option>All time</option>
            <option>This year</option>
            <option>Last 12 months</option>
          </select>
          <Button variant="glass">
            <Icons.Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Filed Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filingHistory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-gray-800 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-white font-medium">
                      {item.reference}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.flag}</span>
                      <span className="text-white">{item.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {item.periodLabel}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {item.filedDate}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    {item.amountFormatted}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-primary hover:text-primary-light p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Icons.Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-primary hover:text-primary-light p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Icons.Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-white p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="More"
                      >
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            Showing 1 to {filingHistory.length} of {filingHistory.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" disabled>
              <Icons.ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button variant="glass" size="sm" disabled>
              Next
              <Icons.ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default FilingHistory;