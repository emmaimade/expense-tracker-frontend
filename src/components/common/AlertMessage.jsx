import { CircleAlert, CircleCheck, Info } from 'lucide-react';

const TONES = {
  error: {
    box: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
    icon: CircleAlert,
    iconColor: 'text-red-500',
  },
  success: {
    box: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
    icon: CircleCheck,
    iconColor: 'text-green-500',
  },
  info: {
    box: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200',
    icon: Info,
    iconColor: 'text-amber-500',
  },
};

// Errors are announced immediately (role="alert"); success and info politely (role="status")
export const AlertMessage = ({ type = 'error', message, className = '' }) => {
  if (!message) return null;
  const tone = TONES[type] || TONES.error;
  const Icon = tone.icon;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`p-3 border rounded-lg flex items-start gap-2 text-sm ${tone.box} ${className}`}
    >
      <Icon className={`${tone.iconColor} mt-0.5 flex-shrink-0 w-4 h-4`} />
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
