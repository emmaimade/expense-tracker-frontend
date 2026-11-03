import { ChevronDown } from 'lucide-react';

// FAQ question: a button that controls an answer region, announced to screen readers.
// The grid-rows animation fits answers of any length (no fixed max-height).
const FaqItem = ({ id, q, a, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 last:border-b-0 dark:border-gray-700">
    <h3>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        id={`faq-button-${id}`}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 sm:text-base dark:text-gray-100">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`}
        />
      </button>
    </h3>
    <div
      id={`faq-panel-${id}`}
      role="region"
      aria-labelledby={`faq-button-${id}`}
      className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">
        <p className="pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{a}</p>
      </div>
    </div>
  </div>
);

export default FaqItem;
