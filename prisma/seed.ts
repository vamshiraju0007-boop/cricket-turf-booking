import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create OWNER user
    const ownerPassword = await bcrypt.hash('Owner@1234', 10);
    const owner = await prisma.user.upsert({
        where: { email: 'owner@turf.com' },
        update: {},
        create: {
            email: 'owner@turf.com',
            name: 'Turf Owner',
            phone: '+919876543210',
            passwordHash: ownerPassword,
            role: 'OWNER',
        },
    });
    console.log('✅ Created OWNER user:', owner.email);

    // Create sample USER
    const userPassword = await bcrypt.hash('User@1234', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Sample User',
            phone: '+919123456789',
            passwordHash: userPassword,
            role: 'USER',
        },
    });
    console.log('✅ Created sample USER:', user.email);

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
