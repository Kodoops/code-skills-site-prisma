import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {ResourceType} from "@/lib/types";

export async function adminGetResources( page: number=1, perPage: number=1 ): Promise<{
    data: ResourceType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.resource.findMany({
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                description:true,
                fileKey: true,
                createdAt:true,
                type:true,
            }
        }),
        prisma.resource.count()
    ]);

    const resources = data.map(resource => ( {
        ...resource,
        courseResources: [],
        lessonResources: [],
        workshopResources: [],
        learningPathResources: [],
        createdAt: resource.createdAt.toISOString(),
    }))
    return {
        data: resources,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
