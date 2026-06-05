import { createError, defineEventHandler, getRouterParam } from 'h3'
import { staffStatusLabels } from '../../../../shared/status'
import { prisma } from '../../../utils/db'
import { getCurrentStaffUser } from '../../../utils/staff'

export default defineEventHandler(async (event) => {
  const staffUser = await getCurrentStaffUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session id is required',
    })
  }

  const session = await prisma.valetSession.findFirst({
    where: {
      id,
      venueId: staffUser.venueId,
    },
    include: {
      venue: true,
      customerContact: true,
      vehicle: true,
      staffCreatedBy: true,
      ticketTokens: {
        where: { status: 'active' },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
      parkingLocations: {
        orderBy: { recordedAt: 'desc' },
        take: 1,
      },
      sessionEvents: {
        orderBy: { occurredAt: 'desc' },
      },
    },
  })

  if (!session) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Session not found',
    })
  }

  return {
    id: session.id,
    venueName: session.venue.name,
    ticketNumber: session.ticketNumber,
    keyTag: session.keyTag,
    status: session.status,
    statusLabel: staffStatusLabels[session.status],
    checkedInAt: session.checkedInAt,
    updatedAt: session.updatedAt,
    staffNotes: session.staffNotes,
    tokenHint: session.ticketTokens[0]?.lastFourHint,
    customer: {
      name: session.customerContact.name,
      phone: session.customerContact.phone,
    },
    vehicle: {
      make: session.vehicle.make,
      model: session.vehicle.model,
      color: session.vehicle.color,
      licensePlate: session.vehicle.licensePlate,
      notes: session.vehicle.notes,
    },
    parkingLocation: session.parkingLocations[0]
      ? {
          zone: session.parkingLocations[0].zone,
          floor: session.parkingLocations[0].floor,
          row: session.parkingLocations[0].row,
          stall: session.parkingLocations[0].stall,
          note: session.parkingLocations[0].note,
          recordedAt: session.parkingLocations[0].recordedAt,
        }
      : null,
    createdBy: {
      name: session.staffCreatedBy.name,
      role: session.staffCreatedBy.role,
    },
    timeline: session.sessionEvents.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      title: event.title,
      description: event.description,
      visibleToCustomer: event.visibleToCustomer,
      occurredAt: event.occurredAt,
    })),
  }
})
