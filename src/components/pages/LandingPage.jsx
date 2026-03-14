import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SpendWiseLogo from "../common/SpendWiseLogo";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  { icon: "💳", title: "Effortless Tracking", desc: "Log and categorize expenses in seconds." },
  { icon: "📊", title: "Smart Analytics", desc: "Beautiful charts that reveal exactly where your money goes." },
  { icon: "🎯", title: "Budget Goals", desc: "Set limits per category. Get alerts before you overspend." },
  { icon: "🌍", title: "Multi-Currency", desc: "Track in any currency with live exchange rates." },
  { icon: "🔒", title: "Bank-Level Security", desc: "JWT sessions, encrypted data, and Google OAuth." },
  { icon: "📱", title: "Works Everywhere", desc: "Fully responsive — desktop, tablet, and mobile." },
];

const VALUES = [
  { icon: "🎯", title: "Built for clarity", desc: "No clutter, no noise. Just the information you actually need." },
  { icon: "🔓", title: "Free, always", desc: "No paywalls, no hidden fees. SpendWise is free for everyone." },
  { icon: "🤝", title: "Privacy first", desc: "Your financial data is yours. We never sell or share it." },
  { icon: "⚡", title: "Fast by design", desc: "Lightweight, responsive, and built to stay out of your way." },
];

const STEPS = [
  { number: "01", title: "Create your account", desc: "Sign up in under 60 seconds. We detect your local currency automatically.", color: "#6366f1", icon: "✦" },
  { number: "02", title: "Log your expenses", desc: "Add expenses, categorize spending, and set budgets per category.", color: "#8b5cf6", icon: "📝" },
  { number: "03", title: "Gain clarity", desc: "Watch your dashboard come alive. Hit your savings goals.", color: "#06b6d4", icon: "📈" },
];

const TESTIMONIALS = [
  { name: "Amara O.", role: "Freelance Designer", avatar: "AO", color: "#6366f1", quote: "I've saved more in 3 months than I did all of last year. The analytics show exactly where my money disappears.", stars: 5 },
  { name: "James K.", role: "Software Engineer", avatar: "JK", color: "#8b5cf6", quote: "The multi-currency support is a game changer. I travel for work and finally have everything in one place.", stars: 5 },
  { name: "Priya M.", role: "Product Manager", avatar: "PM", color: "#06b6d4", quote: "I've tried 6 expense trackers. None had budgets this intuitive. The overspend alerts are genuinely useful.", stars: 5 },
];

const STATS = [
  { value: "2K+", label: "Active Users" },
  { value: "2M+", label: "Expenses Tracked" },
  { value: "7+", label: "Currencies" },
  { value: "99.9%", label: "Uptime" },
];

const FAQS = [
  { q: "Is SpendWise really free?", a: "Yes — 100% free, forever. No credit card required, no hidden fees, no premium tier. Everything you see is available to every user." },
  { q: "Is my financial data safe?", a: "Absolutely. All data is encrypted, sessions are secured with JWT tokens, and we support Google OAuth. We never sell or share your data with third parties." },
  { q: "Which currencies are supported?", a: "SpendWise supports 7+ currencies with live exchange rates. Your local currency is detected automatically when you sign up, and you can change it anytime in settings." },
  { q: "Can I use SpendWise on my phone?", a: "Yes. SpendWise is fully responsive and works on any device — desktop, tablet, or mobile — directly in your browser." },
  { q: "What happens if I change my currency?", a: "You can choose to convert your existing expenses and budgets using live exchange rates, or keep the numbers as-is and only apply the new currency going forward." },
  { q: "Can I sign up with Google?", a: "Yes. You can create an account and log in using your Google account — no password needed." },
];

// ── Helpers ───────────────────────────────────────────────────────

const Stars = ({ count = 5 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
    ))}
  </div>
);

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
};

