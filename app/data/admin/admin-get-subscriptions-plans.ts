import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {SubscriptionPlanType} from "@/lib/db/types";

export async function adminGetSubscriptionPlans( page: number=1, perPage: number=1 ): Promise<{
    data: SubscriptionPlanType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.subscriptionPlan.findMany({
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                slug: true,
                active:true,
                selected:true,
                currency:true,
                interval:true,
                subscriptions:true,
                options:true,
                stripePriceId:true,
                createdAt:true,
                updatedAt:true,
            }
        }),
        prisma.subscriptionPlan.count()
    ]);

    const plans = data.map(plan => ( {
        ...plan,
        stripePriceId : plan.stripePriceId || "",
        subscriptions: plan.subscriptions.map(s => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
        })),
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
    }))
    return {
        data: plans,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
