import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Crown Valet | Premium Parking On Demand',
      meta: [
        {
          name: 'description',
          content:
            'Crown Valet is a premium valet parking app for effortless drop-off, secure parking, and quick vehicle return.',
        },
      ],
    },
  },
})
