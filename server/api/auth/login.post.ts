import { readBody, setCookie, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { verifyPassword } from '~/server/utils/password'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const { email, password } = parsed.data

  const user = await prisma.staffUser.findFirst({
    where: { email, active: true },
  })

  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await prisma.staffUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  setCookie(event, 'cv_staff_session', user.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role }
})
