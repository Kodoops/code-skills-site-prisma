import { NewsletterSubscriptionType} from "@/lib/db/types";
import {prisma} from "@/lib/db/db";

export const getNewsletterList = async ( page: number=1, perPage: number=1 ): Promise<{
    data: NewsletterSubscriptionType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> =>{

    const [data, total] = await Promise.all([
        await prisma.newsletterSubscription.findMany({
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                createdAt: "desc",
            }
        }),
        prisma.newsletterSubscription.count()
    ]);

    return {
        data: data.map(item => ({
            ...item,
            name: item.name ?? "",
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        })),
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage
    }

}
