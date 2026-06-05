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
        eyebrow="Pickup queue"
        title="Vehicles requested for pickup"
        description="Sprint 4 will connect this route to customer pickup requests, runner assignment, retrieval, ready, and handoff actions."
      />

      <section class="app-card">
        <ul class="placeholder-list">
          <li>
            <span>Queue order</span>
            <StatusBadge status="pickup_requested" />
          </li>
          <li>
            <span>Runner assignment</span>
            <StatusBadge status="runner_assigned" />
          </li>
          <li>
            <span>Vehicle ready</span>
            <StatusBadge status="ready" />
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>
