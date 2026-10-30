import StatCard from '../../common/StatCard';

const FinancialStatsGrid = ({ stats = [], onViewAnalytics }) => {
  // The featured stat (Financial Health Score) gets its own full-width row
  const coreStats = stats.filter((stat) => !stat.featured);
  const featuredStat = stats.find((stat) => stat.featured) || null;

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Financial Overview
        </h2>
        <button 
          onClick={onViewAnalytics} 
          className="hidden sm:inline-flex text-indigo-600 hover:text-indigo-700 text-sm font-medium text-left sm:text-right"
        >
          View Details →
        </button>
      </div>
      
      {/* 1. Main Grid for the core stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <button
        onClick={onViewAnalytics}
        className="sm:hidden w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium text-left dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        View Details →
      </button>
    </div>
  );
};

export default FinancialStatsGrid;
