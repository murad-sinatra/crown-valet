export const valetSessionStatuses = [
  'checked_in',
  'being_parked',
  'parked',
  'pickup_requested',
  'runner_assigned',
  'retrieving',
  'ready',
  'completed',
  'cancelled',
  'flagged',
] as const

export type ValetSessionStatus = (typeof valetSessionStatuses)[number]

export const pickupRequestStatuses = [
  'requested',
  'assigned',
  'retrieving',
  'ready',
  'completed',
  'cancelled',
] as const

export type PickupRequestStatus = (typeof pickupRequestStatuses)[number]

export const customerVisibleStatuses: Record<ValetSessionStatus, string> = {
  checked_in: 'Checked in',
  being_parked: 'Being parked',
  parked: 'Parked',
  pickup_requested: 'Pickup requested',
  runner_assigned: 'Pickup requested',
  retrieving: 'Being retrieved',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
  flagged: 'Needs assistance',
}

export const staffStatusLabels: Record<ValetSessionStatus, string> = {
  checked_in: 'Checked in',
  being_parked: 'Being parked',
  parked: 'Parked',
  pickup_requested: 'Pickup requested',
  runner_assigned: 'Runner assigned',
  retrieving: 'Retrieving',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
  flagged: 'Flagged',
}

export function isValetSessionStatus(status: string): status is ValetSessionStatus {
  return valetSessionStatuses.includes(status as ValetSessionStatus)
}

export function isPickupRequestStatus(status: string): status is PickupRequestStatus {
  return pickupRequestStatuses.includes(status as PickupRequestStatus)
}
