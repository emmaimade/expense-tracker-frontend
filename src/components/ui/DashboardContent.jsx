import { Plus, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import StatCard from './StatCard';

const DashboardContent = ({ 
  stats = [],  
  totalSpentThisMonth, 
  setActiveTab,
  onDataChange 
}) => {
  const [userName, setUserName] = useState('');
  const [weeklyTransactions, setWeeklyTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const budgetLimit = 4000;
  const budgetPercentage = (parseFloat(totalSpentThisMonth || '0') / budgetLimit) * 100;
  const remainingBudget = budgetLimit - parseFloat(totalSpentThisMonth || '0');
  const isOverBudget = budgetPercentage > 100;

  // Get user info from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setUserName(user.name);
        }
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);

  // Fetch weekly transactions for Recent Activity
  useEffect(() => {
    const fetchWeeklyTransactions = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('No auth token found for weekly transactions');
        setWeeklyTransactions([]);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching weekly transactions...');
        
        const response = await fetch('https://expense-tracker-api-hvss.onrender.com/expense/weekly', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Weekly transactions response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch weekly transactions: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weekly transactions data:', data);

        let transformedData = [];
        
        if (typeof data.expenses === "object" && data.expenses !== null) {
          if (data.expenses.length > 0) {
            transformedData = Object.values(data.expenses).map(tx => ({
              id: tx._id,
              name: tx.description || tx.name,
              category: tx.category,
              amount: tx.amount,
              date: tx.date,
              type: tx.type || 'expense'
            }));
            setWeeklyTransactions(transformedData);
          }
        }
      } catch (error) {
        console.error('Error fetching weekly transactions:', error);
        setWeeklyTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyTransactions();
  }, []);

  // Ensure weeklyTransactions is always an array before using array methods
  const safeWeeklyTransactions = Array.isArray(weeklyTransactions) ? weeklyTransactions : [];

  console.log('Weekly Transactions:', safeWeeklyTransactions);
  // Calculate recent activity metrics from weekly transactions with safety checks
  const lastExpense = safeWeeklyTransactions
    .filter(tx => tx && tx.type === 'expense')
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0] || { name: 'N/A', amount: 0 };
  

  const largestExpense = safeWeeklyTransactions
    .filter(tx => tx && tx.type === 'expense')
    .reduce((max, tx) => {
      const maxAmount = Math.abs(max.amount || 0);
      const txAmount = Math.abs(tx.amount || 0);
      return txAmount > maxAmount ? tx : max;
    }, { name: 'N/A', amount: 0 });

  const mostFrequentCategory = (() => {
    try {
      const categoryCount = safeWeeklyTransactions
        .filter(tx => tx && tx.type === 'expense' && tx.category)
        .reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + 1;
          return acc;
        }, {});

      const sortedCategories = Object.entries(categoryCount)
        .sort(([, a], [, b]) => b - a);

      return sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';
    } catch (error) {
      console.error('Error calculating most frequent category:', error);
      return 'N/A';
    }
  })();

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

// console.log("recentTransactions:", recentTransactions);
  return (
    <div className="space-y-6">
      {/* Loading indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 text-sm">Loading data...</span>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back {userName && `${userName.split(" ")[0]}`}!
        </h1>
        <p className="text-indigo-100">
          Here's your financial overview for today
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleQuickAdd}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Quick Add Expense
          </button>
          <button 
            onClick={handleViewAllExpenses}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors font-medium"
          >
            View All Expenses
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Spending Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
            <div
              className={`p-2 rounded-lg ${
                isOverBudget ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {isOverBudget ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${
              isOverBudget ? "text-red-600" : "text-gray-900"
            }`}
          >
            ${totalSpentThisMonth}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total spent •{" "}
            {isOverBudget
              ? "Over budget"
              : `$${remainingBudget.toFixed(2)} remaining`}
          </p>
        </div>

        {/* Budget Progress */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Monthly Budget Progress
            </h3>
            <span className="text-sm text-gray-600">
              ${totalSpentThisMonth} / ${budgetLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : budgetPercentage > 80
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600"
              }`}
              style={{
                width: `${Math.min(budgetPercentage, 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <p
              className={`text-sm font-medium ${
                isOverBudget
                  ? "text-red-600"
                  : budgetPercentage > 80
                  ? "text-orange-600"
                  : "text-indigo-600"
              }`}
            >
              {budgetPercentage.toFixed(1)}% of budget used
            </p>
            {isOverBudget && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                Over Budget!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Financial Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Financial Overview
          </h2>
          <button onClick={handleViewAnalytics} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View Details →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(stats) && stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last expense</span>
              <span className="font-medium">
                {lastExpense.name} - ${Math.abs(lastExpense.amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Largest expense</span>
              <span className="font-medium">
                {largestExpense.name} - ${Math.abs(largestExpense.amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Most frequent</span>
              <span className="font-medium">{mostFrequentCategory}</span>
            </div>
          </div>
          <button 
            onClick={handleViewAllExpenses}
            className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View All Transactions →
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Goals & Targets</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Emergency Fund</span>
                <span className="font-medium">$3,200 / $5,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "64%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Vacation Fund</span>
                <span className="font-medium">$1,200 / $3,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
          </div>
          <button onClick={handleViewAnalytics} className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Manage Goals →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;