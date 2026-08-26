import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { educationHistory } from "@/data/site";

export default function EducationPage() {
  return (
    <main className="platform-page">
      <section className="wrap platform-page-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p>EDUCATION</p>
        <h1>
          Learning with<br />
          <em>a visible direction.</em>
        </h1>
        <span>
          Formal study and practical learning work best when they sit beside the work they informed.
        </span>
      </section>

      <section className="wrap education-grid">
        {educationHistory.map((item, index) => (
          <article key={`${item.institution}-${item.qualification}`} className="education-card">
            <small>{String(index + 1).padStart(2, "0")} / {item.dates}</small>
            <h2>{item.qualification}</h2>
            <p className="timeline-company">{item.institution}</p>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
