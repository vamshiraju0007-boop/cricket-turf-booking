import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const IST_TIMEZONE = 'Asia/Kolkata';

export interface TimeSlot {
    hour: number; // 0-23 in IST
    label: string; // "7:00 AM"
    pricePerHour: number; // in paise
    startTimeUtc: Date;
    endTimeUtc: Date;
    isBooked: boolean;
}

export interface BookingSlot {
    startHour: number;
    endHour: number;
    pricePerHour: number;
}

/**
 * Get price for a given hour (0-23 in IST)
 * 7 AM (7) to 10 PM (22) => ₹1500 (150000 paise)
 * 10 PM (22) to 2 AM (2) => ₹1600 (160000 paise)
 */
export function getPriceForHour(hour: number): number {
    // Late night: 22 (10 PM) to 23 (11 PM) and 0 (12 AM) to 1 (1 AM)
    if (hour >= 22 || hour <= 1) {
        return 160000; // ₹1600 in paise
    }
    // Regular hours: 7 AM to 9 PM
    return 150000; // ₹1500 in paise
}

/**
 * Format price in paise to rupees string
 */
export function formatPrice(paise: number): string {
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

/**
 * Generate all available time slots for a given date
 * Operating hours: 7:00 AM to 2:00 AM (next day)
 */
export function generateTimeSlots(
    date: Date,
    bookedSlots: { startTimeUtc: Date; endTimeUtc: Date }[] = []
): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const selectedDate = dayjs(date).tz(IST_TIMEZONE).startOf('day');

    // Generate slots from 7 AM to 11 PM (same day)
    for (let hour = 7; hour < 24; hour++) {
        const startTime = selectedDate.hour(hour).minute(0).second(0);
        const endTime = startTime.add(1, 'hour');

        const isBooked = bookedSlots.some((booked) => {
            const bookedStart = dayjs(booked.startTimeUtc);
            const bookedEnd = dayjs(booked.endTimeUtc);
            return startTime.isBefore(bookedEnd) && endTime.isAfter(bookedStart);
        });

        slots.push({
            hour,
            label: startTime.format('h:00 A'),
            pricePerHour: getPriceForHour(hour),
            startTimeUtc: startTime.utc().toDate(),
            endTimeUtc: endTime.utc().toDate(),
            isBooked,
        });
    }

    // Generate slots from 12 AM to 2 AM (next day)
    const nextDay = selectedDate.add(1, 'day');
    for (let hour = 0; hour < 2; hour++) {
        const startTime = nextDay.hour(hour).minute(0).second(0);
        const endTime = startTime.add(1, 'hour');

        const isBooked = bookedSlots.some((booked) => {
            const bookedStart = dayjs(booked.startTimeUtc);
            const bookedEnd = dayjs(booked.endTimeUtc);
            return startTime.isBefore(bookedEnd) && endTime.isAfter(bookedStart);
        });

        slots.push({
            hour,
            label: startTime.format('h:00 A'),
            pricePerHour: getPriceForHour(hour),
            startTimeUtc: startTime.utc().toDate(),
            endTimeUtc: endTime.utc().toDate(),
            isBooked,
        });
    }

    return slots;
}

/**
 * Calculate total amount for selected slots
 */
export function calculateTotalAmount(slots: TimeSlot[]): number {
    return slots.reduce((total, slot) => total + slot.pricePerHour, 0);
}

/**
 * Check if a booking can be cancelled (must be >2 hours before start time)
 */
export function canCancelBooking(startTimeUtc: Date): boolean {
    const now = dayjs().utc();
    const startTime = dayjs(startTimeUtc).utc();
    const hoursDifference = startTime.diff(now, 'hour', true);
    return hoursDifference > 2;
}

/**
 * Format date for display in IST
 */
export function formatDate(date: Date, format: string = 'DD MMM YYYY'): string {
    return dayjs(date).tz(IST_TIMEZONE).format(format);
}

/**
 * Format time for display in IST
 */
export function formatTime(date: Date, format: string = 'h:mm A'): string {
    return dayjs(date).tz(IST_TIMEZONE).format(format);
}
