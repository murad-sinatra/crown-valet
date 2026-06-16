'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import AppShell from '@/components/AppShell'
import LoadingScreen from '@/components/LoadingScreen'
import PageHeader from '@/components/PageHeader'

const roles = [
  { value: 'attendant', label: 'Attendant', description: 'Parks and retrieves vehicles' },
  { value: 'runner', label: 'Runner', description: 'Retrieves vehicles for pickup' },
  { value: 'manager', label: 'Manager', description: 'Oversees valet operations' },
  { value: 'admin', label: 'Admin', description: 'Full system access' },
] as const

type Role = (typeof roles)[number]['value']

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { statusMessage?: string } | null
  return data?.statusMessage
}

export default function StaffOnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState<{ name: string; phone: string; role: Role }>({
    name: '',
    phone: '',
    role: 'attendant',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function completeProfile(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/staff/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        setErrorMessage((await readError(response)) ?? 'Failed to save profile. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push('/staff')
    } catch {
      setErrorMessage('Failed to save profile. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      {isSubmitting ? <LoadingScreen message="Saving your profile…" /> : null}

        <PageHeader
          eyebrow="Almost there"
          title="Set up your profile"
          description="Tell us a bit about yourself and your role on the team."
        />

        <section className="app-card">
          <form className="check-in-form" onSubmit={completeProfile}>
            <div className="form-section">
              <label className="field">
                <span>Full name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  type="text"
                  autoComplete="name"
                  name="name"
                  placeholder="Jane Smith"
                  required
                />
              </label>

              <label className="field">
                <span>
                  Phone <span className="field-optional">(optional)</span>
                </span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  type="tel"
                  autoComplete="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                />
              </label>
            </div>

            <div className="form-section">
              <p className="role-label">Your role</p>
              <div className="role-grid">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`role-card${form.role === role.value ? ' selected' : ''}`}
                  >
                    <input
                      checked={form.role === role.value}
                      onChange={() => setForm({ ...form, role: role.value })}
                      type="radio"
                      name="role"
                      value={role.value}
                      className="role-radio"
                    />
                    <span className="role-name">{role.label}</span>
                    <span className="role-desc">{role.description}</span>
                  </label>
                ))}
              </div>
            </div>

            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

            <div className="form-submit">
              <button
                className="button primary"
                type="submit"
                disabled={isSubmitting || !form.name}
              >
                {isSubmitting ? 'Saving…' : 'Continue to dashboard'}
              </button>
            </div>
          </form>
        </section>

      <style jsx>{`
        .field-optional {
          font-size: 0.75rem;
          opacity: 0.6;
          font-weight: 400;
        }

        .role-label {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide, 0.08em);
          color: var(--color-ink);
          opacity: 0.6;
          margin-bottom: 0.75rem;
        }

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .role-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          border: 1.5px solid color-mix(in srgb, var(--color-ink) 15%, transparent);
          border-radius: 8px;
          cursor: pointer;
          transition:
            border-color 0.15s,
            background-color 0.15s;
        }

        .role-card:hover {
          border-color: color-mix(in srgb, var(--color-gold) 60%, transparent);
        }

        .role-card.selected {
          border-color: var(--color-gold);
          background-color: color-mix(in srgb, var(--color-gold) 8%, transparent);
        }

        .role-radio {
          display: none;
        }

        .role-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--color-ink);
        }

        .role-desc {
          font-size: 0.8125rem;
          color: var(--color-ink);
          opacity: 0.65;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .role-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppShell>
  )
}
