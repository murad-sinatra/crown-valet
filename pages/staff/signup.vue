<script setup lang="ts">
definePageMeta({ layout: false })

const form = reactive({ email: '', password: '', confirmPassword: '' })
const isSubmitting = ref(false)
const errorMessage = ref('')

async function signup() {
  errorMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })
    await navigateTo('/staff/onboarding')
  } catch (error: unknown) {
    const msg =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage
        : undefined
    errorMessage.value = msg ?? 'Sign up failed. Please try again.'
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
        eyebrow="Create account"
        title="Join Crown Valet"
        description="Create your staff account to get started."
      />

      <section class="app-card">
        <form class="check-in-form" @submit.prevent="signup">
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
                autocomplete="new-password"
                name="password"
                placeholder="••••••••"
                minlength="8"
                required
              >
            </label>

            <label class="field">
              <span>Confirm password</span>
              <input
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                name="confirm-password"
                placeholder="••••••••"
                required
              >
            </label>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

          <div class="form-submit">
            <button class="button primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Creating account…' : 'Create account' }}
            </button>
          </div>
        </form>

        <p class="signup-login-link">
          Already have an account?
          <NuxtLink to="/staff/login">Sign in</NuxtLink>
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.signup-login-link {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.7;
}

.signup-login-link a {
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 600;
}

.signup-login-link a:hover {
  text-decoration: underline;
}
</style>
