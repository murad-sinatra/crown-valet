import { readBody, setCookie, createError } from 'h3'
import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { hashPassword } from '~/server/utils/password'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
    throw createError({ statusCode: 400, statusMessage: msg })
  }

  const { email, password } = parsed.data

  const existing = await prisma.staffUser.findFirst({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists' })
  }

  let venue = await prisma.venue.findFirst()
  if (!venue) {
    venue = await prisma.venue.create({
      data: {
        name: 'Crown Valet',
        slug: 'crown-valet',
        addressLine1: '1 Valet Drive',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
        timezone: 'America/New_York',
        operatingStatus: 'active',
      },
    })
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.staffUser.create({
    data: {
      email,
      passwordHash,
      name: '',
      role: 'attendant',
      venueId: venue.id,
      active: true,
    },
  })

  setCookie(event, 'cv_staff_session', user.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { id: user.id, email: user.email }
})
