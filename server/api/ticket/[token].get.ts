import { createError, getRouterParam } from 'h3'
import { customerVisibleStatuses } from '../../../shared/status'
import { prisma } from '../../utils/db'
import { hashTicketToken } from '../../utils/ticket'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Token is required' })

  const tokenHash = hashTicketToken(token)

  const ticketToken = await prisma.ticketToken.findUnique({
    where: { tokenHash },
    include: {
      valetSession: {
        include: {
          venue: true,
          vehicle: true,
          customerContact: true,
          parkingLocations: { orderBy: { recordedAt: 'desc' }, take: 1 },
          sessionEvents: {
            where: { visibleToCustomer: true },
            orderBy: { occurredAt: 'asc' },
          },
          serviceRequests: { orderBy: { requestedAt: 'desc' } },
        },
      },
    },
  })

  if (!ticketToken || ticketToken.status !== 'active') {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found or expired' })
  }

  const s = ticketToken.valetSession

  return {
    ticketNumber: s.ticketNumber,
    status: s.status,
    statusLabel: customerVisibleStatuses[s.status],
    checkedInAt: s.checkedInAt,
    venueName: s.venue.name,
    venuePhone: s.venue.valetPhone,
    vehicle: {
      make: s.vehicle.make,
      model: s.vehicle.model,
      color: s.vehicle.color,
      licensePlate: s.vehicle.licensePlate,
    },
    customer: {
      name: s.customerContact.name,
    },
    parkingLocation: s.parkingLocations[0]
      ? {
          zone: s.parkingLocations[0].zone,
          floor: s.parkingLocations[0].floor,
          row: s.parkingLocations[0].row,
          stall: s.parkingLocations[0].stall,
        }
      : null,
    timeline: s.sessionEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      occurredAt: e.occurredAt,
    })),
    serviceRequests: s.serviceRequests.map((r) => ({
      id: r.id,
      serviceType: r.serviceType,
      status: r.status,
      notes: r.notes,
      requestedAt: r.requestedAt,
    })),
  }
})
