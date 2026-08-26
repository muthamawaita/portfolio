"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { createPortfolioOrder } from "@/server/actions/orders";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  industry: "",
  portfolioGoals: "",
  timeline: "",
  budget: "",
  notes: "",
};

export function PortfolioOrderForm() {
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
      const result = await createPortfolioOrder(fields);
      setMessage(result.message);
      setSuccess(result.ok);
      if (result.ok) {
        setFields(initialState);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not submit your order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-grid-two">
        <label>
          Full name
          <input required value={fields.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your full name" />
        </label>
        <label>
          Email
          <input required type="email" value={fields.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" />
        </label>
      </div>

      <div className="contact-grid-two">
        <label>
          Phone
          <input value={fields.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Optional phone number" />
        </label>
        <label>
          Industry / field
          <input required value={fields.industry} onChange={(event) => update("industry", event.target.value)} placeholder="e.g. Consulting, Design, Data, Education" />
        </label>
      </div>

      <label>
        Portfolio goals
        <textarea required rows={4} value={fields.portfolioGoals} onChange={(event) => update("portfolioGoals", event.target.value)} placeholder="What do you want your portfolio to help you achieve?" />
      </label>

      <div className="contact-grid-two">
        <label>
          Timeline
          <input required value={fields.timeline} onChange={(event) => update("timeline", event.target.value)} placeholder="e.g. 2 weeks" />
        </label>
        <label>
          Budget range
          <input required value={fields.budget} onChange={(event) => update("budget", event.target.value)} placeholder="e.g. KES 25,000 - 80,000" />
        </label>
      </div>

      <label>
        Notes for the admin
        <textarea rows={4} value={fields.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Share your ideas, preferred template, brand references, and any requirements." />
      </label>

      <button className="button button-dark" disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={16} /> : <ArrowUpRight size={16} />}
        {busy ? "Sending order..." : "Place portfolio order"}
      </button>

      {message && <p className={`contact-message ${success ? "is-success" : ""}`} role="status">{message}</p>}
    </form>
  );
}
