import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(request: Request) {
    let currentStep = 'init';
    try {
        currentStep = 'parsing_json';
        const body = await request.json();

        currentStep = 'validation';
        const validatedData = registerSchema.parse(body);

        currentStep = 'check_existing_user';
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        currentStep = 'hashing_password';
        const passwordHash = await bcrypt.hash(validatedData.password, 10);

        currentStep = 'create_user_db';
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                passwordHash,
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        currentStep = 'generate_token';
        const verificationToken = await generateVerificationToken(validatedData.email);

        currentStep = 'sending_email';
        const emailResult = await sendVerificationEmail(verificationToken.email, verificationToken.token);

        if (emailResult.error) {
            console.error('Email sending failed:', emailResult.error);
        }

        return NextResponse.json(
            {
                message: 'User created successfully. Please check your email to verify.',
                user,
                emailSent: !emailResult.error
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(`Registration error at step [${currentStep}]:`, error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                step: currentStep,
                message: errorMessage
            },
            { status: 500 }
        );
    }
}
