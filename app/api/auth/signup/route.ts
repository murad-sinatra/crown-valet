import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { createId, db, now } from '@/lib/db'
import { staffUsers, venues } from '@/lib/db/schema'
import { hashPassword } from '@/lib/password'
import { staffSessionCookie } from '@/lib/staff'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid input')
    }

    const { email, password } = parsed.data

    const [existing] = await db
      .select({ id: staffUsers.id })
      .from(staffUsers)
      .where(eq(staffUsers.email, email))
      .limit(1)

    if (existing) {
      throw new ApiError(409, 'An account with this email already exists')
    }

    let [venue] = await db.select().from(venues).limit(1)

    if (!venue) {
      ;[venue] = await db
        .insert(venues)
        .values({
          id: createId(),
          name: 'Crown Valet',
          slug: 'crown-valet',
          addressLine1: '1 Valet Drive',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          timezone: 'America/New_York',
          operatingStatus: 'active',
          createdAt: now(),
          updatedAt: now(),
        })
        .returning()
    }

    const passwordHash = await hashPassword(password)

    const [user] = await db
      .insert(staffUsers)
      .values({
        id: createId(),
        email,
        passwordHash,
        name: '',
        role: 'attendant',
        venueId: venue.id,
        active: true,
        createdAt: now(),
        updatedAt: now(),
      })
      .returning()

    const cookieStore = await cookies()
    cookieStore.set(staffSessionCookie.name, user.id, staffSessionCookie.options)

    return Response.json({ id: user.id, email: user.email })
  } catch (error) {
    return errorResponse(error)
  }
}
