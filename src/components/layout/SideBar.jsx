import { useState, useRef, useEffect } from 'react';
import { Home, CreditCard, BarChart3, Target, Settings, HelpCircle, PanelLeft, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import SpendWiseLogo from '../common/SpendWiseLogo';
import { usePreferencesContext } from '../../context/PreferencesContext';

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard", end: true },
  { label: "Expenses", icon: CreditCard, path: "/dashboard/expenses" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Budgets", icon: Target, path: "/dashboard/budgets" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const MODES = [
  { value: "expanded", label: "Expanded" },
  { value: "collapsed", label: "Collapsed" },
  { value: "hover", label: "Expand on hover" },
];

// Delay before expand-on-hover opens, so passing the mouse over the edge doesn't trigger it
const HOVER_OPEN_DELAY = 150;

// Label shown next to the icon when open; a tooltip when the rail is collapsed
const ItemLabel = ({ label, isOpen, showTooltip }) => (
  <>
    <span className={isOpen ? "truncate" : "sr-only"}>{label}</span>
    {showTooltip && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity z-50 dark:bg-gray-700"
      >
        {label}
      </span>
    )}
  </>
);

// Real links: middle-click / open in new tab work, and NavLink sets aria-current
const SidebarLink = ({ item, isOpen, showTooltip }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
        }`
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      <ItemLabel label={item.label} isOpen={isOpen} showTooltip={showTooltip} />
    </NavLink>
  );
};

// Bottom-of-sidebar control for choosing expanded / collapsed / expand on hover
const SidebarModeMenu = ({ mode, onChange, isOpen, showTooltip }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="group relative w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <PanelLeft className="w-5 h-5 shrink-0" />
        <ItemLabel label="Sidebar" isOpen={isOpen} showTooltip={showTooltip && !menuOpen} />
      </button>

      {menuOpen && (
        <div
          role="menu"
          aria-label="Sidebar control"
          className="absolute bottom-full left-0 mb-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50"
        >
          <p className="px-3 pt-1.5 pb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Sidebar control</p>
          {MODES.map((option) => {
            const selected = mode === option.value;
            return (
              <button
                key={option.value}
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option.value);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {option.label}
                {selected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Desktop-only navigation; BottomNav handles mobile
const Sidebar = () => {
  const { sidebarMode, updatePreferences } = usePreferencesContext();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef(null);
  const asideRef = useRef(null);

  const isHoverMode = sidebarMode === "hover";
  const isOpen = sidebarMode === "expanded" || (isHoverMode && isHovered);
  // Tooltips only for the plain collapsed rail; expand-on-hover shows the labels instead
  const showTooltip = sidebarMode === "collapsed";

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const openOnHover = () => {
    if (!isHoverMode) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_OPEN_DELAY);
  };

  const closeOnLeave = () => {
    clearTimeout(hoverTimer.current);
    setIsHovered(false);
  };

  const handleModeChange = (mode) => {
    setIsHovered(false);
    updatePreferences({ sidebarMode: mode });
  };

  return (
    // The outer box reserves the space in the layout; in hover mode the panel widens over the content instead
    <div
      className={`hidden lg:block relative h-full flex-shrink-0 transition-[width] duration-200 ${
        sidebarMode === "expanded" ? "w-64" : "w-16"
      }`}
    >
      <aside
        ref={asideRef}
        onMouseEnter={openOnHover}
        onMouseLeave={closeOnLeave}
        // Keyboard users get the labels too: tabbing in opens it, tabbing out closes it
        onFocus={() => isHoverMode && setIsHovered(true)}
        onBlur={(e) => {
          if (isHoverMode && !asideRef.current?.contains(e.relatedTarget)) setIsHovered(false);
        }}
        className={`absolute inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-[width,box-shadow] duration-200 ${
          isOpen ? "w-64" : "w-16"
        } ${isHoverMode && isOpen ? "shadow-xl" : ""}`}
      >
        <div className={`h-16 flex items-center shrink-0 ${isOpen ? "px-6" : "justify-center"}`}>
          <SpendWiseLogo showText={isOpen} className="h-8" />
        </div>

        <nav aria-label="Primary" className="flex-1 flex flex-col px-3 py-4 min-h-0">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarLink key={item.path} item={item} isOpen={isOpen} showTooltip={showTooltip} />
            ))}
          </div>

          {/* Help and the sidebar control sit at the bottom, below the main nav */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
            <SidebarLink
              item={{ label: "Help & support", icon: HelpCircle, path: "/support" }}
              isOpen={isOpen}
              showTooltip={showTooltip}
            />
            <SidebarModeMenu
              mode={sidebarMode}
              onChange={handleModeChange}
              isOpen={isOpen}
              showTooltip={showTooltip}
            />
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
