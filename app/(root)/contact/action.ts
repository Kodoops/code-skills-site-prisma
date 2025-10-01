"use server";

import { prisma } from "@/lib/db/db";
import { ApiResponseType } from "@/lib/db/types";

export async function createContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): Promise<ApiResponseType> {
    try {
        await prisma.contactMessage.create({
            data,
        });

        return {
            status: "success",
            message: "Votre message a bien été enregistré ✅",
        };
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Erreur lors de l'envoi du message",
        };
    }
}
