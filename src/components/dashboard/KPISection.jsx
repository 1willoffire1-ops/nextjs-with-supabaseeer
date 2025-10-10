import StatCard from '../common/StatCard';

const KPISection = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <StatCard 
          key={kpi.id} 
          stat={kpi} 
          delay={index * 0.1} 
        />
      ))}
    </div>
  );
};

export default KPISection;