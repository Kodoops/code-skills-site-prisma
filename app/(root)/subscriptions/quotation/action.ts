"use server";

import { prisma } from "@/lib/db/db";
import { ApiResponseType } from "@/lib/db/types";
import {revalidatePath} from "next/cache";
import {contactQuotationSchema, ContactQuotationSchema} from "@/lib/db/zodSchemas";

export async function createQuotationMessage(data: ContactQuotationSchema): Promise<ApiResponseType> {
    try {

        const validation = contactQuotationSchema.safeParse(data);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }
        // TODO::  Send Message

        await prisma.contactMessage.create({
            data:{
                name: validation.data.company,
                subject: "Demande de devis  pour " + validation.data.employees + " employees",
                email: validation.data.email,
                message: validation.data.message,
                status: "open",
            }
        });

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre demande de devis a bien été enregistré ",
        };
    } catch (e) {
        return {
            status: "error",
            message: "Erreur lors de l'envoi du message",
        };
    }
}
