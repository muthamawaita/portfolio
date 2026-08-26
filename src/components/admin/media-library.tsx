"use client";

import { ChangeEvent, useState } from "react";
import { FileImage, FileText, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

type MediaItem = { id: string; fileName: string; url: string; mimeType: string; size: number; createdAt: Date };

export function MediaLibrary({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setMessage("");
    const body = new FormData(); body.set("file", file);
    try { const response = await fetch("/api/upload", { method: "POST", body }); const result = await response.json() as { ok: boolean; message?: string }; if (!result.ok) { setMessage(result.message ?? "Upload failed."); return; } setMessage("Upload complete."); event.target.value = ""; router.refresh(); }
    catch { setMessage("Upload failed. Please try again."); } finally { setBusy(false); }
  }
  return <><div className="upload-dropzone"><Upload size={24} /><strong>{busy ? "Uploading…" : "Upload an asset"}</strong><span>JPEG, PNG, WebP, GIF, or PDF · maximum 10 MB</span><label className="button button-dark">{busy ? <LoaderCircle className="spin" size={16} /> : <Upload size={16} />} Choose file<input hidden disabled={busy} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onChange={upload} /></label>{message && <p className="form-success">{message}</p>}</div><section className="admin-panel simple-list"><div className="panel-heading"><div><p className="admin-kicker">DATABASE / MEDIA</p><h2>Uploaded assets</h2></div><span>{media.length} files</span></div>{media.length ? media.map((asset) => <div className="simple-list-row" key={asset.id}><span className="list-icon">{asset.mimeType.startsWith("image/") ? <FileImage size={17} /> : <FileText size={17} />}</span><div><strong>{asset.fileName}</strong><small>{asset.mimeType} · {(asset.size / 1024 / 1024).toFixed(2)} MB · {new Date(asset.createdAt).toLocaleDateString()}</small></div><a className="secondary-action small" href={asset.url} target="_blank" rel="noreferrer">Open</a></div>) : <p className="admin-note">No files have been uploaded yet.</p>}</section></>;
}
