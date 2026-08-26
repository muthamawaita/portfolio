"use client";
import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
const blankFields = { name: "", email: "", phone: "", subject: "", service: "", message: "", website: "" };
type ContactFields = typeof blankFields;
export function ContactForm({ initialValues }: { initialValues?: Partial<ContactFields> }) {
  const initialState = { ...blankFields, ...initialValues };
  const [fields, setFields] = useState(initialState); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false);
  const update = (field: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [field]: value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setSuccess(false);
    try { const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) }); const result = await response.json() as { ok: boolean; message: string }; setMessage(result.message); setSuccess(result.ok); if (result.ok) setFields(initialState); }
    catch { setMessage("We could not send your enquiry. Please try again or email us directly."); } finally { setBusy(false); }
  }
  return <form className="contact-form" onSubmit={submit}>
    <label>Name<input required value={fields.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" placeholder="Your name" /></label>
    <label>Email<input required type="email" value={fields.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" placeholder="you@company.com" /></label>
    <label>Phone <small>Optional</small><input value={fields.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" inputMode="tel" placeholder="Your phone number" /></label>
    <label>Service interested in <small>Optional</small><input value={fields.service} onChange={(event) => update("service", event.target.value)} placeholder="For example, dashboard development" /></label>
    <label>Subject<input required value={fields.subject} onChange={(event) => update("subject", event.target.value)} placeholder="What can we help with?" /></label>
    <label>What are you working on?<textarea required rows={5} value={fields.message} onChange={(event) => update("message", event.target.value)} placeholder="A dashboard, product, course, or research question..." /></label>
    <label className="contact-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => update("website", event.target.value)} /></label>
    <button className="button button-dark" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}{busy ? "Sending…" : "Send enquiry"}</button>
    {message && <p className={`contact-message ${success ? "is-success" : ""}`} role="status">{message}</p>}
  </form>;
}
