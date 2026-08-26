import Link from "next/link";
import { ArrowUpRight, Copy, Eye, FilePenLine, Globe, Rocket, Settings2 } from "lucide-react";

const statItems = [
  { label: "Portfolio status", value: "Published", meta: "Live and shareable" },
  { label: "Current template", value: "Editorial", meta: "Premium layout" },
  { label: "Public URL", value: "/p/jmw-studios", meta: "Private preview" },
  { label: "Sections", value: "11 / 13", meta: "2 hidden" },
  { label: "Completion", value: "86%", meta: "Ready to refine" },
  { label: "Last modified", value: "Today", meta: "12 mins ago" },
  { label: "Published", value: "12 Aug 2026", meta: "2 months ago" },
];

const portfolioRecords = [
  { name: "JMW Studios", owner: "Jeremiah Muthama Waita", status: "Published", type: "Premium", traffic: "12.4k views", report: "None" },
  { name: "Portfolio redesign", owner: "Amina Njeri", status: "Draft", type: "Custom Domain", traffic: "2.1k views", report: "None" },
  { name: "Data analyst profile", owner: "Daniel Kiptoo", status: "Suspended", type: "Basic", traffic: "410 views", report: "Review needed" },
  { name: "Nairobi consultancy", owner: "Noor Hassan", status: "Reported", type: "Premium", traffic: "7.8k views", report: "3 reports" },
];

const actions = [
  { label: "Edit", href: "/admin/portfolio/editor", icon: FilePenLine },
  { label: "Preview", href: "/p/jmw-studios", icon: Eye },
  { label: "Publish", href: "/admin/portfolio", icon: Rocket },
  { label: "Settings", href: "/admin/profile", icon: Settings2 },
  { label: "Duplicate", href: "/admin/portfolio", icon: Copy },
];

export function PortfolioDashboard() {
  return (
    <main className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">PORTFOLIO / DASHBOARD</p>
          <h1>Portfolio overview</h1>
          <p className="admin-subtitle">Track the status of your public portfolio and keep the story consistent.</p>
        </div>
        <Link className="admin-primary" href="/admin/portfolio/editor">
          <FilePenLine size={16} /> Edit portfolio
        </Link>
      </div>

      <section className="admin-stat-grid">
        {statItems.map((item) => (
          <div key={item.label} className="admin-stat">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.meta}</small>
          </div>
        ))}
      </section>

      <div className="portfolio-dashboard-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">CONTROL CENTER</p>
              <h2>Portfolio controls</h2>
            </div>
            <Link href="/admin/portfolio/editor">Open editor <ArrowUpRight size={15} /></Link>
          </div>

          <div className="portfolio-actions-grid">
            {actions.map(({ label, href, icon: Icon }) => (
              <Link key={label} className="portfolio-action" href={href}>
                <span><Icon size={18} /></span>
                <div>
                  <strong>{label}</strong>
                  <small>{label === "Preview" ? "Open live experience" : label === "Publish" ? "Make live for visitors" : label === "Settings" ? "Adjust branding" : label === "Duplicate" ? "Copy current setup" : "Edit sections and copy"}</small>
                </div>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">LIVE PROFILE</p>
              <h2>Public presence</h2>
            </div>
          </div>

          <div className="portfolio-preview-card">
            <div className="mini-portfolio-card neutral">
              <span className="mini-badge">Developer</span>
              <h2>Jeremiah Muthama</h2>
              <p>Data Analyst & Product Designer</p>
              <small>I turn complex work into clear, credible digital experiences and strategic decision systems.</small>
              <div className="mini-tags">
                <span>Power BI</span>
                <span>SQL</span>
                <span>Next.js</span>
                <span>UX</span>
              </div>
            </div>
            <div className="portfolio-url-row">
              <Globe size={15} />
              <span>https://portfolio.example.com/p/jmw-studios</span>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-panel admin-portfolio-management">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">MODERATION / PORTFOLIOS</p>
            <h2>Portfolio status overview</h2>
          </div>
        </div>

        <div className="admin-management-table admin-portfolio-table">
          <div className="admin-table-head">
            <span>Portfolio</span>
            <span>Owner</span>
            <span>Status</span>
            <span>Type</span>
            <span>Traffic</span>
            <span>Reports</span>
            <span>Actions</span>
          </div>

          {portfolioRecords.map((entry) => (
            <div className="admin-table-row" key={entry.name}>
              <span>{entry.name}</span>
              <span>{entry.owner}</span>
              <span><span className={`status-pill ${entry.status.toLowerCase()}`}>{entry.status}</span></span>
              <span>{entry.type}</span>
              <span>{entry.traffic}</span>
              <span>{entry.report}</span>
              <div className="admin-row-actions compact">
                <button type="button">View</button>
                <button type="button">Suspend</button>
                <button type="button">Reports</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
