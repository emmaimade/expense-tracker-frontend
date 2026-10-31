import { useBudget } from './hooks/useBudget';
import BudgetOverview from './components/BudgetOverview';
import CategoryBudgetsSection from './components/CategoryBudgetsSection';
import BudgetAlertsSection from './components/BudgetAlertsSection';
import BudgetTips from './components/BudgetTips';
import {
  BudgetPageSkeleton,
  BudgetOverviewSkeleton,
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

  const {
    totalBudget,
    spent,
    remaining,
    percentageUsed,
    isOverBudget,
    dailyAverage,
    projectedSpending,
    daysRemaining,
    categorySpending,
  } = calculations || {};



  // Show full page skeleton on initial load
  if (loading && !calculations) {
    return <BudgetPageSkeleton />;
  }

  return (
    <div className="space-y-6">
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
          categoryCount={categoryBudgets?.length || 0}
          dailyAverage={dailyAverage}
          projectedSpending={projectedSpending}
        />
      )}

      {/* Alerts sit right under the total: they're the most urgent thing here */}
      {!loading && <BudgetAlertsSection budgetAlerts={budgetAlerts} />}

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


      {/* Tips only for users who haven't set any budgets yet */}
      {!loading && categoryBudgets?.length === 0 && <BudgetTips />}
    </div>
  );
};

export default BudgetsContent;
