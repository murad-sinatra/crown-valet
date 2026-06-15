import { and, desc, eq } from 'drizzle-orm'
import { ApiError, errorResponse } from '@/lib/api-error'
import { db } from '@/lib/db'
import {
  customerContacts,
  parkingLocations,
  serviceRequests,
  sessionEvents,
  staffUsers,
  ticketTokens,
  valetSessions,
  vehicles,
  venues,
} from '@/lib/db/schema'
import { getCurrentStaffUser } from '@/lib/staff'
import { staffStatusLabels } from '@/shared/status'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const staffUser = await getCurrentStaffUser()
    const { id } = await context.params

    if (!id) {
      throw new ApiError(400, 'Session id is required')
    }

    const [row] = await db
      .select({
        session: valetSessions,
        venue: venues,
        customerContact: customerContacts,
        vehicle: vehicles,
        staffCreatedBy: staffUsers,
      })
      .from(valetSessions)
      .innerJoin(venues, eq(valetSessions.venueId, venues.id))
      .innerJoin(customerContacts, eq(valetSessions.customerContactId, customerContacts.id))
      .innerJoin(vehicles, eq(valetSessions.vehicleId, vehicles.id))
      .innerJoin(staffUsers, eq(valetSessions.staffCreatedById, staffUsers.id))
      .where(and(eq(valetSessions.id, id), eq(valetSessions.venueId, staffUser.venueId)))
      .limit(1)

    if (!row) {
      throw new ApiError(404, 'Session not found')
    }

    const [activeToken] = await db
      .select()
      .from(ticketTokens)
      .where(and(eq(ticketTokens.valetSessionId, id), eq(ticketTokens.status, 'active')))
      .orderBy(desc(ticketTokens.issuedAt))
      .limit(1)

    const [parkingLocation] = await db
      .select()
      .from(parkingLocations)
      .where(eq(parkingLocations.valetSessionId, id))
      .orderBy(desc(parkingLocations.recordedAt))
      .limit(1)

    const events = await db
      .select()
      .from(sessionEvents)
      .where(eq(sessionEvents.valetSessionId, id))
      .orderBy(desc(sessionEvents.occurredAt))

    const requests = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.valetSessionId, id))
      .orderBy(desc(serviceRequests.requestedAt))

    const { session, venue, customerContact, vehicle, staffCreatedBy } = row

    return Response.json({
      id: session.id,
      venueName: venue.name,
      ticketNumber: session.ticketNumber,
      keyTag: session.keyTag,
      status: session.status,
      statusLabel: staffStatusLabels[session.status],
      checkedInAt: session.checkedInAt,
      updatedAt: session.updatedAt,
      staffNotes: session.staffNotes,
      tokenHint: activeToken?.lastFourHint,
      customer: {
        name: customerContact.name,
        phone: customerContact.phone,
      },
      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
        notes: vehicle.notes,
      },
      parkingLocation: parkingLocation
        ? {
            zone: parkingLocation.zone,
            floor: parkingLocation.floor,
            row: parkingLocation.row,
            stall: parkingLocation.stall,
            note: parkingLocation.note,
            recordedAt: parkingLocation.recordedAt,
          }
        : null,
      createdBy: {
        name: staffCreatedBy.name,
        role: staffCreatedBy.role,
      },
      timeline: events.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        title: event.title,
        description: event.description,
        visibleToCustomer: event.visibleToCustomer,
        occurredAt: event.occurredAt,
      })),
      serviceRequests: requests.map((request) => ({
        id: request.id,
        serviceType: request.serviceType,
        status: request.status,
        notes: request.notes,
        staffNotes: request.staffNotes,
        requestedAt: request.requestedAt,
        completedAt: request.completedAt,
      })),
    })
  } catch (error) {
    return errorResponse(error)
  }
}
