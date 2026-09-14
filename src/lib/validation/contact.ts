import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/*  Mirrors the schema the API enforces, so a visitor sees the problem as they */
/*  type instead of after a round trip. The server still validates — this is   */
/*  courtesy, not security.                                                     */
/* -------------------------------------------------------------------------- */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please tell me your name.')
    .max(80, 'That name is longer than this form can take.'),

  email: z
    .string()
    .trim()
    .min(1, 'I need an address to reply to.')
    .email('That does not look like an email address I could reply to.'),

  organisation: z
    .string()
    .trim()
    .max(120, 'That organisation name is too long.')
    .optional(),

  message: z
    .string()
    .trim()
    .min(20, 'A little more detail would help — twenty characters at least.')
    .max(4000, 'That message is too long to send. Could you shorten it?'),

  /* Hidden from people, irresistible to bots. Never shown, never validated. */
  website: z.string().optional(),
})

export type ContactValues = z.infer<typeof contactSchema>

export const contactDefaults: ContactValues = {
  name:         '',
  email:        '',
  organisation: '',
  message:      '',
  website:      '',
}

/** Longest message the form will accept — used for the live counter. */
export const MESSAGE_MAX = 4000
