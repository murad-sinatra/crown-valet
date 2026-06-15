import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

export const staffRoleEnum = pgEnum('StaffRole', [
  'attendant',
  'runner',
  'manager',
  'admin',
])

export const contactMethodEnum = pgEnum('ContactMethod', ['sms', 'email', 'none'])

export const valetSessionStatusEnum = pgEnum('ValetSessionStatus', [
  'checked_in',
  'being_parked',
  'parked',
  'pickup_requested',
  'runner_assigned',
  'retrieving',
  'ready',
  'completed',
  'cancelled',
  'flagged',
])

export const ticketTokenStatusEnum = pgEnum('TicketTokenStatus', [
  'active',
  'revoked',
  'expired',
])

export const sessionActorTypeEnum = pgEnum('SessionActorType', [
  'customer',
  'staff',
  'system',
])

export const serviceRequestTypeEnum = pgEnum('ServiceRequestType', [
  'gas_fillup',
  'ev_charge',
  'clean',
  'tire_check',
  'other',
])

export const serviceRequestStatusEnum = pgEnum('ServiceRequestStatus', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
])

export const venues = pgTable('venues', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  timezone: text('timezone').notNull(),
  valetPhone: text('valet_phone'),
  operatingStatus: text('operating_status').notNull().default('active'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
})

export const staffUsers = pgTable('staff_users', {
  id: text('id').primaryKey(),
  venueId: text('venue_id')
    .notNull()
    .references(() => venues.id),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: staffRoleEnum('role').notNull(),
  authProviderId: text('auth_provider_id'),
  passwordHash: text('password_hash'),
  active: boolean('active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { precision: 3, mode: 'date' }),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
})

export const customerContacts = pgTable('customer_contacts', {
  id: text('id').primaryKey(),
  name: text('name'),
  phone: text('phone').notNull(),
  email: text('email'),
  preferredContactMethod: contactMethodEnum('preferred_contact_method').notNull().default('sms'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
})

export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  customerContactId: text('customer_contact_id')
    .notNull()
    .references(() => customerContacts.id),
  make: text('make').notNull(),
  model: text('model').notNull(),
  color: text('color').notNull(),
  licensePlate: text('license_plate').notNull(),
  licensePlateState: text('license_plate_state'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
})

export const valetSessions = pgTable(
  'valet_sessions',
  {
    id: text('id').primaryKey(),
    venueId: text('venue_id')
      .notNull()
      .references(() => venues.id),
    customerContactId: text('customer_contact_id')
      .notNull()
      .references(() => customerContacts.id),
    vehicleId: text('vehicle_id')
      .notNull()
      .references(() => vehicles.id),
    ticketNumber: text('ticket_number').notNull(),
    keyTag: text('key_tag').notNull(),
    status: valetSessionStatusEnum('status').notNull().default('checked_in'),
    staffCreatedById: text('staff_created_by_id')
      .notNull()
      .references(() => staffUsers.id),
    assignedRunnerId: text('assigned_runner_id').references(() => staffUsers.id),
    checkedInAt: timestamp('checked_in_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    parkedAt: timestamp('parked_at', { precision: 3, mode: 'date' }),
    pickupRequestedAt: timestamp('pickup_requested_at', { precision: 3, mode: 'date' }),
    readyAt: timestamp('ready_at', { precision: 3, mode: 'date' }),
    completedAt: timestamp('completed_at', { precision: 3, mode: 'date' }),
    cancelledAt: timestamp('cancelled_at', { precision: 3, mode: 'date' }),
    flaggedAt: timestamp('flagged_at', { precision: 3, mode: 'date' }),
    flagReason: text('flag_reason'),
    staffNotes: text('staff_notes'),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
  },
  (table) => [
    uniqueIndex('valet_sessions_venue_id_ticket_number_key').on(table.venueId, table.ticketNumber),
    index('valet_sessions_venue_id_status_idx').on(table.venueId, table.status),
  ],
)

export const ticketTokens = pgTable('ticket_tokens', {
  id: text('id').primaryKey(),
  valetSessionId: text('valet_session_id')
    .notNull()
    .references(() => valetSessions.id),
  tokenHash: text('token_hash').notNull().unique(),
  lastFourHint: text('last_four_hint').notNull(),
  status: ticketTokenStatusEnum('status').notNull().default('active'),
  issuedAt: timestamp('issued_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { precision: 3, mode: 'date' }),
  lastAccessedAt: timestamp('last_accessed_at', { precision: 3, mode: 'date' }),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
})

export const parkingLocations = pgTable('parking_locations', {
  id: text('id').primaryKey(),
  valetSessionId: text('valet_session_id')
    .notNull()
    .references(() => valetSessions.id),
  zone: text('zone'),
  floor: text('floor'),
  row: text('row'),
  stall: text('stall'),
  note: text('note'),
  recordedById: text('recorded_by_id')
    .notNull()
    .references(() => staffUsers.id),
  recordedAt: timestamp('recorded_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
})

export const sessionEvents = pgTable(
  'session_events',
  {
    id: text('id').primaryKey(),
    valetSessionId: text('valet_session_id')
      .notNull()
      .references(() => valetSessions.id),
    eventType: text('event_type').notNull(),
    actorType: sessionActorTypeEnum('actor_type').notNull(),
    actorStaffId: text('actor_staff_id').references(() => staffUsers.id),
    title: text('title').notNull(),
    description: text('description'),
    visibleToCustomer: boolean('visible_to_customer').notNull().default(false),
    metadataJson: jsonb('metadata_json'),
    occurredAt: timestamp('occurred_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('session_events_valet_session_id_occurred_at_idx').on(
      table.valetSessionId,
      table.occurredAt,
    ),
  ],
)

export const serviceRequests = pgTable(
  'service_requests',
  {
    id: text('id').primaryKey(),
    valetSessionId: text('valet_session_id')
      .notNull()
      .references(() => valetSessions.id),
    serviceType: serviceRequestTypeEnum('service_type').notNull(),
    status: serviceRequestStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    staffNotes: text('staff_notes'),
    requestedAt: timestamp('requested_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { precision: 3, mode: 'date' }),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull(),
  },
  (table) => [
    index('service_requests_valet_session_id_requested_at_idx').on(
      table.valetSessionId,
      table.requestedAt,
    ),
  ],
)

export type StaffUser = typeof staffUsers.$inferSelect
export type ValetSession = typeof valetSessions.$inferSelect
