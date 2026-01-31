import { useNavigate } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import BudgetOverview from './components/BudgetOverview';
import FinancialStatsGrid from './components/FinancialStatsGrid';
import RecentActivity from './components/RecentActivity';
import TopSpendingCategories from './components/TopSpendingCategories';
import useUserData from './hooks/useUserData';
import { useDashboardData } from './hooks/useDashboardData';
import { 
  DashboardSkeleton,
  BudgetOverviewSkeleton,
  StatsCardSkeleton,
  RecentActivitySkeleton,
  CategoryChartSkeleton 
} from '../common/Skeletons';

const DashboardContent = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const { userName } = useUserData();

  // Unified data source
  const { 
    budget, 
    stats,
    transactions, 
    isLoading, 
    error 
  } = useDashboardData();

  // Helper Navigation Handlers
  const handleQuickAdd = () => {
    if (setActiveTab) setActiveTab("expenses");
    else navigate('/dashboard/expenses');
  };

  const handleViewAllExpenses = () => {
    if (setActiveTab) setActiveTab("expenses");
    else navigate('/dashboard/expenses');
  };

  const handleViewAnalytics = () => {
    if (setActiveTab) setActiveTab("analytics");
    else navigate('/dashboard/analytics');
  };

  // ✅ Check if we have any data at all
  const hasAnyData = budget || stats || (transactions?.current && transactions.current.length > 0);
  
  // ✅ Only show error if we have an error AND no data AND not loading
  const shouldShowError = error && !hasAnyData && !isLoading;

  // Show full skeleton only when loading AND data has never been fetched
  const isInitialLoad = isLoading && budget === null && stats === null && transactions.current === null;
  
  if (isInitialLoad) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section - Static content, no skeleton needed */}
      <WelcomeSection
        userName={userName}
        onQuickAdd={handleQuickAdd}
        onViewAllExpenses={handleViewAllExpenses}
      />

      {/* Budget Overview - Show skeleton only if loading AND data is null (never fetched) */}
      {isLoading && budget === null ? (
        <BudgetOverviewSkeleton />
      ) : (
        <BudgetOverview budgetData={budget} />
      )}

      {/* Financial Stats Grid - Show skeleton only if loading AND data is null */}
      {isLoading && stats === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <FinancialStatsGrid stats={stats || []} onViewAnalytics={handleViewAnalytics} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity - Show skeleton only if loading AND data is null */}
        {isLoading && transactions.current === null ? (
          <RecentActivitySkeleton />
        ) : (
          <RecentActivity
            weeklyTransactions={transactions.current || []}
            onViewAllExpenses={handleViewAllExpenses}
            onAddExpense={handleQuickAdd}
          />
        )}

        {/* Top Spending Categories - Show skeleton only if loading AND data is null */}
        {isLoading && transactions.current === null ? (
          <CategoryChartSkeleton />
        ) : (
          <TopSpendingCategories
            transactions={transactions.current || []}
            onViewAnalytics={handleViewAnalytics}
          />
        )}
      </div>

      {/* Error Feedback - Only show if there's a critical error AND no data */}
      {shouldShowError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-200">
              !
            </div>
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">Connection Issue</p>
              <p className="text-red-600 dark:text-red-300 text-sm">
                Unable to load dashboard data. Please check your connection and try again.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;