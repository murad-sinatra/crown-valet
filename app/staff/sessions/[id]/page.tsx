'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AppTopbar from '@/components/AppTopbar'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'

type SessionDetail = {
  id: string
  venueName: string
  ticketNumber: string
  keyTag: string
  status: string
  statusLabel: string
  staffNotes: string | null
  tokenHint: string | null
  customer: { name: string | null; phone: string }
  vehicle: {
    make: string
    model: string
    color: string
    licensePlate: string
    notes: string | null
  }
  parkingLocation: {
    zone: string | null
    floor: string | null
    row: string | null
    stall: string | null
    note: string | null
    recordedAt: string
  } | null
  createdBy: { name: string; role: string }
  timeline: Array<{
    id: string
    title: string
    description: string | null
  }>
  serviceRequests: Array<{
    id: string
    serviceType: string
    status: string
    notes: string | null
    requestedAt: string
  }>
}

export default function StaffSessionDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(false)
  const [origin, setOrigin] = useState('')

  const ticketToken = searchParams.get('ticketToken')
  const shareLink = useMemo(
    () => (ticketToken && origin ? `${origin}/ticket/${ticketToken}` : ''),
    [ticketToken, origin],
  )

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    void fetch(`/api/staff/sessions/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          setError(true)
          return
        }
        setSession(await response.json())
      })
      .catch(() => setError(true))
      .finally(() => setPending(false))
  }, [params.id])

  return (
    <main className="app-surface">
      <div className="app-shell">
        <AppTopbar />

        <PageHeader
          eyebrow="Vehicle detail"
          title={
            session
              ? `${session.vehicle.color} ${session.vehicle.make} ${session.vehicle.model}`
              : 'Session detail'
          }
          description="Review check-in details, share the customer ticket link, and inspect the initial timeline."
        />

        {pending ? (
          <p className="muted-copy">Loading session...</p>
        ) : error ? (
          <p className="form-error">Unable to load this session.</p>
        ) : session ? (
          <div className="detail-layout">
            <section className="app-card detail-summary">
              <div className="section-toolbar">
                <div>
                  <StatusBadge status={session.status} label={session.statusLabel} />
                  <h2>{session.ticketNumber}</h2>
                  <p>
                    {session.venueName} · Key {session.keyTag}
                  </p>
                </div>

                <Link className="button secondary" href="/staff">
                  Back to sessions
                </Link>
              </div>

              <dl className="detail-grid">
                <div>
                  <dt>Customer</dt>
                  <dd>{session.customer.name || 'Guest'}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{session.customer.phone}</dd>
                </div>
                <div>
                  <dt>Vehicle</dt>
                  <dd>
                    {session.vehicle.color} {session.vehicle.make} {session.vehicle.model}
                  </dd>
                </div>
                <div>
                  <dt>Plate</dt>
                  <dd>{session.vehicle.licensePlate}</dd>
                </div>
                <div>
                  <dt>Parking zone</dt>
                  <dd>{session.parkingLocation?.zone || 'Not recorded'}</dd>
                </div>
                <div>
                  <dt>Created by</dt>
                  <dd>{session.createdBy.name}</dd>
                </div>
              </dl>
            </section>

            <section className="app-card">
              <h2>Customer ticket</h2>
              {shareLink ? (
                <div className="share-link-card">
                  <p>Share this secure ticket link with the customer now.</p>
                  <a href={shareLink}>{shareLink}</a>
                </div>
              ) : (
                <p className="muted-copy">
                  The full secure token is only shown immediately after check-in. Active token
                  ending: <strong>{session.tokenHint || 'Unavailable'}</strong>
                </p>
              )}
            </section>

            <section className="app-card">
              <h2>Staff notes</h2>
              <p className="muted-copy">{session.staffNotes || 'No staff-only notes recorded.'}</p>
              <h3>Vehicle notes</h3>
              <p className="muted-copy">{session.vehicle.notes || 'No vehicle notes recorded.'}</p>
            </section>

            {session.serviceRequests.length ? (
              <section className="app-card">
                <h2>Service requests</h2>
                <table className="service-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.serviceRequests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.serviceType.replace('_', ' ')}</td>
                        <td>{req.notes || '—'}</td>
                        <td>
                          <span className={`status-chip status-chip--${req.status}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="muted-copy">
                          {new Date(req.requestedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}

            <section className="app-card detail-timeline">
              <h2>Session timeline</h2>
              <ol className="timeline-list">
                {session.timeline.map((event) => (
                  <li key={event.id}>
                    <strong>{event.title}</strong>
                    <span>{event.description}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  )
}
