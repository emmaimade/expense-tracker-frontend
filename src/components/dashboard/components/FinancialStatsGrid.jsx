import StatCard from '../../common/StatCard';

const FinancialStatsGrid = ({ stats = [], onViewAnalytics }) => {
  // Separate the first 4 core stats from the 5th (Financial Health Score)
  // for a better visual layout without changing the data source.
  const coreStats = stats.slice(0, 4);
  const featuredStat = stats.length > 4 ? stats[4] : null;

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
      
      {/* 1. Main Grid for the first 4 Core Stats (4 columns on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(coreStats) && coreStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
      
      {/* 2. Featured Grid for the Financial Health Score (full width and visually prominent) */}
      {featuredStat && (
        <div className="grid grid-cols-1 gap-6 mt-6">
          <StatCard stat={featuredStat} isFeatured={true} />
        </div>
      )}
    </div>
  );
};

export default FinancialStatsGrid;