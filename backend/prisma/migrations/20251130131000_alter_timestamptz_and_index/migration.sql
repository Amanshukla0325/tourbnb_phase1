-- Convert timestamp columns to timestamptz safely by dropping generated column and constraint first
-- Drop existing EXCLUDE constraint (if exists) and booking_interval generated column
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap') THEN
		ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS bookings_no_overlap;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Booking' AND column_name='booking_interval') THEN
		ALTER TABLE "Booking" DROP COLUMN booking_interval;
	END IF;
END$$;

-- Convert timestamp columns to timestamptz (assume stored as UTC)
ALTER TABLE "Booking" ALTER COLUMN "checkIn" TYPE timestamptz USING ("checkIn" AT TIME ZONE 'UTC');
ALTER TABLE "Booking" ALTER COLUMN "checkOut" TYPE timestamptz USING ("checkOut" AT TIME ZONE 'UTC');

ALTER TABLE "Availability" ALTER COLUMN "startTime" TYPE timestamptz USING ("startTime" AT TIME ZONE 'UTC');
ALTER TABLE "Availability" ALTER COLUMN "endTime" TYPE timestamptz USING ("endTime" AT TIME ZONE 'UTC');

-- Recreate generated booking_interval column and EXCLUDE constraint to prevent overlaps
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Booking' AND column_name='booking_interval') THEN
		ALTER TABLE "Booking" ADD COLUMN booking_interval tstzrange GENERATED ALWAYS AS (tstzrange("checkIn", "checkOut")) STORED;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap') THEN
		CREATE EXTENSION IF NOT EXISTS btree_gist;
		ALTER TABLE "Booking" ADD CONSTRAINT bookings_no_overlap EXCLUDE USING gist (
			"roomId" WITH =,
			booking_interval WITH &&
		);
	END IF;
END$$;

CREATE INDEX IF NOT EXISTS "idx_bookings_room_checkin" ON "Booking" ("roomId", "checkIn");
