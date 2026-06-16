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

export default function StaffLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function login(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        setErrorMessage((await readError(response)) ?? 'Login failed. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push('/staff')
    } catch {
      setErrorMessage('Login failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showNav={false}>
      {isSubmitting ? <LoadingScreen message="Signing you in…" /> : null}

        <PageHeader
          eyebrow="Staff login"
          title="Access Crown Valet operations"
          description="Sign in with your email and password to access staff operations."
        />

        <section className="app-card">
          <form className="check-in-form" onSubmit={login}>
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
                  autoComplete="current-password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </label>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <div className="form-submit">
              <button className="button primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="signup-link">
            Don&apos;t have an account? <Link href="/staff/signup">Create one</Link>
          </p>
        </section>

      <style jsx>{`
        .signup-link {
          margin-top: 1.25rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-ink);
          opacity: 0.7;
        }

        .signup-link :global(a) {
          color: var(--color-gold);
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link :global(a:hover) {
          text-decoration: underline;
        }
      `}</style>
    </AppShell>
  )
}
