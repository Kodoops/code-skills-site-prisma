"use server";

import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {revalidatePath} from "next/cache";
import {contactMessageSchema, ContactMessageSchema} from "@/lib/db/zodSchemas";


export async function createContactMessage(data: ContactMessageSchema): Promise<ApiResponseType> {
    try {
        const validation = contactMessageSchema.safeParse(data);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        // TODO::  Send Message

        await prisma.contactMessage.create({
            data: {
                ...validation.data,
            }
        });

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre message a bien été enregistré ",
        };
    } catch
        (e) {
        console.error(e);
        return {
            status: "error",
            message: "Erreur lors de l'envoi du message",
        };
    }
}


export async function deleteContactMessage(id: string) {
    try {

        await prisma.contactMessage.delete({
            where: {id}
        })

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre message a bien été supprimé ",
        };
    } catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "Erreur lors de la suppression du message",
        };
    }
}

export async function archiveContactMessage(id: string) {
    try {

        await prisma.contactMessage.update({
            where: {id},
            data: {
                status: "closed"
            }
        })

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre message a bien été archivé ",
        };
    } catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "Erreur lors de la archivage du message",
        };
    }
}
