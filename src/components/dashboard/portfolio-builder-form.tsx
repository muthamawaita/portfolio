"use client";

import { useState } from "react";
import { ArrowUpRight, Save, Send } from "lucide-react";
import { publishPortfolio, updateProfile } from "@/server/actions/profile";

type PortfolioTemplateId = "editorial" | "developer" | "analyst" | "designer" | "minimal" | "bold";

type PortfolioDraft = {
  name: string;
  headline: string;
  bio: string;
  careerBackground: string;
  specializations: string[];
  interests: string[];
  technologies: string[];
  objectives: string[];
  values: string[];
  photoUrl: string;
  template: PortfolioTemplateId;
};

export function PortfolioBuilderForm({ initial }: { initial: PortfolioDraft }) {
  const [profile, setProfile] = useState(initial);
  const [message, setMessage] = useState("");

  const toList = (value: string) => value.split(",").map((entry) => entry.trim()).filter(Boolean);

  const save = async () => {
    const result = await updateProfile({
      name: profile.name,
      headline: profile.headline,
      bio: profile.bio,
      careerBackground: profile.careerBackground,
      specializations: profile.specializations,
      interests: profile.interests,
      technologies: profile.technologies,
      objectives: profile.objectives,
      values: profile.values,
      photoUrl: profile.photoUrl,
      template: profile.template,
    });

    setMessage(result.message);
    return result;
  };

  return (
    <section className="admin-panel form-panel">
      <div className="profile-image-row">
        <div className="profile-image-thumb">
          {profile.photoUrl ? <img src={profile.photoUrl} alt={profile.name} /> : <span>{profile.name.slice(0, 2).toUpperCase() || "JM"}</span>}
        </div>
        <div className="profile-image-meta">
          <strong>Portfolio identity</strong>
          <small>Set your headline, story, and visual style before you publish.</small>
        </div>
      </div>

      <label>
        Full name
        <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
      </label>

      <label>
        Professional headline
        <input value={profile.headline} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} />
      </label>

      <label>
        About you
        <textarea rows={6} value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
      </label>

      <label>
        Career background
        <textarea rows={4} value={profile.careerBackground} onChange={(event) => setProfile({ ...profile, careerBackground: event.target.value })} />
      </label>

      <label>
        Professional photo URL
        <input value={profile.photoUrl} onChange={(event) => setProfile({ ...profile, photoUrl: event.target.value })} placeholder="https://images.example.com/your-photo.jpg" />
      </label>

      <label>
        Specializations (comma separated)
        <input value={profile.specializations.join(", ")} onChange={(event) => setProfile({ ...profile, specializations: toList(event.target.value) })} />
      </label>

      <label>
        Interests (comma separated)
        <input value={profile.interests.join(", ")} onChange={(event) => setProfile({ ...profile, interests: toList(event.target.value) })} />
      </label>

      <label>
        Technologies (comma separated)
        <input value={profile.technologies.join(", ")} onChange={(event) => setProfile({ ...profile, technologies: toList(event.target.value) })} />
      </label>

      <label>
        Objectives (comma separated)
        <input value={profile.objectives.join(", ")} onChange={(event) => setProfile({ ...profile, objectives: toList(event.target.value) })} />
      </label>

      <label>
        Values (comma separated)
        <input value={profile.values.join(", ")} onChange={(event) => setProfile({ ...profile, values: toList(event.target.value) })} />
      </label>

      <div className="template-picker-block">
        <p className="template-label">Portfolio template</p>
        <div className="template-choice-grid">
          {([
            { id: "editorial", title: "Editorial", description: "Refined and confident" },
            { id: "developer", title: "Developer", description: "Technical and product-led" },
            { id: "analyst", title: "Analyst", description: "Data-driven and precise" },
            { id: "designer", title: "Designer", description: "Visual and casebook-led" },
            { id: "minimal", title: "Minimal", description: "Clean and focused" },
            { id: "bold", title: "Bold", description: "High-impact and modern" },
          ] as const).map((template) => (
            <button
              key={template.id}
              type="button"
              className={profile.template === template.id ? "template-choice active" : "template-choice"}
              onClick={() => setProfile({ ...profile, template: template.id })}
            >
              <span className="template-swatch" />
              <strong>{template.title}</strong>
              <small>{template.description}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="project-form-actions">
        <button className="outline-button" type="button" onClick={save}><Save size={16} /> Save draft</button>
        <button
          className="admin-primary"
          type="button"
          onClick={async () => {
            const draftResult = await save();
            if (!draftResult.ok) {
              setMessage(draftResult.message);
              return;
            }
            const result = await publishPortfolio();
            setMessage(result.message);
          }}
        >
          <Send size={16} /> Publish portfolio
        </button>
      </div>

      {message && <p className="form-success">{message}</p>}
      <a className="back-link" href="/dashboard/my-portfolio"><ArrowUpRight size={15} /> Review my portfolio</a>
    </section>
  );
}
