"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpDown, Eye, Plus, Trash2 } from "lucide-react";

type PortfolioSection = {
  id: string;
  title: string;
  enabled: boolean;
  visible: boolean;
  layout: string;
};

const defaultSections: PortfolioSection[] = [
  { id: "hero", title: "Hero", enabled: true, visible: true, layout: "Split" },
  { id: "about", title: "About", enabled: true, visible: true, layout: "Text" },
  { id: "skills", title: "Skills", enabled: true, visible: true, layout: "Grid" },
  { id: "experience", title: "Experience", enabled: true, visible: true, layout: "Timeline" },
  { id: "projects", title: "Projects", enabled: true, visible: true, layout: "Cards" },
  { id: "blog", title: "Blog", enabled: false, visible: false, layout: "List" },
  { id: "contact", title: "Contact", enabled: true, visible: true, layout: "Simple" },
];

const portfolioTemplates = [
  { id: "editorial", name: "Editorial", category: "Premium", description: "Confident storytelling with a polished luxury feel.", style: "Refined, premium, editorial" },
  { id: "minimal", name: "Minimal", category: "Classic", description: "Clean layout built for clarity and strong typography.", style: "Minimal, modern, focused" },
  { id: "bold", name: "Bold", category: "High-impact", description: "High-contrast blocks for designers and creators.", style: "Bold, cinematic, vibrant" },
] as const;

export function PortfolioEditor() {
  const [sections, setSections] = useState<PortfolioSection[]>(defaultSections);
  const [theme, setTheme] = useState("Noir Gold");
  const [font, setFont] = useState("Clarkson");
  const [accent, setAccent] = useState("#d9a85c");
  const [portfolioName, setPortfolioName] = useState("Jeremiah Muthama");
  const [template, setTemplate] = useState<(typeof portfolioTemplates)[number]["id"]>("editorial");

  const visibleCount = useMemo(() => sections.filter((section) => section.visible).length, [sections]);

  const toggleVisible = (id: string) => {
    setSections((current) => current.map((section) => section.id === id ? { ...section, visible: !section.visible, enabled: section.enabled || !section.visible } : section));
  };

  const toggleEnabled = (id: string) => {
    setSections((current) => current.map((section) => section.id === id ? { ...section, enabled: !section.enabled, visible: !section.enabled ? true : section.visible } : section));
  };

  const moveSection = (id: string, direction: -1 | 1) => {
    setSections((current) => {
      const index = current.findIndex((section) => section.id === id);
      if (index < 0) return current;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
  };

  const removeSection = (id: string) => {
    setSections((current) => current.filter((section) => section.id !== id));
  };

  return (
    <main className="admin-dashboard">
      <div className="admin-page-heading editor-heading">
        <div>
          <p className="admin-kicker">PORTFOLIO / EDITOR</p>
          <h1>Portfolio editor</h1>
          <p className="admin-subtitle">Arrange sections, edit your story, and tune your theme without leaving the dashboard.</p>
        </div>
        <div className="editor-actions">
          <Link className="admin-back-link" href="/admin/portfolio"><ArrowLeft size={15} /> Back to dashboard</Link>
          <button className="admin-primary" type="button">Publish changes</button>
        </div>
      </div>

      <div className="portfolio-editor-layout">
        <section className="admin-panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">LAYOUT</p>
              <h2>Design settings</h2>
            </div>
          </div>

          <div className="editor-field-grid">
            <label>
              Portfolio name
              <input value={portfolioName} onChange={(event) => setPortfolioName(event.target.value)} />
            </label>
            <label>
              Theme
              <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                <option>Noir Gold</option>
                <option>Monochrome</option>
                <option>Forest</option>
                <option>Slate</option>
              </select>
            </label>
            <label>
              Font family
              <select value={font} onChange={(event) => setFont(event.target.value)}>
                <option>Clarkson</option>
                <option>Manrope</option>
                <option>Libre Baskerville</option>
                <option>Space Grotesk</option>
              </select>
            </label>
            <label className="color-field">
              Accent color
              <div className="color-swatch-wrap">
                <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
                <span>{accent}</span>
              </div>
            </label>
          </div>

          <div className="template-picker-block">
            <p className="template-label">Templates</p>
            <div className="template-choice-grid">
              {portfolioTemplates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={template === item.id ? "template-choice active" : "template-choice"}
                  onClick={() => setTemplate(item.id)}
                >
                  <span className="template-swatch" />
                  <strong>{item.name}</strong>
                  <small>{item.category}</small>
                  <small>{item.style}</small>
                </button>
              ))}
            </div>
            <div className="template-action-row">
              <button type="button" className="secondary-action">Preview</button>
              <button type="button" className="secondary-action">Select</button>
              <button type="button" className="admin-primary">Apply template</button>
            </div>
          </div>

          <div className="section-manager">
            <div className="section-manager-header">
              <div>
                <p className="admin-kicker">SECTIONS</p>
                <h3>Section manager</h3>
              </div>
              <button type="button" className="secondary-action"><Plus size={15} /> Add section</button>
            </div>

            <div className="section-list">
              {sections.map((section, index) => (
                <div key={section.id} className={`section-row ${section.visible ? "visible" : "hidden"}`}>
                  <div className="section-row-main">
                    <button type="button" className="section-toggle" onClick={() => toggleEnabled(section.id)} aria-label={`Toggle ${section.title}`}>
                      {section.enabled ? "On" : "Off"}
                    </button>
                    <div>
                      <strong>{section.title}</strong>
                      <small>{section.layout} · Order #{index + 1}</small>
                    </div>
                  </div>

                  <div className="section-row-actions">
                    <button type="button" onClick={() => toggleVisible(section.id)} title={section.visible ? "Hide section" : "Show section"}>
                      <Eye size={15} />
                    </button>
                    <button type="button" onClick={() => moveSection(section.id, -1)} aria-label={`Move ${section.title} up`}>
                      <ArrowUpDown size={15} />
                    </button>
                    <button type="button" onClick={() => moveSection(section.id, 1)} aria-label={`Move ${section.title} down`}>
                      <ArrowUpDown size={15} />
                    </button>
                    <button type="button" className="danger" onClick={() => removeSection(section.id)} aria-label={`Remove ${section.title}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="admin-panel preview-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">LIVE</p>
              <h2>Preview</h2>
            </div>
            <span className="preview-status">{visibleCount} visible</span>
          </div>

          <div className="mini-portfolio-card" style={{ borderColor: accent }}>
            <span className="mini-badge" style={{ background: accent }}>{theme}</span>
            <h2>{portfolioName}</h2>
            <p>{template === "editorial" ? "Product strategist and designer" : template === "minimal" ? "Clear thinker and builder" : "Creative systems and digital experiences"}</p>
            <small>I build digital experiences that make decisions simpler and categories more distinctive.</small>
            <div className="mini-tags">
              <span>Strategy</span>
              <span>UX</span>
              <span>Data</span>
            </div>
          </div>

          <div className="preview-summary-box">
            <div>
              <span>Sections</span>
              <strong>{visibleCount}</strong>
            </div>
            <div>
              <span>Theme</span>
              <strong>{theme}</strong>
            </div>
            <div>
              <span>Font</span>
              <strong>{font}</strong>
            </div>
          </div>

          <div className="preview-actions">
            <button type="button" className="secondary-action">Save draft</button>
            <button type="button" className="admin-primary">Publish live</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
