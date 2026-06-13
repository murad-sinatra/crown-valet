import { readBody, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { getCurrentStaffUser } from '~/server/utils/staff'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  role: z.enum(['attendant', 'runner', 'manager', 'admin']),
})

export default defineEventHandler(async (event) => {
  const staffUser = await getCurrentStaffUser(event)
  if (!staffUser) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Invalid input'
    throw createError({ statusCode: 400, statusMessage: msg })
  }

  const { name, phone, role } = parsed.data

  const updated = await prisma.staffUser.update({
    where: { id: staffUser.id },
    data: { name, phone: phone || null, role },
  })

  return { id: updated.id, name: updated.name, email: updated.email, role: updated.role }
})
