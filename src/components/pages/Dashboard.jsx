import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { useDashboardData } from '../dashboard/hooks/useDashboardData';
import Sidebar from '../layout/SideBar';
import DashboardContent from '../dashboard/DashboardContent';
import ExpensesContent from '../expenses/ExpensesContent';
import AnalyticsContent from '../analytics/AnalyticsContent';
import BudgetsContent from '../budgets/BudgetsContent';
import SettingsContent from '../settings/SettingsContent';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    user,
    userId,
    isSidebarOpen,
    setIsSidebarOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    currentDateTime,
    initials,
    dropdownRef,
    handleLogout,
  } = useDashboard();

  const { 
    transactions, 
    isLoading: isDataLoading,
    refreshData
  } = useDashboardData();

  if (!user) return null;

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/dashboard/expenses')) return 'expenses';
    if (path.startsWith('/dashboard/analytics')) return 'analytics';
    if (path.startsWith('/dashboard/budgets')) return 'budgets';
    if (path.startsWith('/dashboard/settings')) return 'settings';
    return 'dashboard';
  };

  const titles = {
    '/dashboard': 'Overview',
    '/dashboard/expenses': 'Transactions & Expenses',
    '/dashboard/analytics': 'Spend Analysis',
    '/dashboard/budgets': 'Budget Tracking',
    '/dashboard/settings': 'Settings'
  };

  const currentTitle = titles[location.pathname] || "Dashboard";

  // ✅ FIX: Safely handle transactions.current - convert undefined to null
  const currentTransactions = transactions?.current ?? null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={getActiveTab()}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {currentTitle}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentDateTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900/50">
          <Routes>
            <Route index element={<DashboardContent onDataChange={refreshData} />} />
            
            <Route
              path="expenses"
              element={
                <ExpensesContent 
                  recentTransactions={currentTransactions} // ✅ FIX: Pass null instead of undefined
                  userId={userId}
                  onDataChange={refreshData}
                />
              }
            />

            <Route
              path="analytics"
              element={
                <AnalyticsContent
                  recentTransactions={currentTransactions} // ✅ FIX: Pass null instead of undefined
                />
              }
            />

            <Route
              path="budgets"
              element={
                <BudgetsContent 
                  recentTransactions={currentTransactions} // ✅ FIX: Pass null instead of undefined
                  onDataChange={refreshData}
                  userId={userId}
                />
              }
            />

            <Route
              path="settings"
              element={<SettingsContent userId={userId} onDataChange={refreshData} />}
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;