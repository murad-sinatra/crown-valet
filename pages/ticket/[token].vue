<script setup lang="ts">
const route = useRoute()
const token = computed(() => String(route.params.token))

const { data: ticket, error, refresh } = await useFetch(() => `/api/ticket/${token.value}`)

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

const showRequestPanel = ref(false)
const selectedService = ref<ServiceType | null>(null)
const notes = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const activeSessionStatuses = ['checked_in', 'being_parked', 'parked', 'flagged']
const canRequestServices = computed(() =>
  ticket.value ? activeSessionStatuses.includes(ticket.value.status) : false,
)

const pendingRequests = computed(
  () => ticket.value?.serviceRequests.filter((r) => r.status === 'pending' || r.status === 'in_progress') ?? [],
)

function openRequest(type: ServiceType) {
  selectedService.value = type
  notes.value = ''
  submitError.value = ''
  submitSuccess.value = false
  showRequestPanel.value = true
}

async function submitRequest() {
  if (!selectedService.value) return
  submitError.value = ''
  isSubmitting.value = true

  try {
    await $fetch(`/api/ticket/${token.value}/service-request`, {
      method: 'POST',
      body: { serviceType: selectedService.value, notes: notes.value || undefined },
    })
    submitSuccess.value = true
    await refresh()
  } catch (err: unknown) {
    const msg =
      err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { statusMessage?: string } }).data?.statusMessage
        : undefined
    submitError.value = msg ?? 'Could not submit request. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function closePanel() {
  showRequestPanel.value = false
  selectedService.value = null
  submitSuccess.value = false
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const selectedOption = computed(() =>
  SERVICE_OPTIONS.find((o) => o.type === selectedService.value),
)
</script>

