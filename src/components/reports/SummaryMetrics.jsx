import MetricCard from '../common/MetricCard';
import { reportsData } from '../../data/reportsData';

const SummaryMetrics = () => {
  const { summaryMetrics } = reportsData;

  const metrics = [
    {
      label: 'VAT Collected',
      value: summaryMetrics.currentPeriod.vatCollected,
      change: summaryMetrics.currentPeriod.change.vatCollected,
      icon: 'DollarSign',
      isCurrency: true,
    },
    {
      label: 'VAT Paid',
      value: summaryMetrics.currentPeriod.vatPaid,
      change: summaryMetrics.currentPeriod.change.vatPaid,
      icon: 'CreditCard',
      isCurrency: true,
    },
    {
      label: 'Net VAT Payable',
      value: summaryMetrics.currentPeriod.netVat,
      change: summaryMetrics.currentPeriod.change.netVat,
      icon: 'TrendingUp',
      isCurrency: true,
    },
    {
      label: 'Total Transactions',
      value: summaryMetrics.currentPeriod.transactions,
      change: summaryMetrics.currentPeriod.change.transactions,
      icon: 'Receipt',
      isCurrency: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.label} metric={metric} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default SummaryMetrics;