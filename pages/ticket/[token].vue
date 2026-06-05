<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Customer digital ticket"
        title="Your vehicle status"
        description="This mobile ticket will show the customer-safe session summary, status timeline, and pickup request action after Sprint 3."
      />

      <section class="app-card">
        <StatusBadge status="parked" />
        <h2>Ticket route ready</h2>
        <p>
          Token lookup, safe error states, pickup eligibility, and visible timeline events
          will be connected to the API after the session foundation is in place.
        </p>
      </section>
    </div>
  </main>
</template>
