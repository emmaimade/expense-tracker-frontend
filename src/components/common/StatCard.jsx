import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card';

const StatCard = ({ stat, isFeatured = false }) => {
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

  const mainValue = stat.value;
  const cardTitle = stat.name;
  const secondaryDetail = stat.secondaryValue;

  // Dynamic classes based on featured status and style
  const getAdditionalClasses = () => {
    if (!isFeatured) return '';
    
    let classes = 'shadow-xl scale-[1.01] hover:scale-[1.02] ';
    
    // Apply style-specific border colors for featured cards
    if (stat.style === 'success') {
      return classes + 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10';
    } else if (stat.style === 'warning') {
      return classes + 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10';
    } else if (stat.style === 'danger') {
      return classes + 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10';
    }
    
    return classes;
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${getAdditionalClasses()}`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${stat.bgColor || 'bg-gray-100 dark:bg-gray-700'}`}>
          <span className={`w-6 h-6 ${stat.color || 'text-gray-600 dark:text-gray-400'} text-xl flex items-center justify-center`}>
            {stat.icon}
          </span>
        </div>
        {/* Only show trend if the stat has a change value */}
        {stat.change && (
          <div className={`flex items-center text-sm ${
            stat.trend === 'up' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            {stat.change}
          </div>
        )}
      </div>
      <div className="mt-4">
        {/* Use a larger font for the featured score */}
        <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${isFeatured ? 'text-4xl' : 'text-2xl'}`}>
          {mainValue}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{cardTitle}</p>
        {/* Display secondary details if present */}
        {secondaryDetail && (
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            {secondaryDetail}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;