import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {LearningPathType} from "@/lib/types";
import {getLevels} from "@/app/data/get-levels";
import {notFound} from "next/navigation";

export async function adminGetLearningPaths({
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
    data: LearningPathType[] | null,
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
        where.price = isFree === "true" ? 0 : {gt: 0};
    }

    const [data, totalCount] = await Promise.all([
        await prisma.learningPath.findMany({
            where,
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                smallDescription: true,
                description: true,
                duration: true,
                level: true,
                status: true,
                price: true,
                fileKey: true,
                slug: true,
                stripePriceId: true,
                createdAt: true,
                updatedAt: true,
                promotions: true,
                tags: true,
                promoCodes: true,
                deletedAt: true,
                contents: {
                    select: {
                        course: {
                            where: {
                                deletedAt: null,
                                status: 'Published'
                            },
                            select: {
                                id: true,
                                title: true,
                                smallDescription: true,
                                fileKey: true,
                            }
                        },
                        resource: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                fileKey: true,
                            }
                        },
                        workshop: {
                            where: {
                                deletedAt: null,
                                status: 'Published'
                            },
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                fileKey: true,
                            }
                        }
                    }
                }
            }
        }),
        prisma.learningPath.count()
    ]);

    const paths = data.map(path => ({
        ...path,
        createdAt: path.createdAt.toISOString(),
        updatedAt: path.updatedAt.toISOString(),
    }))
    return {
        data: paths,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
