import { Plus, ArrowRight } from 'lucide-react';

const WelcomeSection = ({ userName, onQuickAdd, onViewAllExpenses, isFirstLogin = false }) => {
  const firstName = (userName || '').trim().split(' ')[0];
  const welcomeText = isFirstLogin ? 'Welcome' : 'Welcome back';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
          {welcomeText}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Here's where your money stands this month
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onViewAllExpenses}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          View expenses
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
        <button
          onClick={onQuickAdd}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add expense
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
