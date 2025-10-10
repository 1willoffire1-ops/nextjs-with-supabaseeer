import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { reportsData } from '../../data/reportsData';
import { formatCurrency } from '../../utils/reportHelpers';

const TransactionTable = () => {
  const { transactions } = reportsData;
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <Icons.ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    return sortDirection === 'asc' 
      ? <Icons.ChevronUp className="w-4 h-4 text-primary" />
      : <Icons.ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Transaction Details
            </h3>
            <p className="text-sm text-gray-400">
              Recent transactions with VAT breakdown
            </p>
          </div>
          <Button variant="glass" size="sm">
            <Icons.Filter className="w-4 h-4" />
            Advanced Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/5 border-b border-primary/20">
            <tr>
              <th 
                onClick={() => handleSort('id')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Transaction ID
                  <SortIcon column="id" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('date')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Party
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th 
                onClick={() => handleSort('amount')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                VAT Rate
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                VAT Amount
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
            {transactions.map((txn, index) => (
              <motion.tr
                key={txn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-gray-800 hover:bg-primary/5 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono text-primary">
                  {txn.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {txn.date}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    txn.type === 'Sale' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {txn.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {txn.customer || txn.supplier}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {txn.country}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-white">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {txn.vatRate}%
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-primary">
                  {formatCurrency(txn.vatAmount)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={txn.status} />
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
          Showing 1 to {transactions.length} of {transactions.length} entries
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
  );
};

export default TransactionTable;