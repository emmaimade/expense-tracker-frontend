import { Home, CreditCard, BarChart3, Settings } from 'lucide-react';
import Logo from '../Logo';

const Sidebar = ({ activeTab, setActiveTab, setIsSidebarOpen, className = "" }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-screen ${className}`}>
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8">
          <Logo />
        </div>
        <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
      </div>
      <nav className="mt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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