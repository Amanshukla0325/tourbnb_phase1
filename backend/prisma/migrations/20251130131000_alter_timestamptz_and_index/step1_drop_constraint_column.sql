DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap') THEN
        ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS bookings_no_overlap;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Booking' AND column_name='booking_interval') THEN
        ALTER TABLE "Booking" DROP COLUMN booking_interval;
    END IF;
END$$;
