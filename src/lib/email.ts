import sgMail from "@sendgrid/mail"

const FROM_EMAIL = "nextwavehq@outlook.com"
const FROM_NAME = "Nerdhaven"

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: { filename: string; content: string; type: string }[],
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not configured — skipping email to", to)
    return { sent: false, error: "SENDGRID_API_KEY not configured" }
  }

  try {
    const msg: any = {
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      html,
    }
    if (attachments && attachments.length > 0) {
      msg.attachments = attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        type: a.type,
        disposition: "attachment",
      }))
    }
    await sgMail.send(msg)
    return { sent: true, error: null }
  } catch (err: any) {
    const msg = err?.response?.body?.errors?.[0]?.message || err?.message || err?.toString?.() || "unknown"
    console.error("Failed to send email:", msg)
    return { sent: false, error: msg }
  }
}

export function contactAutoReplyHtml(name: string): string {
  const greeting = name ? `Hi ${name},` : "Hi there,"
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:32px 24px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px">Nerdhaven</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px">We received your message</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600">${greeting}</h2>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                Thank you for reaching out to <strong>Nerdhaven</strong>!
              </p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                We've received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.
              </p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                If your matter is urgent, feel free to reach us directly at <a href="mailto:nextwavehq@outlook.com" style="color:#6366f1">nextwavehq@outlook.com</a>.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5">
                This is an automated response. Please do not reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 24px;text-align:center">
              <p style="margin:0;color:#9ca3af;font-size:12px">© 2026 Nerdhaven. Copyright owned by Nextwave Infotech.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function welcomeEmailHtml(name: string): string {
  const greeting = name ? `Hi ${name},` : "Hi there,"
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:32px 24px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px">Nerdhaven</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px">Your learning journey starts now</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:600">${greeting}</h2>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                Welcome to <strong>Nerdhaven</strong>! We're thrilled to have you on board.
              </p>
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">
                Whether you're preparing for exams, exploring a degree program, or building career-ready skills — your personalized dashboard is ready.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://nerdhaven.com"}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600">Go to Dashboard</a>
                  </td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <h3 style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:600">Quick links</h3>
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">
                <tr><td style="padding:4px 0"><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://nerdhaven.com"}/courses" style="color:#6366f1;text-decoration:none">Browse courses →</a></td></tr>
                <tr><td style="padding:4px 0"><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://nerdhaven.com"}/secondary/exams" style="color:#6366f1;text-decoration:none">Practice past questions →</a></td></tr>
                <tr><td style="padding:4px 0"><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://nerdhaven.com"}/dashboard/settings" style="color:#6366f1;text-decoration:none">Edit your profile →</a></td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5">
                Need help? Reply to this email or reach out at <a href="mailto:nextwavehq@outlook.com" style="color:#6366f1;text-decoration:none">nextwavehq@outlook.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 24px;text-align:center">
              <p style="margin:0;color:#9ca3af;font-size:12px">© 2026 Nerdhaven. Copyright owned by Nextwave Infotech.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
