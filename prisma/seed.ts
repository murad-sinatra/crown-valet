import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}

async function main() {
  const venue = await prisma.venue.upsert({
    where: { slug: 'crown-demo-hotel' },
    update: {},
    create: {
      name: 'Crown Demo Hotel',
      slug: 'crown-demo-hotel',
      addressLine1: '100 Valet Drive',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      timezone: 'America/New_York',
      valetPhone: '+13055550100',
      operatingStatus: 'active',
    },
  })

  await prisma.staffUser.upsert({
    where: { email: 'manager@crownvalet.test' },
    update: { passwordHash: await hashPassword('manager1234') },
    create: {
      venueId: venue.id,
      name: 'Maya Rivera',
      email: 'manager@crownvalet.test',
      phone: '+13055550101',
      role: 'manager',
      authProviderId: 'seed-manager',
      passwordHash: await hashPassword('manager1234'),
    },
  })

  await prisma.staffUser.upsert({
    where: { email: 'attendant@crownvalet.test' },
    update: { passwordHash: await hashPassword('attendant1234') },
    create: {
      venueId: venue.id,
      name: 'Andre Cole',
      email: 'attendant@crownvalet.test',
      phone: '+13055550102',
      role: 'attendant',
      authProviderId: 'seed-attendant',
      passwordHash: await hashPassword('attendant1234'),
    },
  })

  await prisma.staffUser.upsert({
    where: { email: 'runner@crownvalet.test' },
    update: { passwordHash: await hashPassword('runner1234') },
    create: {
      venueId: venue.id,
      name: 'Nina Patel',
      email: 'runner@crownvalet.test',
      phone: '+13055550103',
      role: 'runner',
      authProviderId: 'seed-runner',
      passwordHash: await hashPassword('runner1234'),
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
