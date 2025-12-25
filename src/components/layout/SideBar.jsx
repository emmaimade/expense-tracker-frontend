import { Home, CreditCard, BarChart3, Target, Settings } from 'lucide-react';
import Logo from '../common/Logo';

const Sidebar = ({ 
  isOpen, 
  activeTab, 
  setActiveTab, 
  onClose = () => {} 
}) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "budgets", label: "Budgets", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <Logo />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
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
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
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