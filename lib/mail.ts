import { Resend } from 'resend';

const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {
    const apiKey = process.env.RESEND_API_KEY;
    const confirmLink = `${domain}/verify-email?token=${token}`;

    if (!apiKey) {
        console.log("\n==================================================================");
        console.log("💌 [DEV MODE] Resend API Key Missing. Logging email instead.");
        console.log(`To: ${email}`);
        console.log(`Link: ${confirmLink}`);
        console.log("==================================================================\n");
        return { success: true, data: "Logged to console" };
    }

    const resend = new Resend(apiKey);

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, // Valid only if this email is verified in Resend (Free Tier limitation)
            subject: 'Confirm your Cricket Turf Account',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify your email address</h2>
                    <p>Click the button below to confirm your email address and complete your registration.</p>
                    <a href="${confirmLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
                    <p style="margin-top: 24px; color: #666; font-size: 14px;">Or copy this link: <br><a href="${confirmLink}">${confirmLink}</a></p>
                </div>
            `
        });

        console.log(`Verification email sent to ${email}`, data);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send verification email with Resend:', error);

        // Fallback to console log on error (e.g., if domain not verified)
        console.log("\n==================================================================");
        console.log("⚠ [FALLBACK] Email sending failed. Logging link for development:");
        console.log(`To: ${email}`);
        console.log(`Link: ${confirmLink}`);
        console.log("==================================================================\n");

        return { error };
    }
};
