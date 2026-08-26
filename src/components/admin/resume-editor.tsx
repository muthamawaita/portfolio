"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { Download, FileText, LoaderCircle, Printer, Save, Trash2, Upload } from "lucide-react";
import { resumeContent, type ResumeContent } from "@/data/resume";
import { saveResume } from "@/server/actions/resume";

const templates = [
  { id: "editorial", name: "Editorial", detail: "Bold headings and a warm professional accent." },
  { id: "classic", name: "Classic", detail: "Traditional, structured, and application-ready." },
  { id: "minimal", name: "Minimal", detail: "Quiet typography with maximum scanability." },
] as const;

type Template = (typeof templates)[number]["id"];

export function ResumeEditor() {
  const [template, setTemplate] = useState<Template>("editorial");
  const [content, setContent] = useState<ResumeContent>(resumeContent);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePrivate, setResumePrivate] = useState(false);
  const [downloadCount, setDownloadCount] = useState(148);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const update = <K extends keyof ResumeContent>(key: K, value: ResumeContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Only PDF resumes are supported.");
      return;
    }

    setResumeFile(file);
    setMessage("Resume uploaded and ready for preview.");
  };

  const downloadWord = async () => {
    const response = await fetch("/api/resume/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, template }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${content.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${template}-resume.doc`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadCount((current) => current + 1);
  };

  const downloadResumeFile = () => {
    if (!resumeFile) {
      void downloadWord();
      return;
    }

    const url = URL.createObjectURL(resumeFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = resumeFile.name;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadCount((current) => current + 1);
  };

  return (
    <div className="resume-workspace">
      <div className="resume-toolbar">
        <div>
          <p className="admin-kicker">RESUME STUDIO</p>
          <h2>Build a resume that travels well.</h2>
          <p>Edit once, export it for applications, and keep the source ready for the next opportunity.</p>
        </div>
        <div className="resume-actions">
          <button className="outline-button" onClick={() => window.print()}>
            <Printer size={16} /> Print / PDF
          </button>
          <button className="outline-button" onClick={downloadWord}>
            <FileText size={16} /> Word
          </button>
          <button
            className="admin-primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setMessage("");
              try {
                await saveResume({ tenantId: "default", template, content: JSON.stringify(content) });
                setMessage("Resume saved.");
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Could not save. Configure the database first.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}
            {busy ? "Saving" : "Save resume"}
          </button>
        </div>
      </div>

      <div className="template-picker">
        {templates.map((item) => (
          <button
            className={template === item.id ? "template-option active" : "template-option"}
            key={item.id}
            onClick={() => setTemplate(item.id)}
          >
            <span className={`template-thumb ${item.id}`}>
              <i />
              <i />
              <i />
            </span>
            <strong>{item.name}</strong>
            <small>{item.detail}</small>
          </button>
        ))}
      </div>

      <div className="resume-editor-grid">
        <section className="admin-panel resume-fields">
          <p className="admin-kicker">EDIT CONTENT</p>
          <div className="resume-field-grid">
            <label>
              Name
              <input value={content.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label>
              Headline
              <input value={content.headline} onChange={(event) => update("headline", event.target.value)} />
            </label>
            <label>
              Email
              <input value={content.email} onChange={(event) => update("email", event.target.value)} />
            </label>
            <label>
              Phone
              <input value={content.phone} onChange={(event) => update("phone", event.target.value)} />
            </label>
            <label>
              LinkedIn
              <input value={content.linkedin} onChange={(event) => update("linkedin", event.target.value)} />
            </label>
            <label>
              GitHub
              <input value={content.github} onChange={(event) => update("github", event.target.value)} />
            </label>
            <label className="wide-field">
              Professional summary
              <textarea rows={6} value={content.summary} onChange={(event) => update("summary", event.target.value)} />
            </label>
            <label className="wide-field">
              Core competencies
              <textarea
                rows={7}
                value={content.competencies.join("\n")}
                onChange={(event) => update("competencies", event.target.value.split("\n").filter(Boolean))}
              />
            </label>
            <label className="wide-field">
              Experience
              <textarea
                rows={13}
                value={JSON.stringify(content.experience, null, 2)}
                onChange={(event) => {
                  try {
                    update("experience", JSON.parse(event.target.value));
                  } catch {
                    // Keep the last valid structure while typing.
                  }
                }}
              />
            </label>
          </div>
          {message && <p className="form-success">{message}</p>}
        </section>

        <aside className="resume-preview-panel">
          <div className="resume-upload-box">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileSelection}
            />

            <div className="resume-upload-header">
              <p className="admin-kicker">RESUME FILE</p>
              <h3>{resumeFile ? resumeFile.name : "No file uploaded yet"}</h3>
            </div>

            <div className="resume-upload-actions">
              <button type="button" className="secondary-action" onClick={() => fileInputRef.current?.click()}>
                <Upload size={15} /> {resumeFile ? "Replace" : "Upload"}
              </button>
              <button type="button" className="secondary-action" onClick={downloadResumeFile}>
                <Download size={15} /> Download
              </button>
              {resumeFile && (
                <button type="button" className="secondary-action danger" onClick={() => setResumeFile(null)}>
                  <Trash2 size={15} /> Delete
                </button>
              )}
            </div>

            <div className="resume-visibility">
              <label>
                <input type="checkbox" checked={!resumePrivate} onChange={() => setResumePrivate((current) => !current)} />
                Public portfolio resume
              </label>
              <span>{resumePrivate ? "Private" : "Public"}</span>
            </div>

            <div className="resume-meta">
              <span>Downloads</span>
              <strong>{downloadCount}</strong>
            </div>
          </div>

          <ResumePreview content={content} template={template} />
        </aside>
      </div>
    </div>
  );
}

function ResumePreview({ content, template }: { content: ResumeContent; template: Template }) {
  return (
    <aside className={`resume-preview ${template}`}>
      <div className="resume-paper">
        <p className="resume-preview-label">{template} template / live preview</p>
        <h1>{content.name}</h1>
        <h2>{content.headline}</h2>
        <p className="resume-preview-contact">
          {content.email} · {content.phone}
        </p>
        <section>
          <h3>Professional Summary</h3>
          <p>{content.summary}</p>
        </section>
        <section>
          <h3>Experience</h3>
          {content.experience.slice(0, 3).map((job) => (
            <article key={`${job.role}-${job.company}`}>
              <strong>{job.role}</strong>
              <small>
                {job.company} · {job.dates}
              </small>
              <p>{job.bullets[0]}</p>
            </article>
          ))}
        </section>
        <section>
          <h3>Core Competencies</h3>
          <div className="preview-tags">
            {content.competencies.slice(0, 8).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}