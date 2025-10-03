"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {revalidatePath} from "next/cache";
import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {stripe} from "@/lib/providers/stripe";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteSubscriptionPlan(planId: string): Promise<ApiResponseType> {

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

        const plan = await prisma.subscriptionPlan.findUnique({
            where: {
                id: planId
            }
        });

        if (!plan) return {
            status: "error",
            message: "Subscription plan not found"
        }

        if (plan.stripePriceId) {
            const price = await stripe.prices.retrieve(plan.stripePriceId!);
            // Désactivation du produit associé
            await stripe.products.update(price.product as string, { active: false });
            // Désactivation du prix
            await stripe.prices.update(plan.stripePriceId!, { active: false });
        }

        await prisma.subscriptionPlan.delete({
            where: {
                id: planId
            },
        })

        revalidatePath(`/admin/plans`)

        return {
            status: "success",
            message: "Subscription plan deleted successfully"
        }
    } catch (e) {
        return {
            status: "error",
            message: "Failed to delete subscription plan"
        }
    }

}
