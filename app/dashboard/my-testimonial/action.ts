"use server";

import {prisma} from "@/lib/db/db";
import {fixedWindow, request} from "@arcjet/next";
import {testimonialFormSchema, TestimonialFormSchema} from "@/lib/db/zodSchemas";
import {ApiResponseType} from "@/lib/db/types";
import arcjet from "@/lib/providers/arcjet";
import {requireUser} from "@/app/data/user/require-user";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createOrUpdateTestimonial(values: TestimonialFormSchema): Promise<ApiResponseType> {

    const session = await requireUser();

    const validation = testimonialFormSchema.safeParse(values);

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session.id as string});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            } else {
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.testimonial.upsert({
            where: { userId: session.id },
            create: {
                rating: validation.data.rating,
                text: validation.data.text,
                userId:session.id,
            },
            update: {
                rating:validation.data.rating,
                text: validation.data.text,
                userId:session.id,
                updatedAt: new Date(),
            },
        });

        return {
            status: "success",
            message: "Testimonial  updated successfully"
        }
    } catch (e) {
        return {
            status: "error",
            message: "Failed to update testimonial"
        }
    }
}

