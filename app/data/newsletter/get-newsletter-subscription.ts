import {NewsletterSubscriptionType} from "@/lib/db/types";
import {prisma} from "@/lib/db/db";

export const getNewsletterSubscription = async (email: string): Promise<NewsletterSubscriptionType | null> => {

    const item = await prisma.newsletterSubscription.findUnique({
        where: {
            email
        }
    })

    if (!item) return null;

    return {
        ...item,
        name: item?.name ?? "",
        createdAt: item?.createdAt.toISOString(),
        updatedAt: item?.updatedAt.toISOString(),
    }

}
