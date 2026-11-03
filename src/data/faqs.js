// Single source for FAQ content: the Help page shows every section, the landing page shows the
// items marked `landing`. Keep answers in step with the app when features change.
import { Sparkles, Receipt, Target, Globe2, ShieldCheck } from 'lucide-react';

export const FAQ_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: Sparkles,
    items: [
      {
        id: 'free',
        landing: true,
        q: 'Is SpendWise really free?',
        a: "Yes. There's no paid plan, no credit card and no ads. Every feature is available to everyone.",
      },
      {
        id: 'google',
        q: 'Can I sign up with Google?',
        a: 'Yes. Choose "Continue with Google" on the sign-up or login page, and you won\'t need a separate password.',
      },
      {
        id: 'verify-email',
        q: 'Why do I need to confirm my email?',
        a: "We send a confirmation link when you sign up so we know the address is really yours. It's where password-reset emails go. Until you confirm, a banner on the dashboard reminds you and lets you resend the email.",
      },
      {
        id: 'devices',
        landing: true,
        q: 'Can I use it on my phone?',
        a: 'Yes. SpendWise works in any modern browser on phones, tablets and computers, in light or dark mode.',
      },
    ],
  },
  {
    id: 'expenses',
    title: 'Expenses',
    icon: Receipt,
    items: [
      {
        id: 'add-expense',
        q: 'How do I add an expense?',
        a: 'Use the Add expense button in the top bar, or the + button in the bottom bar on a phone. Enter what it was, the amount, a category and the date. Your dashboard and budgets update straight away.',
      },
      {
        id: 'edit-expense',
        q: 'How do I edit or delete an expense?',
        a: 'Go to Expenses and use the pencil or bin icon on the row. On a phone, tap the expense to show its actions.',
      },
      {
        id: 'older-expenses',
        q: 'How do I find older expenses?',
        a: 'On the Expenses page, use the period filter: This month, Last month, Last 3 months, This year, All time or a custom range. You can also search and filter by category.',
      },
      {
        id: 'export',
        landing: true,
        q: 'Can I export my data?',
        a: 'Yes. On the Expenses page, choose Export to download your expenses as CSV or PDF for any date range.',
      },
      {
        id: 'categories',
        q: 'How do categories work?',
        a: "SpendWise comes with built-in categories. Add your own in Settings → Categories, or while adding an expense. You can rename or delete your own categories; built-in ones can't be changed.",
      },
    ],
  },
  {
    id: 'budgets',
    title: 'Budgets',
    icon: Target,
    items: [
      {
        id: 'how-budgets-work',
        q: 'How do budgets work?',
        a: 'You set a budget for each category you want to track on the Budgets page. Your monthly budget is the total of those category budgets. The budget card shows how much you\'ve spent in budgeted categories; spending in other categories is shown separately.',
      },
      {
        id: 'alerts',
        q: 'When do I get budget alerts?',
        a: "When a category reaches 80% of its budget you get a notification in the bell, and another when it reaches 100%. The Budgets page also lists categories that are close to or over their limit.",
      },
      {
        id: 'daily-amount',
        q: 'What is the "keep to … per day" amount?',
        a: "It's what's left of your budget divided by the days remaining in the month, including today. Spend no more than that each day and you'll stay on budget.",
      },
    ],
  },
  {
    id: 'currency',
    title: 'Currency',
    icon: Globe2,
    items: [
      {
        id: 'currencies',
        landing: true,
        q: 'Which currencies are supported?',
        a: 'Nine, including the Naira, US Dollar, Euro, British Pound, Japanese Yen, Indian Rupee and South African Rand. Your currency is detected when you sign up and can be changed any time in Settings → Preferences.',
      },
      {
        id: 'change-currency',
        landing: true,
        q: 'What happens if I change my currency?',
        a: 'You choose: convert your existing expenses and budgets at live exchange rates, or keep the numbers as they are and use the new currency from now on.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & security',
    icon: ShieldCheck,
    items: [
      {
        id: 'data-safety',
        landing: true,
        q: 'Is my financial data safe?',
        a: 'Passwords are hashed and never stored in plain text, all traffic uses HTTPS, and your session lives in a secure, http-only cookie. You can also sign in with Google. We never sell or share your data.',
      },
      {
        id: 'forgot-password',
        q: 'I forgot my password. What do I do?',
        a: 'Choose "Forgot password?" on the login page and we\'ll email you a link to set a new one.',
      },
      {
        id: 'change-password',
        q: 'How do I change my password?',
        a: "Go to Settings → Profile → Change password. Accounts created with Google don't have a password.",
      },
      {
        id: 'customise',
        q: 'Can I change how the app looks?',
        a: 'Yes. In Settings → Preferences you can switch between light and dark mode and change the text size. On a computer, the Sidebar button at the bottom of the sidebar keeps it expanded, collapsed or expanding on hover.',
      },
      {
        id: 'delete-account',
        q: 'How do I delete my account?',
        a: 'Go to Settings and choose Delete account at the bottom. This permanently removes your account and all of your expenses, budgets and categories.',
      },
    ],
  },
];

export const LANDING_FAQS = FAQ_SECTIONS.flatMap((section) => section.items.filter((item) => item.landing));

export default FAQ_SECTIONS;
