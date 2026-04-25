import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;
const from = process.env.SMTP_FROM ?? "noreply@sion-emergence.fr";

const transporter = host
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && password ? { user, pass: password } : undefined,
    })
  : null;

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>;
}) {
  if (!transporter) {
    // Dev local — log dans la console au lieu d'envoyer
    console.log("\n[EMAIL — mode dev, non envoyé]");
    console.log("À:", opts.to);
    console.log("Sujet:", opts.subject);
    console.log("---");
    console.log(opts.text ?? opts.html.replace(/<[^>]+>/g, ""));
    if (opts.attachments?.length) {
      console.log(
        "PJ:",
        opts.attachments.map((a) => `${a.filename} (${a.content.length} octets)`).join(", "),
      );
    }
    console.log("---\n");
    return { mocked: true };
  }
  return transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    attachments: opts.attachments,
  });
}
