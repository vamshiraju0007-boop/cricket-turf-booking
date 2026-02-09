import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Clean whitespace from DATABASE_URL if it exists
const databaseUrl = process.env.DATABASE_URL?.replace(/\s/g, '');

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
