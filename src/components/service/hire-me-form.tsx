"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

const initialState = {
  service: "",
  projectDescription: "",
  budget: "",
  deadline: "",
  name: "",
  email: "",
  phone: "",
  attachments: "",
  requirements: "",
};

export function HireMeForm() {
  const [fields, setFields] = useState(initialState);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          subject: `Hire me inquiry: ${fields.service || "Custom project"}`,
          service: fields.service,
          message: [
            `Project description: ${fields.projectDescription}`,
            `Budget range: ${fields.budget}`,
            `Deadline: ${fields.deadline}`,
            `Additional requirements: ${fields.requirements}`,
            `Attachments: ${fields.attachments || "None provided"}`,
          ].join("\n\n"),
          website: "",
        }),
      });

      const result = (await response.json()) as { ok: boolean; message: string };
      setMessage(result.message);
      setSuccess(result.ok);

      if (result.ok) {
        setFields(initialState);
      }
    } catch {
      setMessage("We could not send your inquiry. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        What service is required?
        <input required value={fields.service} onChange={(event) => update("service", event.target.value)} placeholder="Portfolio development, dashboard build, analysis support..." />
      </label>

      <label>
        Project description
        <textarea required rows={5} value={fields.projectDescription} onChange={(event) => update("projectDescription", event.target.value)} placeholder="Describe the business need, scope, audience, and outcome you want." />
      </label>

      <div className="contact-grid-two">
        <label>
          Budget range
          <input value={fields.budget} onChange={(event) => update("budget", event.target.value)} placeholder="KES 20,000 - 80,000" />
        </label>
        <label>
          Deadline
          <input value={fields.deadline} onChange={(event) => update("deadline", event.target.value)} placeholder="2 weeks / Q4 / flexible" />
        </label>
      </div>

      <div className="contact-grid-two">
        <label>
          Full name
          <input required value={fields.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" />
        </label>
        <label>
          Email
          <input required type="email" value={fields.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
        </label>
      </div>

      <label>
        Phone
        <input value={fields.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Optional phone number" />
      </label>

      <label>
        Attachments
        <input value={fields.attachments} onChange={(event) => update("attachments", event.target.value)} placeholder="Links to requirements, docs, or files" />
      </label>

      <label>
        Additional requirements
        <textarea rows={4} value={fields.requirements} onChange={(event) => update("requirements", event.target.value)} placeholder="Brand references, timeline constraints, deliverables, or any extra notes." />
      </label>

      <button className="button button-dark" disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}
        {busy ? "Sending request..." : "Send project request"}
      </button>

      {message && <p className={`contact-message ${success ? "is-success" : ""}`} role="status">{message}</p>}
    </form>
  );
}
