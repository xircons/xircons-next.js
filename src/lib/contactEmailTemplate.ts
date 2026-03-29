/**
 * Transactional HTML for contact notifications — duotone aligned with the site
 * (ink #1a1a1a, canvas #fff, mono labels). Inline styles only for email clients.
 */

const INK = '#1a1a1a'
const CANVAS = '#ffffff'
const MUTED = 'rgba(255,255,255,0.5)'
const RULE = 'rgba(255,255,255,0.35)'

/**
 * Web fonts via Google Fonts `<link>` in `<head>` (supported in many clients; others use fallbacks).
 * Inter + IBM Plex Mono align with the portfolio (sans body, mono labels).
 */
const FONT_SANS =
  "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const FONT_MONO =
  "'IBM Plex Mono',ui-monospace,'Cascadia Code','Segoe UI Mono',Menlo,Consolas,monospace"

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fieldRow(label: string, value: string): string {
  const v = escapeHtml(value)
  return `
<tr>
  <td style="padding:20px 0 8px 0;border-bottom:1px solid ${RULE};">
    <p style="margin:0 0 12px 0;font-family:${FONT_MONO};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:${MUTED};">${label}</p>
    <p style="margin:0;padding:2px 0 4px 0;font-family:${FONT_SANS};font-size:15px;line-height:1.5;color:${CANVAS};">${v}</p>
  </td>
</tr>`
}

export function buildContactEmailPlainText(input: {
  name: string
  phoneLine: string
  email: string
  message: string
}): string {
  const { name, phoneLine, email, message } = input
  return [
    'XIRCONS — PORTFOLIO CONTACT',
    '—'.repeat(32),
    '',
    `NAME\n${name}`,
    '',
    `PHONE\n${phoneLine}`,
    '',
    `EMAIL\n${email}`,
    '',
    'MESSAGE',
    message,
    '',
    '—'.repeat(32),
    'https://xircons.website',
  ].join('\n')
}

export function buildContactEmailHtml(input: {
  name: string
  phoneLine: string
  email: string
  message: string
}): string {
  const { name, phoneLine, email, message } = input
  const safeMessage = escapeHtml(message)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta name="color-scheme" content="dark">
  <title>New contact message</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:${CANVAS};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${CANVAS};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:${INK};border:1px solid ${INK};">
          <tr>
            <td style="padding:40px 36px 32px 36px;">
              <p style="margin:0 0 8px 0;font-family:${FONT_MONO};font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:${MUTED};">Portfolio</p>
              <h1 style="margin:0;font-family:${FONT_SANS};font-size:28px;font-weight:500;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.08;color:${CANVAS};">New contact message.</h1>
              <p style="margin:12px 0 0 0;font-family:${FONT_MONO};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">xircons.website</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 12px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${fieldRow('Name', name)}
                ${fieldRow('Phone', phoneLine)}
                ${fieldRow('Email', email)}
                <tr>
                  <td style="padding:28px 0 8px 0;">
                    <p style="margin:0 0 14px 0;font-family:${FONT_MONO};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:${MUTED};">Message</p>
                    <div style="font-family:${FONT_SANS};font-size:15px;line-height:1.6;color:${CANVAS};white-space:pre-wrap;word-break:break-word;padding:4px 0 8px 0;">${safeMessage}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 36px 44px 36px;border-top:1px solid ${RULE};">
              <p style="margin:0;font-family:${FONT_MONO};font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">Reply to this email to reach the sender directly</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
