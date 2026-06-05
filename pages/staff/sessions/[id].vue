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
        eyebrow="Vehicle detail"
        title="Session detail"
        description="This route will hold status controls, parking location, ticket sharing, timeline, and staff-only notes."
      />

      <div class="app-grid">
        <section class="app-card">
          <StatusBadge status="being_parked" />
          <h2>Status controls</h2>
          <p>Staff will move sessions through the approved transition helper.</p>
        </section>

        <section class="app-card">
          <h2>Parking location</h2>
          <p>Zone, floor, row, stall, and staff note capture will live here.</p>
        </section>

        <section class="app-card">
          <h2>Session timeline</h2>
          <p>Every important action will create a durable event record.</p>
        </section>
      </div>
    </div>
  </main>
</template>
