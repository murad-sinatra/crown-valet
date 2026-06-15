'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import AppTopbar from '@/components/AppTopbar'
import PageHeader from '@/components/PageHeader'

type Me = {
  id: string
  name: string
  email: string
  role: string
}

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { statusMessage?: string } | null
  return data?.statusMessage
}

export default function StaffProfilePage() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    void fetch('/api/staff/me')
      .then((response) => response.json())
      .then(setMe)
      .catch(() => setMe(null))
  }, [])

  async function changePassword(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        setErrorMessage((await readError(response)) ?? 'Could not update password. Please try again.')
        return
      }

      setSuccessMessage('Password updated successfully.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setErrorMessage('Could not update password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/staff/login')
  }

  return (
    <main className="app-surface">
      <div className="app-shell">
        <AppTopbar />

        <PageHeader
          eyebrow="My profile"
          title="Account settings"
          description="Manage your staff account details."
        />

        <section className="app-card">
          <div className="form-section">
            <div>
              <p className="eyebrow">Account</p>
              <h2>Your details</h2>
            </div>
            <p>
              <strong>Name:</strong> {me?.name}
            </p>
            <p>
              <strong>Email:</strong> {me?.email}
            </p>
            <p>
              <strong>Role:</strong> {me?.role}
            </p>
          </div>
        </section>

        <section className="app-card">
          <form className="check-in-form" onSubmit={changePassword}>
            <div className="form-section">
              <div>
                <p className="eyebrow">Security</p>
                <h2>Change password</h2>
              </div>

              <label className="field">
                <span>Current password</span>
                <input
                  value={form.currentPassword}
                  onChange={(event) =>
                    setForm({ ...form, currentPassword: event.target.value })
                  }
                  type="password"
                  autoComplete="current-password"
                  name="currentPassword"
                  placeholder="••••••••"
                  required
                />
              </label>

              <label className="field">
                <span>
                  New password <strong>Min. 8 characters</strong>
                </span>
                <input
                  value={form.newPassword}
                  onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
                  type="password"
                  autoComplete="new-password"
                  name="newPassword"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </label>

              <label className="field">
                <span>Confirm new password</span>
                <input
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm({ ...form, confirmPassword: event.target.value })
                  }
                  type="password"
                  autoComplete="new-password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </label>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            {successMessage ? <p className="form-success">{successMessage}</p> : null}

            <div className="form-submit">
              <button className="button primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </section>

        <section className="app-card">
          <div className="form-section">
            <div>
              <p className="eyebrow">Session</p>
              <h2>Sign out</h2>
            </div>
            <p>End your current staff session.</p>
            <button className="button" type="button" onClick={() => void logout()}>
              Sign out
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
