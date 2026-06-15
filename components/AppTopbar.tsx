'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function getStaffSessionCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )cv_staff_session=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function AppTopbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!getStaffSessionCookie())
  }, [])

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/staff/login')
    }
  }

  return (
    <header className="app-topbar">
      <Link className="brand brand--logo" href="/" aria-label="Crown Valet home">
        <img className="brand-logo" src="/logo.png" alt="Crown Valet" />
      </Link>

      {isAuthenticated ? (
        <nav className="app-nav" aria-label="Product navigation">
          <Link href="/staff">Sessions</Link>
          <Link href="/staff/check-in">Check-in</Link>
          <Link href="/staff/pickup-queue">Pickup queue</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/staff/profile">Profile</Link>
          <button type="button" className="app-nav-signout" onClick={logout}>
            Sign out
          </button>
        </nav>
      ) : (
        <nav className="app-nav" aria-label="Account navigation">
          <Link className="app-nav-signup" href="/staff/signup">
            Create account
          </Link>
          <Link className="app-nav-signin" href="/staff/login">
            Sign in
          </Link>
        </nav>
      )}
    </header>
  )
}
