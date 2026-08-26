export async function sendActivationEmail(input: { email: string; name: string; token: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!apiKey || !from || !appUrl) throw new Error("Email delivery is not configured. Set RESEND_API_KEY, EMAIL_FROM, and NEXT_PUBLIC_APP_URL.");
  const url = `${appUrl}/activate?token=${encodeURIComponent(input.token)}`;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [input.email], subject: "Activate your Jeremiah Muthama Waita portfolio account", html: `<h1>Welcome to Jeremiah Muthama Waita&apos;s portfolio</h1><p>Hi ${escapeHtml(input.name)},</p><p>Activate your account to access your workspace.</p><p><a href="${url}">Activate my account</a></p><p>This link expires in 24 hours.</p>` }) });
  if (!response.ok) throw new Error("We could not send the activation email. Please try again shortly.");
}

export async function sendPasswordResetEmail(input: { email: string; name: string; token: string }) {
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.EMAIL_FROM; const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!apiKey || !from || !appUrl) throw new Error("Email delivery is not configured.");
  const url = `${appUrl}/reset-password?token=${encodeURIComponent(input.token)}`;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [input.email], subject: "Reset your Jeremiah Muthama Waita password", html: `<h1>Reset your password</h1><p>Hi ${escapeHtml(input.name)},</p><p><a href="${url}">Choose a new password</a></p><p>This link expires in one hour. If you did not request it, you can ignore this email.</p>` }) });
  if (!response.ok) throw new Error("Password reset email could not be sent.");
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
