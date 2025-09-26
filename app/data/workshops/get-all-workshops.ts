import { prisma } from "@/lib/db";
import {notFound} from "next/navigation";
import { getLevels } from "../get-levels";
import { WorkshopType} from "@/lib/types";

export async function getAllWorkshops({
                                        level,
                                        isFree,
                                        page = 1,
                                        perPage = 9,
                                    }: {
    level?: string;
    isFree?: string;
    page?: number;
    perPage?: number;
}): Promise<{
    data: WorkshopType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    const levels = await getLevels();

    const where: any = {
        status: "Published",
        deletedAt: null,
    };



    if (level && level !== "all") {
        where.level = level;
    }

    if (level && level !== "all" && !levels.includes(level as any)) {
       return notFound();
    }

    if (isFree && isFree !== "all") {
        where.price = isFree === "true" ? 0 : { gt: 0 };
    }

    const [data, total] = await Promise.all([
        prisma.workshop.findMany({
            where,
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                description:true,
                duration: true,
                level: true,
                status: true,
                price: true,
                fileKey: true,
                statement:true,
                statementVideoKey:true,
                statementsStartFileKey:true,
                statementsStartFileUrl:true,
                solution:true,
                solutionVideoKey:true,
                solutionFileKey:true,
                solutionFileUrl:true,
                slug: true,
                createdAt:true,
                updatedAt:true,
                promotions: true,
                tags:true,
            }
        }),
        prisma.workshop.count({ where }),
    ]);

    const workshops = data.map(workshop => ( {
        ...workshop,
        createdAt: workshop.createdAt.toISOString(),
        updatedAt: workshop.updatedAt.toISOString(),
        tags: workshop.tags.map(tag=>({
            ...tag,
        })),

    }))

    return {
        data: workshops,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage
    };
}

