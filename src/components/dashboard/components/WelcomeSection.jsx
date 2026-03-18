import { Plus, ArrowRight } from 'lucide-react';

const WelcomeSection = ({ userName, onQuickAdd, onViewAllExpenses, isFirstLogin = false }) => {
  const firstName = (userName || '').trim().split(' ')[0];
  const welcomeText = isFirstLogin ? 'Welcome' : 'Welcome back';

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 sm:p-8 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-2">
        {welcomeText}{firstName ? ` ${firstName}` : ''}!
      </h1>
      <p className="text-indigo-100">
        Here's your financial overview for today
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onQuickAdd}
          className="w-full sm:w-auto bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Quick Add Expense
        </button>
        <button 
          onClick={onViewAllExpenses}
          className="w-full sm:w-auto bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors font-medium"
        >
          View All Expenses
          <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
