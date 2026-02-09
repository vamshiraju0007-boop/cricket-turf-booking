import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://neondb_owner:npg_GPvCl0jFi4ta@ep-aged-bird-aie6hjpo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
            }
        }
    });

    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected!');

        console.log('Checking User table...');
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);

        console.log('Database verification successful! Tables are present.');
    } catch (error) {
        console.error('Database verification failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
