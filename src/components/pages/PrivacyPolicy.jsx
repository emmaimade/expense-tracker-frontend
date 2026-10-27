import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CONTACT_EMAIL = 'emmaimade14@gmail.com';
const LAST_UPDATED = 'October 25, 2026';

const Section = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h2>
    <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
  </section>
);

const Mail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-600 dark:text-indigo-400 underline">
    {CONTACT_EMAIL}
  </a>
);

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to SpendWise
        </Link>

        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: {LAST_UPDATED}</p>

        <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          SpendWise is a free personal expense tracker. This page explains, in plain language, what information
          SpendWise collects, why, who it is shared with, and how you can delete it. If anything is unclear,
          email <Mail />.
        </p>

        <Section title="What we collect">
          <p><strong>Account details</strong> - your first and last name, email address and preferred currency.
            If you sign up with email, we store your password only as a secure one-way hash, never the password
            itself. If you sign in with Google, we receive your name, email address and Google account ID.</p>
          <p><strong>Your financial entries</strong> - the expenses you add (amount, description, category and date),
            your budgets and any custom categories. If you change currency and convert your data, we also keep the
            original amounts and the exchange rate used.</p>
          <p><strong>Account activity</strong> - when your account was created, your first and most recent sign-in,
            and whether you have confirmed your email address.</p>
          <p><strong>Temporary security codes</strong> - links for confirming your email, resetting your password or
            changing your email address. They are stored in hashed form and expire after 15 minutes to 24 hours.</p>
          <p><strong>Your IP address</strong> - used when you sign up to suggest your local currency (looked up in an
            offline country database), and kept briefly in memory to limit repeated sign-in attempts. We don't store
            it with your account.</p>
          <p>We don&apos;t collect payment details, bank account information or government IDs, and we don&apos;t use
            analytics, advertising or tracking tools.</p>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc pl-6 space-y-2">
            <li>To run SpendWise: show your expenses, budgets, charts and exports.</li>
            <li>To keep your account secure: sign-in, password resets and email confirmation.</li>
            <li>To send account emails: confirming your email, welcome, password reset and security notices
              (for example, when your password or email changes). We don&apos;t send marketing emails.</li>
          </ul>
          <p>We never sell your data or use it for advertising.</p>
        </Section>

        <Section title="Services we use">
          <p>SpendWise relies on these providers, who process data only to provide their service to us:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Vercel</strong> - hosts the SpendWise website.</li>
            <li><strong>Render</strong> - hosts the SpendWise server.</li>
            <li><strong>A MongoDB database host</strong> - stores your account and financial entries.</li>
            <li><strong>Brevo</strong> - delivers our emails (your name and email address are sent with each message).</li>
            <li><strong>Google</strong> - only if you choose &quot;Continue with Google&quot; to sign in.</li>
            <li><strong>Cloudinary</strong> - hosts the logo shown in our emails; your email app loads it from there.</li>
            <li><strong>Exchange-rate services</strong> - receive only currency codes (such as USD to NGN), never your
              personal data.</li>
          </ul>
          <p>These providers may store data in other countries. They also keep their own technical logs, which can
            include IP addresses, under their own privacy policies.</p>
        </Section>

        <Section title="Stored in your browser">
          <p>SpendWise saves a few things in your browser&apos;s local storage so you stay signed in and your settings
            stick: your sign-in token, a copy of your profile, your display preferences (such as theme) and your
            in-app notifications. We don&apos;t use advertising or tracking cookies. Signing out clears your sign-in
            details; deleting your account clears all of it on that device.</p>
        </Section>

        <Section title="How long we keep it">
          <p>We keep your information for as long as you have an account. When you delete your account, your
            profile, expenses, budgets and custom categories are permanently removed from our database straight
            away. Copies may remain for a limited time in our providers&apos; system backups or logs, under their
            own retention policies.</p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>See and correct your data</strong> - view and edit your profile in Settings, and edit or
              delete any expense.</li>
            <li><strong>Download your data</strong> - export your expenses as CSV or PDF from the Expenses page.</li>
            <li><strong>Delete your account</strong> - Settings &rarr; Profile &rarr; Delete account. This is
              immediate and permanent.</li>
            <li><strong>Anything else</strong> - email <Mail /> and we&apos;ll respond within 30 days.</li>
          </ul>
        </Section>

        <Section title="Security">
          <p>All traffic uses HTTPS, passwords and security codes are stored hashed, and repeated sign-in attempts are
            rate limited. No online service can be perfectly secure, so please use a strong, unique password.</p>
        </Section>

        <Section title="Children">
          <p>SpendWise isn&apos;t intended for children under 16, and we don&apos;t knowingly collect their data. If you
            believe a child has created an account, contact us and we&apos;ll delete it.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>If we change this policy, we&apos;ll update the date at the top of this page. For significant changes,
            we&apos;ll also let you know by email or in the app.</p>
        </Section>

        <Section title="Contact">
          <p>Questions or requests about your data: <Mail />.</p>
        </Section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
