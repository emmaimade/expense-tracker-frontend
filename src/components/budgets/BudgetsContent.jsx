import { useBudget } from './hooks/useBudget';
import BudgetHeader from './components/BudgetHeader';
import BudgetOverview from './components/BudgetOverview';
import BudgetStats from './components/BudgetStats';
import CategoryBudgetsSection from './components/CategoryBudgetsSection';
import BudgetAlertsSection from './components/BudgetAlertsSection';
import SmartInsights from './components/SmartInsights';
import BudgetTips from './components/BudgetTips';
import {
  BudgetPageSkeleton,
  BudgetOverviewSkeleton,
  BudgetStatsSkeleton,
  CategoryBudgetsSkeleton
} from '../common/AnalyticsSkeletons';

const BudgetsContent = ({ recentTransactions = [] }) => {
  const {
    loading,
    categoryBudgets,
    budgetAlerts,
    isEditingCategory,
    editingCategoryId,
    tempCategoryBudget,
    setTempCategoryBudget,
    setIsEditingCategory,
    setEditingCategoryId,
    handleSaveCategoryBudget,
    handleAddCategory,
    handleDeleteBudget,
    calculations,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    categories,
  } = useBudget(recentTransactions);

  // Show full page skeleton on initial load
  if (loading && !calculations) {
    return <BudgetPageSkeleton />;
  }

  const {
    totalBudget,
    spent,
    remaining,
    percentageUsed,
    isOverBudget,
    currentDay,
    daysInMonth,
    dailyAverage,
    projectedSpending,
    daysRemaining,
    categorySpending,
  } = calculations || {};

  return (
    <div className="space-y-6">
      {/* Header - No skeleton needed (static content) */}
      <BudgetHeader />

      {/* Budget Overview with granular skeleton */}
      {loading && !totalBudget ? (
        <BudgetOverviewSkeleton />
      ) : (
        <BudgetOverview
          totalBudget={totalBudget}
          remaining={remaining}
          isOverBudget={isOverBudget}
          daysRemaining={daysRemaining}
          spent={spent}
          percentageUsed={percentageUsed}
        />
      )}

      {/* Quick Stats with granular skeleton */}
      {loading && !dailyAverage ? (
        <BudgetStatsSkeleton />
      ) : (
        <BudgetStats
          dailyAverage={dailyAverage}
          currentDay={currentDay}
          projectedSpending={projectedSpending}
          totalBudget={totalBudget}
          percentageUsed={percentageUsed}
          isOverBudget={isOverBudget}
        />
      )}

      {/* Category Budgets with granular skeleton */}
      {loading && !categoryBudgets ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <CategoryBudgetsSection
          categoryBudgets={categoryBudgets}
          categorySpending={categorySpending}
          showAddCategory={showAddCategory}
          setShowAddCategory={setShowAddCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categories={categories}
          handleAddCategory={handleAddCategory}
          isEditingCategory={isEditingCategory}
          editingCategoryId={editingCategoryId}
          tempCategoryBudget={tempCategoryBudget}
          setTempCategoryBudget={setTempCategoryBudget}
          setIsEditingCategory={setIsEditingCategory}
          setEditingCategoryId={setEditingCategoryId}
          handleSaveCategoryBudget={handleSaveCategoryBudget}
          handleDeleteBudget={handleDeleteBudget}
        />
      )}

      {/* Budget Alerts - Show only when data is loaded and alerts exist */}
      {!loading && budgetAlerts && budgetAlerts.length > 0 && (
        <BudgetAlertsSection budgetAlerts={budgetAlerts} />
      )}

      {/* Smart Insights - Show only when data is loaded and budgets exist */}
      {!loading && categoryBudgets && categoryBudgets.length > 0 && (
        <SmartInsights
          projectedSpending={projectedSpending}
          totalBudget={totalBudget}
          dailyAverage={dailyAverage}
          daysInMonth={daysInMonth}
          percentageUsed={percentageUsed}
          isOverBudget={isOverBudget}
          remaining={remaining}
        />
      )}

      {/* Budget Tips - Always show (static content) */}
      <BudgetTips />
    </div>
  );
};

export default BudgetsContent;