import { AlertCircle } from 'lucide-react';
import Card from '../../../components/common/Card';

const BudgetAlertsSection = ({ budgetAlerts }) => {
  if (!Array.isArray(budgetAlerts) || budgetAlerts.length === 0) return null;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        Budget Alerts
      </h2>
      <div className="space-y-3">
        {budgetAlerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              alert.severity === "high"
                ? "bg-red-50 border-red-200"
                : alert.severity === "medium"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  alert.severity === "high"
                    ? "text-red-600"
                    : alert.severity === "medium"
                    ? "text-yellow-600"
                    : "text-blue-600"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    alert.severity === "high"
                      ? "text-red-900"
                      : alert.severity === "medium"
                      ? "text-yellow-900"
                      : "text-blue-900"
                  }`}
                >
                  {alert.message}
                </p>
                {alert.suggestion && (
                  <p className="text-sm text-gray-700 mt-1">
                    {alert.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BudgetAlertsSection;