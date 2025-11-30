-- Create index on availability for (roomId, startTime)
CREATE INDEX IF NOT EXISTS "idx_availability_room_start" ON "Availability" ("roomId", "startTime");
