import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { certifications } from "@/data/site";

export default function CertificationsPage() {
  return (
    <main className="platform-page">
      <section className="wrap platform-page-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p>CERTIFICATIONS</p>
        <h1>
          Credentials with<br />
          <em>context.</em>
        </h1>
        <span>
          Verified learning is most useful when it sits next to the work it supports and the skills it confirms.
        </span>
      </section>

      <section className="wrap certification-grid">
        {certifications.map((item) => (
          <article key={item.credential} className="cert-card">
            <div className="cert-card-head">
              <Award size={18} />
              <span>{item.issued}</span>
            </div>
            <h2>{item.title}</h2>
            <p className="timeline-company">{item.issuer}</p>
            <small>{item.credential}</small>
            <p>{item.emphasis}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