const smoothScroll = (e, href) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const AccordionItem = ({ q, a, isOpen, onToggle }) => (
  <div
    style={{
      borderBottom: "1px solid #f3f4f6",
      transition: "all 0.2s",
    }}
  >
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "20px 0",
        background: "none", border: "none", cursor: "pointer",
        textAlign: "left", gap: 16,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.4 }}>{q}</span>
      <span style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: isOpen ? "#6366f1" : "#f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.25s",
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
          <path d="M2 4L6 8L10 4" stroke={isOpen ? "#fff" : "#6b7280"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
    <div style={{
      maxHeight: isOpen ? 200 : 0,
      overflow: "hidden",
      transition: "max-height 0.3s ease",
    }}>
      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, paddingBottom: 20 }}>{a}</p>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const scrolled = useScrolled();

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#fafaf9", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sw-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.3s; }
        .sw-nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .sw-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .sw-nav-links { display: flex; align-items: center; gap: 28px; list-style: none; }
        .sw-nav-links a { text-decoration: none; color: #4b5563; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .sw-nav-links a:hover { color: #6366f1; }
        .sw-nav-actions { display: flex; align-items: center; gap: 12px; }

        .sw-btn-ghost { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #374151; background: transparent; border: 1.5px solid #e5e7eb; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .sw-btn-ghost:hover { border-color: #6366f1; color: #6366f1; }
        .sw-btn-primary { padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #fff; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(99,102,241,0.3); display: inline-block; }
        .sw-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
        .sw-btn-primary-lg { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; color: #fff; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(99,102,241,0.35); display: inline-block; }
        .sw-btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
        .sw-btn-outline-lg { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; color: #6366f1; background: #fff; border: 2px solid #e0e0ff; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .sw-btn-outline-lg:hover { border-color: #6366f1; background: #f5f3ff; }
        .sw-btn-white { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; color: #6366f1; background: #fff; border: none; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: inline-block; }
        .sw-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
        .sw-btn-ghost-white { padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.8); background: transparent; border: 1.5px solid rgba(255,255,255,0.25); text-decoration: none; transition: all 0.2s; display: inline-block; }
        .sw-btn-ghost-white:hover { border-color: rgba(255,255,255,0.6); color: #fff; }

        .sw-hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 140px 24px 100px; position: relative; overflow: hidden; }
        .sw-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 100px; background: #ede9fe; color: #6d28d9; font-size: 13px; font-weight: 600; margin-bottom: 28px; border: 1px solid #ddd6fe; }
        .sw-hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(40px, 6.5vw, 72px); font-weight: 800; line-height: 1.07; letter-spacing: -2px; color: #1a1a2e; max-width: 680px; margin-bottom: 20px; }
        .sw-hero h1 em { font-style: normal; background: linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sw-hero-sub { font-size: 17px; color: #6b7280; max-width: 360px; line-height: 1.65; margin-bottom: 36px; }
        .sw-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 44px; }
        .sw-hero-social { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #9ca3af; }
        .sw-hero-avatars { display: flex; }
        .sw-avatar-sm { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; margin-left: -7px; }
        .sw-avatar-sm:first-child { margin-left: 0; }

        .sw-stats { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 56px 24px; }
        .sw-stats-inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; text-align: center; }
        .sw-stat-value { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; color: #fff; line-height: 1; }
        .sw-stat-label { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 6px; font-weight: 500; }

        .sw-section-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .sw-section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6366f1; margin-bottom: 10px; }
        .sw-section-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; line-height: 1.15; letter-spacing: -0.8px; color: #1a1a2e; margin-bottom: 10px; max-width: 480px; }
        .sw-section-sub { font-size: 15px; color: #6b7280; line-height: 1.65; max-width: 340px; }
        .sw-section-title.centered, .sw-section-sub.centered { margin-left: auto; margin-right: auto; text-align: center; }

        .sw-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 52px; }
        .sw-feature-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px; padding: 24px; transition: all 0.3s; }
        .sw-feature-card:hover { border-color: #e0e0ff; box-shadow: 0 10px 36px rgba(99,102,241,0.1); transform: translateY(-2px); }
        .sw-feature-icon { font-size: 26px; margin-bottom: 12px; width: 48px; height: 48px; background: #f5f3ff; border-radius: 11px; display: flex; align-items: center; justify-content: center; }
        .sw-feature-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 5px; }
        .sw-feature-desc { font-size: 13px; color: #6b7280; line-height: 1.6; }

        .sw-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 52px; }
        .sw-step { position: relative; background: #fff; border-radius: 18px; padding: 28px 24px; border: 1.5px solid #f3f4f6; transition: all 0.3s; overflow: hidden; }
        .sw-step:hover { border-color: #e0e0ff; box-shadow: 0 10px 36px rgba(99,102,241,0.1); }
        .sw-step-number { font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; opacity: 0.06; line-height: 1; position: absolute; top: 14px; right: 18px; }
        .sw-step-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 16px; }
        .sw-step-title { font-size: 17px; font-weight: 700; color: #1a1a2e; margin-bottom: 7px; }
        .sw-step-desc { font-size: 13px; color: #6b7280; line-height: 1.65; }

        .sw-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 52px; }
        .sw-testimonial { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; padding: 24px; transition: all 0.3s; }
        .sw-testimonial:hover { border-color: #e0e0ff; box-shadow: 0 10px 36px rgba(99,102,241,0.1); transform: translateY(-2px); }
        .sw-testimonial-quote { font-size: 14px; color: #4b5563; line-height: 1.75; font-style: italic; margin: 12px 0 18px; }
        .sw-testimonial-quote::before { content: '"'; }
        .sw-testimonial-quote::after { content: '"'; }
        .sw-t-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }

        .sw-cta { background: linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%); padding: 96px 24px; text-align: center; }
        .sw-cta h2 { font-family: 'Syne', sans-serif; font-size: clamp(30px, 4.5vw, 48px); font-weight: 800; color: #fff; margin: 0 auto 12px; letter-spacing: -1px; max-width: 500px; line-height: 1.1; }
        .sw-cta p { font-size: 15px; color: rgba(255,255,255,0.5); max-width: 280px; margin: 0 auto 32px; line-height: 1.6; }
        .sw-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .sw-footer { background: #0f0f1a; padding: 60px 24px 28px; }
        .sw-footer-inner { max-width: 1100px; margin: 0 auto; }
        .sw-footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .sw-footer-brand p { font-size: 13px; color: #6b7280; max-width: 220px; line-height: 1.65; margin-top: 12px; }
        .sw-footer-col h4 { font-size: 11px; font-weight: 700; color: #f9fafb; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 1.5px; }
        .sw-footer-col a { display: block; text-decoration: none; font-size: 13px; color: #6b7280; margin-bottom: 9px; transition: color 0.2s; }
        .sw-footer-col a:hover { color: #a5b4fc; }
        .sw-footer-bottom { border-top: 1px solid #1f2937; padding-top: 22px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 12px; color: #4b5563; }

        .sw-mobile-menu { position: fixed; top: 68px; left: 0; right: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(16px); border-bottom: 1px solid #f3f4f6; padding: 16px 24px 24px; z-index: 99; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .sw-mobile-menu a { display: block; text-decoration: none; padding: 11px 0; font-size: 15px; font-weight: 500; color: #374151; border-bottom: 1px solid #f9f9f9; }
        .sw-mobile-menu-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

        @media (max-width: 768px) {
          .sw-nav-links, .sw-nav-actions { display: none; }
          .sw-menu-btn { display: flex !important; }
          .sw-stats-inner { grid-template-columns: repeat(2,1fr); }
          .sw-footer-top { grid-template-columns: 1fr 1fr; }
          .sw-footer-brand { grid-column: 1 / -1; }
          .sw-about-grid { grid-template-columns: 1fr !important; }
          .sw-faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`sw-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="sw-nav-inner">
          <Link to="/"><SpendWiseLogo className="h-9" showText={true} /></Link>
          <ul className="sw-nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={(e) => smoothScroll(e, l.href)}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="sw-nav-actions">
            <Link to="/login" className="sw-btn-ghost">Log in</Link>
            <Link to="/register" className="sw-btn-primary">Get started free</Link>
          </div>
          <button
            className="sw-menu-btn"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="sw-mobile-menu">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={(e) => { smoothScroll(e, l.href); setMenuOpen(false); }}>{l.label}</a>
            ))}
            <div className="sw-mobile-menu-actions">
              <Link to="/login" className="sw-btn-ghost" style={{ textAlign: "center" }}>Log in</Link>
              <Link to="/register" className="sw-btn-primary" style={{ textAlign: "center" }}>Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="sw-hero">
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#6366f1", filter: "blur(90px)", opacity: 0.1, top: -180, right: -80 }} />
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "#06b6d4", filter: "blur(90px)", opacity: 0.08, bottom: 40, left: -80 }} />
        </div>
        <div className="sw-hero-badge"><span>✦</span> 100% free — no credit card required</div>
        <h1>Your money,<br /><em>finally under control</em></h1>
        <p className="sw-hero-sub">Track spending. Set budgets. Gain clarity.<br />Built for real people, not spreadsheets.</p>
        <div className="sw-hero-actions">
          <Link to="/register" className="sw-btn-primary-lg">Start tracking for free →</Link>
          <a href="#how-it-works" className="sw-btn-outline-lg" onClick={(e) => smoothScroll(e, "#how-it-works")}>How it works</a>
        </div>
        <div className="sw-hero-social">
          <div className="sw-hero-avatars">
            {[["#6366f1","AO"],["#8b5cf6","JK"],["#06b6d4","PM"],["#f59e0b","RN"]].map(([c,i]) => (
              <div key={i} className="sw-avatar-sm" style={{ background: c }}>{i}</div>
            ))}
          </div>
          <span>Loved by <strong style={{ color: "#1a1a2e" }}>2,000+</strong> users</span>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: "88px 0", background: "#fff" }}>
        <div className="sw-section-wrap">
          <div className="sw-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Left — mission */}
            <div>
              <div className="sw-section-label">About SpendWise</div>
              <h2 className="sw-section-title">Built out of frustration with complicated finance tools</h2>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.75, marginTop: 16, maxWidth: 420 }}>
                Most expense trackers are either too simple to be useful or too complex to actually use. SpendWise was built to sit exactly in between — powerful enough to give you real insight, simple enough that you'll actually stick with it.
              </p>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.75, marginTop: 12, maxWidth: 420 }}>
                Our mission is simple: help everyday people understand their money without needing an accounting degree.
              </p>
              <Link to="/register" className="sw-btn-primary-lg" style={{ marginTop: 28, display: "inline-block" }}>
                Join for free →
              </Link>
            </div>

            {/* Right — value points */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {VALUES.map((v) => (
                <div key={v.title} style={{
                  background: "#f9f8ff",
                  border: "1.5px solid #ede9fe",
                  borderRadius: 14,
                  padding: "20px 18px",
                }}>
                  <div style={{
                    fontSize: 22, marginBottom: 10,
                    width: 44, height: 44, background: "#ede9fe",
                    borderRadius: 10, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {v.icon}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{v.title}</div>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="sw-stats">
        <div className="sw-stats-inner">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="sw-stat-value">{value}</div>
              <div className="sw-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "88px 0", background: "#fafaf9" }}>
        <div className="sw-section-wrap">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="sw-section-label">Features</div>
              <h2 className="sw-section-title">Everything you need to master your money</h2>
            </div>
            <p className="sw-section-sub">Powerful tools, zero complexity.</p>
          </div>
          <div className="sw-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="sw-feature-card">
                <div className="sw-feature-icon">{f.icon}</div>
                <div className="sw-feature-title">{f.title}</div>
                <p className="sw-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: "88px 0", background: "#f9f8ff" }}>
        <div className="sw-section-wrap">
          <div style={{ textAlign: "center" }}>
            <div className="sw-section-label">How it works</div>
            <h2 className="sw-section-title centered">Up and running in under 2 minutes</h2>
            <p className="sw-section-sub centered" style={{ marginBottom: 0 }}>Sign up and you're ready. No setup required.</p>
          </div>
          <div className="sw-steps">
            {STEPS.map((step) => (
              <div key={step.number} className="sw-step">
                <div className="sw-step-number" style={{ color: step.color }}>{step.number}</div>
                <div className="sw-step-icon" style={{ background: step.color + "18" }}>{step.icon}</div>
                <div className="sw-step-title">{step.title}</div>
                <p className="sw-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ padding: "88px 0", background: "#fff" }}>
        <div className="sw-section-wrap">
          <div style={{ textAlign: "center" }}>
            <div className="sw-section-label">Testimonials</div>
            <h2 className="sw-section-title centered">Real people, real results</h2>
            <p className="sw-section-sub centered" style={{ marginBottom: 52 }}>
              Join thousands who've taken control of their finances.
            </p>
          </div>
          <div className="sw-testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="sw-testimonial">
                <Stars count={t.stars} />
                <p className="sw-testimonial-quote">{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="sw-t-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "88px 0", background: "#f9f8ff" }}>
        <div className="sw-section-wrap">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="sw-section-label">FAQ</div>
            <h2 className="sw-section-title centered">Questions? We've got answers</h2>
            <p className="sw-section-sub centered">
              Can't find what you're looking for? <a href="mailto:emmaimade14@gmail.com?subject=SpendWise Support" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Contact support →</a>
            </p>
          </div>

          {/* Two-column accordion */}
          <div className="sw-faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            {/* Left column */}
            <div>
              {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((item, i) => (
                <AccordionItem
                  key={i}
                  q={item.q}
                  a={item.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
            {/* Right column */}
            <div>
              {FAQS.slice(Math.ceil(FAQS.length / 2)).map((item, i) => {
                const idx = i + Math.ceil(FAQS.length / 2);
                return (
                  <AccordionItem
                    key={idx}
                    q={item.q}
                    a={item.a}
                    isOpen={openFaq === idx}
                    onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sw-cta">
        <div className="sw-section-label" style={{ color: "#a5b4fc" }}>Get started today</div>
        <h2>Stop wondering where your money went</h2>
        <p>Free forever. No credit card. No catch.</p>
        <div className="sw-cta-actions">
          <Link to="/register" className="sw-btn-white">Create free account →</Link>
          <Link to="/login" className="sw-btn-ghost-white">I already have an account</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="sw-footer">
        <div className="sw-footer-inner">
          <div className="sw-footer-top">
            <div className="sw-footer-brand">
              <SpendWiseLogo className="h-8" showText={true} />
              <p>Smarter budgeting for everyday people.</p>
            </div>
            <div className="sw-footer-col">
              <h4>Product</h4>
              <a href="#features" onClick={(e) => smoothScroll(e, "#features")}>Features</a>
              <a href="#how-it-works" onClick={(e) => smoothScroll(e, "#how-it-works")}>How it works</a>
              <a href="#testimonials" onClick={(e) => smoothScroll(e, "#testimonials")}>Testimonials</a>
              <a href="#faq" onClick={(e) => smoothScroll(e, "#faq")}>FAQ</a>
            </div>
            <div className="sw-footer-col">
              <h4>Account</h4>
              <Link to="/register">Sign up</Link>
              <Link to="/login">Log in</Link>
              <Link to="/forgot-password">Forgot password</Link>
            </div>
            <div className="sw-footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <a href="/support" style={{ color: "#6b7280", textDecoration: "none", display: "block", marginBottom: 9, fontSize: 13, transition: "color 0.2s" }}>Support</a>
            </div>
          </div>
          <div className="sw-footer-bottom">
            <span>© {new Date().getFullYear()} SpendWise. All rights reserved.</span>
            <span>Made with ♥ for people who care about their finances</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;