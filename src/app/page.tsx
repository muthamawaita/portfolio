import Link from "next/link";
import { ArrowRight, Briefcase, Code2, Download, Mail, MapPin, Sparkles } from "lucide-react";

const projects = [
  {
    title: "Tableau & Power BI Performance Dashboards",
    type: "Business Intelligence",
    summary: "Developed operational dashboards for institutional decision-making by transforming raw data into clear, actionable performance insights.",
  },
  {
    title: "Research & Statistical Analysis Work",
    type: "Data Analytics",
    summary: "Supported over 1,000 research projects through data cleaning, statistical analysis, visualization, and evidence-led reporting.",
  },
  {
    title: "Systems, Training & Product Support",
    type: "Software & Capacity Building",
    summary: "Built practical software support tools, taught digital and analytical skills, and translated operational requirements into usable solutions.",
  },
];

const skills = [
  "Tableau",
  "Power BI",
  "SPSS",
  "Excel",
  "SQL",
  "Python",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Node.js",
  "React.js",
  "PHP",
  "Java",
  "MATLAB",
  "Research Methods",
  "Technical Training",
  "Dashboard Design",
  "Data Cleaning",
  "Systems Analysis",
];

const services = [
  {
    title: "Business Intelligence",
    description: "Tableau and Power BI dashboards that convert complex operational data into reliable, decision-ready reporting.",
  },
  {
    title: "Data Analysis & Research",
    description: "Clean, validate, and interpret structured and unstructured datasets with statistical reasoning and clear reporting.",
  },
  {
    title: "Software & Training",
    description: "Software support, database management, and practical technical training for teams building digital capability.",
  },
];

const testimonials = [
  {
    quote: "Jeremiah blends technical depth with business clarity. Every solution is structured, practical, and easy to act on.",
    name: "Operations Leader",
  },
  {
    quote: "He has a rare ability to convert raw complexity into a clear story, useful tools, and confident execution.",
    name: "Product Partner",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="portfolio-page">
      <header className="portfolio-header wrap">
        <div className="brand-block">
          <span className="brand-mark">JW</span>
          <div>
            <strong>JEREMIAH MUTHAMA WAITA</strong>
            <small>Data Analyst • Software Developer • Instructor</small>
          </div>
        </div>

        <nav className="portfolio-nav" aria-label="Main navigation">
          <Link href="#about">About</Link>
          <Link href="#work">Work</Link>
          <Link href="#skills">Skills</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <Link className="button button-primary" href="#contact">
          Let&apos;s work together
        </Link>
      </header>

      <section className="portfolio-hero wrap">
        <div className="portfolio-copy">
          <p className="eyebrow">DATA ANALYTICS • BUSINESS INTELLIGENCE • SOFTWARE DEVELOPMENT</p>
          <h1>
            Turning complexity into <span>clear decisions.</span>
          </h1>
          <p className="lead">
            I am Jeremiah Muthama Waita, a data and software professional with hands-on experience in business intelligence, statistical analysis, database management, and software development.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#work">
              View my work <ArrowRight size={16} />
            </Link>
            <Link className="button button-secondary" href="#contact">
              Contact me
            </Link>
          </div>

          <div className="hero-meta" aria-label="Highlights">
            <span><Sparkles size={14} /> Data storyteller</span>
            <span><Code2 size={14} /> Software developer</span>
            <span><Briefcase size={14} /> Technical trainer</span>
          </div>
        </div>

        <aside className="portfolio-panel" aria-label="Profile summary">
          <div className="panel-badge">Available for select opportunities</div>
          <h2>Driven by evidence, systems thinking, and practical outcomes.</h2>
          <ul>
            <li>
              <strong>5+</strong>
              <span>years across analytics, software, and training</span>
            </li>
            <li>
              <strong>1,000+</strong>
              <span>research and analytics projects delivered</span>
            </li>
            <li>
              <strong>100%</strong>
              <span>focus on actionable insight and execution</span>
            </li>
          </ul>
        </aside>
      </section>

      <section id="about" className="portfolio-section wrap">
        <div className="section-kicker">About</div>
        <div className="about-grid">
          <div>
            <h2>I translate complex data and operational requirements into tools, dashboards, and decisions people can trust.</h2>
          </div>
          <div>
            <p>
              My work sits at the intersection of business intelligence, software development, research, and user training. I help organizations make sense of operational data, improve visibility, and build practical systems that support better decisions.
            </p>
            <p>
              From Tableau and Power BI dashboards to database systems, digital support tools, and hands-on technical training, I bring a combination of analytical rigor and implementation capability that helps teams move from information to action.
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="portfolio-section portfolio-section-alt">
        <div className="wrap">
          <div className="section-header">
            <div className="section-kicker">Selected work</div>
            <h2>Work shaped around insight, execution, and measurable outcomes.</h2>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <small>{project.type}</small>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <Link href="#contact">Discuss a similar project <ArrowRight size={15} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="portfolio-section wrap">
        <div className="section-kicker">Capabilities</div>
        <div className="skills-layout">
          <div>
            <h2>Analytical thinking, product clarity, and practical build execution.</h2>
          </div>
          <div className="skill-cloud" aria-label="Professional skills and tools">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section portfolio-section-alt">
        <div className="wrap">
          <div className="section-header">
            <div className="section-kicker">Services</div>
            <h2>Focused support for data, digital products, and better decision-making.</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <span className="service-index">0{services.indexOf(service) + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section portfolio-section-accent">
        <div className="wrap highlight-box">
          <div>
            <div className="section-kicker">Focus</div>
            <h2>Helping organizations turn information into action.</h2>
          </div>
          <ul>
            <li>Business intelligence and performance reporting</li>
            <li>Product and workflow design</li>
            <li>Data analysis and decision support</li>
            <li>Technical training and knowledge transfer</li>
          </ul>
        </div>
      </section>

      <section className="portfolio-section portfolio-section-alt">
        <div className="wrap">
          <div className="section-header">
            <div className="section-kicker">Testimonials</div>
            <h2>Trusted for clear thinking and measurable results.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="testimonial-card">
                <p>“{item.quote}”</p>
                <footer>{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="portfolio-section wrap">
        <div className="contact-card">
          <div>
            <div className="section-kicker">Contact</div>
            <h2>Let&apos;s build something useful and valuable.</h2>
          </div>

          <div className="contact-details">
            <a href="mailto:waitamuthama2021@gmail.com">
              <Mail size={18} /> waitamuthama2021@gmail.com
            </a>
            <a href="tel:+254794158981">
              <Mail size={18} /> 0794158981 / 0705297607
            </a>
            <a href="https://www.linkedin.com/in/waita-muthama-a40769188/" target="_blank" rel="noreferrer">
              <MapPin size={18} /> LinkedIn
            </a>
            <a href="https://github.com/waitamuthama" target="_blank" rel="noreferrer">
              <Code2 size={18} /> GitHub
            </a>
            <span>
              <MapPin size={18} /> Nairobi, Kenya
            </span>
            <Link href="#top" className="text-link-inline">
              <Download size={16} /> Portfolio overview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
