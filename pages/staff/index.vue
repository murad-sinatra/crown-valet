<script setup lang="ts">
definePageMeta({
  middleware: 'staff-auth',
})
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Staff operations"
        title="Active valet sessions"
        description="This view will become the live staff queue for checked-in, parked, flagged, and pickup-ready vehicles."
      />

      <div class="app-grid">
        <section class="app-card">
          <StatusBadge status="checked_in" />
          <h2>Active sessions</h2>
          <p>Session cards will list vehicle, ticket, status, and last update.</p>
        </section>

        <section class="app-card">
          <StatusBadge status="pickup_requested" />
          <h2>Pickup requests</h2>
          <p>Customer pickup requests will surface here and in the dedicated queue.</p>
        </section>

        <section class="app-card">
          <StatusBadge status="flagged" />
          <h2>Flagged vehicles</h2>
          <p>Delayed or problem sessions will stay visible for managers and staff.</p>
        </section>
      </div>
    </div>
  </main>
</template>
