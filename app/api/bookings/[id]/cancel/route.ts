import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canCancelBooking } from '@/lib/booking-utils';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (booking.status !== 'CONFIRMED') {
            return NextResponse.json(
                { error: 'Booking cannot be cancelled' },
                { status: 400 }
            );
        }

        if (!canCancelBooking(booking.startTimeUtc)) {
            return NextResponse.json(
                { error: 'Cannot cancel booking less than 2 hours before start time' },
                { status: 400 }
            );
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: params.id },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({ booking: updatedBooking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
