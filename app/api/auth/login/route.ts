import { and, desc, eq, notInArray } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { db } from '@/lib/db'
import { staffUsers } from '@/lib/db/schema'
import { verifyPassword } from '@/lib/password'
import { getCurrentStaffUser, staffSessionCookie } from '@/lib/staff'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, 'Email and password are required')
    }

    const { email, password } = parsed.data

    const [user] = await db
      .select()
      .from(staffUsers)
      .where(and(eq(staffUsers.email, email), eq(staffUsers.active, true)))
      .limit(1)

    if (!user?.passwordHash) {
      throw new ApiError(401, 'Invalid email or password')
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      throw new ApiError(401, 'Invalid email or password')
    }

    await db
      .update(staffUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(staffUsers.id, user.id))

    const cookieStore = await cookies()
    cookieStore.set(staffSessionCookie.name, user.id, staffSessionCookie.options)

    return Response.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch (error) {
    return errorResponse(error)
  }
}
