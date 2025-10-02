"use server";

import { prisma } from "@/lib/db/db";
import { ApiResponseType } from "@/lib/db/types";
import {revalidatePath} from "next/cache";

export async function createContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): Promise<ApiResponseType> {
    try {

        // TODO::  Send Message

        await prisma.contactMessage.create({
            data,
        });

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre message a bien été enregistré ",
        };
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Erreur lors de l'envoi du message",
        };
    }
}


export async function deleteContactMessage(id:string) {
    try {

        await prisma.contactMessage.delete({
            where: {id}
        })

        revalidatePath("/dashboard/messages");

        return {
            status: "success",
            message: "Votre message a bien été supprimé ",
        };
    }catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "Erreur lors de la suppression du message",
        };
    }
}

export async function archiveContactMessage(id:string) {
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
    }catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "Erreur lors de la archivage du message",
        };
    }
}
