import process from 'process'
import { defineNuxtConfig } from 'nuxt/config'

const appPort = Number(process.env.APP_PORT || process.env.NUXT_HMR_CLIENT_PORT || 3001)
const usePolling = process.env.NUXT_DEV_WATCH_POLLING !== 'false'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
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
  vite: {
    server: {
      hmr: {
        clientPort: appPort,
      },
      watch: {
        interval: Number(process.env.CHOKIDAR_INTERVAL || 250),
        usePolling,
      },
    },
  },
})
