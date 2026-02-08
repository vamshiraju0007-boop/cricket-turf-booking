-- Cricket Turf Booking Database Schema
-- Run this in Supabase SQL Editor

-- Create enums
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PAID', 'FAILED');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Booking table
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTimeUtc" TIMESTAMP(3) NOT NULL,
    "endTimeUtc" TIMESTAMP(3) NOT NULL,
    "slotsCount" INTEGER NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- Create Payment table
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'razorpay',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Booking_no_overlap" ON "Booking"("startTimeUtc", "endTimeUtc", "status");
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- Create indexes for performance
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");
CREATE INDEX "Booking_date_idx" ON "Booking"("date");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Payment_razorpayOrderId_idx" ON "Payment"("razorpayOrderId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- Add foreign key constraints
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert test users (with bcrypt hashed passwords)
-- Owner: owner@turf.com / Owner@1234
-- User: user@example.com / User@1234
INSERT INTO "User" ("id", "name", "email", "phone", "passwordHash", "role", "createdAt", "updatedAt")
VALUES 
    ('owner_' || gen_random_uuid()::text, 'Turf Owner', 'owner@turf.com', '+91 98765 43210', '$2a$10$YourHashedPasswordHere1', 'OWNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('user_' || gen_random_uuid()::text, 'Sample User', 'user@example.com', '+91 98765 43211', '$2a$10$YourHashedPasswordHere2', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Note: The passwords above need to be properly hashed. 
-- You'll need to run the seed script to get properly hashed passwords.
