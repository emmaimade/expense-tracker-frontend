import Card from '../../../components/common/Card';

const BudgetTips = () => {
  const tips = [
    "Set realistic budgets for each spending category",
    "Review category spending weekly to catch overspending early",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    "Adjust category budgets based on your spending patterns",
    "Build an emergency fund equal to 3-6 months of expenses",
    "Celebrate your wins and learn from overspending",
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-800">
      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-4">
        💡 Budget Management Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-indigo-800 dark:text-indigo-300">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BudgetTips;