import StatCard from '../../common/StatCard';
import SectionLink from './SectionLink';

const FinancialStatsGrid = ({ stats = [], onViewAnalytics }) => {
  // The featured stat (Financial health) gets its own full-width row
  const coreStats = stats.filter((stat) => !stat.featured);
  const featuredStat = stats.find((stat) => stat.featured) || null;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Financial Overview
        </h2>
        <SectionLink onClick={onViewAnalytics}>View analytics</SectionLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coreStats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {featuredStat && (
        <div className="mt-6">
          <StatCard stat={featuredStat} isFeatured={true} />
        </div>
      )}
    </div>
  );
};

export default FinancialStatsGrid;
