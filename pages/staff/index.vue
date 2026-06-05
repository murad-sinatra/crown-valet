<script setup lang="ts">
definePageMeta({
  middleware: 'staff-auth',
})

const { data: sessions, pending, error, refresh } = await useFetch('/api/staff/sessions')
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Staff operations"
        title="Active valet sessions"
        description="Live checked-in, parked, flagged, and pickup-ready vehicles for the current venue."
      />

      <section class="app-card session-list-card">
        <div class="section-toolbar">
          <div>
            <p class="eyebrow">Queue</p>
            <h2>{{ sessions?.length || 0 }} active sessions</h2>
          </div>

          <div class="toolbar-actions">
            <NuxtLink class="button secondary" to="/staff/check-in">New check-in</NuxtLink>
            <button class="button secondary" type="button" @click="refresh()">Refresh</button>
          </div>
        </div>

        <p v-if="pending" class="muted-copy">Loading active sessions...</p>
        <p v-else-if="error" class="form-error">Unable to load active sessions.</p>
        <div v-else-if="sessions?.length" class="session-list">
          <NuxtLink
            v-for="session in sessions"
            :key="session.id"
            class="session-row"
            :to="`/staff/sessions/${session.id}`"
          >
            <div>
              <StatusBadge :status="session.status" :label="session.statusLabel" />
              <h3>{{ session.vehicleSummary }}</h3>
              <p>{{ session.licensePlate }} · Key {{ session.keyTag }}</p>
            </div>

            <div class="session-meta">
              <strong>{{ session.ticketNumber }}</strong>
              <span>{{ session.customerName || session.customerPhone }}</span>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="empty-state">
          <h2>No active sessions yet</h2>
          <p>Create the first check-in to start the live staff queue.</p>
          <NuxtLink class="button primary" to="/staff/check-in">Create check-in</NuxtLink>
        </div>
      </section>
    </div>
  </main>
</template>
