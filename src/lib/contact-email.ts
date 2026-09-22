import "server-only";

import nodemailer from "nodemailer";

export type ContactEmailInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function requiredEnvironmentValue(name: "GMAIL_USER" | "GMAIL_APP_PASSWORD") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

/** Sends a contact enquiry directly to Gmail. Contact messages are not stored. */
export async function sendContactEmail(input: ContactEmailInput) {
  const gmailUser = requiredEnvironmentValue("GMAIL_USER");
  const gmailAppPassword = requiredEnvironmentValue("GMAIL_APP_PASSWORD");
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim() || gmailUser;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date());

  await transporter.sendMail({
    from: `TV SUPREME Contact <${gmailUser}>`,
    to: recipient,
    replyTo: input.email,
    subject: `[TV SUPREME Contact] ${input.subject}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || "Not supplied"}`,
      `Submitted: ${submittedAt}`,
      "",
      input.message,
    ].join("\n"),
    html: `
      <h2>New TV SUPREME contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.phone || "Not supplied")}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <hr />
      <p style="white-space: pre-wrap">${escapeHtml(input.message)}</p>
    `,
  });
}
