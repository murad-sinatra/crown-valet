import { defineEventHandler } from 'h3'
import { staffStatusLabels } from '../../../../shared/status'
import { prisma } from '../../../utils/db'
import { getCurrentStaffUser } from '../../../utils/staff'

export default defineEventHandler(async (event) => {
  const staffUser = await getCurrentStaffUser(event)

  const sessions = await prisma.valetSession.findMany({
    where: {
      venueId: staffUser.venueId,
      status: {
        notIn: ['completed', 'cancelled'],
      },
    },
    include: {
      customerContact: true,
      vehicle: true,
      ticketTokens: {
        where: { status: 'active' },
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { checkedInAt: 'desc' },
  })

  return sessions.map((session) => ({
    id: session.id,
    ticketNumber: session.ticketNumber,
    keyTag: session.keyTag,
    status: session.status,
    statusLabel: staffStatusLabels[session.status],
    checkedInAt: session.checkedInAt,
    updatedAt: session.updatedAt,
    customerName: session.customerContact.name,
    customerPhone: session.customerContact.phone,
    vehicleSummary: `${session.vehicle.color} ${session.vehicle.make} ${session.vehicle.model}`,
    licensePlate: session.vehicle.licensePlate,
    tokenHint: session.ticketTokens[0]?.lastFourHint,
  }))
})
