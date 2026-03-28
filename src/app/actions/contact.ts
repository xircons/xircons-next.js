'use server'

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

/**
 * Validates and (in production) dispatches a contact form submission.
 * Returns a structured result — never throws unhandled errors.
 *
 * Swap the TODO comment for a real transactional email call (Resend,
 * SendGrid, etc.) using environment variables only, never exposing keys
 * to the client.
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

  // TODO: swap for real email delivery
  // await resend.emails.send({ from: '...', to: '...', ...parsed.data })

  // Simulate async work without leaking internal data
  await new Promise((resolve) => setTimeout(resolve, 600))

  return { ok: true }
}
