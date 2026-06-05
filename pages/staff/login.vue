<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Staff login"
        title="Access Crown Valet operations"
        description="Sprint 1 protects operational pages. Sprint 2 will replace this shell with the selected pilot staff authentication flow."
      />

      <section class="app-card">
        <h2>Authentication shell</h2>
        <p>
          Staff and manager credentials will be wired after the auth approach is finalized.
          For now, protected routes redirect here when no staff session cookie is present.
        </p>
      </section>
    </div>
  </main>
</template>
