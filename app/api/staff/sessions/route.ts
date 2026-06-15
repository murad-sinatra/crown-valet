import { and, desc, eq, inArray, notInArray } from 'drizzle-orm'
import { errorResponse } from '@/lib/api-error'
import { db } from '@/lib/db'
import {
  customerContacts,
  ticketTokens,
  valetSessions,
  vehicles,
} from '@/lib/db/schema'
import { getCurrentStaffUser } from '@/lib/staff'
import { staffStatusLabels } from '@/shared/status'

export async function GET() {
  try {
    const staffUser = await getCurrentStaffUser()

    const sessions = await db
      .select({
        session: valetSessions,
        customerContact: customerContacts,
        vehicle: vehicles,
      })
      .from(valetSessions)
      .innerJoin(customerContacts, eq(valetSessions.customerContactId, customerContacts.id))
      .innerJoin(vehicles, eq(valetSessions.vehicleId, vehicles.id))
      .where(
        and(
          eq(valetSessions.venueId, staffUser.venueId),
          notInArray(valetSessions.status, ['completed', 'cancelled']),
        ),
      )
      .orderBy(desc(valetSessions.checkedInAt))

    const sessionIds = sessions.map((row) => row.session.id)
    const tokens =
      sessionIds.length === 0
        ? []
        : await db
            .select()
            .from(ticketTokens)
            .where(
              and(
                inArray(ticketTokens.valetSessionId, sessionIds),
                eq(ticketTokens.status, 'active'),
              ),
            )
            .orderBy(desc(ticketTokens.issuedAt))

    const tokenBySession = new Map<string, (typeof tokens)[number]>()
    for (const token of tokens) {
      if (!tokenBySession.has(token.valetSessionId)) {
        tokenBySession.set(token.valetSessionId, token)
      }
    }

    return Response.json(
      sessions.map(({ session, customerContact, vehicle }) => ({
        id: session.id,
        ticketNumber: session.ticketNumber,
        keyTag: session.keyTag,
        status: session.status,
        statusLabel: staffStatusLabels[session.status],
        checkedInAt: session.checkedInAt,
        updatedAt: session.updatedAt,
        customerName: customerContact.name,
        customerPhone: customerContact.phone,
        vehicleSummary: `${vehicle.color} ${vehicle.make} ${vehicle.model}`,
        licensePlate: vehicle.licensePlate,
        tokenHint: tokenBySession.get(session.id)?.lastFourHint,
      })),
    )
  } catch (error) {
    return errorResponse(error)
  }
}
