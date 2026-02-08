import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json(
                { error: 'Date parameter is required' },
                { status: 400 }
            );
        }

        const date = new Date(dateParam);
        const startOfDay = dayjs(date).tz('Asia/Kolkata').startOf('day').utc().toDate();
        const endOfNextDay = dayjs(date).tz('Asia/Kolkata').add(2, 'day').startOf('day').utc().toDate();

        // Get all confirmed bookings for the date range
        const bookings = await prisma.booking.findMany({
            where: {
                status: 'CONFIRMED',
                startTimeUtc: {
                    gte: startOfDay,
                    lt: endOfNextDay,
                },
            },
            select: {
                startTimeUtc: true,
                endTimeUtc: true,
            },
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching slots:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
