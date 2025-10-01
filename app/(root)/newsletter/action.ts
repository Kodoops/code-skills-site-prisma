"use server";

import { prisma } from "@/lib/db/db";
import { z } from "zod";
import { ApiResponseType } from "@/lib/db/types";
import {newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";

export async function subscribeToNewsletter(values: NewsletterSchema): Promise<ApiResponseType> {
    const parsed = newsletterSchema.safeParse(values);

    if (!parsed.success) {
        return { status: "error", message: "Email invalide" };
    }

    try {
        const existing = await prisma.newsletterSubscription.findUnique({
            where: { email: parsed.data.email },
        });

        if (existing) {
            return { status: "error", message: "Cet email est déjà inscrit." };
        }

        console.log(parsed.data)
        await prisma.newsletterSubscription.create({
            data: { ...parsed.data},
        });

        return { status: "success", message: "Inscription réussie !" };
    } catch (e) {
        return { status: "error", message: "Erreur lors de l'inscription." };
    }
}
