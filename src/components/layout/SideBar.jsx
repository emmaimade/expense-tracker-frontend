import { Home, CreditCard, BarChart3, Target, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const Sidebar = ({ isOpen, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "expenses", label: "Expenses", icon: CreditCard, path: "/dashboard/expenses" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { id: "budgets", label: "Budgets", icon: Target, path: "/dashboard/budgets" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    
    // Exact match for dashboard home
    if (path === '/dashboard') return 'dashboard';
    
    // Check for nested routes
    if (path.startsWith('/dashboard/expenses')) return 'expenses';
    if (path.startsWith('/dashboard/analytics')) return 'analytics';
    if (path.startsWith('/dashboard/budgets')) return 'budgets';
    if (path.startsWith('/dashboard/settings')) return 'settings';
    
    return 'dashboard'; // Default
  };

  const activeTab = getActiveTab();

  const handleNavigation = (item) => {
    navigate(item.path);
    onClose(); // Close mobile sidebar after navigation
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <Logo />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">FinTrack</span>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      <nav className="mt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-2 border-indigo-600 dark:border-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;