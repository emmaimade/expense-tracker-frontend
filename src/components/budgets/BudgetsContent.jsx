import { useBudget } from './hooks/useBudget';
import BudgetHeader from './components/BudgetHeader';
import BudgetOverview from './components/BudgetOverview';
import BudgetStats from './components/BudgetStats';
import CategoryBudgetsSection from './components/CategoryBudgetsSection';
import BudgetAlertsSection from './components/BudgetAlertsSection';
import SmartInsights from './components/SmartInsights';
import BudgetTips from './components/BudgetTips';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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
  } = calculations;

  return (
    <div className="space-y-6">
      {/* Header */}
      <BudgetHeader />

      {/* Budget Overview Card */}
      <BudgetOverview
        totalBudget={totalBudget}
        remaining={remaining}
        isOverBudget={isOverBudget}
        daysRemaining={daysRemaining}
        spent={spent}
        percentageUsed={percentageUsed}
      />

      {/* Quick Stats */}
      <BudgetStats
        dailyAverage={dailyAverage}
        currentDay={currentDay}
        projectedSpending={projectedSpending}
        totalBudget={totalBudget}
        percentageUsed={percentageUsed}
        isOverBudget={isOverBudget}
      />

      {/* Category Budgets */}
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

      {/* Budget Alerts */}
      <BudgetAlertsSection budgetAlerts={budgetAlerts} />

      {/* Smart Insights */}
      <SmartInsights
        projectedSpending={projectedSpending}
        totalBudget={totalBudget}
        dailyAverage={dailyAverage}
        daysInMonth={daysInMonth}
        percentageUsed={percentageUsed}
        isOverBudget={isOverBudget}
        remaining={remaining}
      />

      {/* Budget Tips */}
      <BudgetTips />
    </div>
  );
};

export default BudgetsContent;