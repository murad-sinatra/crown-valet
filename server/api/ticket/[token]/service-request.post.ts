import { createError, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import { prisma } from '../../../utils/db'
import { hashTicketToken } from '../../../utils/ticket'

const SERVICE_TYPES = ['gas_fillup', 'ev_charge', 'clean', 'tire_check', 'other'] as const

const schema = z.object({
  serviceType: z.enum(SERVICE_TYPES),
  notes: z.string().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Token is required' })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message ?? 'Invalid request',
    })
  }

  const tokenHash = hashTicketToken(token)
  const ticketToken = await prisma.ticketToken.findUnique({
    where: { tokenHash },
    include: { valetSession: true },
  })

  if (!ticketToken || ticketToken.status !== 'active') {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found or expired' })
  }

  const { status } = ticketToken.valetSession
  if (['completed', 'cancelled'].includes(status)) {
    throw createError({ statusCode: 409, statusMessage: 'Session is no longer active' })
  }

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      valetSessionId: ticketToken.valetSessionId,
      serviceType: parsed.data.serviceType,
      notes: parsed.data.notes,
    },
  })

  return {
    id: serviceRequest.id,
    serviceType: serviceRequest.serviceType,
    status: serviceRequest.status,
    requestedAt: serviceRequest.requestedAt,
  }
})
