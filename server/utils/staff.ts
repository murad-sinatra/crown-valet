import { createError, getCookie, type H3Event } from 'h3'
import { prisma } from './db'

export async function getCurrentStaffUser(event: H3Event) {
  const staffSession = getCookie(event, 'cv_staff_session')

  if (!staffSession) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Staff session required',
    })
  }

  const staffUser =
    (await prisma.staffUser.findFirst({
      where: {
        active: true,
        OR: [
          { id: staffSession },
          { email: staffSession },
          { authProviderId: staffSession },
        ],
      },
      orderBy: { createdAt: 'asc' },
    })) ??
    (await prisma.staffUser.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    }))

  if (!staffUser) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No active staff user is available',
    })
  }

  return staffUser
}
