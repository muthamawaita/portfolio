"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Check, LayoutTemplate, Plus, Save, Search, Send, Trash2 } from "lucide-react";
import { publishPortfolio } from "@/server/actions/profile";
import { saveTemplateStudio } from "@/server/actions/template-studio";

type PortfolioPage = { slug: string; title: string; enabled: boolean };
type Template = { id: string; name: string; category: string; description: string; accent: string; surface: string; pages: string[] };

const templates: Template[] = [
  { id: "editorial", name: "Editorial Portfolio", category: "Consultant & Executive", description: "A refined long-form portfolio for credibility and depth.", accent: "#e56d3f", surface: "#17201d", pages: ["Home", "About", "Experience", "Projects", "Education", "Contact"] },
  { id: "developer", name: "Developer Showcase", category: "Developer & Product", description: "A confident technical portfolio for products and case studies.", accent: "#83c5ff", surface: "#101824", pages: ["Home", "About", "Skills", "Projects", "Experience", "Resume", "Contact"] },
  { id: "analyst", name: "Insight Portfolio", category: "Data & Analytics", description: "A decision-focused format for dashboards, research, and impact.", accent: "#9bd3b0", surface: "#102019", pages: ["Home", "About", "Skills", "Projects", "Education", "Certifications", "Contact"] },
  { id: "designer", name: "Visual Casebook", category: "Designer & Creative", description: "A visual-first casebook with space for process and outcomes.", accent: "#efaaa1", surface: "#21191c", pages: ["Home", "About", "Projects", "Experience", "Testimonials", "Resume", "Contact"] },
  { id: "minimal", name: "Minimal Professional", category: "Student & Researcher", description: "A calm, clear layout that lets credentials and work lead.", accent: "#a7a9ff", surface: "#171722", pages: ["Home", "About", "Education", "Projects", "Certifications", "Resume", "Contact"] },
  { id: "bold", name: "Bold Independent", category: "Freelancer & Founder", description: "A high-energy portfolio for services, work, and conversion.", accent: "#ff9f62", surface: "#241811", pages: ["Home", "About", "Services", "Projects", "Testimonials", "Resume", "Contact"] },
  { id: "architect", name: "Architect's Journal", category: "Architecture & Interiors", description: "A spacious project archive for visual stories and built work.", accent: "#d7c3a5", surface: "#29251f", pages: ["Home", "Studio", "Projects", "Process", "Press", "Contact"] },
  { id: "photographer", name: "Photo Narrative", category: "Photographer & Artist", description: "An immersive image-led portfolio for collections and commissions.", accent: "#fc675e", surface: "#1d1113", pages: ["Home", "About", "Selected Work", "Journal", "Services", "Contact"] },
  { id: "strategist", name: "Strategy Practice", category: "Consultant & Executive", description: "A clear, confident home for expertise, thinking, and outcomes.", accent: "#e6d76f", surface: "#253144", pages: ["Home", "About", "Capabilities", "Case Studies", "Insights", "Contact"] },
  { id: "researcher", name: "Research Portfolio", category: "Student & Researcher", description: "A rigorous layout for publications, projects, and credentials.", accent: "#6889e7", surface: "#f4f1e9", pages: ["Home", "Profile", "Research", "Publications", "Education", "Contact"] },
  { id: "marketer", name: "Growth Portfolio", category: "Marketing & Growth", description: "A sharp portfolio for campaigns, strategy, and measurable impact.", accent: "#d9ff55", surface: "#141a20", pages: ["Home", "About", "Campaigns", "Results", "Services", "Contact"] },
  { id: "motion", name: "Motion Folio", category: "Designer & Creative", description: "A bold presentation format for showreels and creative direction.", accent: "#bd8cff", surface: "#151419", pages: ["Home", "About", "Work", "Showreel", "Awards", "Contact"] },
];

const defaultPages: PortfolioPage[] = [
  { slug: "home", title: "Home", enabled: true }, { slug: "about", title: "About", enabled: true }, { slug: "skills", title: "Skills", enabled: true }, { slug: "experience", title: "Experience", enabled: true }, { slug: "projects", title: "Projects", enabled: true }, { slug: "education", title: "Education", enabled: true }, { slug: "certifications", title: "Certifications", enabled: true }, { slug: "resume", title: "Resume", enabled: true }, { slug: "contact", title: "Contact", enabled: true },
];

const templatePageBlueprints: Record<string, PortfolioPage[]> = {
  editorial: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "experience", title: "Experience", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "education", title: "Education", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
  developer: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "skills", title: "Skills", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "experience", title: "Experience", enabled: true },
    { slug: "resume", title: "Resume", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
  analyst: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "skills", title: "Skills", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "education", title: "Education", enabled: true },
    { slug: "certifications", title: "Certifications", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
  designer: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "experience", title: "Experience", enabled: true },
    { slug: "resume", title: "Resume", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
  minimal: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "education", title: "Education", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "certifications", title: "Certifications", enabled: true },
    { slug: "resume", title: "Resume", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
  bold: [
    { slug: "home", title: "Home", enabled: true },
    { slug: "about", title: "About", enabled: true },
    { slug: "services", title: "Services", enabled: true },
    { slug: "projects", title: "Projects", enabled: true },
    { slug: "resume", title: "Resume", enabled: true },
    { slug: "contact", title: "Contact", enabled: true },
  ],
};

