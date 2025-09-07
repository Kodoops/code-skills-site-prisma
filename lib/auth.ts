
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {prisma} from "@/lib/db";
import {env} from "./env";
import {emailOTP} from "better-auth/plugins/email-otp";
import {resend} from "@/lib/resend";
import { admin } from "better-auth/plugins"


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders:{
        github:{
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
        }
    },

    plugins: [
        emailOTP({
            async sendVerificationOTP(email) {
                await resend.emails.send({
                    from: 'LMS Code Skills <onboarding@resend.dev>',
                    to: [email.email],
                    subject: 'Code&Skills LMS - Vérify your email',
                   // react: EmailTemplate({ firstName: 'John' }),
                    html:`<p>Your OTP is <strong>${email.otp}</strong></p>`
                });
            },
        }),
        admin()
    ]
});
