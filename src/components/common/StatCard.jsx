import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Helper function to dynamically set classes based on featured status and style
const getCardClasses = (isFeatured, stat) => {
    let baseClasses = "bg-white p-6 rounded-xl border transition-all duration-300";
    
    if (isFeatured) {
        // Prominent styling for Health Score
        let borderColor = 'border-gray-200';
        let shadowClass = 'shadow-xl'; // Stronger shadow

        // Apply style-specific colors (e.g., success=green, warning=yellow)
        if (stat.style === 'success') {
            borderColor = 'border-green-300 bg-green-50/50';
        } else if (stat.style === 'warning') {
            borderColor = 'border-yellow-300 bg-yellow-50/50';
        } else if (stat.style === 'danger') {
            borderColor = 'border-red-300 bg-red-50/50';
        }

        return `${baseClasses} ${shadowClass} ${borderColor} scale-[1.01] hover:scale-[1.02]`;
    } else {
        // Standard styling
        return `${baseClasses} shadow-sm border-gray-100 hover:shadow-md`;
    }
}

const StatCard = ({ stat, isFeatured = false }) => {
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

  const mainValue = stat.value;
  const cardTitle = stat.name;
  const secondaryDetail = stat.secondaryValue;

  return (
    <div className={getCardClasses(isFeatured, stat)}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <span className={`w-6 h-6 ${stat.color} text-xl flex items-center justify-center`}>
            {stat.icon}
          </span>
        </div>
        {/* Only show trend if the stat has a change value */}
        {stat.change && (
            <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                {stat.change}
            </div>
        )}
      </div>
      <div className="mt-4">
        {/* Use a larger font for the featured score */}
        <h3 className={`font-bold text-gray-900 ${isFeatured ? 'text-4xl' : 'text-2xl'}`}>
            {mainValue}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{cardTitle}</p>
        {/* Display secondary details if present */}
        {secondaryDetail && (
            <p className="text-gray-500 text-xs mt-2 pt-2 border-t border-gray-100">
                {secondaryDetail}
            </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;