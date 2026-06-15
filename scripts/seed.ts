import { eq } from 'drizzle-orm'
import { db, createId, now, pool } from '../lib/db'
import { staffUsers, venues } from '../lib/db/schema'
import { hashPassword } from '../lib/password'

async function upsertStaffUser(input: {
  venueId: string
  name: string
  email: string
  phone: string
  role: 'manager' | 'attendant' | 'runner'
  authProviderId: string
  password: string
}) {
  const passwordHash = await hashPassword(input.password)
  const [existing] = await db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.email, input.email))
    .limit(1)

  if (existing) {
    await db
      .update(staffUsers)
      .set({ passwordHash, updatedAt: now() })
      .where(eq(staffUsers.id, existing.id))
    return
  }

  await db.insert(staffUsers).values({
    id: createId(),
    venueId: input.venueId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    authProviderId: input.authProviderId,
    passwordHash,
    active: true,
    createdAt: now(),
    updatedAt: now(),
  })
}

async function main() {
  let [venue] = await db
    .select()
    .from(venues)
    .where(eq(venues.slug, 'crown-demo-hotel'))
    .limit(1)

  if (!venue) {
    const [created] = await db
      .insert(venues)
      .values({
        id: createId(),
        name: 'Crown Demo Hotel',
        slug: 'crown-demo-hotel',
        addressLine1: '100 Valet Drive',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
        timezone: 'America/New_York',
        valetPhone: '+13055550100',
        operatingStatus: 'active',
        createdAt: now(),
        updatedAt: now(),
      })
      .returning()
    venue = created
  }

  await upsertStaffUser({
    venueId: venue.id,
    name: 'Maya Rivera',
    email: 'manager@crownvalet.test',
    phone: '+13055550101',
    role: 'manager',
    authProviderId: 'seed-manager',
    password: 'manager1234',
  })

  await upsertStaffUser({
    venueId: venue.id,
    name: 'Andre Cole',
    email: 'attendant@crownvalet.test',
    phone: '+13055550102',
    role: 'attendant',
    authProviderId: 'seed-attendant',
    password: 'attendant1234',
  })

  await upsertStaffUser({
    venueId: venue.id,
    name: 'Nina Patel',
    email: 'runner@crownvalet.test',
    phone: '+13055550103',
    role: 'runner',
    authProviderId: 'seed-runner',
    password: 'runner1234',
  })
}

main()
  .then(async () => {
    await pool.end()
  })
  .catch(async (error) => {
    console.error(error)
    await pool.end()
    process.exit(1)
  })
