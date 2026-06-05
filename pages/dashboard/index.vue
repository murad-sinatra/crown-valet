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
        eyebrow="Manager dashboard"
        title="Live venue operations"
        description="This dashboard will summarize active sessions, pickup queue state, flagged vehicles, completed sessions, and pickup wait time."
      />

      <div class="app-grid">
        <section class="app-card">
          <h2>Active vehicles</h2>
          <p>Live status counts will be calculated from valet session data.</p>
        </section>

        <section class="app-card">
          <h2>Pickup wait</h2>
          <p>Average wait time will use pickup requested and ready timestamps.</p>
        </section>

        <section class="app-card">
          <h2>Flagged sessions</h2>
          <p>Managers will see delayed or problem vehicles at a glance.</p>
        </section>
      </div>
    </div>
  </main>
</template>
