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
        eyebrow="New check-in"
        title="Create a valet session"
        description="Sprint 2 will turn this route into the mobile-first curbside form for customer, vehicle, key tag, and ticket details."
      />

      <section class="app-card">
        <h2>Check-in form shell</h2>
        <ul class="placeholder-list">
          <li><span>Customer phone</span><strong>Required</strong></li>
          <li><span>Vehicle make, model, color, plate</span><strong>Required</strong></li>
          <li><span>Key tag and ticket number</span><strong>Required</strong></li>
          <li><span>Parking zone and staff notes</span><strong>Optional</strong></li>
        </ul>
      </section>
    </div>
  </main>
</template>
