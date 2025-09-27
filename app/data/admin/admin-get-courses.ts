import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {SimpleCourse} from "@/lib/db/models";

export async function adminGetCourses( page: number=1, perPage: number=1 ): Promise<{
    data: SimpleCourse[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.course.findMany({
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
                category:true,
                promotions: true,
                tags:true,
            }
        }),
        prisma.course.count()
    ]);

    const courses = data.map(course => ( {
        ...course,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        category:{
            ...course.category,
            createdAt: course.category.createdAt.toISOString(),
            updatedAt: course.category.updatedAt.toISOString(),
        },

    }))
    return {
        data: courses,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
