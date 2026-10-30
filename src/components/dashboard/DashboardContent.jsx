import { useNavigate } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import BudgetOverview from './components/BudgetOverview';
import FinancialStatsGrid from './components/FinancialStatsGrid';
import RecentActivity from './components/RecentActivity';
import TopSpendingCategories from './components/TopSpendingCategories';
import useUserData from './hooks/useUserData';
import useMonthlyResetNotification from '../../hooks/useMonthlyResetNotification';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  DashboardSkeleton,
  BudgetOverviewSkeleton,
  StatsCardSkeleton,
  RecentActivitySkeleton,
  CategoryChartSkeleton 
} from '../common/Skeletons';

const DashboardContent = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const { userName, user } = useUserData();
  const isFirstLogin =
    user?.isFirstLogin === true ||
    user?.firstLogin === true ||
    user?.loginCount === 1 ||
    (user?.firstLoginAt && user?.lastLoginAt && user.firstLoginAt === user.lastLoginAt);

  // Unified data source
  const { 
    budget, 
    stats,
    transactions, 
    isLoading
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

  // Monthly reset notification
  useMonthlyResetNotification();

  // Show full skeleton only when loading AND data has never been fetched
  const isInitialLoad = isLoading && budget === null && stats === null && transactions.current === null;
  
  if (isInitialLoad) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Static content, no skeleton needed */}
      <WelcomeSection
        userName={userName}
        isFirstLogin={isFirstLogin}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

    </div>
  );
};

export default DashboardContent;
