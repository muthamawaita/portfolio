import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioHighlights } from "@/data/site";

export default function PortfolioPage() {
  return (
    <main className="platform-page">
      <section className="wrap platform-page-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p>PORTFOLIO</p>
        <h1>
          Work worth<br />
          <em>landing on.</em>
        </h1>
        <span>
          The portfolio brings projects, capabilities, experience, certifications, and professional context into one clear story.
        </span>
        <Link className="button button-dark" href="/projects">
          Explore work <ArrowUpRight size={16} />
        </Link>
      </section>

      <section className="wrap portfolio-overview-grid">
        {portfolioHighlights.map((item) => (
          <article key={item.label} className="portfolio-overview-card">
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
