-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('attendant', 'runner', 'manager', 'admin');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('sms', 'email', 'none');

-- CreateEnum
CREATE TYPE "ValetSessionStatus" AS ENUM ('checked_in', 'being_parked', 'parked', 'pickup_requested', 'runner_assigned', 'retrieving', 'ready', 'completed', 'cancelled', 'flagged');

-- CreateEnum
CREATE TYPE "TicketTokenStatus" AS ENUM ('active', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "PickupRequestedByType" AS ENUM ('customer', 'staff');

-- CreateEnum
CREATE TYPE "PickupRequestStatus" AS ENUM ('requested', 'assigned', 'retrieving', 'ready', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "SessionActorType" AS ENUM ('customer', 'staff', 'system');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('sms', 'email');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ticket_link', 'pickup_requested', 'vehicle_ready');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'failed', 'skipped');

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "valet_phone" TEXT,
    "operating_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_users" (
    "id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "StaffRole" NOT NULL,
    "auth_provider_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferred_contact_method" "ContactMethod" NOT NULL DEFAULT 'sms',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "customer_contact_id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "license_plate_state" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valet_sessions" (
    "id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "customer_contact_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "key_tag" TEXT NOT NULL,
    "status" "ValetSessionStatus" NOT NULL DEFAULT 'checked_in',
    "staff_created_by_id" TEXT NOT NULL,
    "assigned_runner_id" TEXT,
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parked_at" TIMESTAMP(3),
    "pickup_requested_at" TIMESTAMP(3),
    "ready_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "flagged_at" TIMESTAMP(3),
    "flag_reason" TEXT,
    "staff_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "valet_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_tokens" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "last_four_hint" TEXT NOT NULL,
    "status" "TicketTokenStatus" NOT NULL DEFAULT 'active',
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "last_accessed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_locations" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "zone" TEXT,
    "floor" TEXT,
    "row" TEXT,
    "stall" TEXT,
    "note" TEXT,
    "recorded_by_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_requests" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "requested_by_type" "PickupRequestedByType" NOT NULL,
    "requested_by_staff_id" TEXT,
    "status" "PickupRequestStatus" NOT NULL DEFAULT 'requested',
    "assigned_runner_id" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_at" TIMESTAMP(3),
    "retrieving_at" TIMESTAMP(3),
    "ready_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancel_reason" TEXT,
    "delay_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_events" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "actor_type" "SessionActorType" NOT NULL,
    "actor_staff_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visible_to_customer" BOOLEAN NOT NULL DEFAULT false,
    "metadata_json" JSONB,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "customer_contact_id" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "provider" TEXT NOT NULL,
    "provider_message_id" TEXT,
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_email_key" ON "staff_users"("email");

-- CreateIndex
CREATE INDEX "valet_sessions_venue_id_status_idx" ON "valet_sessions"("venue_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "valet_sessions_venue_id_ticket_number_key" ON "valet_sessions"("venue_id", "ticket_number");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_tokens_token_hash_key" ON "ticket_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "pickup_requests_status_requested_at_idx" ON "pickup_requests"("status", "requested_at");

-- CreateIndex
CREATE INDEX "session_events_valet_session_id_occurred_at_idx" ON "session_events"("valet_session_id", "occurred_at");

-- CreateIndex
CREATE INDEX "notification_logs_status_created_at_idx" ON "notification_logs"("status", "created_at");

-- AddForeignKey
ALTER TABLE "staff_users" ADD CONSTRAINT "staff_users_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_customer_contact_id_fkey" FOREIGN KEY ("customer_contact_id") REFERENCES "customer_contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valet_sessions" ADD CONSTRAINT "valet_sessions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valet_sessions" ADD CONSTRAINT "valet_sessions_customer_contact_id_fkey" FOREIGN KEY ("customer_contact_id") REFERENCES "customer_contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valet_sessions" ADD CONSTRAINT "valet_sessions_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valet_sessions" ADD CONSTRAINT "valet_sessions_staff_created_by_id_fkey" FOREIGN KEY ("staff_created_by_id") REFERENCES "staff_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valet_sessions" ADD CONSTRAINT "valet_sessions_assigned_runner_id_fkey" FOREIGN KEY ("assigned_runner_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_tokens" ADD CONSTRAINT "ticket_tokens_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_locations" ADD CONSTRAINT "parking_locations_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_locations" ADD CONSTRAINT "parking_locations_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "staff_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_requested_by_staff_id_fkey" FOREIGN KEY ("requested_by_staff_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_requests" ADD CONSTRAINT "pickup_requests_assigned_runner_id_fkey" FOREIGN KEY ("assigned_runner_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_events" ADD CONSTRAINT "session_events_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_events" ADD CONSTRAINT "session_events_actor_staff_id_fkey" FOREIGN KEY ("actor_staff_id") REFERENCES "staff_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_customer_contact_id_fkey" FOREIGN KEY ("customer_contact_id") REFERENCES "customer_contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
