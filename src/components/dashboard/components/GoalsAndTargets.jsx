const GoalsAndTargets = ({ onViewAnalytics }) => {
  // These could be passed as props or fetched from an API
  const goals = [
    {
      name: 'Emergency Fund',
      current: 3200,
      target: 5000,
      color: 'green'
    },
    {
      name: 'Vacation Fund',
      current: 1200,
      target: 3000,
      color: 'blue'
    }
  ];

  const calculatePercentage = (current, target) => {
    return (current / target) * 100;
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: 'bg-green-600',
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600'
    };
    return colorMap[color] || 'bg-gray-600';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Goals & Targets</h3>
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{goal.name}</span>
              <span className="font-medium">
                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getColorClass(goal.color)}`}
                style={{ width: `${calculatePercentage(goal.current, goal.target)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={onViewAnalytics} 
        className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
      >
        Manage Goals →
      </button>
    </div>
  );
};

export default GoalsAndTargets;