type LeadEmail = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  service?: string;
  message: string;
};

export async function sendLeadEmails(lead: LeadEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL ?? from;
  if (!apiKey || !from || !recipient) return;

  const safe = {
    name: escapeHtml(lead.name), email: escapeHtml(lead.email), phone: escapeHtml(lead.phone ?? "Not provided"),
    subject: escapeHtml(lead.subject), service: escapeHtml(lead.service ?? "General enquiry"), message: escapeHtml(lead.message).replace(/\n/g, "<br />"),
  };
  const send = (to: string, subject: string, html: string) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  const [admin, confirmation] = await Promise.allSettled([
    send(recipient, `New portfolio enquiry: ${lead.subject}`, `<h1>New enquiry</h1><p><strong>From:</strong> ${safe.name} (${safe.email})</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Service:</strong> ${safe.service}</p><p><strong>Subject:</strong> ${safe.subject}</p><p>${safe.message}</p>`),
    send(lead.email, "We received your enquiry", `<h1>Thanks, ${safe.name}</h1><p>Your message has been received. We will get back to you shortly.</p><p><strong>Subject:</strong> ${safe.subject}</p>`),
  ]);
  if (admin.status === "rejected" || confirmation.status === "rejected") console.error("Contact email delivery failed.");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
