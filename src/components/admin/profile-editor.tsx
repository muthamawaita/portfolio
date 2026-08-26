"use client";
import { useState } from "react";
import { Eye, Save, Send } from "lucide-react";
import { publishPortfolio, updateProfile } from "@/server/actions/profile";

type ProfileState = {
  name: string;
  headline: string;
  bio: string;
  careerBackground?: string;
  specializations?: string[];
  interests?: string[];
  technologies?: string[];
  objectives?: string[];
  values?: string[];
  photoUrl: string;
  cvUrl?: string;
  template: "editorial" | "minimal" | "bold";
};

export function ProfileEditor({ initial, shareUrl }: { initial: ProfileState; shareUrl: string }) {
  const [profile, setProfile] = useState(initial);
  const [message, setMessage] = useState("");

  const save = async () => {
    const result = await updateProfile(profile);
    setMessage(result.message);
  };

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "JM";

  const toList = (value: string) => value.split(",").map((entry) => entry.trim()).filter(Boolean);

  return (
    <section className="admin-panel form-panel">
      <p className="field-hint">Live portfolio URL: {shareUrl}</p>

      <div className="profile-image-row">
        <div className="profile-image-thumb">
          {profile.photoUrl ? <img src={profile.photoUrl} alt={profile.name} /> : <span>{initials}</span>}
        </div>
        <div className="profile-image-meta">
          <strong>Portfolio image</strong>
          <small>Add a clear profile photo so visitors can instantly recognise your brand.</small>
        </div>
      </div>

      <label>
        Professional photo URL
        <input
          value={profile.photoUrl}
          onChange={(event) => setProfile({ ...profile, photoUrl: event.target.value })}
          placeholder="https://images.example.com/your-photo.jpg"
        />
      </label>

      <div className="template-picker-block">
        <p className="template-label">Portfolio template</p>
        <div className="template-choice-grid">
          {([
            { id: "editorial", title: "Editorial", description: "Refined and confident" },
            { id: "minimal", title: "Minimal", description: "Clean and focused" },
            { id: "bold", title: "Bold", description: "High-impact and modern" }
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
        <textarea rows={7} value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
      </label>

      <label>
        Career background
        <textarea rows={5} value={profile.careerBackground ?? ""} onChange={(event) => setProfile({ ...profile, careerBackground: event.target.value })} />
      </label>

      <label>
        Specializations (comma separated)
        <input value={(profile.specializations ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, specializations: toList(event.target.value) })} />
      </label>

      <label>
        Professional interests (comma separated)
        <input value={(profile.interests ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, interests: toList(event.target.value) })} />
      </label>

      <label>
        Technologies used (comma separated)
        <input value={(profile.technologies ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, technologies: toList(event.target.value) })} />
      </label>

      <label>
        Career objectives (comma separated)
        <input value={(profile.objectives ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, objectives: toList(event.target.value) })} />
      </label>

      <label>
        Professional values (comma separated)
        <input value={(profile.values ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, values: toList(event.target.value) })} />
      </label>

      <label>
        CV download URL
        <input value={profile.cvUrl ?? ""} onChange={(event) => setProfile({ ...profile, cvUrl: event.target.value })} placeholder="https://example.com/my-cv.pdf" />
      </label>

      <div className="project-form-actions">
        <button className="outline-button" onClick={save}><Save size={16} /> Save draft</button>
        <button
          className="admin-primary"
          onClick={async () => {
            await save();
            const result = await publishPortfolio();
            setMessage(result.message);
          }}
        >
          <Send size={16} /> Publish & share
        </button>
      </div>

      <div className="admin-notice">
        <strong>Portfolio publishing is gated by payment.</strong>
        <span>Upgrade to an active plan before publishing your live portfolio.</span>
        <a href="/pricing" className="button button-dark">Choose a publishing plan</a>
      </div>

      <a className="back-link" href={shareUrl} target="_blank"><Eye size={15} /> Preview public portfolio</a>
      {message && <p className="form-success">{message}</p>}
    </section>
  );
}

