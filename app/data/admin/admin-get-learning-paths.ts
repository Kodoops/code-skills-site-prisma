import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {LearningPathType} from "@/lib/types";

export async function adminGetLearningPaths( page: number=1, perPage: number=1 ): Promise<{
    data: LearningPathType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.learningPath.findMany({
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                smallDescription: true,
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
                promotions: true,
                tags:true,
                contents:{
                    select:{
                        course:{
                            select:{
                                id:true,
                                title:true,
                                smallDescription:true,
                            }
                        },
                        resource:{
                            select:{
                                id:true,
                                title:true,
                                description: true
                            }
                        },
                        workshop:{
                            select:{
                                id:true,
                                title:true,
                                description: true
                            }
                        }
                    }
                }
            }
        }),
        prisma.course.count()
    ]);

    const courses = data.map(course => ( {
        ...course,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
    }))
    return {
        data: courses,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
