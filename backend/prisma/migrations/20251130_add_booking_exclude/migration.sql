-- Add btree_gist extension if not exists
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add generated tsrange column booking_interval if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='Booking' AND column_name='booking_interval'
    ) THEN
        ALTER TABLE "Booking" ADD COLUMN booking_interval tsrange GENERATED ALWAYS AS (tsrange("checkIn", "checkOut")) STORED;
    END IF;
END$$;

-- Add EXCLUDE constraint to prevent overlapping bookings for the same room_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap'
    ) THEN
        ALTER TABLE "Booking" ADD CONSTRAINT bookings_no_overlap EXCLUDE USING gist (
                "roomId" WITH =,
                booking_interval WITH &&
            );
    END IF;
END$$;