<template>
  <main class="ticket-surface">
    <div class="ticket-shell">

      <header class="ticket-header">
        <img class="ticket-logo" src="/logo.png" alt="Crown Valet">
      </header>

      <div v-if="error" class="ticket-card">
        <p class="ticket-error">Ticket not found or has expired. Please check your link.</p>
      </div>

      <template v-else-if="ticket">
        <!-- Status card -->
        <div class="ticket-card status-hero">
          <p class="ticket-eyebrow">{{ ticket.venueName }}</p>
          <div class="status-pill" :class="`status-pill--${ticket.status}`">
            {{ ticket.statusLabel }}
          </div>
          <p class="ticket-number">{{ ticket.ticketNumber }}</p>
        </div>

        <!-- Vehicle card -->
        <div class="ticket-card">
          <p class="ticket-section-label">Your vehicle</p>
          <div class="vehicle-row">
            <div class="vehicle-icon">🚗</div>
            <div>
              <strong>{{ ticket.vehicle.color }} {{ ticket.vehicle.make }} {{ ticket.vehicle.model }}</strong>
              <p class="ticket-muted">{{ ticket.vehicle.licensePlate }}</p>
            </div>
          </div>

          <div v-if="ticket.parkingLocation && ticket.status !== 'checked_in'" class="parking-info">
            <p class="ticket-section-label">Parking location</p>
            <div class="parking-chips">
              <span v-if="ticket.parkingLocation.zone" class="parking-chip">Zone {{ ticket.parkingLocation.zone }}</span>
              <span v-if="ticket.parkingLocation.floor" class="parking-chip">Floor {{ ticket.parkingLocation.floor }}</span>
              <span v-if="ticket.parkingLocation.row" class="parking-chip">Row {{ ticket.parkingLocation.row }}</span>
              <span v-if="ticket.parkingLocation.stall" class="parking-chip">Stall {{ ticket.parkingLocation.stall }}</span>
            </div>
          </div>
        </div>

        <!-- Active service requests -->
        <div v-if="pendingRequests.length" class="ticket-card">
          <p class="ticket-section-label">Active requests</p>
          <ul class="service-request-list">
            <li v-for="req in pendingRequests" :key="req.id" class="service-request-item">
              <span class="service-request-icon">
                {{ SERVICE_OPTIONS.find(o => o.type === req.serviceType)?.icon ?? '📋' }}
              </span>
              <div>
                <strong>{{ SERVICE_OPTIONS.find(o => o.type === req.serviceType)?.label ?? req.serviceType }}</strong>
                <p v-if="req.notes" class="ticket-muted">{{ req.notes }}</p>
              </div>
              <span class="service-status-badge" :class="`service-status--${req.status}`">
                {{ SERVICE_STATUS_LABELS[req.status] ?? req.status }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Request services -->
        <div v-if="canRequestServices" class="ticket-card">
          <p class="ticket-section-label">Request a service</p>
          <p class="ticket-muted" style="margin-bottom: 16px">Need something done while your car is with us?</p>
          <div class="service-grid">
            <button
              v-for="option in SERVICE_OPTIONS"
              :key="option.type"
              class="service-btn"
              type="button"
              @click="openRequest(option.type)"
            >
              <span class="service-btn-icon">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="ticket.timeline.length" class="ticket-card">
          <p class="ticket-section-label">Timeline</p>
          <ol class="ticket-timeline">
            <li v-for="event in ticket.timeline" :key="event.id">
              <div class="timeline-dot" />
              <div class="timeline-body">
                <strong>{{ event.title }}</strong>
                <p v-if="event.description" class="ticket-muted">{{ event.description }}</p>
                <time class="ticket-muted">{{ formatDate(event.occurredAt) }} · {{ formatTime(event.occurredAt) }}</time>
              </div>
            </li>
          </ol>
        </div>

        <!-- Contact -->
        <div v-if="ticket.venuePhone" class="ticket-card ticket-contact">
          <p class="ticket-muted">Need help? Call valet</p>
          <a :href="`tel:${ticket.venuePhone}`" class="ticket-phone">{{ ticket.venuePhone }}</a>
        </div>
      </template>

      <!-- Service request panel -->
      <Teleport to="body">
        <div v-if="showRequestPanel" class="panel-overlay" @click.self="closePanel">
          <div class="panel-sheet">
            <button class="panel-close" type="button" aria-label="Close" @click="closePanel">✕</button>

            <template v-if="!submitSuccess">
              <p class="ticket-eyebrow">Request service</p>
              <h2 class="panel-title">
                {{ selectedOption?.icon }} {{ selectedOption?.label }}
              </h2>

              <label class="ticket-field">
                <span>Notes (optional)</span>
                <textarea
                  v-model="notes"
                  rows="3"
                  placeholder="Any details for the valet team…"
                  maxlength="500"
                />
              </label>

              <p v-if="submitError" class="ticket-error">{{ submitError }}</p>

              <button
                class="ticket-btn-primary"
                type="button"
                :disabled="isSubmitting"
                @click="submitRequest"
              >
                {{ isSubmitting ? 'Sending…' : 'Send request' }}
              </button>
            </template>

            <template v-else>
              <div class="panel-success">
                <span class="panel-success-icon">✅</span>
                <h2>Request sent!</h2>
                <p class="ticket-muted">The valet team has been notified.</p>
                <button class="ticket-btn-primary" type="button" @click="closePanel">Done</button>
              </div>
            </template>
          </div>
        </div>
      </Teleport>

    </div>
  </main>
</template>

<style scoped>
.ticket-surface {
  background:
    radial-gradient(circle at top left, rgba(205, 161, 87, 0.22), transparent 30rem),
    linear-gradient(135deg, #fff9ef 0%, #f6efe5 50%, #edf1f6 100%);
  min-height: 100svh;
  padding: 0 0 48px;
}

.ticket-shell {
  margin: 0 auto;
  max-width: 480px;
  padding: 0 16px;
}

.ticket-header {
  padding: 24px 0 16px;
  text-align: center;
}

.ticket-logo {
  height: 32px;
}

.ticket-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(38, 45, 64, 0.09);
  margin-bottom: 14px;
  padding: 22px 20px;
}

.status-hero {
  text-align: center;
  padding: 28px 20px;
}

.ticket-eyebrow {
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.status-pill {
  border-radius: 999px;
  display: inline-block;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
  padding: 8px 20px;
  background: var(--color-success-bg);
  color: var(--color-success);
}

.status-pill--pickup_requested,
.status-pill--runner_assigned,
.status-pill--retrieving {
  background: #fff3cd;
  color: #856404;
}

.status-pill--ready {
  background: #d1fae5;
  color: #065f46;
}

.status-pill--completed {
  background: #f3f4f6;
  color: #6b7280;
}

.status-pill--cancelled,
.status-pill--flagged {
  background: #fee2e2;
  color: #991b1b;
}

.ticket-number {
  color: var(--color-muted);
  font-size: 0.85rem;
  margin: 0;
}

.ticket-section-label {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.ticket-muted {
  color: var(--color-muted);
  font-size: 0.875rem;
  margin: 2px 0 0;
}

.vehicle-row {
  align-items: center;
  display: flex;
  gap: 14px;
}

.vehicle-icon {
  font-size: 2rem;
}

.parking-info {
  border-top: 1px solid var(--color-line);
  margin-top: 16px;
  padding-top: 16px;
}

.parking-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.parking-chip {
  background: rgba(245, 199, 107, 0.2);
  border: 1px solid rgba(166, 111, 24, 0.2);
  border-radius: 999px;
  color: var(--color-gold-deep);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 5px 12px;
}

.service-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
}

.service-btn {
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(17, 24, 39, 0.1);
  border-radius: 16px;
  color: var(--color-ink);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 0.82rem;
  font-weight: 700;
  gap: 6px;
  padding: 16px 12px;
  transition: background 0.15s, border-color 0.15s;
}

.service-btn:hover,
.service-btn:active {
  background: rgba(245, 199, 107, 0.18);
  border-color: rgba(166, 111, 24, 0.3);
}

.service-btn-icon {
  font-size: 1.6rem;
}

.service-request-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-request-item {
  align-items: center;
  display: flex;
  gap: 12px;
}

.service-request-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.service-request-item > div {
  flex: 1;
}

.service-status-badge {
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  white-space: nowrap;
  background: var(--color-success-bg);
  color: var(--color-success);
}

.service-status--in_progress {
  background: #fff3cd;
  color: #856404;
}

.service-status--completed {
  background: #f3f4f6;
  color: #6b7280;
}

.service-status--cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.ticket-timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ticket-timeline li {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  padding-bottom: 18px;
  position: relative;
}

.ticket-timeline li:not(:last-child)::before {
  background: var(--color-line);
  content: '';
  height: calc(100% - 8px);
  left: 7px;
  position: absolute;
  top: 16px;
  width: 2px;
}

.timeline-dot {
  background: var(--color-gold);
  border-radius: 50%;
  flex-shrink: 0;
  height: 16px;
  margin-top: 3px;
  width: 16px;
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticket-contact {
  text-align: center;
}

.ticket-phone {
  color: var(--color-ink);
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  margin-top: 4px;
  text-decoration: underline;
}

.ticket-error {
  background: rgba(166, 111, 24, 0.12);
  border: 1px solid rgba(166, 111, 24, 0.24);
  border-radius: 16px;
  color: #7a4300;
  padding: 14px 16px;
  text-align: center;
}

/* Bottom sheet panel */
.panel-overlay {
  background: rgba(17, 24, 39, 0.45);
  bottom: 0;
  inset: 0;
  position: fixed;
  z-index: 100;
}

.panel-sheet {
  background: #fff9ef;
  border-radius: 28px 28px 0 0;
  bottom: 0;
  left: 0;
  padding: 32px 24px 48px;
  position: fixed;
  right: 0;
  z-index: 101;
}

.panel-close {
  background: rgba(17, 24, 39, 0.07);
  border: none;
  border-radius: 999px;
  color: var(--color-ink);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 10px;
  position: absolute;
  right: 20px;
  top: 20px;
}

.panel-title {
  font-size: 1.5rem;
  letter-spacing: var(--letter-spacing-display);
  margin: 0 0 20px;
}

.ticket-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.ticket-field span {
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.ticket-field textarea {
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(17, 24, 39, 0.12);
  border-radius: 14px;
  color: var(--color-ink);
  padding: 12px 14px;
  resize: none;
}

.ticket-btn-primary {
  background: var(--color-ink);
  border: none;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 800;
  padding: 14px 28px;
  width: 100%;
  letter-spacing: 0.01em;
}

.ticket-btn-primary:disabled {
  opacity: 0.5;
}

.panel-success {
  text-align: center;
  padding: 16px 0;
}

.panel-success-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.panel-success h2 {
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.panel-success .ticket-btn-primary {
  margin-top: 20px;
}
</style>
