'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import AppTopbar from '@/components/AppTopbar'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'

type Session = {
  id: string
  ticketNumber: string
  keyTag: string
  status: string
  statusLabel: string
  customerName: string | null
  customerPhone: string
  vehicleSummary: string
  licensePlate: string
}

export default function StaffSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(false)

  async function loadSessions() {
    setPending(true)
    setError(false)

    try {
      const response = await fetch('/api/staff/sessions')
      if (!response.ok) {
        setError(true)
        return
      }
      setSessions(await response.json())
    } catch {
      setError(true)
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  return (
    <main className="app-surface">
      <div className="app-shell">
        <AppTopbar />

        <PageHeader
          eyebrow="Staff operations"
          title="Active valet sessions"
          description="Live checked-in, parked, flagged, and pickup-ready vehicles for the current venue."
        />

        <section className="app-card session-list-card">
          <div className="section-toolbar">
            <div>
              <p className="eyebrow">Queue</p>
              <h2>{sessions.length} active sessions</h2>
            </div>

            <div className="toolbar-actions">
              <Link className="button secondary" href="/staff/check-in">
                New check-in
              </Link>
              <button className="button secondary" type="button" onClick={() => void loadSessions()}>
                Refresh
              </button>
            </div>
          </div>

          {pending ? (
            <p className="muted-copy">Loading active sessions...</p>
          ) : error ? (
            <p className="form-error">Unable to load active sessions.</p>
          ) : sessions.length ? (
            <div className="session-list">
              {sessions.map((session) => (
                <Link key={session.id} className="session-row" href={`/staff/sessions/${session.id}`}>
                  <div>
                    <StatusBadge status={session.status} label={session.statusLabel} />
                    <h3>{session.vehicleSummary}</h3>
                    <p>
                      {session.licensePlate} · Key {session.keyTag}
                    </p>
                  </div>

                  <div className="session-meta">
                    <strong>{session.ticketNumber}</strong>
                    <span>{session.customerName || session.customerPhone}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No active sessions yet</h2>
              <p>Create the first check-in to start the live staff queue.</p>
              <Link className="button primary" href="/staff/check-in">
                Create check-in
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
