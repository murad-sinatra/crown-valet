import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crown Valet | Premium Parking On Demand',
  description:
    'Crown Valet is a premium valet parking app for effortless drop-off, secure parking, and quick vehicle return.',
  openGraph: {
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
