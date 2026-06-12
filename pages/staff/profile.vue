<script setup lang="ts">
definePageMeta({
  middleware: 'staff-auth',
})

const { data: me } = await useFetch('/api/staff/me')

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function changePassword() {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/staff/change-password', {
      method: 'POST',
      body: form,
    })
    successMessage.value = 'Password updated successfully.'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error: unknown) {
    const msg =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage
        : undefined
    errorMessage.value = msg ?? 'Could not update password. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/staff/login')
}
</script>

<template>
  <main class="app-surface">
    <div class="app-shell">
      <AppTopbar />

      <PageHeader
        eyebrow="My profile"
        title="Account settings"
        description="Manage your staff account details."
      />

      <section class="app-card">
        <div class="form-section">
          <div>
            <p class="eyebrow">Account</p>
            <h2>Your details</h2>
          </div>
          <p><strong>Name:</strong> {{ me?.name }}</p>
          <p><strong>Email:</strong> {{ me?.email }}</p>
          <p><strong>Role:</strong> {{ me?.role }}</p>
        </div>
      </section>

      <section class="app-card">
        <form class="check-in-form" @submit.prevent="changePassword">
          <div class="form-section">
            <div>
              <p class="eyebrow">Security</p>
              <h2>Change password</h2>
            </div>

            <label class="field">
              <span>Current password</span>
              <input
                v-model="form.currentPassword"
                type="password"
                autocomplete="current-password"
                name="currentPassword"
                placeholder="••••••••"
                required
              >
            </label>

            <label class="field">
              <span>New password <strong>Min. 8 characters</strong></span>
              <input
                v-model="form.newPassword"
                type="password"
                autocomplete="new-password"
                name="newPassword"
                placeholder="••••••••"
                minlength="8"
                required
              >
            </label>

            <label class="field">
              <span>Confirm new password</span>
              <input
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                name="confirmPassword"
                placeholder="••••••••"
                minlength="8"
                required
              >
            </label>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

          <div class="form-submit">
            <button class="button primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Updating…' : 'Update password' }}
            </button>
          </div>
        </form>
      </section>

      <section class="app-card">
        <div class="form-section">
          <div>
            <p class="eyebrow">Session</p>
            <h2>Sign out</h2>
          </div>
          <p>End your current staff session.</p>
          <button class="button" type="button" @click="logout">Sign out</button>
        </div>
      </section>
    </div>
  </main>
</template>
