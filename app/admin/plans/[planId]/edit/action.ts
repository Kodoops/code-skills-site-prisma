"use server";

import { subscriptionPlanSchema, SubscriptionPlanSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";
import {stripe} from "@/lib/providers/stripe";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateSubscriptionPlan(id:string, values: SubscriptionPlanSchema): Promise<ApiResponseType> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            }else{
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const validation = subscriptionPlanSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.subscriptionPlan.update({
            where:{
                id: id,
            },
            data: {
                title: validation.data.title,
                slug: validation.data.slug,
                description: validation.data.description,
                price: validation.data.price,
                active:validation.data.active,
                selected: validation.data.selected,
                currency: validation.data.currency,
                interval: validation.data.interval,
                updatedAt: new Date(),
            }
        });

        return {
            status: "success",
            message: "Subscription Plan created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create subscription plan"
        };
    }

}
