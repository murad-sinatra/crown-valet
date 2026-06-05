<script setup lang="ts">
definePageMeta({
  middleware: 'staff-auth',
})

const form = reactive({
  customerPhone: '',
  customerName: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleColor: '',
  licensePlate: '',
  keyTag: '',
  vehicleNotes: '',
  parkingZone: '',
  staffNotes: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

async function submitCheckIn() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const result = await $fetch<{
      session: { id: string; ticketNumber: string }
      ticketToken: string
    }>('/api/staff/check-in', {
      method: 'POST',
      body: form,
    })

    await navigateTo({
      path: `/staff/sessions/${result.session.id}`,
      query: { ticketToken: result.ticketToken },
    })
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to create this valet session. Please try again.'
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
        eyebrow="New check-in"
        title="Create a valet session"
        description="Capture the customer, vehicle, key tag, and parking notes needed to start a traceable valet session."
      />

      <section class="app-card">
        <form class="check-in-form" @submit.prevent="submitCheckIn">
          <div class="form-section">
            <div>
              <p class="eyebrow">Customer</p>
              <h2>Contact details</h2>
            </div>

            <label class="field">
              <span>Customer phone <strong>Required</strong></span>
              <input
                v-model="form.customerPhone"
                autocomplete="tel"
                inputmode="tel"
                name="customerPhone"
                placeholder="+1 305 555 0123"
                required
              >
            </label>

            <label class="field">
              <span>Customer name</span>
              <input
                v-model="form.customerName"
                autocomplete="name"
                name="customerName"
                placeholder="Optional"
              >
            </label>
          </div>

          <div class="form-section">
            <div>
              <p class="eyebrow">Vehicle</p>
              <h2>Car details</h2>
            </div>

            <div class="form-grid">
              <label class="field">
                <span>Make <strong>Required</strong></span>
                <input v-model="form.vehicleMake" name="vehicleMake" placeholder="Mercedes" required>
              </label>

              <label class="field">
                <span>Model <strong>Required</strong></span>
                <input v-model="form.vehicleModel" name="vehicleModel" placeholder="S-Class" required>
              </label>

              <label class="field">
                <span>Color <strong>Required</strong></span>
                <input v-model="form.vehicleColor" name="vehicleColor" placeholder="Black" required>
              </label>

              <label class="field">
                <span>License plate <strong>Required</strong></span>
                <input v-model="form.licensePlate" name="licensePlate" placeholder="ABC 123" required>
              </label>
            </div>

            <label class="field">
              <span>Vehicle notes</span>
              <textarea
                v-model="form.vehicleNotes"
                name="vehicleNotes"
                placeholder="Optional vehicle identifiers or condition notes"
                rows="3"
              ></textarea>
            </label>
          </div>

          <div class="form-section">
            <div>
              <p class="eyebrow">Operations</p>
              <h2>Key and staff notes</h2>
            </div>

            <div class="form-grid">
              <label class="field">
                <span>Key tag <strong>Required</strong></span>
                <input v-model="form.keyTag" name="keyTag" placeholder="K-104" required>
              </label>

              <label class="field">
                <span>Parking zone</span>
                <input v-model="form.parkingZone" name="parkingZone" placeholder="North ramp">
              </label>
            </div>

            <label class="field">
              <span>Staff notes</span>
              <textarea
                v-model="form.staffNotes"
                name="staffNotes"
                placeholder="Staff-only handoff notes"
                rows="3"
              ></textarea>
            </label>
          </div>

          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

          <button class="button primary form-submit" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating session...' : 'Create valet session' }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>
