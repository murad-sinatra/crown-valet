import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ApiError, errorResponse } from '@/lib/api-error'
import { db, now } from '@/lib/db'
import { staffUsers } from '@/lib/db/schema'
import { getCurrentStaffUser } from '@/lib/staff'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  role: z.enum(['attendant', 'runner', 'manager', 'admin']),
})

export async function POST(request: Request) {
  try {
    const staffUser = await getCurrentStaffUser()
    const parsed = schema.safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid input')
    }

    const { name, phone, role } = parsed.data

    const [updated] = await db
      .update(staffUsers)
      .set({ name, phone: phone || null, role, updatedAt: now() })
      .where(eq(staffUsers.id, staffUser.id))
      .returning()

    return Response.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    })
  } catch (error) {
    return errorResponse(error)
  }
}
