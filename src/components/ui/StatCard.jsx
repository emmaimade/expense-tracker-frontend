import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <Icon className={`w-6 h-6 ${stat.color}`} />
        </div>
        <div className={`flex items-center text-sm ${
          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendIcon className="w-4 h-4 mr-1" />
          {stat.change}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{stat.amount}</h3>
        <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
      </div>
    </div>
  );
};

export default StatCard;