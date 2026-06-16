'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function getStaffSessionCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )cv_staff_session=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

const STAFF_NAV = [
  { href: '/staff', label: 'Sessions', hint: 'Active vehicles' },
  { href: '/staff/check-in', label: 'Check-in', hint: 'New arrival' },
  { href: '/staff/pickup-queue', label: 'Pickup queue', hint: 'Ready for handoff' },
  { href: '/dashboard', label: 'Dashboard', hint: 'Live operations' },
  { href: '/staff/profile', label: 'Profile', hint: 'Your account' },
] as const

function isNavActive(pathname: string, href: string) {
  if (href === '/staff') {
    return pathname === '/staff' || pathname.startsWith('/staff/sessions/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

type AppSidebarProps = {
  showNav?: boolean
  isOpen: boolean
  onClose: () => void
}

export default function AppSidebar({ showNav = true, isOpen, onClose }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!getStaffSessionCookie())
  }, [])

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/staff/login')
    }
  }

  return (
    <>
      <div
        className={`app-sidebar-backdrop${isOpen ? ' is-visible' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        id="app-sidebar"
        className={`app-sidebar${isOpen ? ' is-open' : ''}`}
        aria-label="App navigation"
      >
        <div className="app-sidebar-header">
          <Link className="brand brand--logo app-sidebar-brand" href="/" aria-label="Crown Valet home">
            <img className="brand-logo app-sidebar-logo" src="/logo.png" alt="Crown Valet" />
          </Link>
        </div>

        {showNav ? (
          isAuthenticated ? (
            <nav className="app-sidebar-nav" aria-label="Product navigation">
              <p className="app-sidebar-section">Operations</p>
              <ul className="app-sidebar-links">
                {STAFF_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      className={`app-sidebar-link${isNavActive(pathname, item.href) ? ' is-active' : ''}`}
                      href={item.href}
                    >
                      <span className="app-sidebar-link-label">{item.label}</span>
                      <span className="app-sidebar-link-hint">{item.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="app-sidebar-footer">
                <button type="button" className="app-sidebar-signout" onClick={logout}>
                  Sign out
                </button>
              </div>
            </nav>
          ) : (
            <nav className="app-sidebar-nav" aria-label="Account navigation">
              <p className="app-sidebar-section">Account</p>
              <ul className="app-sidebar-links">
                <li>
                  <Link
                    className={`app-sidebar-link app-sidebar-link--signup${pathname === '/staff/signup' ? ' is-active' : ''}`}
                    href="/staff/signup"
                  >
                    <span className="app-sidebar-link-label">Create account</span>
                    <span className="app-sidebar-link-hint">Join your venue team</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`app-sidebar-link app-sidebar-link--signin${pathname === '/staff/login' ? ' is-active' : ''}`}
                    href="/staff/login"
                  >
                    <span className="app-sidebar-link-label">Sign in</span>
                    <span className="app-sidebar-link-hint">Access staff tools</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )
        ) : (
          <div className="app-sidebar-nav app-sidebar-nav--minimal">
            <p className="app-sidebar-tagline">Premium valet operations</p>
          </div>
        )}
      </aside>
    </>
  )
}
