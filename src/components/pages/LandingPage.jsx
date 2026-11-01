import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu, X, ArrowRight, Check, Plus, ChevronDown,
  Receipt, BarChart3, Target, Globe2, Download, ShieldCheck,
  UserPlus, LineChart, Tag, TrendingDown, CalendarClock,
  Home, CreditCard, Settings, Bell,
} from "lucide-react";
import SpendWiseLogo from "../common/SpendWiseLogo";
import StatCard from "../common/StatCard";
import BudgetOverview from "../dashboard/components/BudgetOverview";
import BudgetAlertsSection from "../budgets/components/BudgetAlertsSection";
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

// ── Hero previews: the app's real components (BudgetAlertsSection, BudgetOverview, StatCard) with sample
// data, at real size inside a slim app frame. Using the real components means the preview can't drift
// from the dashboard; showing only the budget and stats keeps it readable instead of a wall of tiny UI.
const SAMPLE_BUDGET = {
  totalSpentThisMonth: 1240,
  budgetLimit: 2000,
  totalRemaining: 760,
  percentageUsed: 62,
  isOverBudget: false,
};

const sampleAlerts = [
  { severity: "medium", message: "Food is at 85% of its budget", suggestion: "You have 9 days to go this month." },
];

const sampleStats = (fmt) => [
  { name: "Top category", value: "Food", change: "38% of spending", icon: Tag, style: "info", secondaryValue: fmt(471.2) },
  {
    name: "vs. last month", value: "12.0%", trend: "down", change: "Less spent", icon: TrendingDown, style: "success",
    secondaryValue: `${fmt(169)} less than last month`,
  },
  {
    name: "Daily average", value: fmt(41.33), change: "On track", icon: CalendarClock, style: "info",
    secondaryValue: `On pace for ${fmt(1281.33)} this month`,
  },
];

const PREVIEW_NAV = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Expenses", icon: CreditCard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Budgets", icon: Target },
  { label: "Settings", icon: Settings },
];

// Top bar shared by both previews (the add button is desktop-only, as in the app)
const PreviewTopBar = ({ showAdd }) => (
  <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</p>
    <div className="flex items-center gap-3">
      {showAdd && (
        <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          <Plus className="h-4 w-4" /> Add expense
        </span>
      )}
      <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">AO</span>
    </div>
  </div>
);

const DashboardPreview = () => {
  const { formatCurrency } = usePreferencesContext();
  const stats = sampleStats(formatCurrency);

  return (
    <div
      role="img"
      aria-label="Preview of the SpendWise dashboard: a budget alert, this month's budget and spending stats"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-indigo-500/10 dark:border-gray-700 dark:bg-gray-900"
    >
      <div aria-hidden="true" inert className="flex text-left">
        {/* Collapsed sidebar rail */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-gray-200 bg-white py-3 dark:border-gray-700 dark:bg-gray-800">
          <SpendWiseLogo className="mb-3 h-8" showText={false} />
          {PREVIEW_NAV.map((item) => (
            <span
              key={item.label}
              className={`rounded-lg p-2.5 ${
                item.active ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <PreviewTopBar showAdd />
          <div className="space-y-5 p-5 md:p-6">
            <BudgetAlertsSection budgetAlerts={sampleAlerts} />
            <BudgetOverview budgetData={SAMPLE_BUDGET} />
            <div className="grid grid-cols-3 gap-5">
              {stats.map((stat) => <StatCard key={stat.name} stat={stat} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Phones: the same real components edge to edge, with the mobile bottom nav
const MOBILE_NAV = [
  { label: "Home", icon: Home, active: true },
  { label: "Expenses", icon: CreditCard },
  null, // raised + button
  { label: "Budgets", icon: Target },
  { label: "Analytics", icon: BarChart3 },
];

const MobilePreview = () => {
  const { formatCurrency } = usePreferencesContext();
  const [, vsLastMonth] = sampleStats(formatCurrency);

  return (
    <div
      role="img"
      aria-label="Preview of the SpendWise dashboard on a phone: a budget alert, this month's budget and a spending stat"
      // Full-bleed so the content is exactly as wide as in the real app
      className="overflow-hidden border-y border-gray-200 bg-gray-50 text-left shadow-xl shadow-indigo-500/10 dark:border-gray-700 dark:bg-gray-900"
    >
      <div aria-hidden="true" inert>
        <PreviewTopBar />
        <div className="space-y-4 p-4">
          <BudgetAlertsSection budgetAlerts={sampleAlerts} />
          <BudgetOverview budgetData={SAMPLE_BUDGET} />
          <StatCard stat={vsLastMonth} />
        </div>
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

            {/* Below md the edge-to-edge mobile preview; from md the framed desktop one (three stat cards need the width) */}
            <div className="-mx-4 mt-12 sm:-mx-6 md:hidden">
              <MobilePreview />
            </div>
            <div className="mx-auto mt-14 hidden max-w-5xl md:block">
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
