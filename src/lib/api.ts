import axios, { AxiosError } from 'axios'
import type { ContactValues } from './validation/contact'

/* -------------------------------------------------------------------------- */
/*  The only place this site talks to the backend.                            */
/*                                                                            */
/*  Every failure is turned into something a visitor can read — the API        */
/*  already writes its errors that way, and anything unexpected gets a plain   */
/*  sentence rather than an axios message about status codes.                  */
/* -------------------------------------------------------------------------- */

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const client = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/** What the API sends back when something is wrong. */
type ApiError = {
  ok: false
  error?: string
  fields?: Record<string, string>
}

type ApiSuccess = {
  ok: true
  message: string
}

export type SubmitResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fields?: Record<string, string> }

const GENERIC =
  'Something went wrong sending your message. Please try again, or email me directly.'

export async function submitEnquiry(values: ContactValues): Promise<SubmitResult> {
  try {
    const { data } = await client.post<ApiSuccess>('/v1/contact', {
      name:         values.name,
      email:        values.email,
      organisation: values.organisation || undefined,
      message:      values.message,
      website:      values.website ?? '',
    })

    return { ok: true, message: data.message }
  } catch (cause) {
    const error = cause as AxiosError<ApiError>

    if (error.code === 'ECONNABORTED') {
      return {
        ok: false,
        message: 'That took too long to send. Please check your connection and try again.',
      }
    }

    /* No response at all — offline, DNS, or the service is down. */
    if (!error.response) {
      return {
        ok: false,
        message: 'I could not reach the server. Please try again in a moment, or email me directly.',
      }
    }

    const body = error.response.data

    return {
      ok: false,
      message: body?.error ?? GENERIC,
      ...(body?.fields ? { fields: body.fields } : {}),
    }
  }
}
