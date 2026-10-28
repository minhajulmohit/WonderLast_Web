import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("wanderlast-users");

export const auth = betterAuth({
  user: {
    additionalFields: {
      nationality: { type: "string", required: false, input: true },
      location: { type: "string", required: false, input: true },
      phone: { type: "string", required: false, input: true },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const from = "Wanderlast <onboarding@resend.dev>";

      if (!apiKey) {
        throw new Error(
          "Password reset email is not configured. Set RESEND_API_KEY.",
        );
      }

      const safeName = user.name.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[character] ?? character;
      });

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: "Reset your Wanderlast password",
          html: `<p>Hi ${safeName},</p><p>We received a request to reset your Wanderlast password.</p><p><a href="${url}">Reset your password</a></p><p>If you didn't request this, you can ignore this email.</p>`,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Could not send password reset email: ${error || response.statusText}`,
        );
      }
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [jwt()],

  session: {
    cookieCache: { strategy: "jwt", enabled: true, maxAge: 7 * 24 * 60 * 60 },
  },
});
