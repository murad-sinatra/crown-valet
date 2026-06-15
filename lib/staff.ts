import { and, asc, eq, or } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { ApiError } from './api-error'
import { db } from './db'
import { staffUsers } from './db/schema'

export async function getCurrentStaffUser() {
  const cookieStore = await cookies()
  const staffSession = cookieStore.get('cv_staff_session')?.value

  if (!staffSession) {
    throw new ApiError(401, 'Staff session required')
  }

  const [staffUser] = await db
    .select()
    .from(staffUsers)
    .where(
      and(
        eq(staffUsers.active, true),
        or(
          eq(staffUsers.id, staffSession),
          eq(staffUsers.email, staffSession),
          eq(staffUsers.authProviderId, staffSession),
        ),
      ),
    )
    .orderBy(asc(staffUsers.createdAt))
    .limit(1)

  if (staffUser) {
    return staffUser
  }

  const [fallback] = await db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.active, true))
    .orderBy(asc(staffUsers.createdAt))
    .limit(1)

  if (!fallback) {
    throw new ApiError(403, 'No active staff user is available')
  }

  return fallback
}

export const staffSessionCookie = {
  name: 'cv_staff_session',
  options: {
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  },
}
