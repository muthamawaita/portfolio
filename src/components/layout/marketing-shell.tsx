import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MarketingHeader() {
  return (
    <header className="platform-header">
      <div className="wrap platform-nav">
        <Link className="platform-brand" href="/" aria-label="JMW Studio home">
          <span className="platform-brand-mark">JMW Studio</span>
        </Link>

        <div className="platform-actions">
          <Link href="/studio">My portfolio</Link>
          <Link href="/signup">Create portfolio</Link>
          <Link className="platform-cta" href="/admin/login">
            Log in <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="platform-footer">
      <div className="wrap">
        <div>
          <strong>JMW Studios</strong>
          <p>Creative portfolio systems for professionals, founders, and teams who want a premium digital presence that feels polished and memorable.</p>
        </div>
        <div className="footer-links">
          <Link href="/studio">My portfolio</Link>
          <Link href="/signup">Create portfolio</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <small>© 2026 JMW Studios. Premium portfolios built for growth.</small>
      </div>
    </footer>
  );
}
