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
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
      <h3 className="text-lg font-semibold text-indigo-900 mb-4">
        💡 Budget Management Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-indigo-800">
            <span className="text-indigo-600 font-bold">•</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTips;