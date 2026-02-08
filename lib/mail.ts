import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {
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
