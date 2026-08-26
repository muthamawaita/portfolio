import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { skillGroups } from "@/data/site";

export default function SkillsPage() {
  return (
    <main className="platform-page">
      <section className="wrap platform-page-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p>CAPABILITIES</p>
        <h1>
          Skills that turn<br />
          <em>possibility into proof.</em>
        </h1>
        <span>
          A clear capability profile blends technical depth with evidence, context, and the kinds of problems each skill helps solve.
        </span>
      </section>

      <section className="wrap skill-grid">
        {skillGroups.map((group) => (
          <article key={group.category} className="skill-card">
            <div className="skill-card-header">
              <span>{group.category}</span>
              {group.featured ? <Star size={14} /> : null}
            </div>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <strong>{skill.name}</strong>
                  <small>
                    {skill.level} · {skill.years} years
                  </small>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="wrap section-note">
        <p>PROFILE FOCUS</p>
        <div>
          <span>Decision support</span>
          <span>Analytics</span>
          <span>Product thinking</span>
          <span>Web systems</span>
          <span>Research integrity</span>
        </div>
      </section>
    </main>
  );
}
