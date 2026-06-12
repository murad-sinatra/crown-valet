import { readBody, createError } from 'h3'
import { z } from 'zod'
import { getCurrentStaffUser } from '~/server/utils/staff'
import { prisma } from '~/server/utils/db'
import { verifyPassword, hashPassword } from '~/server/utils/password'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const user = await getCurrentStaffUser(event)
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message ?? 'Invalid input',
    })
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data

  if (newPassword !== confirmPassword) {
    throw createError({ statusCode: 400, statusMessage: 'New passwords do not match' })
  }

  if (!user.passwordHash) {
    throw createError({ statusCode: 400, statusMessage: 'No password set on this account' })
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Current password is incorrect' })
  }

  const newHash = await hashPassword(newPassword)
  await prisma.staffUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  })

  return { ok: true }
})
