import { Plus, TrendingUp, Calendar } from 'lucide-react';

const EmptyState = ({ 
  type = 'transactions', 
  period = 'week',
  onAddExpense,
  onViewAllTime 
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'transactions':
        return {
          icon: Calendar,
          title: `No expenses this ${period}`,
          description: `You haven't recorded any expenses in the past ${period}. Great job staying budget-conscious!`,
          primaryAction: {
            label: 'Add Expense',
            onClick: onAddExpense,
            icon: Plus
          },
          secondaryAction: {
            label: 'View All Time',
            onClick: onViewAllTime
          }
        };
      case 'recent-activity':
        return {
          icon: TrendingUp,
          title: 'No recent activity',
          description: 'Start tracking your expenses to see insights here.',
          primaryAction: {
            label: 'Add First Expense',
            onClick: onAddExpense,
            icon: Plus
          }
        };
      default:
        return {
          icon: Calendar,
          title: 'No data available',
          description: 'There\'s no data to display for this period.',
          primaryAction: {
            label: 'Add Data',
            onClick: onAddExpense,
            icon: Plus
          }
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <div className="text-center py-8 px-4">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={config.primaryAction.onClick}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <config.primaryAction.icon className="w-4 h-4 mr-2" />
          {config.primaryAction.label}
        </button>
        
        {config.secondaryAction && (
          <button
            onClick={config.secondaryAction.onClick}
            className="inline-flex items-center px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            {config.secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;