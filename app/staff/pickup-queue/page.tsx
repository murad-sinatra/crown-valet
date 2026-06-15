import AppTopbar from '@/components/AppTopbar'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'

export default function PickupQueuePage() {
  return (
    <main className="app-surface">
      <div className="app-shell">
        <AppTopbar />

        <PageHeader
          eyebrow="Pickup queue"
          title="Vehicles requested for pickup"
          description="Sprint 4 will connect this route to customer pickup requests, runner assignment, retrieval, ready, and handoff actions."
        />

        <section className="app-card">
          <ul className="placeholder-list">
            <li>
              <span>Queue order</span>
              <StatusBadge status="pickup_requested" />
            </li>
            <li>
              <span>Runner assignment</span>
              <StatusBadge status="runner_assigned" />
            </li>
            <li>
              <span>Vehicle ready</span>
              <StatusBadge status="ready" />
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
