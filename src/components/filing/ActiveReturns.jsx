import ReturnCard from './ReturnCard';
import { filingData } from '../../data/filingData';

const ActiveReturns = () => {
  const { activeReturns } = filingData;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Active VAT Returns</h2>
        <select className="glass-button">
          <option>Sort by: Due Date</option>
          <option>Sort by: Country</option>
          <option>Sort by: Status</option>
        </select>
      </div>

      <div className="space-y-6">
        {activeReturns.map((returnItem, index) => (
          <ReturnCard 
            key={returnItem.id} 
            returnData={returnItem} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveReturns;