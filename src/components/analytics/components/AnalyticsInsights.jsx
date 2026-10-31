import { AlertCircle, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { usePreferencesContext } from '../../../context/PreferencesContext';
import Card from '../../../components/common/Card';

const TONES = {
  error: {
    box: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    title: 'text-red-900 dark:text-red-300',
    desc: 'text-red-700 dark:text-red-400',
  },
  warning: {
    box: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    title: 'text-amber-900 dark:text-amber-300',
    desc: 'text-amber-700 dark:text-amber-400',
  },
  success: {
    box: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    title: 'text-green-900 dark:text-green-300',
    desc: 'text-green-700 dark:text-green-400',
  },
  info: {
    box: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    title: 'text-blue-900 dark:text-blue-300',
    desc: 'text-blue-700 dark:text-blue-400',
  },
};

const AnalyticsInsights = ({ analytics, trendInsight }) => {
  const { budgetAdherence, categoryData, categoryChange } = analytics;
  const { formatCurrency } = usePreferencesContext();

  if (categoryData.length === 0) return null;

  const insights = [];

  if (budgetAdherence > 100) {
    insights.push({
      type: 'error', icon: AlertCircle, title: 'Over budget',
      message: `You've spent ${budgetAdherence - 100}% more than your budget over this period.`,
    });
  } else if (budgetAdherence > 80) {
    insights.push({
      type: 'warning', icon: AlertTriangle, title: 'Close to your limit',
      message: `You've used ${budgetAdherence}% of your budget over this period.`,
    });
  } else if (budgetAdherence > 0) {
    insights.push({
      type: 'success', icon: CheckCircle2, title: 'Within budget',
      message: `You've used ${budgetAdherence}% of your budget over this period.`,
    });
  }

  // Which category moved the most since last month (the chart already shows the biggest one)
  if (categoryChange) {
    const up = categoryChange.delta > 0;
    insights.push({
      type: up ? 'warning' : 'success',
      icon: up ? ArrowUpRight : ArrowDownRight,
      title: 'Biggest change',
      message: `${categoryChange.name}: ${formatCurrency(Math.abs(categoryChange.delta))} ${up ? 'more' : 'less'} than last month (${formatCurrency(categoryChange.previous)} → ${formatCurrency(categoryChange.current)}).`,
    });
  }

  if (trendInsight) {
    insights.push(trendInsight);
  }

  if (insights.length === 0) return null;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Insights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, index) => {
          const tone = TONES[insight.type] || TONES.info;
          const Icon = insight.icon;
          return (
            <div key={index} className={`p-3 rounded-lg border ${tone.box}`}>
              <h3 className={`font-medium ${tone.title} flex items-center gap-2`}>
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {insight.title}
              </h3>
              <p className={`text-sm ${tone.desc} mt-1`}>{insight.message}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AnalyticsInsights;
