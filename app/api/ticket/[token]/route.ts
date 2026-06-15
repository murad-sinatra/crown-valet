import { and, asc, desc, eq } from 'drizzle-orm'
import { ApiError, errorResponse } from '@/lib/api-error'
import { db } from '@/lib/db'
import {
  customerContacts,
  parkingLocations,
  serviceRequests,
  sessionEvents,
  ticketTokens,
  valetSessions,
  vehicles,
  venues,
} from '@/lib/db/schema'
import { hashTicketToken } from '@/lib/ticket'
import { customerVisibleStatuses } from '@/shared/status'

type RouteContext = {
  params: Promise<{ token: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params

    if (!token) {
      throw new ApiError(400, 'Token is required')
    }

    const tokenHash = hashTicketToken(token)

    const [ticketRow] = await db
      .select({
        ticketToken: ticketTokens,
        session: valetSessions,
        venue: venues,
        vehicle: vehicles,
        customerContact: customerContacts,
      })
      .from(ticketTokens)
      .innerJoin(valetSessions, eq(ticketTokens.valetSessionId, valetSessions.id))
      .innerJoin(venues, eq(valetSessions.venueId, venues.id))
      .innerJoin(vehicles, eq(valetSessions.vehicleId, vehicles.id))
      .innerJoin(customerContacts, eq(valetSessions.customerContactId, customerContacts.id))
      .where(eq(ticketTokens.tokenHash, tokenHash))
      .limit(1)

    if (!ticketRow || ticketRow.ticketToken.status !== 'active') {
      throw new ApiError(404, 'Ticket not found or expired')
    }

    const sessionId = ticketRow.session.id

    const [parkingLocation] = await db
      .select()
      .from(parkingLocations)
      .where(eq(parkingLocations.valetSessionId, sessionId))
      .orderBy(desc(parkingLocations.recordedAt))
      .limit(1)

    const events = await db
      .select()
      .from(sessionEvents)
      .where(
        and(
          eq(sessionEvents.valetSessionId, sessionId),
          eq(sessionEvents.visibleToCustomer, true),
        ),
      )
      .orderBy(asc(sessionEvents.occurredAt))

    const requests = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.valetSessionId, sessionId))
      .orderBy(desc(serviceRequests.requestedAt))

    const { session, venue, vehicle, customerContact } = ticketRow

    return Response.json({
      ticketNumber: session.ticketNumber,
      status: session.status,
      statusLabel: customerVisibleStatuses[session.status],
      checkedInAt: session.checkedInAt,
      venueName: venue.name,
      venuePhone: venue.valetPhone,
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
      },
      customer: {
        name: customerContact.name,
      },
      parkingLocation: parkingLocation
        ? {
            zone: parkingLocation.zone,
            floor: parkingLocation.floor,
            row: parkingLocation.row,
            stall: parkingLocation.stall,
          }
        : null,
      timeline: events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        occurredAt: event.occurredAt,
      })),
      serviceRequests: requests.map((request) => ({
        id: request.id,
        serviceType: request.serviceType,
        status: request.status,
        notes: request.notes,
        requestedAt: request.requestedAt,
      })),
    })
  } catch (error) {
    return errorResponse(error)
  }
}
