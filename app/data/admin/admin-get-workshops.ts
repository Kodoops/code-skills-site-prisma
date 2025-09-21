import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {WorkshopType} from "@/lib/types";

export async function adminGetWorkshops( page: number=1, perPage: number=1 ): Promise<{
    data: WorkshopType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.workshop.findMany({
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                description:true,
                duration: true,
                level: true,
                status: true,
                price: true,
                fileKey: true,
                slug: true,
                stripePriceId:true,
                createdAt:true,
                updatedAt:true,
                deletedAt: true,
                promotions: true,
                tags:true,
            }
        }),
        prisma.workshop.count()
    ]);

    const workshops = data.map(workshop => ( {
        ...workshop,
        createdAt: workshop.createdAt.toISOString(),
        updatedAt: workshop.updatedAt.toISOString(),
        deletedAt: workshop.deletedAt ? workshop.deletedAt.toISOString() : null,
    }))
    return {
        data: workshops,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
