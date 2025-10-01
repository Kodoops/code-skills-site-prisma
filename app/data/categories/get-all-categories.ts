import "server-only";

import {prisma} from "@/lib/db/db";
import {SimpleCategory} from "@/lib/db/models";

export async function getAllCategories() : Promise<SimpleCategory[]>  {

    const data = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            slug: true,
            desc: true,
            color: true,
            iconName: true,
            iconLib: true,
            createdAt:true,
            updatedAt:true,
        }
    });

    return data.map(item => ({
            ...item,
            courses:[],
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        })
    );
}


export async function getPaginatedCategories(current: number = 1, nbrPage: number ): Promise<{
    data: SimpleCategory[] ,
    total:number,
    page: number,
    perPage: number,
    totalPages: number,
}> {

    const [data, total] = await Promise.all([
        await prisma.category.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: nbrPage,
            skip: (current - 1) * nbrPage,
            select: {
                id: true,
                title: true,
                slug: true,
                desc: true,
                color: true,
                iconName: true,
                iconLib: true,
                createdAt:true,
                updatedAt:true,
            }
        }),
        prisma.category.count(),
    ]);

    const updatedData =  data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        desc: item.desc,
        color: item.color,
        iconName: item.iconName,
        iconLib: item.iconLib,
        courses:[],
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));

    return {
        data: updatedData,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}

export async function getRandomCategories(limit: number = 6): Promise< string[]> {

    // 1. Récupérer tous les IDs
    const allIds = await prisma.category.findMany({
        select: { id: true },
    });

    if (allIds.length === 0) return [];

    // 2. Mélanger et prendre "limit"
    const shuffled = allIds.sort(() => 0.5 - Math.random()).slice(0, limit);
    const selectedIds = shuffled.map((c) => c.id);

    // 3. Récupérer les catégories correspondantes
    const data = await prisma.category.findMany({
        where: { id: { in: selectedIds } },
        select: {
            id: true,
            title: true,
            // slug: true,
            // desc: true,
            // color: true,
            // iconName: true,
            // iconLib: true,
            // createdAt: true,
            // updatedAt: true,
        },
    });

    // 4. Formatter
    return data.map(item => (item.title))
}
