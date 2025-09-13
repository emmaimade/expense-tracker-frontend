import StatCard from '../../common/StatCard';

const FinancialStatsGrid = ({ stats = [], onViewAnalytics }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Financial Overview
        </h2>
        <button 
          onClick={onViewAnalytics} 
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          View Details →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(stats) && stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default FinancialStatsGrid;