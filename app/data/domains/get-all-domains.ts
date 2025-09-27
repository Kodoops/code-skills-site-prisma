import "server-only";

import {prisma} from "@/lib/db/db";
import { DomainType} from "@/lib/db/types";

export async function getAllDomains() : Promise<DomainType[]>  {

    const data = await prisma.domain.findMany({
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
            categories:[],
        })
    );
    ;
}


export async function getPaginatedDomains(current: number = 1, nbrPage: number ): Promise<{
    data: DomainType[],
    total:number,
    page: number,
    perPage: number,
    totalPages: number,
}> {

    const [data, total] = await Promise.all([
        await prisma.domain.findMany({
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
        prisma.domain.count(),
    ]);

    const updatedData =  data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        desc: item.desc,
        color: item.color,
        iconName: item.iconName,
        iconLib: item.iconLib,
        categories:[],
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
