import { Check, Circle } from 'lucide-react';
import { PASSWORD_RULES } from '../../utils/passwordUtils';

// Live list of password rules, ticked off as the user types (shown up front, not after a failed submit)
export const PasswordChecklist = ({ password = '', id }) => (
  <ul id={id} className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1" aria-label="Password requirements">
    {PASSWORD_RULES.map((rule) => {
      const met = rule.test(password);
      return (
        <li
          key={rule.id}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {met ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Circle className="h-3 w-3 shrink-0" />}
          <span>
            {rule.label}
            <span className="sr-only">{met ? ' (done)' : ' (not yet)'}</span>
          </span>
        </li>
      );
    })}
  </ul>
);

export default PasswordChecklist;
