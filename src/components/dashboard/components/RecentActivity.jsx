import { useMemo } from 'react';
import { isToday, isYesterday } from 'date-fns';
import EmptyState from './EmptyState';
import SectionLink from './SectionLink';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import { getCategoryIcon } from '../../../utils/categoryIcons';
import Card from '../../../components/common/Card';

const RECENT_COUNT = 5;

const formatDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const RecentActivity = ({ transactions = [], onViewAllExpenses, onAddExpense }) => {
  const { formatCurrency } = usePreferencesContext();

  const recent = useMemo(
    () =>
      (Array.isArray(transactions) ? transactions : [])
        .filter((tx) => tx && tx.type === 'expense')
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, RECENT_COUNT),
    [transactions]
  );

  return (
    <Card>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
        {recent.length > 0 && <SectionLink onClick={onViewAllExpenses}>View all</SectionLink>}
      </div>

      {recent.length === 0 ? (
        <EmptyState type="recent-activity" onAddExpense={onAddExpense} />
      ) : (
        <ul className="-my-2 divide-y divide-gray-100 dark:divide-gray-700">
          {recent.map((tx) => {
            const categoryName = tx.category?.name || 'Uncategorized';
            const Icon = getCategoryIcon(categoryName);
            return (
              <li key={tx.id || tx._id} className="flex items-center gap-3 py-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{tx.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {categoryName} · {formatDay(tx.date)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                  -{formatCurrency(Math.abs(tx.amount || 0))}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default RecentActivity;
