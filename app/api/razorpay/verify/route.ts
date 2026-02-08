import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import dayjs from 'dayjs';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData,
        } = await request.json();

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Create booking and payment in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Check for overlapping bookings
            const overlapping = await tx.booking.findFirst({
                where: {
                    status: 'CONFIRMED',
                    OR: [
                        {
                            AND: [
                                { startTimeUtc: { lte: new Date(bookingData.startTimeUtc) } },
                                { endTimeUtc: { gt: new Date(bookingData.startTimeUtc) } },
                            ],
                        },
                        {
                            AND: [
                                { startTimeUtc: { lt: new Date(bookingData.endTimeUtc) } },
                                { endTimeUtc: { gte: new Date(bookingData.endTimeUtc) } },
                            ],
                        },
                    ],
                },
            });

            if (overlapping) {
                throw new Error('Slot already booked');
            }

            // Create booking
            const booking = await tx.booking.create({
                data: {
                    userId: session.user.id,
                    date: new Date(bookingData.date),
                    startTimeUtc: new Date(bookingData.startTimeUtc),
                    endTimeUtc: new Date(bookingData.endTimeUtc),
                    slotsCount: bookingData.slotsCount,
                    amountPaise: bookingData.amountPaise,
                    status: 'CONFIRMED',
                },
            });

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    bookingId: booking.id,
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    amountPaise: bookingData.amountPaise,
                    status: 'PAID',
                },
            });

            return { booking, payment };
        });

        return NextResponse.json({
            success: true,
            booking: result.booking,
        });
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: error.message || 'Payment verification failed' },
            { status: 500 }
        );
    }
}
