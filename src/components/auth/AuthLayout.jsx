import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import SpendWiseLogo from '../common/SpendWiseLogo';
import { usePreferencesContext } from '../../context/PreferencesContext';

const POINTS = ['Budgets that warn you before you overspend', 'See where every expense goes', 'Free, with no credit card'];

// Brand panel for large screens: the same pitch and budget card as the landing page
const BrandPanel = () => {
  const { formatCurrency } = usePreferencesContext();
  return (
    <aside className="relative hidden overflow-hidden bg-indigo-600 lg:flex lg:flex-col lg:justify-center dark:bg-indigo-950">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-md px-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">Your money, finally under control</h2>
        <p className="mt-3 text-indigo-100">Track what you spend and see exactly where your money goes.</p>

        {/* Sample budget card, styled like the dashboard */}
        <div aria-hidden="true" className="mt-10 rounded-xl bg-white p-5 shadow-2xl shadow-indigo-900/30 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Spent this month</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(1240)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">of {formatCurrency(2000)}</p>
          </div>
          <div className="mt-4 h-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-3 w-[62%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">62% used</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(760)} left</span>
          </div>
        </div>

        <ul className="mt-10 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm text-indigo-50">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

// Shared shell for login and sign up: form column, plus a brand panel from lg up
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-white lg:grid lg:grid-cols-2 dark:bg-gray-900">
    <main className="flex flex-col justify-center px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-md">
        {/* Logo goes back to the landing page */}
        <Link
          to="/"
          aria-label="SpendWise home"
          className="mb-8 inline-block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <SpendWiseLogo className="h-9" showText={true} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">{footer}</div>}
      </div>
    </main>
    <BrandPanel />
  </div>
);

export default AuthLayout;
