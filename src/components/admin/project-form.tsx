"use client";

import { useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { createProject } from "@/server/actions/projects";

type FormState = {
  title: string;
  slug: string;
  type: string;
  summary: string;
  problem: string;
  objective: string;
  solution: string;
  client: string;
  role: string;
  completedDate: string;
  dataset: string;
  tools: string;
  process: string;
  challenges: string;
  findings: string;
  impact: string;
  metric: string;
  metricLabel: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage: string;
};

const initialForm: FormState = {
  title: "",
  slug: "",
  type: "",
  summary: "",
  problem: "",
  objective: "",
  solution: "",
  client: "",
  role: "",
  completedDate: "",
  dataset: "",
  tools: "",
  process: "",
  challenges: "",
  findings: "",
  impact: "",
  metric: "",
  metricLabel: "",
  status: "DRAFT",
  coverImage: "",
};

export function ProjectForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="project-editor-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");

        try {
          const result = await createProject(form);
          setMessage(result.ok ? `Project saved as ${result.slug}.` : result.message ?? "Project could not be saved.");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not save project. Check your database configuration.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="project-form-grid">
        <label>
          Project title
          <input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Organizational Performance Dashboard" />
        </label>

        <label>
          URL slug
          <input required value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="organizational-performance-dashboard" />
        </label>

        <label>
          Project type
          <input required value={form.type} onChange={(event) => update("type", event.target.value)} placeholder="Business Intelligence" />
        </label>

        <label>
          Client
          <input value={form.client} onChange={(event) => update("client", event.target.value)} placeholder="Synthetic public-sector operations case" />
        </label>

        <label>
          Role
          <input value={form.role} onChange={(event) => update("role", event.target.value)} placeholder="Analyst and dashboard designer" />
        </label>

        <label>
          Completed date
          <input value={form.completedDate} onChange={(event) => update("completedDate", event.target.value)} placeholder="May 2026" />
        </label>

        <label>
          Metric
          <input value={form.metric} onChange={(event) => update("metric", event.target.value)} placeholder="38%" />
        </label>

        <label>
          Metric label
          <input value={form.metricLabel} onChange={(event) => update("metricLabel", event.target.value)} placeholder="backlog visibility gained" />
        </label>

        <label>
          Tools
          <span className="field-hint">comma separated</span>
          <input required value={form.tools} onChange={(event) => update("tools", event.target.value)} placeholder="Power BI, SQL, Excel" />
        </label>

        <label>
          Process
          <span className="field-hint">comma separated</span>
          <input value={form.process} onChange={(event) => update("process", event.target.value)} placeholder="Discovery, KPI modelling, storytelling" />
        </label>

        <label>
          Challenges
          <span className="field-hint">comma separated</span>
          <input value={form.challenges} onChange={(event) => update("challenges", event.target.value)} placeholder="Data quality, stakeholder alignment, delivery" />
        </label>

        <label>
          Cover image URL
          <input value={form.coverImage} onChange={(event) => update("coverImage", event.target.value)} placeholder="https://images.unsplash.com/..." />
        </label>

        <label className="wide-field">
          Summary
          <textarea required rows={3} value={form.summary} onChange={(event) => update("summary", event.target.value)} placeholder="What does this project make possible?" />
        </label>

        <label>
          Problem
          <textarea required rows={5} value={form.problem} onChange={(event) => update("problem", event.target.value)} placeholder="What challenge was being solved?" />
        </label>

        <label>
          Objective
          <textarea rows={5} value={form.objective} onChange={(event) => update("objective", event.target.value)} placeholder="What did the client need to achieve?" />
        </label>

        <label>
          Solution
          <textarea rows={5} value={form.solution} onChange={(event) => update("solution", event.target.value)} placeholder="How did you approach and deliver it?" />
        </label>

        <label>
          Dataset
          <textarea rows={5} value={form.dataset} onChange={(event) => update("dataset", event.target.value)} placeholder="Describe the source data and technical context." />
        </label>

        <label>
          Findings
          <textarea rows={5} value={form.findings} onChange={(event) => update("findings", event.target.value)} placeholder="What insight emerged from the analysis?" />
        </label>

        <label>
          Impact
          <textarea rows={5} value={form.impact} onChange={(event) => update("impact", event.target.value)} placeholder="What changed because of the work?" />
        </label>

        <label>
          Project status
          <select value={form.status} onChange={(event) => update("status", event.target.value as "DRAFT" | "PUBLISHED")}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      <div className="project-form-actions">
        <Link className="admin-back-link" href="/admin/projects">
          Back to list
        </Link>
        <button type="submit" className="admin-primary" disabled={busy}>
          {busy ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />}
          {busy ? "Saving..." : form.status === "PUBLISHED" ? "Publish project" : "Save draft"}
        </button>
      </div>

      {message ? (
        <p className="form-success" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
