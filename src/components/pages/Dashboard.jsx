import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, HelpCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDashboard } from './hooks/useDashboard';
import { useDashboardData } from '../../hooks/useDashboardData';
import { NotificationProvider, useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../notification/NotificationPanel';
import Sidebar from '../layout/SideBar';
import BottomNav from '../layout/BottomNav';
import QuickAddExpense from '../expenses/QuickAddExpense';
import DashboardContent from '../dashboard/DashboardContent';
import ExpensesContent from '../expenses/ExpensesContent';
import AnalyticsContent from '../analytics/AnalyticsContent';
import BudgetsContent from '../budgets/BudgetsContent';
import SettingsContent from '../settings/SettingsContent';
import ConnectionErrorBanner from '../common/ConnectionErrorBanner';
import EmailVerificationBanner from '../common/EmailVerificationBanner';

// Inner component that has access to notification context
const DashboardInner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const notificationRef = useRef(null);
  const { unreadCount } = useNotifications();

  const {
    user,
    userId,
    isDropdownOpen,
    setIsDropdownOpen,
    currentDateTime,
    initials,
    dropdownRef,
    handleLogout,
  } = useDashboard();

  const {
    transactions,
    error: dataError,
    refreshData
  } = useDashboardData();

  // Close notification panel when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationPanelOpen(false);
      }
    };
    if (isNotificationPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationPanelOpen]);

  if (!user) return null;

  const titles = {
    '/dashboard': 'Overview',
    '/dashboard/expenses': 'Transactions & Expenses',
    '/dashboard/analytics': 'Spend Analysis',
    '/dashboard/budgets': 'Budget Tracking',
    '/dashboard/settings': 'Settings'
  };

  const currentTitle = titles[location.pathname] || 'Dashboard';
  const currentTransactions = transactions?.current ?? null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 z-20">

          {/* Left — title */}
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              {currentTitle}
            </h1>
            <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
              {currentDateTime}
            </p>
          </div>

          {/* Right — bell + profile */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Notification Bell — wrapped in ref for click-outside detection */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition-colors dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 border-2 border-white dark:border-gray-800">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {/* Non-blocking notification panel — lives inside the ref div */}
              <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label={`Account menu for ${user.name}`}
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                title={user.name}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {initials}
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
                    onClick={() => {
                      navigate('/support');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> Help Center
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
        {/* Extra bottom padding below lg keeps content clear of the bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-6 bg-gray-50 dark:bg-gray-900/50">
          <EmailVerificationBanner />
          {dataError && <ConnectionErrorBanner onRetry={refreshData} />}
          <Routes>
            <Route index element={<DashboardContent onDataChange={refreshData} />} />

            <Route
              path="expenses"
              element={
                <ExpensesContent
                  recentTransactions={currentTransactions}
                  userId={userId}
                  onDataChange={refreshData}
                />
              }
            />

            <Route
              path="analytics"
              element={
                <AnalyticsContent
                  recentTransactions={currentTransactions}
                />
              }
            />

            <Route
              path="budgets"
              element={
                <BudgetsContent
                  recentTransactions={currentTransactions}
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

      <BottomNav onAddExpense={() => setIsQuickAddOpen(true)} />

      <QuickAddExpense
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        userId={userId}
        onDataChange={refreshData}
      />
    </div>
  );
};

// Wrapper component with notification provider
const Dashboard = () => {
  const { userId } = useDashboard();

  return (
    <NotificationProvider userId={userId}>
      <DashboardInner />
    </NotificationProvider>
  );
};

export default Dashboard;