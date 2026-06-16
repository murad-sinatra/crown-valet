'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import styles from './ticket.module.css'

const SERVICE_OPTIONS = [
  { type: 'gas_fillup', label: 'Fill up gas', icon: '⛽' },
  { type: 'ev_charge', label: 'EV charge', icon: '🔋' },
  { type: 'clean', label: 'Car wash', icon: '✨' },
  { type: 'tire_check', label: 'Tire check', icon: '🔧' },
  { type: 'other', label: 'Other', icon: '💬' },
] as const

type ServiceType = (typeof SERVICE_OPTIONS)[number]['type']

const SERVICE_STATUS_LABELS: Record<string, string> = {
  pending: 'Requested',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

type Ticket = {
  ticketNumber: string
  status: string
  statusLabel: string
  venueName: string
  venuePhone: string | null
  vehicle: {
    make: string
    model: string
    color: string
    licensePlate: string
  }
  parkingLocation: {
    zone: string | null
    floor: string | null
    row: string | null
    stall: string | null
  } | null
  timeline: Array<{
    id: string
    title: string
    description: string | null
    occurredAt: string
  }>
  serviceRequests: Array<{
    id: string
    serviceType: string
    status: string
    notes: string | null
    requestedAt: string
  }>
}

const activeSessionStatuses = new Set(['checked_in', 'being_parked', 'parked', 'flagged'])

function statusPillClass(status: string) {
  if (['pickup_requested', 'runner_assigned', 'retrieving'].includes(status)) {
    return `${styles.statusPill} ${styles.statusPillPickup}`
  }
  if (status === 'ready') return `${styles.statusPill} ${styles.statusPillReady}`
  if (status === 'completed') return `${styles.statusPill} ${styles.statusPillCompleted}`
  if (status === 'cancelled' || status === 'flagged') {
    return `${styles.statusPill} ${styles.statusPillCancelled}`
  }
  return styles.statusPill
}

function serviceStatusClass(status: string) {
  if (status === 'in_progress') return `${styles.serviceStatusBadge} ${styles.serviceStatusInProgress}`
  if (status === 'completed') return `${styles.serviceStatusBadge} ${styles.serviceStatusCompleted}`
  if (status === 'cancelled') return `${styles.serviceStatusBadge} ${styles.serviceStatusCancelled}`
  return styles.serviceStatusBadge
}

async function readError(response: Response) {
  const data = (await response.json().catch(() => null)) as { statusMessage?: string } | null
  return data?.statusMessage
}

export default function TicketPage() {
  const params = useParams<{ token: string }>()
  const token = params.token
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [pending, setPending] = useState(true)
  const [error, setError] = useState(false)
  const [showRequestPanel, setShowRequestPanel] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  async function loadTicket(showLoading = true) {
    if (showLoading) setPending(true)
    try {
      const response = await fetch(`/api/ticket/${token}`)
      if (!response.ok) {
        setError(true)
        setTicket(null)
        return
      }
      setError(false)
      setTicket(await response.json())
    } catch {
      setError(true)
      setTicket(null)
    } finally {
      if (showLoading) setPending(false)
    }
  }

  useEffect(() => {
    void loadTicket()
  }, [token])

  const canRequestServices = ticket ? activeSessionStatuses.has(ticket.status) : false
  const pendingRequests = useMemo(
    () =>
      ticket?.serviceRequests.filter(
        (request) => request.status === 'pending' || request.status === 'in_progress',
      ) ?? [],
    [ticket],
  )
  const selectedOption = SERVICE_OPTIONS.find((option) => option.type === selectedService)

  function openRequest(type: ServiceType) {
    setSelectedService(type)
    setNotes('')
    setSubmitError('')
    setSubmitSuccess(false)
    setShowRequestPanel(true)
  }

  async function submitRequest() {
    if (!selectedService) return
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/ticket/${token}/service-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType: selectedService, notes: notes || undefined }),
      })

      if (!response.ok) {
        setSubmitError((await readError(response)) ?? 'Could not submit request. Please try again.')
        setIsSubmitting(false)
        return
      }

      setSubmitSuccess(true)
      await loadTicket()
    } catch {
      setSubmitError('Could not submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function closePanel() {
    setShowRequestPanel(false)
    setSelectedService(null)
    setSubmitSuccess(false)
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <main className={styles.ticketSurface}>
      {pending ? <LoadingScreen message="Loading your ticket…" /> : null}
      {isSubmitting ? <LoadingScreen message="Sending request…" /> : null}
      <div className={styles.ticketShell}>
        <header className={styles.ticketHeader}>
          <img className={styles.ticketLogo} src="/logo.png" alt="Crown Valet" />
        </header>

        {error ? (
          <div className={styles.ticketCard}>
            <p className={styles.ticketError}>
              Ticket not found or has expired. Please check your link.
            </p>
          </div>
        ) : ticket ? (
          <>
            <div className={`${styles.ticketCard} ${styles.statusHero}`}>
              <p className={styles.ticketEyebrow}>{ticket.venueName}</p>
              <div className={statusPillClass(ticket.status)}>{ticket.statusLabel}</div>
              <p className={styles.ticketNumber}>{ticket.ticketNumber}</p>
            </div>

            <div className={styles.ticketCard}>
              <p className={styles.ticketSectionLabel}>Your vehicle</p>
              <div className={styles.vehicleRow}>
                <div className={styles.vehicleIcon}>🚗</div>
                <div>
                  <strong>
                    {ticket.vehicle.color} {ticket.vehicle.make} {ticket.vehicle.model}
                  </strong>
                  <p className={styles.ticketMuted}>{ticket.vehicle.licensePlate}</p>
                </div>
              </div>

              {ticket.parkingLocation && ticket.status !== 'checked_in' ? (
                <div className={styles.parkingInfo}>
                  <p className={styles.ticketSectionLabel}>Parking location</p>
                  <div className={styles.parkingChips}>
                    {ticket.parkingLocation.zone ? (
                      <span className={styles.parkingChip}>Zone {ticket.parkingLocation.zone}</span>
                    ) : null}
                    {ticket.parkingLocation.floor ? (
                      <span className={styles.parkingChip}>Floor {ticket.parkingLocation.floor}</span>
                    ) : null}
                    {ticket.parkingLocation.row ? (
                      <span className={styles.parkingChip}>Row {ticket.parkingLocation.row}</span>
                    ) : null}
                    {ticket.parkingLocation.stall ? (
                      <span className={styles.parkingChip}>Stall {ticket.parkingLocation.stall}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            {pendingRequests.length ? (
              <div className={styles.ticketCard}>
                <p className={styles.ticketSectionLabel}>Active requests</p>
                <ul className={styles.serviceRequestList}>
                  {pendingRequests.map((request) => (
                    <li key={request.id} className={styles.serviceRequestItem}>
                      <span className={styles.serviceRequestIcon}>
                        {SERVICE_OPTIONS.find((option) => option.type === request.serviceType)?.icon ??
                          '📋'}
                      </span>
                      <div className={styles.serviceRequestBody}>
                        <strong>
                          {SERVICE_OPTIONS.find((option) => option.type === request.serviceType)
                            ?.label ?? request.serviceType}
                        </strong>
                        {request.notes ? <p className={styles.ticketMuted}>{request.notes}</p> : null}
                      </div>
                      <span className={serviceStatusClass(request.status)}>
                        {SERVICE_STATUS_LABELS[request.status] ?? request.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {canRequestServices ? (
              <div className={styles.ticketCard}>
                <p className={styles.ticketSectionLabel}>Request a service</p>
                <p className={`${styles.ticketMuted} ${styles.serviceIntro}`}>
                  Need something done while your car is with us?
                </p>
                <div className={styles.serviceGrid}>
                  {SERVICE_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      className={styles.serviceBtn}
                      type="button"
                      onClick={() => openRequest(option.type)}
                    >
                      <span className={styles.serviceBtnIcon}>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {ticket.timeline.length ? (
              <div className={styles.ticketCard}>
                <p className={styles.ticketSectionLabel}>Timeline</p>
                <ol className={styles.ticketTimeline}>
                  {ticket.timeline.map((event) => (
                    <li key={event.id}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineBody}>
                        <strong>{event.title}</strong>
                        {event.description ? (
                          <p className={styles.ticketMuted}>{event.description}</p>
                        ) : null}
                        <time className={styles.ticketMuted}>
                          {formatDate(event.occurredAt)} · {formatTime(event.occurredAt)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {ticket.venuePhone ? (
              <div className={`${styles.ticketCard} ${styles.ticketContact}`}>
                <p className={styles.ticketMuted}>Need help? Call valet</p>
                <a href={`tel:${ticket.venuePhone}`} className={styles.ticketPhone}>
                  {ticket.venuePhone}
                </a>
              </div>
            ) : null}
          </>
        ) : null}

        {showRequestPanel ? (
          <div className={styles.panelOverlay} onClick={closePanel} role="presentation">
            <div
              className={styles.panelSheet}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button className={styles.panelClose} type="button" aria-label="Close" onClick={closePanel}>
                ✕
              </button>

              {!submitSuccess ? (
                <>
                  <p className={styles.ticketEyebrow}>Request service</p>
                  <h2 className={styles.panelTitle}>
                    {selectedOption?.icon} {selectedOption?.label}
                  </h2>

                  <label className={styles.ticketField}>
                    <span>Notes (optional)</span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={3}
                      placeholder="Any details for the valet team…"
                      maxLength={500}
                    />
                  </label>

                  {submitError ? <p className={styles.ticketError}>{submitError}</p> : null}

                  <button
                    className={styles.ticketBtnPrimary}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void submitRequest()}
                  >
                    {isSubmitting ? 'Sending…' : 'Send request'}
                  </button>
                </>
              ) : (
                <div className={styles.panelSuccess}>
                  <span className={styles.panelSuccessIcon}>✅</span>
                  <h2>Request sent!</h2>
                  <p className={styles.ticketMuted}>The valet team has been notified.</p>
                  <button className={styles.ticketBtnPrimary} type="button" onClick={closePanel}>
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
