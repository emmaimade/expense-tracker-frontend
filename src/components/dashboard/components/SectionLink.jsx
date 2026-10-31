import { ArrowRight } from 'lucide-react';

// The one style for "View all"-type links in dashboard card headers
const SectionLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
  >
    {children}
    <ArrowRight className="w-4 h-4" />
  </button>
);

export default SectionLink;
