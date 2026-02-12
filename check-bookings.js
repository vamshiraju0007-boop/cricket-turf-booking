
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const bookings = await prisma.booking.findMany({});
        console.log(`Found ${bookings.length} bookings.`);
        if (bookings.length > 0) {
            console.log("Sample booking:", bookings[0]);
            const { count } = await prisma.booking.deleteMany({});
            console.log(`Deleted ${count} bookings.`);
        } else {
            console.log("No bookings found. Slots should be empty.");
        }
    } catch (e) {
        console.error('Error accessing database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
