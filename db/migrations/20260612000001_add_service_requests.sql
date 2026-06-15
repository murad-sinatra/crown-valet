-- CreateEnum
CREATE TYPE "ServiceRequestType" AS ENUM ('gas_fillup', 'ev_charge', 'clean', 'tire_check', 'other');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "valet_session_id" TEXT NOT NULL,
    "service_type" "ServiceRequestType" NOT NULL,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "staff_notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_requests_valet_session_id_requested_at_idx" ON "service_requests"("valet_session_id", "requested_at");

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_valet_session_id_fkey" FOREIGN KEY ("valet_session_id") REFERENCES "valet_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
