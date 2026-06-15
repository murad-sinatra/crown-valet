import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { createId, db, now } from '@/lib/db'
import { serviceRequests, ticketTokens, valetSessions } from '@/lib/db/schema'
import { hashTicketToken } from '@/lib/ticket'

const SERVICE_TYPES = ['gas_fillup', 'ev_charge', 'clean', 'tire_check', 'other'] as const

const schema = z.object({
  serviceType: z.enum(SERVICE_TYPES),
  notes: z.string().max(500).optional(),
})

type RouteContext = {
  params: Promise<{ token: string }>
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { token } = await context.params

    if (!token) {
      throw new ApiError(400, 'Token is required')
    }

    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid request')
    }

    const tokenHash = hashTicketToken(token)

    const [ticketRow] = await db
      .select({
        ticketToken: ticketTokens,
        session: valetSessions,
      })
      .from(ticketTokens)
      .innerJoin(valetSessions, eq(ticketTokens.valetSessionId, valetSessions.id))
      .where(eq(ticketTokens.tokenHash, tokenHash))
      .limit(1)

    if (!ticketRow || ticketRow.ticketToken.status !== 'active') {
      throw new ApiError(404, 'Ticket not found or expired')
    }

    const { status } = ticketRow.session
    if (status === 'completed' || status === 'cancelled') {
      throw new ApiError(409, 'Session is no longer active')
    }

    const timestamp = now()
    const [serviceRequest] = await db
      .insert(serviceRequests)
      .values({
        id: createId(),
        valetSessionId: ticketRow.ticketToken.valetSessionId,
        serviceType: parsed.data.serviceType,
        notes: parsed.data.notes,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning()

    return Response.json({
      id: serviceRequest.id,
      serviceType: serviceRequest.serviceType,
      status: serviceRequest.status,
      requestedAt: serviceRequest.requestedAt,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
