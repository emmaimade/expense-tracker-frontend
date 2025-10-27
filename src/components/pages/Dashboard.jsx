import { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../layout/SideBar';
import DashboardContent from '../dashboard/DashboardContent';
import ExpensesContent from '../expenses/ExpensesContent';
import AnalyticsContent from '../analytics/AnalyticsContent';
import BudgetsContent from '../budgets/BudgetsContent';
import SettingsContent from '../settings/SettingsContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId, setUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [initials, setInitials] = useState('JD');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to get initials from a username
  const getInitials = (username) => {
    if (!username) return 'JD';
    const nameParts = username.trim().split(' ');
    if (nameParts.length === 1) {
      return username.slice(0, 2).toUpperCase();
    }
    return (
      nameParts[0][0] + 
      (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '')
    ).toUpperCase();
  };

  // Fetch userId and username from localStorage on component mount
  useEffect(() => {
    const username = localStorage.getItem('user');
    if (username) {
      try {
        const parsedUser = JSON.parse(username);
        setInitials(getInitials(parsedUser?.name));

        const id = parsedUser?.id || parsedUser?._id || parsedUser?.userId || null;
        setUserId(id);

        if (!id) {
          console.warn('No userId found in localStorage user data:', parsedUser);
        }
        // Store userId in state or use directly (here, we'll pass it as a prop)
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
      setIsLoading(true);
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

      // Access expenses from data.data.expenses
      const expenses = data.data?.expenses || [];
      console.log("Raw expenses data:", expenses);
      console.log(
        "Type of expenses data:",
        typeof expenses,
        Array.isArray(expenses)
      );

      // Transform data to match expected format
      let transformedData = [];

      if (Array.isArray(expenses)) {
        transformedData = expenses.map((tx) => ({
          id: tx._id || null,
          name: tx.description || "Unknown",
          category: tx.category?.name || "Uncategorized",
          amount: tx.amount || 0,
          date: tx.date || new Date().toISOString(),
          type: tx.type || "expense",
        }));
      } else {
        console.warn("Expenses is not an array:", expenses);
        transformedData = [];
      }

      console.log(
        "✅ Transformed data:",
        transformedData.length,
        "transactions"
      );
      console.log("📋 Sample transaction:", transformedData[0]);
      setRecentTransactions(transformedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to refresh all data (called after successful operations)
  const refreshData = async (newTransactions) => {
    if (newTransactions) {
      console.log("📊 Refreshing with new transactions:", newTransactions.length);
      setRecentTransactions(newTransactions);
    } else {
      console.log("🔄 Fetching all transactions...");
      await fetchTransactions();
    }
  };

  // Debug state update
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab set to: ${tab}`);
  };

  // Calculate top spending categories for CURRENT MONTH (not hardcoded)
  const getCurrentMonthCategories = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYearMonth = `${currentYear}-${currentMonth}`;

    return Object.entries(
      recentTransactions
        .filter(tx => {
          if (tx.type !== 'expense' || !tx.date) return false;
          // Check if transaction is from current month
          const txYearMonth = tx.date.substring(0, 7); // Gets "YYYY-MM"
          return txYearMonth === currentYearMonth;
        })
        .reduce((acc, tx) => {
          const category = tx.category || 'Other';
          acc[category] = (acc[category] || 0) + Math.abs(tx.amount || 0);
          return acc;
        }, {})
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount: amount.toFixed(2) }));
  };

  const topCategories = getCurrentMonthCategories();

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
                  {activeTab === "budgets" &&
                    "Set and track your monthly budget"}
                  {activeTab === "settings" &&
                    "Manage your account preferences"}
                </p>
              </div>
            </div>
            <div
              className="flex items-center space-x-4 relative"
              ref={dropdownRef}
            >
              <div className="text-sm text-gray-600 hidden sm:block">
                {currentDateTime}
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
              >
                <span className="text-white text-sm font-medium">
                  {initials}
                </span>
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
              topCategories={topCategories}
              setActiveTab={handleSetActiveTab}
              onDataChange={refreshData}
            />
          )}
          {activeTab === "expenses" && (
            <ExpensesContent
              recentTransactions={recentTransactions}
              topCategories={topCategories}
              setActiveTab={handleSetActiveTab}
              onDataChange={refreshData}
              userId={userId}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsContent
              setActiveTab={handleSetActiveTab}
              recentTransactions={recentTransactions}
            />
          )}
          {activeTab === "budgets" && (
            <BudgetsContent recentTransactions={recentTransactions} />
          )}
          {activeTab === "settings" && (
            <SettingsContent
              setActiveTab={handleSetActiveTab}
              userId={userId}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;