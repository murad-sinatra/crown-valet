import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { db, now } from '@/lib/db'
import { staffUsers } from '@/lib/db/schema'
import { hashPassword, verifyPassword } from '@/lib/password'
import { getCurrentStaffUser } from '@/lib/staff'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const user = await getCurrentStaffUser()
    const parsed = schema.safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid input')
    }

    const { currentPassword, newPassword, confirmPassword } = parsed.data

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, 'New passwords do not match')
    }

    if (!user.passwordHash) {
      throw new ApiError(400, 'No password set on this account')
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash)
    if (!valid) {
      throw new ApiError(401, 'Current password is incorrect')
    }

    const newHash = await hashPassword(newPassword)
    await db
      .update(staffUsers)
      .set({ passwordHash: newHash, updatedAt: now() })
      .where(eq(staffUsers.id, user.id))

    return Response.json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
