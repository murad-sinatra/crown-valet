type StatusBadgeProps = {
  status: string
  label?: string
}

const knownVariants = new Set([
  'ready',
  'completed',
  'pickup_requested',
  'runner_assigned',
  'flagged',
  'cancelled',
])

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const badgeClass = knownVariants.has(status)
    ? `status-badge--${status}`
    : 'status-badge--default'

  return (
    <span className={`status-badge ${badgeClass}`}>
      {label ?? status.replaceAll('_', ' ')}
    </span>
  )
}
