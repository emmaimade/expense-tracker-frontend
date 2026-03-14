import { Home, CreditCard, BarChart3, Target, Settings, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SpendWiseLogo from '../common/SpendWiseLogo';

const Sidebar = ({ isOpen, setIsOpen }) => {
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
    if (setIsOpen) setIsOpen(false); 
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SpendWiseLogo showText={true} className="h-8" />
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => { if (setIsOpen) setIsOpen(false); }}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      <nav className="mt-8 flex flex-col h-[calc(100%-88px)]">
        <div className="flex-1">
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
        </div>

        {/* Help Center — bottom of sidebar */}
        <div className="px-4 pb-6 mt-auto">
          <Link
            to="/support"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">Help Center</p>
              <p className="text-xs text-indigo-400 dark:text-indigo-500 truncate">FAQs & support</p>
            </div>
            <svg className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;