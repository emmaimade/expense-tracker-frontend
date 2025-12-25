import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import Sidebar from '../layout/SideBar';
import DashboardContent from '../dashboard/DashboardContent';
import ExpensesContent from '../expenses/ExpensesContent';
import AnalyticsContent from '../analytics/AnalyticsContent';
import BudgetsContent from '../budgets/BudgetsContent';
import SettingsContent from '../settings/SettingsContent';

const Dashboard = () => {
  const {
    user,
    userId,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    currentDateTime,
    initials,
    recentTransactions,
    isLoading,
    dropdownRef,
    handleLogout,
    refreshData,
  } = useDashboard();

  if (!user) return null; // ProtectedRoute handles redirect

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTab === "dashboard" &&
                  "Overview of your financial health"}
                {activeTab === "expenses" && "Track and manage your expenses"}
                {activeTab === "analytics" &&
                  "Insights into your spending patterns"}
                {activeTab === "budgets" && "Set and track your monthly budget"}
                {activeTab === "settings" && "Manage your account preferences"}
              </p>
            </div>
          </div>

          <div
            className="flex items-center space-x-4 relative"
            ref={dropdownRef}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {currentDateTime}
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <div
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-white text-sm font-medium">{initials}</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
                  <User className="w-4 h-4 mr-2" /> Profile
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 lg:p-6 flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {activeTab === "dashboard" && (
            <DashboardContent
              onDataChange={refreshData}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "expenses" && (
            <ExpensesContent
              recentTransactions={recentTransactions}
              userId={userId}
              onDataChange={refreshData}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsContent
              recentTransactions={recentTransactions}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "budgets" && (
            <BudgetsContent recentTransactions={recentTransactions} />
          )}
          {activeTab === "settings" && <SettingsContent userId={userId} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;