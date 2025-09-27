import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {TagType} from "@/lib/db/types";

export async function adminGetTags(current: number = 1, nbrPage: number):
    Promise<{
        data: TagType[] | null,
        page: number,
        total: number,
        perPage: number,
        totalPages: number
    }> {

    await requireAdmin();

    const [data, total] = await Promise.all([
        await prisma.tag.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: nbrPage,
            skip: (current - 1) * nbrPage,
            select: {
                id: true,
                title: true,
                slug: true,
                color: true,
                createdAt: true,
                updatedAt: true,
                courseTags:true,
                learningPathTags:true,
                workshopTags:true,
            }
        }),
        prisma.course.count(),
    ]);

    const  tags= data.map(tag => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
    }))
    return {
        data: tags,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}


export async function adminGetAllTags(): Promise<TagType[] | null> {

    await requireAdmin();

    const data = await prisma.tag.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            slug: true,
            color: true,
            createdAt:true,
            updatedAt:true,
            courseTags:true,
            learningPathTags:true,
            workshopTags:true,
        }
    })

    if (!data) return null;

    return data.map(tag=>({
       ...tag,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString(),
    }));
}
