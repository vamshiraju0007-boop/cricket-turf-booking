import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = body;

        const existingToken = await prisma.verificationToken.findFirst({
            where: { token }
        });

        if (!existingToken) {
            return NextResponse.json({ error: "Token does not exist!" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: { email: existingToken.email }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "Email does not exist!" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email, // Standard to update email if it was a change request, harmless here
            }
        });

        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        });

        return NextResponse.json({ success: "Email verified!" });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}
