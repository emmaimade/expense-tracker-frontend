import { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, User, LogOut, Wallet, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import DashboardContent from './ui/DashboardContent';
import ExpensesContent from './ui/ExpensesContent';
import AnalyticsContent from './ui/AnalyticsContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [initials, setInitials] = useState('JD');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalSpentThisMonth, setTotalSpentThisMonth] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to get initials from a username
  const getInitials = (username) => {
    if (!username) return 'JD';
    const nameParts = username.trim().split(' ');
    console.log(nameParts);
    if (nameParts.length === 1) {
      return username.slice(0, 2).toUpperCase();
    }
    return (
      nameParts[0][0] + 
      (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '')
    ).toUpperCase();
  };

  // Fetch username from localStorage on component mount
  useEffect(() => {
    const username = localStorage.getItem('user');
    if (username) {
      try {
        const parsedUser = JSON.parse(username);
        setInitials(getInitials(parsedUser?.name));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setInitials('JD');
      }
    }
  }, []);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("No auth token found");
      setRecentTransactions([]);
      return;
    }

    try {
      console.log("Fetching transactions...");

      const response = await fetch(
        "https://expense-tracker-api-hvss.onrender.com/expense/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Transactions response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transactions data:", data);
      console.log("type of data", typeof data);
      console.log("type of data.expenses", typeof data.expenses);

      // Transform data to match expected format
      let transformedData = [];

      if (typeof data.expenses === "object" && data.expenses !== null) {
        
        if (data.expenses.length > 0) {
          transformedData = Object.values(data.expenses).map((tx) => {
            return {
              id: tx._id || null,
              name: tx.description || "Unknown",
              category: tx.category || "Uncategorized",
              amount: tx.amount || 0,
              date: tx.date || new Date().toISOString(),
              type: tx.type || "expense",
            };
          });
        }
      } else {
        console.warn("Expenses is not an object or is null:", data.expenses);
        transformedData = [];
      }

      console.log("Transformed data:", transformedData);
      setRecentTransactions(transformedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setRecentTransactions([]);
    }
  };

  // console.log("Recent Transaction", recentTransactions);

  // Fetch total spent this month from backend
  const fetchTotalSpent = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No auth token found');
      setTotalSpentThisMonth('0.00');
      return;
    }

    try {
      console.log('Fetching monthly total...');
      
      const response = await fetch('https://expense-tracker-api-hvss.onrender.com/expense/monthly', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Monthly total response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch monthly total: ${response.status}`);
      }

      const data = await response.json();
      console.log('Monthly total data:', data);
      
      // Handle different response formats
      const total = typeof data === 'number' ? data : (data.totalExpenses || data.amount || 0);
      setTotalSpentThisMonth(parseFloat(total).toFixed(2));
    } catch (error) {
      console.error('Error fetching monthly total:', error);
      setTotalSpentThisMonth('0.00');
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
    fetchTotalSpent();
  }, []);

  // Function to refresh all data (called after successful operations)
  const refreshData = async () => {
    console.log('Refreshing dashboard data...');
    await Promise.all([fetchTransactions(), fetchTotalSpent()]);
  };

  // Debug state update
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab set to: ${tab}`);
  };

  // Mock data for dashboard - you can replace with real API data
  const stats = [
    {
      title: 'Total Balance',
      amount: '$12,847.50',
      change: '+2.5%',
      trend: 'up',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Expenses',
      amount: `$${totalSpentThisMonth}`,
      change: '-12%',
      trend: 'down',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Monthly Income',
      amount: '$5,420.00',
      change: '+8.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Savings Goal',
      amount: '$2,172.20',
      change: '68% Complete',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Calculate top spending categories
  const topCategories = Object.entries(
    recentTransactions
      .filter(tx => tx.type === 'expense' && tx.date && tx.date.startsWith('2025-08'))
      .reduce((acc, tx) => {
        const category = tx.category || 'Other';
        acc[category] = (acc[category] || 0) + Math.abs(tx.amount || 0);
        return acc;
      }, {})
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, amount]) => ({ category, amount: amount.toFixed(2) }));

  // Update date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/login', { state: { message: 'You have been logged out.' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleSetActiveTab}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize flex items-center gap-2">
                  {activeTab}
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  )}
                </h1>
                <p className="text-gray-600 text-sm">
                  {activeTab === "dashboard" &&
                    "Welcome back! Here's your financial overview"}
                  {activeTab === "expenses" && "Track and manage your expenses"}
                  {activeTab === "analytics" &&
                    "Analyze your spending patterns"}
                  {activeTab === "settings" &&
                    "Manage your account preferences"}
                </p>
              </div>
            </div>
            <div
              className="flex items-center space-x-4 relative"
              ref={dropdownRef}
            >
              <div className="text-sm text-gray-600">{currentDateTime}</div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
              >
                <span className="text-white text-sm font-medium">{initials}</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {activeTab === "dashboard" && (
            <DashboardContent
              stats={stats}
              recentTransactions={recentTransactions}
              totalSpentThisMonth={totalSpentThisMonth}
              topCategories={topCategories}
              setActiveTab={handleSetActiveTab}
              onDataChange={refreshData}
            />
          )}
          {activeTab === "expenses" && (
            <ExpensesContent
              recentTransactions={recentTransactions}
              totalSpentThisMonth={totalSpentThisMonth}
              topCategories={topCategories}
              setActiveTab={handleSetActiveTab}
              onDataChange={refreshData}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsContent 
              setActiveTab={handleSetActiveTab}
              recentTransactions={recentTransactions}
              totalSpentThisMonth={totalSpentThisMonth}
            />
          )}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Settings
              </h2>
              <p className="text-gray-600">
                Settings and preferences content would go here...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;