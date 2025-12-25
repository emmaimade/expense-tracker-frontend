import LoadingOverlay from '../common/LoadingOverlay';
import WelcomeSection from './components/WelcomeSection';
import BudgetOverview from './components/BudgetOverview';
import FinancialStatsGrid from './components/FinancialStatsGrid';
import RecentActivity from './components/RecentActivity';
import TopSpendingCategories from './components/TopSpendingCategories';
import useWeeklyTransactions from './hooks/useWeeklyTransactions';
import useUserData from './hooks/useUserData';
import { useDashboardData } from './hooks/useDashboardData';

const DashboardContent = ({
  setActiveTab,
  onDataChange 
}) => {
  const { userName } = useUserData();

  const {
    weeklyTransactions,
    loading: weeklyLoading,
    fallbackUsed,
  } = useWeeklyTransactions();

  const { 
    budget, 
    stats,
    transactions, 
    isLoading: dashboardLoading, 
    error: dashboardError 
  } = useDashboardData();

  // Combine loading states
  const overallLoading = weeklyLoading || dashboardLoading;

  const handleQuickAdd = () => {
    if (setActiveTab) {
      setActiveTab("expenses");
    }
  };

  const handleViewAllExpenses = () => {
    if (setActiveTab) {
      setActiveTab("expenses");
    }
  };

  const handleViewAnalytics = () => {
    console.log("View Analytics clicked");
    if (setActiveTab) {
      setActiveTab("analytics");
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      {overallLoading && <LoadingOverlay />}

      {/* Welcome Section */}
      <WelcomeSection
        userName={userName}
        onQuickAdd={handleQuickAdd}
        onViewAllExpenses={handleViewAllExpenses}
      />

      {/* Budget Overview */}
      <BudgetOverview budgetData={budget} />

      {/* Financial Stats Grid */}
      <FinancialStatsGrid stats={stats} onViewAnalytics={handleViewAnalytics} />

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity
          weeklyTransactions={weeklyTransactions}
          onViewAllExpenses={handleViewAllExpenses}
          onAddExpense={handleQuickAdd}
          fallbackUsed={fallbackUsed}
        />

        {/* Top Spending Categories */}
        <TopSpendingCategories
          transactions={transactions.current}
          onViewAnalytics={handleViewAnalytics}
        />
      </div>
    </div>
  );
};

export default DashboardContent;