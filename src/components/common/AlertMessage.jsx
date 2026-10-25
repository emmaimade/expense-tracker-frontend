import { CircleAlert, CircleCheck } from 'lucide-react';

export const AlertMessage = ({ type, message }) => {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const iconColor = isError ? 'text-red-500' : 'text-green-500';
  const Icon = isError ? CircleAlert : CircleCheck;

  if (!message) return null;

  return (
    <div className={`mt-4 p-3 ${bgColor} border ${borderColor} rounded-md flex items-start`}>
      <Icon className={`${iconColor} mt-0.5 mr-2 flex-shrink-0 w-5 h-5`} />
      <span className={`text-sm ${textColor}`}>{message}</span>
    </div>
  );
};

export default AlertMessage;