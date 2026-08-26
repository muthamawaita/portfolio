import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";
import { ProjectGallery } from "@/components/projects/project-gallery";

export function generateStaticParams() { return portfolioProjects.map((project) => ({ slug: project.slug })); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  const visibleGallery = project.gallery.slice(0, 5);

  return (
    <main className="project-detail">
      <div className="wrap detail-top">
        <Link className="back-link" href="/projects">
          <ArrowLeft size={16} /> All projects
        </Link>
        <p className="section-kicker">
          {project.number} / {project.type}
        </p>
        <h1>{project.title}</h1>
        <p className="detail-summary">{project.summary}</p>
        <div className="detail-tools">
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>

      <div className="wrap detail-layout">
        <aside>
          <div className="detail-metric">
            <strong>{project.metric}</strong>
            <span>{project.metricLabel}</span>
          </div>

          <div className="detail-meta-list">
            <div>
              <span className="detail-meta-label">Status</span>
              <strong>{project.status}</strong>
            </div>
            <div>
              <span className="detail-meta-label">Completed</span>
              <strong>{project.completedDate}</strong>
            </div>
            {project.client ? (
              <div>
                <span className="detail-meta-label">Client</span>
                <strong>{project.client}</strong>
              </div>
            ) : null}
            <div>
              <span className="detail-meta-label">Role</span>
              <strong>{project.role}</strong>
            </div>
          </div>

          <div className="detail-links">
            {project.links.map((link) => (
              <Link
                key={link.label}
                className="button button-dark"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                {link.label} <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </aside>

        <div className="detail-content">
          <DetailBlock title="The problem" text={project.problem} />
          <DetailBlock title="Objective" text={project.objective} />
          <DetailBlock title="Proposed solution" text={project.solution} />
          <DetailBlock title="My role" text={project.role} />
          <DetailBlock title="Dataset" text={project.dataset} />
          <div className="detail-process">
            <h2>Development process</h2>
            <div>
              {project.process.map((step) => (
                <span key={step}>
                  <Check size={14} />
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-process">
            <h2>Challenges</h2>
            <div>
              {project.challenges.map((step) => (
                <span key={step}>
                  <Check size={14} />
                  {step}
                </span>
              ))}
            </div>
          </div>

          <DetailBlock title="Outcomes" text={project.impact} />
          <DetailBlock title="Key findings" text={project.findings} />
        </div>
      </div>

      <section className="wrap project-gallery-section">
        <div className="project-gallery-header">
          <p className="section-kicker">PROJECT GALLERY</p>
          <h2>Visual evidence of the work.</h2>
        </div>

        <ProjectGallery images={project.gallery} />
      </section>
    </main>
  );
}

function DetailBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="detail-block">
      <p className="section-kicker">{title}</p>
      <p>{text}</p>
    </section>
  );
}