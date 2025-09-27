"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/db/types";
import {
    featureSchema, FeatureSchema,
} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";

const aj = arcjet

    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateFeature(data: FeatureSchema, featureId: string): Promise<ApiResponseType> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

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

        const result = featureSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.feature.update({
            where: {
                id: featureId,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Feature updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update feature"
        }
    }
}
