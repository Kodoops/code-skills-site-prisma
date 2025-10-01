"use server";

import { prisma } from "@/lib/db/db";
import { ApiResponseType } from "@/lib/db/types";

export const unsubscribeNewsletter = async (email: string): Promise<ApiResponseType> => {
    try {
        const result = await prisma.newsletterSubscription.deleteMany({
            where: { email },
        });

        if (result.count === 0) {
            return {
                status: "error",
                message: "Email not found in subscription list",
            };
        }

        return {
            status: "success",
            message: "Unsubscribed successfully",
        };
    } catch (e) {
        console.error("unsubscribeNewsletter error:", e);
        return {
            status: "error",
            message: "Something went wrong. Please try again later.",
        };
    }
};
