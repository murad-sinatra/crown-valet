import { createError, defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { prisma } from '../../utils/db'
import { getCurrentStaffUser } from '../../utils/staff'
import { createTicketNumber, createTicketToken } from '../../utils/ticket'

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

export default defineEventHandler(async (event) => {
  const staffUser = await getCurrentStaffUser(event)
  const body = await readValidatedBody(event, (value) => checkInSchema.parse(value))
  const ticket = createTicketToken()

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const ticketNumber = createTicketNumber()

    try {
      const valetSession = await prisma.$transaction(async (tx) => {
        const customerContact = await tx.customerContact.create({
          data: {
            name: optionalText(body.customerName),
            phone: body.customerPhone,
          },
        })

        const vehicle = await tx.vehicle.create({
          data: {
            customerContactId: customerContact.id,
            make: body.vehicleMake,
            model: body.vehicleModel,
            color: body.vehicleColor,
            licensePlate: body.licensePlate.toUpperCase(),
            notes: optionalText(body.vehicleNotes),
          },
        })

        const session = await tx.valetSession.create({
          data: {
            venueId: staffUser.venueId,
            customerContactId: customerContact.id,
            vehicleId: vehicle.id,
            ticketNumber,
            keyTag: body.keyTag,
            staffCreatedById: staffUser.id,
            staffNotes: optionalText(body.staffNotes),
          },
        })

        if (optionalText(body.parkingZone)) {
          await tx.parkingLocation.create({
            data: {
              valetSessionId: session.id,
              zone: optionalText(body.parkingZone),
              recordedById: staffUser.id,
            },
          })
        }

        await tx.ticketToken.create({
          data: {
            valetSessionId: session.id,
            tokenHash: ticket.tokenHash,
            lastFourHint: ticket.lastFourHint,
          },
        })

        await tx.sessionEvent.create({
          data: {
            valetSessionId: session.id,
            eventType: 'session_created',
            actorType: 'staff',
            actorStaffId: staffUser.id,
            title: 'Session created',
            description: `${vehicle.color} ${vehicle.make} ${vehicle.model} checked in by ${staffUser.name}.`,
            visibleToCustomer: true,
            metadataJson: {
              ticketNumber,
              keyTag: body.keyTag,
              parkingZone: optionalText(body.parkingZone),
            },
          },
        })

        return session
      })

      return {
        session: {
          id: valetSession.id,
          ticketNumber: valetSession.ticketNumber,
        },
        ticketToken: ticket.token,
      }
    } catch (error: unknown) {
      const isTicketCollision =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'

      if (!isTicketCollision || attempt === 4) {
        throw error
      }
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Unable to create a unique ticket number',
  })
})
