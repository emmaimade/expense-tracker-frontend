import { Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SpendWiseLogo from "../common/SpendWiseLogo";
import HelpContent from "./HelpContent";

// Public help page. Signed-in users read help inside the app (/dashboard/help) instead,
// so they keep the sidebar and top bar.
const SupportPage = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard/help" replace />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="SpendWise home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <SpendWiseLogo showText={true} className="h-7" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <HelpContent />
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Privacy policy</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} SpendWise</p>
      </footer>
    </div>
  );
};

export default SupportPage;
