import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma/client'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
})

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
    update: {},
    create: {
      venueId: venue.id,
      name: 'Maya Rivera',
      email: 'manager@crownvalet.test',
      phone: '+13055550101',
      role: 'manager',
      authProviderId: 'seed-manager',
    },
  })

  await prisma.staffUser.upsert({
    where: { email: 'attendant@crownvalet.test' },
    update: {},
    create: {
      venueId: venue.id,
      name: 'Andre Cole',
      email: 'attendant@crownvalet.test',
      phone: '+13055550102',
      role: 'attendant',
      authProviderId: 'seed-attendant',
    },
  })

  await prisma.staffUser.upsert({
    where: { email: 'runner@crownvalet.test' },
    update: {},
    create: {
      venueId: venue.id,
      name: 'Nina Patel',
      email: 'runner@crownvalet.test',
      phone: '+13055550103',
      role: 'runner',
      authProviderId: 'seed-runner',
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
