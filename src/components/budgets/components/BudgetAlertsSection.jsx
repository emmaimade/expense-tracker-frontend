import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const SEVERITY = {
  high: {
    icon: AlertCircle,
    box: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-200',
  },
  medium: {
    icon: AlertTriangle,
    box: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-200',
  },
  low: {
    icon: Info,
    box: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-200',
  },
};

// Shown near the top of the Budgets page: these are the most urgent things on it
const BudgetAlertsSection = ({ budgetAlerts }) => {
  if (!Array.isArray(budgetAlerts) || budgetAlerts.length === 0) return null;

  return (
    <section aria-label="Budget alerts" className="space-y-3">
      {budgetAlerts.map((alert, index) => {
        const tone = SEVERITY[alert.severity] || SEVERITY.low;
        const Icon = tone.icon;
        return (
          <div key={index} role="alert" className={`p-4 rounded-xl border ${tone.box}`}>
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tone.iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${tone.title}`}>{alert.message}</p>
                {alert.suggestion && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.suggestion}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default BudgetAlertsSection;
