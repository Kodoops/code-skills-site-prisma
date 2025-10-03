import {prisma} from "@/lib/db/db";

export async function adminGetSubscriptionPlan(id:string) {

    const data = await prisma.subscriptionPlan.findUnique({
        where:{
            id: id,
        },
        select:{
            id:true,
            title:true,
            slug:true,
            description:true,
            price:true,
            interval:true,
            currency:true,
            active:true,
            selected: true,
            stripePriceId:true,
            createdAt:true,
            updatedAt:true,
            options:true,
        }
    });

    if (!data) return null;

    return {
        ...data,
        stripePriceId : data.stripePriceId ?? "",
        subscriptions:  [],
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
    }
}
