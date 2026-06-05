<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  label?: string
}>()

const badgeClass = computed(() => {
  const knownVariants = [
    'ready',
    'completed',
    'pickup_requested',
    'runner_assigned',
    'flagged',
    'cancelled',
  ]

  return knownVariants.includes(props.status)
    ? `status-badge--${props.status}`
    : 'status-badge--default'
})

const displayLabel = computed(() => props.label ?? props.status.replaceAll('_', ' '))
</script>

<template>
  <span class="status-badge" :class="badgeClass">{{ displayLabel }}</span>
</template>
