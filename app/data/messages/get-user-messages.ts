"use server";

import {prisma} from "@/lib/db/db";
import {ContactMessageType} from "@/lib/db/types";

export async function getUserMessages(id: string,page: number = 1, perPage: number ): Promise<{
    data: ContactMessageType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {
    const [data, total] = await Promise.all([
    await prisma.contactMessage.findMany(
        {
            where: {
                userId: id,
            },
            orderBy:{
                updatedAt:"desc"
            },
            take: perPage,
            skip: (page - 1) * perPage,
            select: {
                id: true,
                name: true,
                email: true,
                subject: true,
                status: true,
                message: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                replies: {
                    select:{
                        id: true,
                        contactMessageId: true,
                        contactMessage: true,
                        adminId: true,
                        response: true,
                        createdAt: true,
                    }
                },
            }
        }
    ),
        prisma.contactMessage.count({where: {userId: id}}),
    ]);

    const messages = data.map(message => ( {
        ...message,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        replies: message.replies.map(reply => ({
            ...reply,
            createdAt: reply.createdAt.toISOString(),
        }))
    }))

    return {
        data:messages,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage
    };
}
