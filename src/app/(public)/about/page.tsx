import Link from "next/link";
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { profile } from "@/data/site";

const biography =
  "I am a data and software professional focused on translating complex information into useful decisions, polished digital experiences, and practical systems that help teams move forward with confidence.";

const careerBackground =
  "My work combines business intelligence, software development, research support, and technical training. I have supported organizations with dashboards, analytics workflows, web systems, process improvement, and clear communication that turns difficult data into action.";

const specializations = [
  "Data Analytics",
  "Business Intelligence",
  "Software Development",
  "Portfolio Strategy",
  "Technical Training",
  "Research Support",
];

const interests = ["AI workflows", "Product thinking", "Knowledge systems", "Digital transformation", "Leadership enablement"];
const technologies = ["Power BI", "Tableau", "SQL", "Python", "Excel", "Next.js", "Node.js", "MySQL", "SPSS"];
const objectives = [
  "Build digital solutions that are useful and understandable",
  "Help professionals communicate value with credibility",
  "Turn complex information into clear decisions and action",
];
const values = ["Clarity", "Evidence", "Professionalism", "Trust", "Impact"];

export default function AboutPage() {
  return (
    <main className="content-page">
      <div className="wrap content-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p className="section-kicker">01 / ABOUT</p>
        <h1>
          Analytical mind.<br />
          <em>Builder&apos;s hands.</em>
        </h1>
        <p className="content-lead">{biography}</p>
      </div>

      <section className="wrap principle-grid">
        <div>
          <p className="section-kicker">PROFILE</p>
          <h2>
            Professional background.<br />
            Purposeful execution.
          </h2>
        </div>

        <div className="principles">
          <div>
            <span>01</span>
            <strong>Career background</strong>
            <Check size={16} />
          </div>
          <div>
            <span>02</span>
            <strong>Specializations</strong>
            <Check size={16} />
          </div>
          <div>
            <span>03</span>
            <strong>Technology stack</strong>
            <Check size={16} />
          </div>
        </div>
      </section>

      <section className="wrap about-band-grid" style={{ marginTop: 32 }}>
        <div>
          <p className="section-kicker">BIOGRAPHY</p>
          <p>{careerBackground}</p>
        </div>
        <div>
          <p className="section-kicker">VALUES</p>
          <div className="about-skills">
            {values.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="about-band">
        <div className="wrap about-band-grid">
          <div>
            <p className="section-kicker">CAPABILITY MAP</p>
            <h2>
              One practice.<br />
              <span>Many lenses.</span>
            </h2>
          </div>
          <div className="about-skills">
            {specializations.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap principle-grid" style={{ paddingTop: 80 }}>
        <div>
          <p className="section-kicker">INTERESTS</p>
          <h2>What drives the work.</h2>
        </div>
        <div className="principles">
          {interests.map((interest, index) => (
            <div key={interest}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{interest}</strong>
              <Check size={16} />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap about-band-grid" style={{ marginBottom: 40 }}>
        <div>
          <p className="section-kicker">TECHNOLOGIES</p>
          <div className="about-skills">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="section-kicker">OBJECTIVES</p>
          <ul className="about-list">
            {objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap page-cta">
        <p>Want the longer version?</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link className="button button-dark" href="/cv">
            Read my CV <ArrowUpRight size={16} />
          </Link>
          <a className="button button-light" href="/resume.pdf" aria-label="Download CV">
            Download CV <ArrowDownToLine size={16} />
          </a>
        </div>
      </div>
    </main>
  );
}
