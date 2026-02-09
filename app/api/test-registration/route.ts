import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        tests: {}
    };

    // Test 1: Environment variables
    try {
        results.tests.env = {
            RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
            DATABASE_URL: process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 15)}...` : 'MISSING',
        };
    } catch (error: any) {
        results.tests.env = { error: error.message };
    }

    // Test 2: Bcrypt
    try {
        const hash = await bcrypt.hash('TestPassword123', 10);
        results.tests.bcrypt = { status: 'OK', hashLength: hash.length };
    } catch (error: any) {
        results.tests.bcrypt = { status: 'FAILED', error: error.message };
    }

    // Test 3: UUID
    try {
        const token = uuidv4();
        results.tests.uuid = { status: 'OK', sample: token };
    } catch (error: any) {
        results.tests.uuid = { status: 'FAILED', error: error.message };
    }

    // Test 4: Database connection
    try {
        await prisma.$connect();
        results.tests.database = { status: 'CONNECTED' };
    } catch (error: any) {
        results.tests.database = { status: 'FAILED', error: error.message };
    }

    // Test 5: Database query
    try {
        const userCount = await prisma.user.count();
        results.tests.databaseQuery = { status: 'OK', userCount };
    } catch (error: any) {
        results.tests.databaseQuery = { status: 'FAILED', error: error.message };
    }

    // Test 6: VerificationToken table
    try {
        const tokenCount = await prisma.verificationToken.count();
        results.tests.verificationTokenTable = { status: 'OK', tokenCount };
    } catch (error: any) {
        results.tests.verificationTokenTable = { status: 'FAILED', error: error.message };
    }

    // Test 7: Full Mock Registration Flow
    try {
        const testEmail = `test-${Date.now()}@example.com`;
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: testEmail,
                passwordHash: 'fake-hash',
            }
        });
        const testToken = await generateVerificationToken(testEmail);

        // Cleanup
        await prisma.verificationToken.delete({ where: { id: testToken.id } });
        await prisma.user.delete({ where: { id: testUser.id } });

        results.tests.mockRegistration = { status: 'SUCCESS', email: testEmail };
    } catch (error: any) {
        results.tests.mockRegistration = { status: 'FAILED', error: error.message };
    }

    // Test 8: Real Email Service Test (Simulated)
    try {
        const testResult = await sendVerificationEmail('test@example.com', 'test-token');
        results.tests.emailService = {
            status: testResult.error ? 'FAILED_CLIENT_ERROR' : 'OK_OR_LOGGED',
            details: testResult.error || 'Check server logs for Resend output'
        };
    } catch (error: any) {
        results.tests.emailService = { status: 'CRASHED', error: error.message };
    }

    return NextResponse.json(results, { status: 200 });
}
