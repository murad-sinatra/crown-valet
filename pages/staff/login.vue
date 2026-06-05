<script setup lang="ts">
const staffSession = useCookie('cv_staff_session', {
  sameSite: 'lax',
})

function enterPilotMode() {
  staffSession.value = 'attendant@crownvalet.test'
  return navigateTo('/staff')
}
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Staff login"
        title="Access Crown Valet operations"
        description="Use the seeded pilot staff session to access local operations while the final authentication provider is pending."
      />

      <section class="app-card">
        <h2>Pilot staff access</h2>
        <p>
          This starts a local attendant session for the MVP workflow. Production authentication
          will replace this before pilot launch.
        </p>
        <button class="button primary" type="button" @click="enterPilotMode">Enter staff operations</button>
      </section>
    </div>
  </main>
</template>
