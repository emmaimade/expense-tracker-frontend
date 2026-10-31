import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, ArrowRight, ArrowDownRight, Check, Plus, ChevronDown,
  Receipt, BarChart3, Target, Globe2, Download, ShieldCheck,
  UserPlus, LineChart, UtensilsCrossed, Car, Lightbulb, Tag, TrendingDown, CalendarClock,
  Home, CreditCard, Settings, HelpCircle, PanelLeft, Bell,
} from "lucide-react";
import SpendWiseLogo from "../common/SpendWiseLogo";
import { useAuth } from "../../context/AuthContext";
import { usePreferencesContext } from "../../context/PreferencesContext";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  { icon: Receipt, title: "Log expenses in seconds", desc: "Add an expense from any page in one tap, then find it later with search, categories and date ranges." },
  { icon: BarChart3, title: "See where it goes", desc: "Monthly trends against your budget and a clear breakdown of your top categories." },
  { icon: Target, title: "Budgets that warn you", desc: "Set limits per category, get alerts before you overspend, and see how much you can still spend per day." },
  { icon: Globe2, title: "9 currencies", desc: "Your currency is detected when you sign up. Switch any time, and convert past expenses at live rates." },
  { icon: Download, title: "Export any time", desc: "Download your expenses as CSV or PDF whenever you need them." },
  { icon: ShieldCheck, title: "Private and secure", desc: "Hashed passwords, secure sign-in sessions and Google sign-in. We never sell or share your data." },
];

const STEPS = [
  { icon: UserPlus, title: "Create your account", desc: "Sign up in under a minute with email or Google. Your local currency is set for you." },
  { icon: Receipt, title: "Log your expenses", desc: "Add what you spend and set a budget for the categories you care about." },
  { icon: LineChart, title: "See the full picture", desc: "Your dashboard shows where you stand this month and how your spending changes over time." },
];

const FAQS = [
  { q: "Is SpendWise really free?", a: "Yes. There's no paid plan, no credit card and no ads. Every feature is available to everyone." },
  { q: "Is my financial data safe?", a: "Passwords are hashed and never stored in plain text, all traffic uses HTTPS, and your session lives in a secure, http-only cookie. You can also sign in with Google. We never sell or share your data." },
  { q: "Which currencies are supported?", a: "Nine, including the Naira, US Dollar, Euro, British Pound, Japanese Yen, Indian Rupee and South African Rand. Your currency is detected when you sign up and can be changed any time in settings." },
  { q: "What happens if I change my currency?", a: "You choose: convert your existing expenses and budgets at live exchange rates, or keep the numbers as they are and use the new currency from now on." },
  { q: "Can I use it on my phone?", a: "Yes. SpendWise works in any modern browser on phones, tablets and computers, in light or dark mode." },
  { q: "Can I export my data?", a: "Yes. You can download your expenses as CSV or PDF for any date range, and delete your account and all its data from settings." },
];

const smoothScroll = (e, href) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
};

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors";

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
    <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
    {subtitle && <p className="mt-3 text-base text-gray-600 dark:text-gray-400">{subtitle}</p>}
  </div>
);

// ── Hero preview: a scaled-down copy of the real dashboard (same layout and styles) with sample data ──
const PREVIEW_NAV = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Expenses", icon: CreditCard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Budgets", icon: Target },
  { label: "Settings", icon: Settings },
];

const PreviewNavItem = ({ item }) => (
  <div
    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
      item.active
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-300"
    }`}
  >
    <item.icon className="h-3.5 w-3.5 shrink-0" />
    {/* Labels from md up, like the expanded sidebar; an icon rail below that */}
    <span className="hidden md:inline">{item.label}</span>
  </div>
);

const PreviewStat = ({ icon, iconClass, label, value, note, noteClass, trend, secondary }) => {
  const Icon = icon;
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-0.5 truncate text-sm font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <span className={`rounded-md p-1 ${iconClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className={`mt-1 flex items-center text-[10px] font-medium ${noteClass}`}>
        {trend && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
        {note}
      </p>
      <p className="mt-2 border-t border-gray-100 pt-2 text-[9px] text-gray-500 dark:border-gray-700 dark:text-gray-400">{secondary}</p>
    </div>
  );
};

