import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { createId, db, isUniqueViolation, now } from '@/lib/db'
import {
  customerContacts,
  parkingLocations,
  sessionEvents,
  ticketTokens,
  valetSessions,
  vehicles,
} from '@/lib/db/schema'
import { getCurrentStaffUser } from '@/lib/staff'
import { createTicketNumber, createTicketToken } from '@/lib/ticket'

const checkInSchema = z.object({
  customerPhone: z.string().trim().min(1, 'Customer phone is required'),
  customerName: z.string().trim().optional(),
  vehicleMake: z.string().trim().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().trim().min(1, 'Vehicle model is required'),
  vehicleColor: z.string().trim().min(1, 'Vehicle color is required'),
  licensePlate: z.string().trim().min(1, 'License plate is required'),
  keyTag: z.string().trim().min(1, 'Key tag is required'),
  vehicleNotes: z.string().trim().optional(),
  parkingZone: z.string().trim().optional(),
  staffNotes: z.string().trim().optional(),
})

function optionalText(value?: string) {
  return value?.trim() || undefined
}

export async function POST(request: Request) {
  try {
    const staffUser = await getCurrentStaffUser()
    const parsedBody = checkInSchema.safeParse(await request.json())

    if (!parsedBody.success) {
      throw new ApiError(
        400,
        parsedBody.error.issues[0]?.message ?? 'Invalid check-in details',
      )
    }

    const body = parsedBody.data
    const ticket = createTicketToken()

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const ticketNumber = createTicketNumber()

      try {
        const valetSession = await db.transaction(async (tx) => {
          const timestamp = now()
          const customerContactId = createId()
          const vehicleId = createId()
          const sessionId = createId()

          await tx.insert(customerContacts).values({
            id: customerContactId,
            name: optionalText(body.customerName),
            phone: body.customerPhone,
            createdAt: timestamp,
            updatedAt: timestamp,
          })

          await tx.insert(vehicles).values({
            id: vehicleId,
            customerContactId,
            make: body.vehicleMake,
            model: body.vehicleModel,
            color: body.vehicleColor,
            licensePlate: body.licensePlate.toUpperCase(),
            notes: optionalText(body.vehicleNotes),
            createdAt: timestamp,
            updatedAt: timestamp,
          })

          const [session] = await tx
            .insert(valetSessions)
            .values({
              id: sessionId,
              venueId: staffUser.venueId,
              customerContactId,
              vehicleId,
              ticketNumber,
              keyTag: body.keyTag,
              staffCreatedById: staffUser.id,
              staffNotes: optionalText(body.staffNotes),
              createdAt: timestamp,
              updatedAt: timestamp,
            })
            .returning()

          if (optionalText(body.parkingZone)) {
            await tx.insert(parkingLocations).values({
              id: createId(),
              valetSessionId: sessionId,
              zone: optionalText(body.parkingZone),
              recordedById: staffUser.id,
              createdAt: timestamp,
              updatedAt: timestamp,
            })
          }

          await tx.insert(ticketTokens).values({
            id: createId(),
            valetSessionId: sessionId,
            tokenHash: ticket.tokenHash,
            lastFourHint: ticket.lastFourHint,
          })

          await tx.insert(sessionEvents).values({
            id: createId(),
            valetSessionId: sessionId,
            eventType: 'session_created',
            actorType: 'staff',
            actorStaffId: staffUser.id,
            title: 'Session created',
            description: `${body.vehicleColor} ${body.vehicleMake} ${body.vehicleModel} checked in by ${staffUser.name}.`,
            visibleToCustomer: true,
            metadataJson: {
              ticketNumber,
              keyTag: body.keyTag,
              parkingZone: optionalText(body.parkingZone),
            },
          })

          return session
        })

        return Response.json({
          session: {
            id: valetSession.id,
            ticketNumber: valetSession.ticketNumber,
          },
          ticketToken: ticket.token,
        })
      } catch (error: unknown) {
        if (!isUniqueViolation(error) || attempt === 4) {
          throw error
        }
      }
    }

    throw new ApiError(500, 'Unable to create a unique ticket number')
  } catch (error) {
    return errorResponse(error)
  }
}
