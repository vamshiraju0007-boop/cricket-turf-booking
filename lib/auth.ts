import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                isAutoLogin: { label: 'isAutoLogin', type: 'hidden' },
            },
            async authorize(credentials) {
                if (!credentials?.email) {
                    throw new Error('Email is required');
                }

                // Handle Auto-Login after verification
                if (credentials.isAutoLogin === "true") {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user || !user.emailVerified) {
                        throw new Error('Invalid auto-login attempt');
                    }

                    // Only allow auto-login if verified in the last 5 minutes
                    const verifiedAt = new Date(user.emailVerified).getTime();
                    const now = new Date().getTime();
                    const diffMinutes = (now - verifiedAt) / (1000 * 60);

                    if (diffMinutes > 5) {
                        throw new Error('Auto-login window expired. Please sign in normally.');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                }

                if (!credentials?.password) {
                    throw new Error('Password is required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                if (!user.emailVerified) {
                    throw new Error('Email not verified. Please check your inbox.');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
