<script setup lang="ts">
definePageMeta({
  middleware: 'staff-auth',
})

const route = useRoute()
const sessionId = computed(() => String(route.params.id))
const ticketToken = computed(() => {
  const value = route.query.ticketToken

  return Array.isArray(value) ? value[0] : value
})
const origin = ref('')

const { data: session, pending, error } = await useFetch(
  () => `/api/staff/sessions/${sessionId.value}`,
)

const shareLink = computed(() =>
  ticketToken.value && origin.value ? `${origin.value}/ticket/${ticketToken.value}` : '',
)

onMounted(() => {
  origin.value = window.location.origin
})
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Vehicle detail"
        :title="session ? `${session.vehicle.color} ${session.vehicle.make} ${session.vehicle.model}` : 'Session detail'"
        description="Review check-in details, share the customer ticket link, and inspect the initial timeline."
      />

      <p v-if="pending" class="muted-copy">Loading session...</p>
      <p v-else-if="error" class="form-error">Unable to load this session.</p>

      <div v-else-if="session" class="detail-layout">
        <section class="app-card detail-summary">
          <div class="section-toolbar">
            <div>
              <StatusBadge :status="session.status" :label="session.statusLabel" />
              <h2>{{ session.ticketNumber }}</h2>
              <p>{{ session.venueName }} · Key {{ session.keyTag }}</p>
            </div>

            <NuxtLink class="button secondary" to="/staff">Back to sessions</NuxtLink>
          </div>

          <dl class="detail-grid">
            <div>
              <dt>Customer</dt>
              <dd>{{ session.customer.name || 'Guest' }}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{{ session.customer.phone }}</dd>
            </div>
            <div>
              <dt>Vehicle</dt>
              <dd>
                {{ session.vehicle.color }} {{ session.vehicle.make }} {{ session.vehicle.model }}
              </dd>
            </div>
            <div>
              <dt>Plate</dt>
              <dd>{{ session.vehicle.licensePlate }}</dd>
            </div>
            <div>
              <dt>Parking zone</dt>
              <dd>{{ session.parkingLocation?.zone || 'Not recorded' }}</dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{{ session.createdBy.name }}</dd>
            </div>
          </dl>
        </section>

        <section class="app-card">
          <h2>Customer ticket</h2>
          <div v-if="shareLink" class="share-link-card">
            <p>Share this secure ticket link with the customer now.</p>
            <a :href="shareLink">{{ shareLink }}</a>
          </div>
          <p v-else class="muted-copy">
            The full secure token is only shown immediately after check-in. Active token ending:
            <strong>{{ session.tokenHint || 'Unavailable' }}</strong>
          </p>
        </section>

        <section class="app-card">
          <h2>Staff notes</h2>
          <p class="muted-copy">{{ session.staffNotes || 'No staff-only notes recorded.' }}</p>
          <h3>Vehicle notes</h3>
          <p class="muted-copy">{{ session.vehicle.notes || 'No vehicle notes recorded.' }}</p>
        </section>

        <section class="app-card detail-timeline">
          <h2>Session timeline</h2>
          <ol class="timeline-list">
            <li v-for="event in session.timeline" :key="event.id">
              <strong>{{ event.title }}</strong>
              <span>{{ event.description }}</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  </main>
</template>
