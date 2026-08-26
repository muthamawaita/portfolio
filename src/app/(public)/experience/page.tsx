import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { experienceTimeline } from "@/data/site";

export default function ExperiencePage() {
  return (
    <main className="platform-page">
      <section className="wrap platform-page-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p>EXPERIENCE</p>
        <h1>
          Give every role<br />
          <em>its proper weight.</em>
        </h1>
        <span>
          A strong professional history connects responsibilities, technical depth, and measurable outcomes into a credible narrative.
        </span>
      </section>

      <section className="wrap experience-timeline">
        {experienceTimeline.map((job, index) => (
          <article key={`${job.company}-${job.role}`} className="timeline-item">
            <div className="timeline-meta">
              <small>
                {String(index + 1).padStart(2, "0")} / {job.type}
              </small>
              <span>{job.dates}</span>
            </div>
            <h2>{job.role}</h2>
            <p className="timeline-company">{job.company}</p>
            <p>{job.summary}</p>
            <ul>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
