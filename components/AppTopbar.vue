<template>
  <header class="app-topbar">
    <NuxtLink class="brand brand--logo" to="/" aria-label="Crown Valet home">
      <img class="brand-logo" src="/logo.png" alt="Crown Valet">
    </NuxtLink>

    <nav class="app-nav" aria-label="Product navigation">
      <NuxtLink to="/staff">Staff</NuxtLink>
      <NuxtLink to="/staff/check-in">Check-in</NuxtLink>
      <NuxtLink to="/staff/pickup-queue">Pickup queue</NuxtLink>
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    </nav>
  </header>
</template>
