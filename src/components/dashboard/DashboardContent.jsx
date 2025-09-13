import LoadingOverlay from '../common/LoadingOverlay';
import WelcomeSection from './components/WelcomeSection';
import BudgetOverview from './components/BudgetOverview';
import FinancialStatsGrid from './components/FinancialStatsGrid';
import RecentActivity from './components/RecentActivity';
import GoalsAndTargets from './components/GoalsAndTargets';
import useWeeklyTransactions from './hooks/useWeeklyTransactions';
import useUserData from './hooks/useUserData';

const DashboardContent = ({ 
  stats = [],  
  totalSpentThisMonth, 
  setActiveTab,
  onDataChange 
}) => {
  const { userName } = useUserData();
  const { weeklyTransactions, loading, fallbackUsed } = useWeeklyTransactions();

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
      {loading && <LoadingOverlay />}

      {/* Welcome Section */}
      <WelcomeSection 
        userName={userName}
        onQuickAdd={handleQuickAdd}
        onViewAllExpenses={handleViewAllExpenses}
      />

      {/* Budget Overview */}
      <BudgetOverview 
        totalSpentThisMonth={totalSpentThisMonth}
        budgetLimit={4000}
      />

      {/* Financial Stats Grid */}
      <FinancialStatsGrid 
        stats={stats}
        onViewAnalytics={handleViewAnalytics}
      />

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity 
          weeklyTransactions={weeklyTransactions}
          onViewAllExpenses={handleViewAllExpenses}
          onAddExpense={handleQuickAdd}
          fallbackUsed={fallbackUsed}
        />
        <GoalsAndTargets 
          onViewAnalytics={handleViewAnalytics}
        />
      </div>
    </div>
  );
};

export default DashboardContent;