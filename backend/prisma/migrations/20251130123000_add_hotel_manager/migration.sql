-- Migration for add_hotel_manager
-- SQL generated from prisma migrate diff (from-empty) 

-- (content copied from the previous migration.sql) 
-- To be applied: create HotelManager table and related indices & constraints

-- CreateTable
CREATE TABLE "HotelManager" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotelManager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HotelManager" ADD CONSTRAINT "HotelManager_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelManager" ADD CONSTRAINT "HotelManager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Indexes and constraints are handled earlier in other migrations
