import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card';

// Shared tones keyed by stat.style (good / bad, not direction: spending going up is bad)
const TONES = {
  success: {
    text: 'text-green-600 dark:text-green-400',
    icon: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    bar: 'bg-green-500',
  },
  warning: {
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
  danger: {
    text: 'text-red-600 dark:text-red-400',
    icon: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    bar: 'bg-red-500',
  },
  info: {
    text: 'text-gray-500 dark:text-gray-400',
    icon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    bar: 'bg-indigo-500',
  },
};

const StatCard = ({ stat, isFeatured = false }) => {
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const Icon = stat.icon;
  const tone = TONES[stat.style] || TONES.info;

  return (
    <Card className="transition-shadow duration-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
          <p className={`font-bold text-gray-900 dark:text-gray-100 mt-1 break-words ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
            {stat.value}
            {stat.valueSuffix && (
              <span className="text-base font-medium text-gray-400 dark:text-gray-500">{stat.valueSuffix}</span>
            )}
          </p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg shrink-0 ${tone.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {stat.change && (
        <p className={`flex items-center text-sm font-medium mt-2 ${tone.text}`}>
          {/* Arrow only for stats with a direction */}
          {stat.trend && <TrendIcon className="w-4 h-4 mr-1 shrink-0" />}
          {stat.change}
        </p>
      )}

      {/* 0-100 score bar */}
      {typeof stat.score === 'number' && (
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3"
          role="progressbar"
          aria-valuenow={stat.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={stat.name}
        >
          <div className={`h-1.5 rounded-full ${tone.bar}`} style={{ width: `${stat.score}%` }} />
        </div>
      )}

      {stat.secondaryValue && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {stat.secondaryValue}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
