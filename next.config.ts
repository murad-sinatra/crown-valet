import type { NextConfig } from 'next'

const usePolling = process.env.NEXT_DEV_WATCH_POLLING !== 'false'

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev && usePolling) {
      config.watchOptions = {
        poll: Number(process.env.CHOKIDAR_INTERVAL || 250),
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig
