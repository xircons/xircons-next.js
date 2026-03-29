'use server'

import {
  buildContactEmailHtml,
  buildContactEmailPlainText,
} from '@/lib/contactEmailTemplate'
import { Resend } from 'resend'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name is too long.'),
  phone: z.string().trim().max(30, 'Phone number is too long.').optional(),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(254, 'Email address is too long.'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters.')
    .max(2000, 'Message must be under 2000 characters.'),
})

export type ContactFormState = {
  ok: boolean
  error?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string[]>>
}

const SEND_FAILED =
  'Could not send your message. Please try again in a few minutes.'
const NOT_CONFIGURED =
  'Contact form is temporarily unavailable. Please try again later.'

function sanitizeSubjectName(name: string): string {
  return name
    .replace(/[\r\n\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

function parseToRecipients(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

type ResendErr = { name: string; message: string; statusCode: number | null }

function userFacingResendError(err: ResendErr): string {
  const dev = process.env.NODE_ENV === 'development'
  const suffix = dev && err.message ? ` — ${err.message}` : ''

  switch (err.name) {
    case 'invalid_from_address':
      return (
        'This site cannot send mail yet: the sender address is not verified in Resend. ' +
        'Verify your domain and set CONTACT_FROM_EMAIL to an address on that domain.' +
        suffix
      )
    case 'invalid_api_key':
    case 'restricted_api_key':
    case 'missing_api_key':
      return 'Email service is misconfigured (API key). Please contact the site owner.' + suffix
    case 'validation_error':
    case 'missing_required_field':
    case 'invalid_parameter':
      return (
        'The message could not be accepted by the email service. Check environment variables (from/to) and try again.' +
        suffix
      )
    case 'rate_limit_exceeded':
    case 'daily_quota_exceeded':
    case 'monthly_quota_exceeded':
      return 'Too many messages were sent recently. Please try again later.' + suffix
    default:
      return SEND_FAILED + suffix
  }
}

/**
 * Validates and sends contact submissions via Resend (server-only env).
 * Never throws; never exposes API details to the client.
 */
export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name'),
    phone: formData.get('phone') || undefined,
    email: formData.get('email'),
    message: formData.get('message'),
  }

  const parsed = ContactSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      ok: false,
      error: '',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim()

  if (!apiKey || !from || !to) {
    console.error('[contact] Missing RESEND_API_KEY, CONTACT_FROM_EMAIL, or CONTACT_TO_EMAIL')
    return { ok: false, error: NOT_CONFIGURED }
  }

  const { name, phone, email, message } = parsed.data
  const phoneLine = phone && phone.length > 0 ? phone : '(none)'

  const payload = { name, phoneLine, email, message }
  const text = buildContactEmailPlainText(payload)
  const html = buildContactEmailHtml(payload)
  const subjectName = sanitizeSubjectName(name)
  const toList = parseToRecipients(to)
  if (toList.length === 0) {
    console.error('[contact] CONTACT_TO_EMAIL has no valid addresses')
    return { ok: false, error: NOT_CONFIGURED }
  }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to: toList.length === 1 ? toList[0]! : toList,
      replyTo: email,
      subject: `[xircons.website] Message from ${subjectName}`,
      text,
      html,
    })

    if (error) {
      console.error(
        '[contact] Resend error:',
        error.name,
        error.message,
        error.statusCode,
      )
      return { ok: false, error: userFacingResendError(error) }
    }

    if (!data?.id) {
      console.error('[contact] Resend returned no email id', { data })
      return { ok: false, error: SEND_FAILED }
    }

    console.info('[contact] Resend accepted:', data.id, '→', toList.join(', '))
    return { ok: true }
  } catch (e) {
    console.error('[contact] Send failed:', e)
    const dev = process.env.NODE_ENV === 'development'
    const hint =
      dev && e instanceof Error && e.message
        ? `${SEND_FAILED} — ${e.message}`
        : SEND_FAILED
    return { ok: false, error: hint }
  }
}
