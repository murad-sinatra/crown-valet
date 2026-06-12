<script setup lang="ts">
const form = reactive({ email: '', password: '' })
const isSubmitting = ref(false)
const errorMessage = ref('')

async function login() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    })
    await navigateTo('/staff')
  } catch (error: unknown) {
    const msg =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage
        : undefined
    errorMessage.value = msg ?? 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="Staff login"
        title="Access Crown Valet operations"
        description="Sign in with your email and password to access staff operations."
      />

      <section class="app-card">
        <form class="check-in-form" @submit.prevent="login">
          <div class="form-section">
            <label class="field">
              <span>Email</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                name="email"
                placeholder="you@example.com"
                required
              >
            </label>

            <label class="field">
              <span>Password</span>
              <input
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                name="password"
                placeholder="••••••••"
                required
              >
            </label>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

          <div class="form-submit">
            <button class="button primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>
