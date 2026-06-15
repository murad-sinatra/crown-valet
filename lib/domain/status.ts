import type { ValetSessionStatus } from '@/shared/status'

export const allowedValetStatusTransitions: Record<ValetSessionStatus, ValetSessionStatus[]> = {
  checked_in: ['being_parked', 'parked', 'cancelled', 'flagged'],
  being_parked: ['parked', 'cancelled', 'flagged'],
  parked: ['pickup_requested', 'cancelled', 'flagged'],
  pickup_requested: ['runner_assigned', 'retrieving', 'cancelled', 'flagged'],
  runner_assigned: ['retrieving', 'cancelled', 'flagged'],
  retrieving: ['ready', 'cancelled', 'flagged'],
  ready: ['completed', 'flagged'],
  completed: [],
  cancelled: [],
  flagged: [
    'being_parked',
    'parked',
    'pickup_requested',
    'runner_assigned',
    'retrieving',
    'ready',
    'cancelled',
  ],
}

export function canTransitionValetStatus(
  fromStatus: ValetSessionStatus,
  toStatus: ValetSessionStatus,
) {
  return allowedValetStatusTransitions[fromStatus].includes(toStatus)
}

export function assertValetStatusTransition(
  fromStatus: ValetSessionStatus,
  toStatus: ValetSessionStatus,
) {
  if (!canTransitionValetStatus(fromStatus, toStatus)) {
    throw new Error(`Cannot transition valet session from ${fromStatus} to ${toStatus}`)
  }
}
