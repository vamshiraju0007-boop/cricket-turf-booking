import { Resend } from 'resend';

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('RESEND_API_KEY is missing');
        return { error: 'Mail configuration error' };
    }

    const resend = new Resend(apiKey);
    const confirmLink = `${domain}/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Confirm your email',
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
        });
        console.log(`Verification email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send verification email:', error);
        return { error };
    }
};
