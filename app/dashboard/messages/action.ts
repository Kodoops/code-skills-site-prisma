"use server";

import {ReplyContactMessageSchema} from "@/lib/db/zodSchemas";
import {ApiResponseType} from "@/lib/db/types";
import {prisma} from "@/lib/db/db";
import {revalidatePath} from "next/cache";

export async function replyToContactMessage(values: ReplyContactMessageSchema, path: string): Promise<ApiResponseType> {

    try {

        // TODO::  Send Message

        await prisma.$transaction([
             prisma.contactReply.create({
                data: {
                    response: values.response,
                    adminId: values.adminId ?? null,
                    contactMessageId: values.contactMessageId,
                },
            }),
            prisma.contactMessage.update({
                where: {
                    id: values.contactMessageId
                },
                data: {
                    status: 'answered'
                }
            })
        ]);

        revalidatePath(path)
        return {
            status: 'success',
            message: 'Message replied successfully.'
        }
    } catch {

        return {
            status: 'error',
            message: 'Something went wrong, Failed to reply to contact message.'
        }
    }

}
