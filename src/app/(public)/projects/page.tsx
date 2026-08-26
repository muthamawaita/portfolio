import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { publishedProjects } from "@/data/portfolio";
import { projectFilters } from "@/data/site";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <div className="wrap project-index-head">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p className="section-kicker">02 / PROJECT ARCHIVE</p>
        <h1>
          Proof, not<br />
          <em>promises.</em>
        </h1>
        <p className="archive-intro">
          A portfolio of analytical, product, research, and software work. Each case explains the problem, the method, and the decision it makes possible.
        </p>
      </div>

      <div className="wrap project-filter-bar" aria-label="Project categories">
        {projectFilters.map((filter) => (
          <span key={filter} className={filter === "All" ? "project-filter-pill active" : "project-filter-pill"}>
            {filter}
          </span>
        ))}
      </div>

      <div className="wrap archive-grid">
        {publishedProjects.map((project) => (
          <Link className="archive-card" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="archive-card-top">
              <span>
                {project.number} / {project.type}
              </span>
              <ArrowUpRight size={19} />
            </div>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <div className="archive-card-bottom">
              <span>{project.tools.join(" / ")}</span>
              <strong>{project.metric}</strong>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}