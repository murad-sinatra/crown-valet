import AppShell from '@/components/AppShell'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'

export default function DashboardPage() {
  return (
    <AppShell>
        <PageHeader
          eyebrow="Manager dashboard"
          title="Live venue operations"
          description="This dashboard will summarize active sessions, pickup queue state, flagged vehicles, completed sessions, and pickup wait time."
        />

        <div className="app-grid">
          <section className="app-card">
            <h2>Active vehicles</h2>
            <p>Live status counts will be calculated from valet session data.</p>
          </section>

          <section className="app-card">
            <h2>Pickup wait</h2>
            <p>Average wait time will use pickup requested and ready timestamps.</p>
          </section>

          <section className="app-card">
            <h2>Flagged sessions</h2>
            <p>Managers will see delayed or problem vehicles at a glance.</p>
          </section>
        </div>
    </AppShell>
  )
}