export function TemplateStudio({ initialTemplateKey, initialPages }: { initialTemplateKey?: string; initialPages?: PortfolioPage[] }) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateKey && templates.some((template) => template.id === initialTemplateKey) ? initialTemplateKey : "editorial");
  const [pages, setPages] = useState<PortfolioPage[]>(initialPages?.length ? initialPages : defaultPages);
  const [newPage, setNewPage] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedTemplate = useMemo(() => templates.find((template) => template.id === selectedTemplateId) ?? templates[0], [selectedTemplateId]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(templates.map((template) => template.category)))], []);
  const visibleTemplates = useMemo(() => templates.filter((template) => (category === "All" || template.category === category) && `${template.name} ${template.category} ${template.description}`.toLowerCase().includes(templateSearch.toLowerCase().trim())), [category, templateSearch]);

  const applyTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setPages(templatePageBlueprints[templateId] ?? defaultPages);
  };

  const addPage = () => {
    const title = newPage.trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug || pages.some((page) => page.slug === slug)) return;
    setPages([...pages, { slug, title, enabled: true }]);
    setNewPage("");
  };
  const save = async () => {
    setBusy(true); setMessage("");
    try {
      const result = await saveTemplateStudio({ templateKey: selectedTemplateId, pages });
      setMessage(result.message);
      return result;
    }
    catch {
      setMessage("We could not save your template settings.");
      return { ok: false, message: "We could not save your template settings." };
    }
    finally { setBusy(false); }
  };

  const publish = async () => {
    const saveResult = await save();
    if (!saveResult.ok) return;

    const publishResult = await publishPortfolio();
    setMessage(publishResult.message);
  };

  const previewStyle = { "--template-accent": selectedTemplate.accent, "--template-surface": selectedTemplate.surface } as CSSProperties;

  return <section className="portfolio-template-manager">
    <header className="portfolio-template-header"><div><p className="section-kicker">PORTFOLIO TEMPLATES</p><h2>Choose a layout, then make it yours.</h2><p>Every template is a real multi-page portfolio. Select the pages you need and tailor them in the editor.</p></div><div className="portfolio-template-actions"><button type="button" className="button button-light" onClick={() => router.push("/dashboard/portfolio-editor")}>Open in editor</button><button type="button" className="button button-dark" onClick={save} disabled={busy}><Save size={16} /> {busy ? "Saving…" : "Save structure"}</button><button type="button" className="button button-dark" onClick={publish}><Send size={16} /> Publish</button></div></header>
    <div className="portfolio-template-browser"><div className="template-search"><Search size={17} /><input value={templateSearch} onChange={(event) => setTemplateSearch(event.target.value)} placeholder="Search portfolio templates" aria-label="Search portfolio templates" /></div><div className="template-category-list">{categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="portfolio-template-grid">{visibleTemplates.map((template, index) => <button type="button" key={template.id} className={selectedTemplateId === template.id ? "portfolio-template-card active" : "portfolio-template-card"} onClick={() => applyTemplate(template.id)}><span className={`portfolio-template-cover template-art-${index % 6}`} style={{ background: `linear-gradient(145deg, ${template.surface}, ${template.accent})` }}><i /><i /><i /><b>YOUR<br />WORK</b></span><small>{template.category}</small><strong>{template.name}</strong><em>{template.description}</em><span className="portfolio-template-pages">{template.pages.length}+ pages</span></button>)}{!visibleTemplates.length && <p className="template-empty-state">No portfolio templates match that search.</p>}</div>
    <div className="portfolio-template-workspace"><section className="portfolio-page-manager"><div className="panel-heading-row"><div><p className="section-kicker">PAGE STRUCTURE</p><h3>Your portfolio pages</h3></div><span className="panel-badge"><LayoutTemplate size={14} /> {pages.filter((page) => page.enabled).length} active</span></div><p>Turn pages on or off, rename them, or add a new page. Home is always included.</p><div className="portfolio-page-list">{pages.map((page) => <div className={page.enabled ? "portfolio-page-row" : "portfolio-page-row disabled"} key={page.slug}><input type="checkbox" checked={page.enabled} disabled={page.slug === "home"} onChange={() => setPages(pages.map((item) => item.slug === page.slug ? { ...item, enabled: !item.enabled } : item))} /><input value={page.title} onChange={(event) => setPages(pages.map((item) => item.slug === page.slug ? { ...item, title: event.target.value } : item))} aria-label={`${page.title} page title`} /><span>/{page.slug}</span>{page.slug !== "home" && <button type="button" aria-label={`Remove ${page.title}`} onClick={() => setPages(pages.filter((item) => item.slug !== page.slug))}><Trash2 size={15} /></button>}</div>)}</div><div className="portfolio-add-page"><input value={newPage} onChange={(event) => setNewPage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addPage(); } }} placeholder="New page name, e.g. Services" /><button type="button" className="outline-button" onClick={addPage}><Plus size={15} /> Add page</button></div></section><aside className="portfolio-template-preview" style={previewStyle}><div className="portfolio-preview-browser"><span /><span /><span /><b>{selectedTemplate.name}</b></div><div className="portfolio-preview-content"><small>{selectedTemplate.category}</small><h3>Your portfolio, <em>with a clear point of view.</em></h3><p>Editable hero, about, skills, projects, experience, education, certifications, resume, and contact components.</p><div>{pages.filter((page) => page.enabled).map((page) => <span key={page.slug}><Check size={12} /> {page.title}</span>)}</div></div></aside></div>
    {message && <p className="form-success">{message}</p>}
  </section>;
}
