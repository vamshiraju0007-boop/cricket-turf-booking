import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate, formatTime, formatPrice } from '@/lib/booking-utils';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const status = searchParams.get('status');

        const where: any = {};

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        if (status && status !== 'ALL') {
            where.status = status;
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Generate CSV
        const headers = [
            'Booking ID',
            'User Name',
            'User Email',
            'User Phone',
            'Date',
            'Start Time',
            'End Time',
            'Slots',
            'Amount',
            'Status',
            'Payment Status',
            'Razorpay Payment ID',
            'Created At',
        ];

        const rows = bookings.map((booking) => [
            booking.id,
            booking.user.name,
            booking.user.email,
            booking.user.phone || 'N/A',
            formatDate(new Date(booking.date)),
            formatTime(new Date(booking.startTimeUtc)),
            formatTime(new Date(booking.endTimeUtc)),
            booking.slotsCount.toString(),
            formatPrice(booking.amountPaise),
            booking.status,
            booking.payment?.status || 'N/A',
            booking.payment?.razorpayPaymentId || 'N/A',
            formatDate(new Date(booking.createdAt), 'DD MMM YYYY HH:mm'),
        ]);

        const csv = [
            headers.join(','),
            ...rows.map((row) =>
                row.map((cell) => `"${cell}"`).join(',')
            ),
        ].join('\n');

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="bookings_${Date.now()}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error exporting bookings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
