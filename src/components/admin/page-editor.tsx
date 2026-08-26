"use client";

import { useState } from "react";
import { Eye, Save } from "lucide-react";
import { saveSitePage } from "@/server/actions/site-pages";

export function PageEditor({ slug, initialTitle, initialContent }: { slug: string; initialTitle: string; initialContent: string }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return <div className="page-editor-layout"><section className="admin-panel form-panel"><label>Page title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Page slug<div className="slug-input"><span>/p/</span><input value={slug} readOnly /></div></label><label>Page content<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={16} /></label><label>Publishing status<select value={status} onChange={(event) => setStatus(event.target.value as "DRAFT" | "PUBLISHED")}><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select></label><button className="admin-primary" disabled={busy} onClick={async () => { setBusy(true); setMessage(""); try { await saveSitePage({ tenantId: "default", title, slug, content: JSON.stringify({ body: content }), status }); setMessage("Saved successfully."); } catch { setMessage("Could not save. Check the page content and database connection."); } finally { setBusy(false); } }}><Save size={16} /> {busy ? "Saving..." : "Save page"}</button>{message && <p className="form-success">{message}</p>}</section><aside className="editor-preview"><div className="preview-toolbar"><span><Eye size={15} /> Live preview</span><span>Unsaved changes update here</span></div><div className="preview-paper"><p className="section-kicker">PORTFOLIO PAGE</p><h2>{title}</h2><p>{content}</p></div></aside></div>;
}
