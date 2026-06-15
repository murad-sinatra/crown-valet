<script setup lang="ts">
const staffSession = useCookie('cv_staff_session')
const isAuthenticated = computed(() => !!staffSession.value)

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
  } finally {
    await navigateTo('/staff/login')
  }
}
</script>

<template>
  <header class="app-topbar">
    <NuxtLink class="brand brand--logo" to="/" aria-label="Crown Valet home">
      <img class="brand-logo" src="/logo.png" alt="Crown Valet">
    </NuxtLink>

    <nav v-if="isAuthenticated" class="app-nav" aria-label="Product navigation">
      <NuxtLink to="/staff">Sessions</NuxtLink>
      <NuxtLink to="/staff/check-in">Check-in</NuxtLink>
      <NuxtLink to="/staff/pickup-queue">Pickup queue</NuxtLink>
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
      <NuxtLink to="/staff/profile">Profile</NuxtLink>
      <button type="button" class="app-nav-signout" @click="logout">Sign out</button>
    </nav>
    <nav v-else class="app-nav" aria-label="Account navigation">
      <NuxtLink class="app-nav-signup" to="/staff/signup">Create account</NuxtLink>
      <NuxtLink class="app-nav-signin" to="/staff/login">Sign in</NuxtLink>
    </nav>
  </header>
</template>
