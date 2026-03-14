import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  HelpCircle, Mail, ChevronDown, ArrowLeft,
  Shield, CreditCard, Globe, Smartphone, RefreshCw, Trash2, LogIn
} from "lucide-react";
import SpendWiseLogo from "../common/SpendWiseLogo";

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: "Account & Billing",
    icon: Shield,
    color: "indigo",
    items: [
      {
        q: "Is SpendWise really free?",
        a: "Yes — 100% free, forever. No credit card required, no hidden fees, no premium tier. Everything you see is available to every user with no limits.",
      },
      {
        q: "Can I sign up with Google?",
        a: "Yes. You can create an account and log in using your Google account — no password needed. Just click 'Continue with Google' on the login or signup page.",
      },
    ],
  },
  {
    category: "Expenses & Budgets",
    icon: CreditCard,
    color: "violet",
    items: [
      {
        q: "How do I add an expense?",
        a: "Click '+ Quick Add Expense' on your dashboard, or go to the Expenses tab. Fill in the amount, category, and date. Your budget and analytics will update instantly.",
      },
      {
        q: "Can I edit or delete an expense?",
        a: "Yes. Go to the Expenses tab, find the transaction, and use the edit or delete options. Changes are reflected immediately across your dashboard and analytics.",
      },
      {
        q: "How do budget alerts work?",
        a: "When you've spent 80% or more of a budget category, SpendWise will show a warning on your dashboard. At 100% you'll see an overspend alert. You'll also see a notification in the bell icon.",
      },
    ],
  },
  {
    category: "Currencies & Data",
    icon: Globe,
    color: "cyan",
    items: [
      {
        q: "Which currencies are supported?",
        a: "SpendWise supports 7+ currencies. Your local currency is detected automatically when you sign up. You can change it anytime in Settings → Preferences.",
      },
      {
        q: "What happens if I change my currency?",
        a: "You can choose to convert existing expenses and budgets using live exchange rates, or keep the numbers as-is and apply the new currency symbol going forward. The choice is yours.",
      },
      {
        q: "Is my financial data safe?",
        a: "Yes. All data is encrypted in transit and at rest. Sessions are secured with JWT tokens. We never sell or share your data with third parties — ever.",
      },
    ],
  },
  {
    category: "App & Device",
    icon: Smartphone,
    color: "emerald",
    items: [
      {
        q: "Can I use SpendWise on my phone?",
        a: "Yes. SpendWise is fully responsive and works on any device — desktop, tablet, or mobile — directly in your browser. No app download needed.",
      },
      {
        q: "Why is my dashboard showing old data?",
        a: "Try refreshing the page. If the issue persists, check your internet connection. Data syncs automatically whenever you add or edit expenses.",
      },
    ],
  },
];

const COLOR_MAP = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800",
    icon: "text-indigo-500 dark:text-indigo-400",
    label: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-100 dark:border-violet-800",
    icon: "text-violet-500 dark:text-violet-400",
    label: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-100 dark:border-cyan-800",
    icon: "text-cyan-500 dark:text-cyan-400",
    label: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-500",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800",
    icon: "text-emerald-500 dark:text-emerald-400",
    label: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
};

// ── Accordion Item ────────────────────────────────────────────────────────────
const AccordionItem = ({ q, a, isOpen, onToggle, dotColor }) => (
  <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-4 py-4 text-left group"
    >
      <div className="flex items-start gap-3">
        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${dotColor}`} />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {q}
        </span>
      </div>
      <ChevronDown
        className={`w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
      />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-48 pb-4" : "max-h-0"}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed pl-4 ml-0.5 border-l-2 border-indigo-100 dark:border-indigo-800">
        {a}
      </p>
    </div>
  </div>
);

// ── Main Support Page ─────────────────────────────────────────────────────────
const SupportPage = () => {
  const [openItem, setOpenItem] = useState(null); // "catIdx-itemIdx"
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const toggle = (key) => setOpenItem((prev) => (prev === key ? null : key));

  // Flatten + filter by search
  const filtered = search.trim()
    ? FAQ_CATEGORIES.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : FAQ_CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">

      {/* ── Top nav bar ── */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <SpendWiseLogo showText={true} className="h-7" />
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {user ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-5">
            <HelpCircle className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
            How can we help?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
            Browse answers to common questions below, or reach out directly.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-gray-200 placeholder-gray-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── FAQ Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {filtered.map((cat, ci) => {
              const colors = COLOR_MAP[cat.color];
              const Icon = cat.icon;
              return (
                <div
                  key={cat.category}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  {/* Category header */}
                  <div className={`px-5 py-4 flex items-center gap-3 ${colors.bg} border-b ${colors.border}`}>
                    <div className={`p-1.5 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <Icon className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    <span className={`text-sm font-bold ${colors.label}`}>{cat.category}</span>
                  </div>

                  {/* Accordion items */}
                  <div className="px-5">
                    {cat.items.map((item, ii) => {
                      const key = `${ci}-${ii}`;
                      return (
                        <AccordionItem
                          key={key}
                          q={item.q}
                          a={item.a}
                          isOpen={openItem === key}
                          onToggle={() => toggle(key)}
                          dotColor={colors.dot}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <p className="text-gray-400 dark:text-gray-500 text-sm">No results for "<span className="font-medium text-gray-600 dark:text-gray-300">{search}</span>"</p>
            <button onClick={() => setSearch("")} className="mt-3 text-sm text-indigo-500 hover:underline">Clear search</button>
          </div>
        )}

        {/* ── Email card ── */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-indigo-200 text-sm mb-3 max-w-xs mx-auto">
            Can't find what you're looking for? Send us an email and we'll get back to you.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="mailto:emmaimade14@gmail.com?subject=SpendWise Support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              SpendWise Support
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-indigo-200 font-medium">We typically respond within 24 hours</span>
            </div>
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
          ) : (
            <Link to="/" className="hover:text-indigo-500 transition-colors">Home</Link>
          )}
          <span>·</span>
          <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} SpendWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SupportPage;