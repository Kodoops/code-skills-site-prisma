import "server-only";

import {prisma} from "@/lib/db";
import {CategoryType} from "@/lib/types";

export async function getAllCategories() : Promise<CategoryType[]>  {

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
            id: item.id,
            title: item.title,
            slug: item.slug,
            desc: item.desc,
            color: item.color,
            iconName: item.iconName,
            iconLib: item.iconLib,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        })
    );
    ;
}


export async function getCategories(current: number = 1, nbrPage: number ): Promise<{
    data: CategoryType[],
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
        prisma.course.count(),
    ]);

    const updatedData =  data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        desc: item.desc,
        color: item.color,
        iconName: item.iconName,
        iconLib: item.iconLib,
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
