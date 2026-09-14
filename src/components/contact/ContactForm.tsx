import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { submitEnquiry } from '@/lib/api'
import {
  contactDefaults,
  contactSchema,
  MESSAGE_MAX,
  type ContactValues,
} from '@/lib/validation/contact'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  Shared field chrome. Hierarchy from borders and tone, never elevation —    */
/*  the focus ring is the one shadow this design allows, because it is an      */
/*  accessibility affordance rather than decoration.                           */
/* -------------------------------------------------------------------------- */

const fieldBase =
  'w-full rounded-xl border bg-canvas px-3.5 py-2.5 text-base text-ink transition-colors duration-200 placeholder:text-ink-faint focus:outline-none focus-visible:outline-none'

const fieldRest = 'border-line hover:border-line-strong focus:border-accent'
const fieldError = 'border-danger-line bg-danger-soft focus:border-danger'

type FieldProps = {
  id: keyof ContactValues
  label: string
  error?: string
  optional?: boolean
  children: React.ReactNode
  hint?: string
}

function Field({ id, label, error, optional, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {optional ? (
            <span className="ml-1.5 font-normal text-ink-faint">optional</span>
          ) : null}
        </label>
        {hint ? <span className="font-mono text-xs text-ink-faint">{hint}</span> : null}
      </div>

      {children}

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden text-sm text-danger"
          >
            <span className="block pt-1.5">{error}</span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function ContactForm() {
  const reduced = useReducedMotion()
  const [sent, setSent] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
    mode: 'onBlur',
  })

  const messageLength = watch('message')?.length ?? 0

  const onSubmit = async (values: ContactValues) => {
    setFormError(null)

    const result = await submitEnquiry(values)

    if (result.ok) {
      setSent(result.message)
      reset(contactDefaults)
      return
    }

    /* The API can disagree with the browser about a specific field. */
    if (result.fields) {
      for (const [field, message] of Object.entries(result.fields)) {
        if (field in contactDefaults) {
          setError(field as keyof ContactValues, { type: 'server', message })
        }
      }
    }

    setFormError(result.message)
  }

  /* ------------------------------------------------------------- sent -- */

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-success-line bg-success-soft p-6 sm:p-8"
      >
        <span className="grid size-9 place-items-center rounded-full border border-success-line bg-canvas text-success">
          <Check aria-hidden className="size-4.5" />
        </span>

        <h3 className="mt-4 text-lg font-medium text-ink">Message sent</h3>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-ink-muted">{sent}</p>

        <button
          type="button"
          onClick={() => setSent(null)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
        >
          Send another
        </button>
      </motion.div>
    )
  }

  /* ------------------------------------------------------------- form -- */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={cn(fieldBase, errors.name ? fieldError : fieldRest)}
              {...register('name')}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(fieldBase, errors.email ? fieldError : fieldRest)}
              {...register('email')}
            />
          </Field>
        </div>

        <Field
          id="organisation"
          label="Company or organisation"
          optional
          error={errors.organisation?.message}
        >
          <input
            id="organisation"
            type="text"
            autoComplete="organization"
            placeholder="Where you work"
            aria-invalid={Boolean(errors.organisation)}
            aria-describedby={errors.organisation ? 'organisation-error' : undefined}
            className={cn(fieldBase, errors.organisation ? fieldError : fieldRest)}
            {...register('organisation')}
          />
        </Field>

        <Field
          id="message"
          label="What do you have in mind?"
          error={errors.message?.message}
          hint={messageLength > MESSAGE_MAX - 400 ? `${messageLength}/${MESSAGE_MAX}` : undefined}
        >
          <textarea
            id="message"
            rows={5}
            placeholder="What you are building, roughly when, and what you need from me."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={cn(fieldBase, 'resize-y leading-relaxed', errors.message ? fieldError : fieldRest)}
            {...register('message')}
          />
        </Field>

        {/*
          Honeypot. Off-screen rather than display:none, because some bots skip
          hidden inputs but almost all of them fill in everything they can see
          in the markup. Never announced, never focusable.
        */}
        <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {formError ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="mt-4 flex gap-2.5 rounded-xl border border-danger-line bg-danger-soft px-3.5 py-3"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
              <p className="text-sm leading-relaxed text-ink">{formError}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-2 rounded-xl border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-3 hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:gap-2 disabled:hover:border-ink disabled:hover:bg-ink"
        >
          {isSubmitting ? (
            <>
              Sending
              <Loader2 aria-hidden className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>

        <p aria-live="polite" className="text-xs text-ink-faint">
          {isSubmitting ? 'Sending your message…' : 'I usually reply within a day or two.'}
        </p>
      </div>
    </form>
  )
}