const PreviewActivity = ({ icon, name, meta, amount }) => {
  const Icon = icon;
  return (
    <li className="flex items-center gap-2 py-1.5">
      <span className="rounded-md bg-gray-100 p-1 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        <Icon className="h-3 w-3" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[10px] font-medium text-gray-900 dark:text-gray-100">{name}</span>
        <span className="block truncate text-[9px] text-gray-500 dark:text-gray-400">{meta}</span>
      </span>
      <span className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">-{amount}</span>
    </li>
  );
};

const PreviewCategory = ({ name, amount, pct, bar }) => (
  <div>
    <div className="flex justify-between text-[10px]">
      <span className="font-medium text-gray-700 dark:text-gray-300">{name}</span>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{amount}</span>
    </div>
    <div className="mt-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700">
      <div className={`h-1 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const DashboardPreview = () => {
  const { formatCurrency } = usePreferencesContext();
  const fmt = (n) => formatCurrency(n);

  return (
    <div
      role="img"
      aria-label="Preview of the SpendWise dashboard: sidebar, this month's budget, spending stats, recent activity and top categories"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-indigo-500/10 dark:border-gray-700 dark:bg-gray-800"
    >
      <div aria-hidden="true" className="flex text-left">
        {/* Sidebar */}
        <div className="hidden w-11 shrink-0 flex-col border-r border-gray-200 bg-white p-2 sm:flex md:w-36 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex h-8 items-center px-1">
            <SpendWiseLogo className="h-6" showText={false} />
            <span className="ml-1.5 hidden text-xs font-extrabold text-indigo-600 md:inline dark:text-white">SpendWise</span>
          </div>
          <div className="space-y-0.5">
            {PREVIEW_NAV.map((item) => <PreviewNavItem key={item.label} item={item} />)}
          </div>
          <div className="mt-auto space-y-0.5 border-t border-gray-100 pt-2 dark:border-gray-700">
            <PreviewNavItem item={{ label: "Help & support", icon: HelpCircle }} />
            <PreviewNavItem item={{ label: "Sidebar", icon: PanelLeft }} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="flex h-11 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Dashboard</p>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white sm:inline-flex">
                <Plus className="h-3 w-3" /> Add expense
              </span>
              <span className="relative text-gray-500 dark:text-gray-400">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-semibold text-white">AO</span>
            </div>
          </div>

          {/* Content, cropped with a fade like a screenshot */}
          <div className="relative max-h-[490px] overflow-hidden bg-gray-50 p-3 sm:p-4 dark:bg-gray-900">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Welcome back, Ada</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Here&apos;s where your money stands this month</p>
                </div>
                <span className="hidden items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 sm:inline-flex dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                  View expenses <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {/* Budget card */}
              <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Spent this month</p>
                    <p className="text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">{fmt(1240)}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">of {fmt(2000)} budget</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-1.5 w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
                </div>
                <div className="mt-1 flex justify-between text-[10px]">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">62.0% used</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{fmt(760)} left</span>
                </div>
              </div>

              {/* Financial overview */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Financial Overview</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  View analytics <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <PreviewStat
                  icon={Tag}
                  iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  label="Top category" value="Food"
                  note="38% of spending" noteClass="text-gray-500 dark:text-gray-400"
                  secondary={fmt(471.2)}
                />
                <PreviewStat
                  icon={TrendingDown}
                  iconClass="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  label="vs. last month" value="12.0%"
                  note="Less spent" noteClass="text-green-600 dark:text-green-400" trend
                  secondary={`${fmt(169)} less than last month`}
                />
                <PreviewStat
                  icon={CalendarClock}
                  iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  label="Daily average" value={fmt(41.33)}
                  note="Day 30 of 31" noteClass="text-gray-500 dark:text-gray-400"
                  secondary={`On pace for ${fmt(1281.33)} this month`}
                />
              </div>

              {/* Recent activity + top categories */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">Recent Activity</p>
                  <ul className="mt-1 divide-y divide-gray-100 dark:divide-gray-700">
                    <PreviewActivity icon={UtensilsCrossed} name="Groceries" meta="Food · Today" amount={fmt(54)} />
                    <PreviewActivity icon={Car} name="Ride home" meta="Transportation · Yesterday" amount={fmt(12)} />
                    <PreviewActivity icon={Lightbulb} name="Electricity" meta="Utilities · Oct 28" amount={fmt(80)} />
                  </ul>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">Top Spending Categories</p>
                  <div className="mt-2 space-y-2">
                    <PreviewCategory name="Food" amount={fmt(471.2)} pct={38} bar="bg-blue-600" />
                    <PreviewCategory name="Transportation" amount={fmt(310)} pct={25} bar="bg-purple-600" />
                    <PreviewCategory name="Utilities" amount={fmt(248)} pct={20} bar="bg-orange-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Mobile preview: the app's real mobile dashboard at its real sizes (no scaled-down device frame) ──
// Mirrors the phone layout: top bar, welcome row with both buttons, budget card, Financial Overview,
// and the bottom nav with the raised + button. The middle is cropped with a fade, like a screenshot.
const MOBILE_NAV = [
  { label: "Home", icon: Home, active: true },
  { label: "Expenses", icon: CreditCard },
  null, // raised + button
  { label: "Budgets", icon: Target },
  { label: "Analytics", icon: BarChart3 },
];

const MobilePreview = () => {
  const { formatCurrency } = usePreferencesContext();
  const fmt = (n) => formatCurrency(n);

  return (
    <div
      role="img"
      aria-label="Preview of the SpendWise dashboard on a phone: this month's budget and spending overview"
      // Full-bleed (edge to edge, no side border) so the content is exactly as wide as in the real app;
      // any inset makes the same UI look squeezed
      className="overflow-hidden border-y border-gray-200 bg-gray-50 text-left shadow-xl shadow-indigo-500/10 dark:border-gray-700 dark:bg-gray-900"
    >
      <div aria-hidden="true">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</p>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">AO</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Welcome back, Ada</p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Here&apos;s where your money stands this month</p>
          </div>
          <div className="flex gap-2">
            <span className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
              View expenses <ArrowRight className="h-4 w-4" />
            </span>
            <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white">
              <Plus className="h-4 w-4" /> Add expense
            </span>
          </div>

          {/* Budget card */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Spent this month</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{fmt(1240)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">of {fmt(2000)} budget</p>
            <div className="mt-4 h-3 rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-3 w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">62.0% used</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{fmt(760)} left</span>
            </div>
          </div>

          {/* Financial overview */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Financial Overview</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              View analytics <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Top category</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Food</p>
              </div>
              <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Tag className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">38% of spending</p>
            <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">{fmt(471.2)}</p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex h-16 items-stretch border-t border-gray-200 bg-white px-1 dark:border-gray-700 dark:bg-gray-800">
          {MOBILE_NAV.map((item, i) =>
            item ? (
              <div
                key={item.label}
                className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  item.active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full ${item.active ? "bg-indigo-50 dark:bg-indigo-900/30" : ""}`}>
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label}
              </div>
            ) : (
              <div key={`add-${i}`} className="flex flex-1 items-center justify-center">
                <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-gray-50 dark:ring-gray-900">
                  <Plus className="h-6 w-6" />
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ── FAQ item: button + region, announced to screen readers ──
const FaqItem = ({ id, q, a, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <h3>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        id={`faq-button-${id}`}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`}
        />
      </button>
    </h3>
    {/* Grid-rows animation fits any answer length (no fixed max-height) */}
    <div
      id={`faq-panel-${id}`}
      role="region"
      aria-labelledby={`faq-button-${id}`}
      className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">
        <p className="pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{a}</p>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const scrolled = useScrolled();

  // Signed-in visitors get a way back into the app instead of "Log in"
  const primaryCta = user
    ? { to: "/dashboard", label: "Go to dashboard" }
    : { to: "/register", label: "Get started free" };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* ── Navbar ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors ${
          scrolled || menuOpen
            ? "border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90"
            : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="SpendWise home">
            <SpendWiseLogo className="h-8" showText={true} />
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={(e) => smoothScroll(e, l.href)}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-3 md:flex">
            {!user && (
              <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400">
                Log in
              </Link>
            )}
            <Link to={primaryCta.to} className={`${primaryButton} py-2`}>
              {primaryCta.label}
            </Link>
          </div>
          <button
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-gray-200 px-4 pb-5 pt-2 dark:border-gray-800 md:hidden">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => { smoothScroll(e, l.href); setMenuOpen(false); }}
                className="block py-3 text-base font-medium text-gray-700 dark:text-gray-200"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 grid gap-3">
              {!user && <Link to="/login" className={secondaryButton}>Log in</Link>}
              <Link to={primaryCta.to} className={primaryButton}>{primaryCta.label}</Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[480px] bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-950/40" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                Your money, <span className="text-indigo-600 dark:text-indigo-400">finally under control</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                Track what you spend, set budgets that warn you before you overspend, and see exactly where your money goes.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to={primaryCta.to} className={primaryButton}>
                  {user ? primaryCta.label : "Start tracking for free"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" onClick={(e) => smoothScroll(e, "#how-it-works")} className={secondaryButton}>
                  How it works
                </a>
              </div>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                {["No credit card", "Sign up with Google", "Works on any device"].map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phones see the mobile dashboard at real size; larger screens see the desktop dashboard */}
            <div className="-mx-4 mt-12 sm:hidden">
              <MobilePreview />
            </div>
            <div className="mx-auto mt-14 hidden max-w-5xl sm:block">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="scroll-mt-16 bg-gray-50 px-4 py-14 sm:px-6 sm:py-20 dark:bg-gray-800/40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Features"
              title="Everything you need, nothing you don't"
              subtitle="Built for everyday spending, not accounting."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                // Compact icon-left rows on phones, stacked cards from sm up
                <div key={feature.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:block sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                  <span className="inline-flex h-fit shrink-0 rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:mt-4 dark:text-gray-100">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:mt-1.5 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="scroll-mt-16 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="How it works" title="Up and running in two minutes" />
            <ol className="mx-auto mt-10 grid max-w-md gap-6 md:mt-12 md:max-w-none md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                // A left-aligned timeline on phones, centred columns from md up
                <li key={step.title} className="flex gap-4 md:block md:text-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white md:mx-auto md:h-12 md:w-12 dark:bg-indigo-500">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 md:mt-4">Step {i + 1}</p>
                    <h3 className="mt-0.5 text-lg font-semibold text-gray-900 md:mt-1 dark:text-gray-100">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 md:mx-auto md:mt-2 md:max-w-xs dark:text-gray-400">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-16 bg-gray-50 px-4 py-14 sm:px-6 sm:py-20 dark:bg-gray-800/40">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" />
            <div className="mt-10">
              {FAQS.map((item, i) => (
                <FaqItem
                  key={item.q}
                  id={i}
                  q={item.q}
                  a={item.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Still have a question?{" "}
              <Link to="/support" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                Visit the help center
              </Link>
            </p>
          </div>
        </section>

        {/* ── Final call to action ── */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-6 py-14 text-center dark:bg-indigo-700">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Stop wondering where your money went</h2>
            <p className="mx-auto mt-3 max-w-md text-indigo-100">Set up takes two minutes, and there's no credit card.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={primaryCta.to}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                {user ? primaryCta.label : "Create your free account"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  I already have an account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 px-4 py-12 sm:px-6 dark:border-gray-800">
        {/* Brand on the left, link groups pushed to the right so the footer spans the full width evenly */}
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <SpendWiseLogo className="h-8" showText={true} />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              A simple expense tracker for everyday people who want to understand their money without spreadsheets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:gap-x-20">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Product</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => smoothScroll(e, l.href)} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {(user
                ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/dashboard/settings", label: "Settings" }]
                : [{ to: "/register", label: "Sign up" }, { to: "/login", label: "Log in" }, { to: "/forgot-password", label: "Forgot password" }]
              ).map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Help</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/support" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Help center</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Privacy policy</Link></li>
            </ul>
          </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-gray-200 pt-6 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          © {new Date().getFullYear()} SpendWise
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
