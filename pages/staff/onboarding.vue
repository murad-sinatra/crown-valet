<script setup lang="ts">
definePageMeta({ middleware: 'staff-auth' })

const form = reactive({
  name: '',
  phone: '',
  role: 'attendant' as 'attendant' | 'runner' | 'manager' | 'admin',
})
const isSubmitting = ref(false)
const errorMessage = ref('')

const roles = [
  { value: 'attendant', label: 'Attendant', description: 'Parks and retrieves vehicles' },
  { value: 'runner', label: 'Runner', description: 'Retrieves vehicles for pickup' },
  { value: 'manager', label: 'Manager', description: 'Oversees valet operations' },
  { value: 'admin', label: 'Admin', description: 'Full system access' },
] as const

async function completeProfile() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/staff/complete-profile', {
      method: 'POST',
      body: form,
    })
    await navigateTo('/staff')
  } catch (error: unknown) {
    const msg =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { statusMessage?: string } }).data?.statusMessage
        : undefined
    errorMessage.value = msg ?? 'Failed to save profile. Please try again.'
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
        eyebrow="Almost there"
        title="Set up your profile"
        description="Tell us a bit about yourself and your role on the team."
      />

      <section class="app-card">
        <form class="check-in-form" @submit.prevent="completeProfile">
          <div class="form-section">
            <label class="field">
              <span>Full name</span>
              <input
                v-model="form.name"
                type="text"
                autocomplete="name"
                name="name"
                placeholder="Jane Smith"
                required
              >
            </label>

            <label class="field">
              <span>Phone <span class="field-optional">(optional)</span></span>
              <input
                v-model="form.phone"
                type="tel"
                autocomplete="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
              >
            </label>
          </div>

          <div class="form-section">
            <p class="role-label">Your role</p>
            <div class="role-grid">
              <label
                v-for="r in roles"
                :key="r.value"
                class="role-card"
                :class="{ selected: form.role === r.value }"
              >
                <input
                  v-model="form.role"
                  type="radio"
                  name="role"
                  :value="r.value"
                  class="role-radio"
                >
                <span class="role-name">{{ r.label }}</span>
                <span class="role-desc">{{ r.description }}</span>
              </label>
            </div>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

          <div class="form-submit">
            <button class="button primary" type="submit" :disabled="isSubmitting || !form.name">
              {{ isSubmitting ? 'Saving…' : 'Continue to dashboard' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.field-optional {
  font-size: 0.75rem;
  opacity: 0.6;
  font-weight: 400;
}

.role-label {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide, 0.08em);
  color: var(--color-ink);
  opacity: 0.6;
  margin-bottom: 0.75rem;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.role-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  border: 1.5px solid color-mix(in srgb, var(--color-ink) 15%, transparent);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.role-card:hover {
  border-color: color-mix(in srgb, var(--color-gold) 60%, transparent);
}

.role-card.selected {
  border-color: var(--color-gold);
  background-color: color-mix(in srgb, var(--color-gold) 8%, transparent);
}

.role-radio {
  display: none;
}

.role-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-ink);
}

.role-desc {
  font-size: 0.8125rem;
  color: var(--color-ink);
  opacity: 0.65;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
