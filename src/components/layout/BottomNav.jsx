import { Home, CreditCard, BarChart3, Target, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard", end: true },
  { label: "Expenses", icon: CreditCard, path: "/dashboard/expenses" },
  { label: "Budgets", icon: Target, path: "/dashboard/budgets" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
];

const NavItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-[11px] font-medium transition-colors ${
          isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${
              isActive ? "bg-indigo-50 dark:bg-indigo-900/30" : ""
            }`}
          >
            <Icon className="w-5 h-5" />
          </span>
          {item.label}
        </>
      )}
    </NavLink>
  );
};

// Mobile-only bottom navigation; the sidebar takes over from lg up
const BottomNav = ({ onAddExpense }) => {
  const [first, second, third, fourth] = navItems;

  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch h-16 px-1">
        <NavItem item={first} />
        <NavItem item={second} />

        {/* Primary action: add an expense from any page */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onAddExpense}
            aria-label="Add expense"
            className="-mt-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center ring-4 ring-gray-50 dark:ring-gray-900 transition"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <NavItem item={third} />
        <NavItem item={fourth} />
      </div>
    </nav>
  );
};

export default BottomNav;
