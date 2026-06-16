'use client'

import { ReactNode, useCallback, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'

type AppShellProps = {
  children: ReactNode
  showNav?: boolean
}

export default function AppShell({ children, showNav = true }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="app-layout">
      <AppSidebar showNav={showNav} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="app-main">
        <header className="app-mobile-bar">
          <button
            type="button"
            className="app-menu-toggle"
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <span className="app-menu-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="app-menu-toggle-label">Menu</span>
          </button>
        </header>

        <div className="app-shell">{children}</div>
      </div>
    </div>
  )
}
