import { Home, CreditCard, BarChart3, Target, Settings, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import SpendWiseLogo from '../common/SpendWiseLogo';

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard", end: true },
  { label: "Expenses", icon: CreditCard, path: "/dashboard/expenses" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Budgets", icon: Target, path: "/dashboard/budgets" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

// Real links: middle-click / open in new tab work, and NavLink sets aria-current
const SidebarLink = ({ item }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      {item.label}
    </NavLink>
  );
};

// Desktop-only navigation; BottomNav handles mobile
const Sidebar = () => {
  return (
    <div className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-16 px-6 flex items-center">
        <SpendWiseLogo showText={true} className="h-8" />
      </div>

      <nav aria-label="Primary" className="flex-1 flex flex-col px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </div>

        {/* Help sits at the bottom as a plain item, so it doesn't compete with the main nav */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <SidebarLink item={{ label: "Help & support", icon: HelpCircle, path: "/support" }} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
