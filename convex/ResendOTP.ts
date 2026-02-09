import { Email } from "@convex-dev/auth/providers/Email";

// Generate a random numeric OTP using Web Crypto API (available in default Convex runtime)
function generateOTP(length: number): string {
  const digits = "0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => digits[b % digits.length]).join("");
}

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateOTP(8);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    // Call the Resend REST API directly via fetch (no Node.js deps needed)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PantryFy <noreply@amori.info>",
        to: [email],
        subject: "Your PantryFy sign-in code",
        text: `Your verification code is: ${token}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error (${response.status}): ${error}`);
    }
  },
});
