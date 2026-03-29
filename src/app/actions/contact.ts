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

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[xircons.website] Message from ${name}`,
      text,
      html,
    })

    if (error) {
      console.error('[contact] Resend error:', error.name, error.message)
      return { ok: false, error: SEND_FAILED }
    }

    return { ok: true }
  } catch (e) {
    console.error('[contact] Send failed:', e)
    return { ok: false, error: SEND_FAILED }
  }
}
