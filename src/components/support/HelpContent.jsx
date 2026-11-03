import { useState } from "react";
import { Mail, Search, X } from "lucide-react";
import FaqItem from "../common/FaqItem";
import { FAQ_SECTIONS } from "../../data/faqs";

const SUPPORT_EMAIL = "emmaimade14@gmail.com";

// Help content shared by the public /support page and the in-app /dashboard/help page
const HelpContent = () => {
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const sections = term
    ? FAQ_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => item.q.toLowerCase().includes(term) || item.a.toLowerCase().includes(term)
        ),
      })).filter((section) => section.items.length > 0)
    : FAQ_SECTIONS;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Heading + search */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">How can we help?</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Find answers to common questions, or email us.</p>
        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search questions"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Questions, one column with section headings */}
      {sections.length > 0 ? (
        <div className="mt-10 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} aria-labelledby={`help-${section.id}`}>
                <h2 id={`help-${section.id}`} className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  {section.title}
                </h2>
                <div className="rounded-xl border border-gray-100 bg-white px-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  {section.items.map((item) => (
                    <FaqItem
                      key={item.id}
                      id={item.id}
                      q={item.q}
                      a={item.a}
                      // While searching, show the matching answers open
                      isOpen={openItem === item.id || !!term}
                      onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No results for &ldquo;<span className="font-medium text-gray-700 dark:text-gray-200">{search}</span>&rdquo;
          </p>
          <button onClick={() => setSearch("")} className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            Clear search
          </button>
        </div>
      )}

      {/* Contact: honest about response time, and shows the address for people without a mail app */}
      <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <span className="inline-flex rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          <Mail className="h-5 w-5" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Still need help?</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-600 dark:text-gray-400">
          Email us and we&apos;ll get back to you, usually within a day or two.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=SpendWise%20support`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          or write to <span className="select-all font-medium text-gray-700 dark:text-gray-300">{SUPPORT_EMAIL}</span>
        </p>
      </div>
    </div>
  );
};

export default HelpContent;
