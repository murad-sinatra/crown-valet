'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import AppTopbar from '@/components/AppTopbar'
import PageHeader from '@/components/PageHeader'

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { statusMessage?: string } | null
  return data?.statusMessage
}

export default function StaffCheckInPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    customerPhone: '',
    customerName: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    keyTag: '',
    vehicleNotes: '',
    parkingZone: '',
    staffNotes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function submitCheckIn(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/staff/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        setErrorMessage((await readError(response)) ?? 'Unable to create this valet session. Please try again.')
        return
      }

      const result = (await response.json()) as {
        session: { id: string; ticketNumber: string }
        ticketToken: string
      }

      router.push(
        `/staff/sessions/${result.session.id}?ticketToken=${encodeURIComponent(result.ticketToken)}`,
      )
    } catch {
      setErrorMessage('Unable to create this valet session. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-surface">
      <div className="app-shell">
        <AppTopbar />

        <PageHeader
          eyebrow="New check-in"
          title="Create a valet session"
          description="Capture the customer, vehicle, key tag, and parking notes needed to start a traceable valet session."
        />

        <section className="app-card">
          <form className="check-in-form" onSubmit={submitCheckIn}>
            <div className="form-section">
              <div>
                <p className="eyebrow">Customer</p>
                <h2>Contact details</h2>
              </div>

              <label className="field">
                <span>
                  Customer phone <strong>Required</strong>
                </span>
                <input
                  value={form.customerPhone}
                  onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
                  autoComplete="tel"
                  inputMode="tel"
                  name="customerPhone"
                  placeholder="+1 305 555 0123"
                  required
                />
              </label>

              <label className="field">
                <span>Customer name</span>
                <input
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                  autoComplete="name"
                  name="customerName"
                  placeholder="Optional"
                />
              </label>
            </div>

            <div className="form-section">
              <div>
                <p className="eyebrow">Vehicle</p>
                <h2>Car details</h2>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>
                    Make <strong>Required</strong>
                  </span>
                  <input
                    value={form.vehicleMake}
                    onChange={(event) => setForm({ ...form, vehicleMake: event.target.value })}
                    name="vehicleMake"
                    placeholder="Mercedes"
                    required
                  />
                </label>

                <label className="field">
                  <span>
                    Model <strong>Required</strong>
                  </span>
                  <input
                    value={form.vehicleModel}
                    onChange={(event) => setForm({ ...form, vehicleModel: event.target.value })}
                    name="vehicleModel"
                    placeholder="S-Class"
                    required
                  />
                </label>

                <label className="field">
                  <span>
                    Color <strong>Required</strong>
                  </span>
                  <input
                    value={form.vehicleColor}
                    onChange={(event) => setForm({ ...form, vehicleColor: event.target.value })}
                    name="vehicleColor"
                    placeholder="Black"
                    required
                  />
                </label>

                <label className="field">
                  <span>
                    License plate <strong>Required</strong>
                  </span>
                  <input
                    value={form.licensePlate}
                    onChange={(event) => setForm({ ...form, licensePlate: event.target.value })}
                    name="licensePlate"
                    placeholder="ABC 123"
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span>Vehicle notes</span>
                <textarea
                  value={form.vehicleNotes}
                  onChange={(event) => setForm({ ...form, vehicleNotes: event.target.value })}
                  name="vehicleNotes"
                  placeholder="Optional vehicle identifiers or condition notes"
                  rows={3}
                />
              </label>
            </div>

            <div className="form-section">
              <div>
                <p className="eyebrow">Operations</p>
                <h2>Key and staff notes</h2>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>
                    Key tag <strong>Required</strong>
                  </span>
                  <input
                    value={form.keyTag}
                    onChange={(event) => setForm({ ...form, keyTag: event.target.value })}
                    name="keyTag"
                    placeholder="K-104"
                    required
                  />
                </label>

                <label className="field">
                  <span>Parking zone</span>
                  <input
                    value={form.parkingZone}
                    onChange={(event) => setForm({ ...form, parkingZone: event.target.value })}
                    name="parkingZone"
                    placeholder="North ramp"
                  />
                </label>
              </div>

              <label className="field">
                <span>Staff notes</span>
                <textarea
                  value={form.staffNotes}
                  onChange={(event) => setForm({ ...form, staffNotes: event.target.value })}
                  name="staffNotes"
                  placeholder="Staff-only handoff notes"
                  rows={3}
                />
              </label>
            </div>

            {errorMessage ? (
              <p className="form-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <button className="button primary form-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating session...' : 'Create valet session'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
