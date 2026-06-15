import { describe, expect, it } from 'vitest'
import { assertValetStatusTransition, canTransitionValetStatus } from '@/lib/domain/status'

describe('valet status transitions', () => {
  it('allows the normal check-in to parked flow', () => {
    expect(canTransitionValetStatus('checked_in', 'being_parked')).toBe(true)
    expect(canTransitionValetStatus('being_parked', 'parked')).toBe(true)
  })

  it('prevents reopening completed sessions', () => {
    expect(canTransitionValetStatus('completed', 'parked')).toBe(false)
    expect(() => assertValetStatusTransition('completed', 'parked')).toThrow(
      'Cannot transition valet session from completed to parked',
    )
  })
})
