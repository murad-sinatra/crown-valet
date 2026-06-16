'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import AppShell from '@/components/AppShell'
import LoadingScreen from '@/components/LoadingScreen'
import PageHeader from '@/components/PageHeader'

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { statusMessage?: string } | null
  return data?.statusMessage
}

export default function StaffSignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function signup(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      if (!response.ok) {
        setErrorMessage((await readError(response)) ?? 'Sign up failed. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push('/staff/onboarding')
    } catch {
      setErrorMessage('Sign up failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showNav={false}>
      {isSubmitting ? <LoadingScreen message="Creating your account…" /> : null}

        <PageHeader
          eyebrow="Create account"
          title="Join Crown Valet"
          description="Create your staff account to get started."
        />

        <section className="app-card">
          <form className="check-in-form" onSubmit={signup}>
            <div className="form-section">
              <label className="field">
                <span>Email</span>
                <input
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  type="email"
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </label>

              <label className="field">
                <span>Confirm password</span>
                <input
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm({ ...form, confirmPassword: event.target.value })
                  }
                  type="password"
                  autoComplete="new-password"
                  name="confirm-password"
                  placeholder="••••••••"
                  required
                />
              </label>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <div className="form-submit">
              <button className="button primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>

          <p className="signup-login-link">
            Already have an account? <Link href="/staff/login">Sign in</Link>
          </p>
        </section>

      <style jsx>{`
        .signup-login-link {
          margin-top: 1.25rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-ink);
          opacity: 0.7;
        }

        .signup-login-link :global(a) {
          color: var(--color-gold);
          text-decoration: none;
          font-weight: 600;
        }

        .signup-login-link :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </AppShell>
  )
}
