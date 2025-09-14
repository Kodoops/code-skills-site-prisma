import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {CourseType} from "@/lib/types";

export async function adminGetCourses( page: number=1, perPage: number=1 ): Promise<{
    data: CourseType[] | null,
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
                createdAt:true,
                updatedAt:true,
                category:true,
                coursePromotion: true,
                tags:true,
                chapters:{
                    select:{
                        id: true,
                        title: true,
                        courseId: true,
                        position: true,
                        createdAt : true,
                        updatedAt : true,
                        lessons: {
                            select:{
                                id: true,
                                title: true,
                                description: true,
                                position: true,
                                thumbnailKey: true,
                                videoKey: true,
                                public: true,
                                chapterId: true,
                                duration: true,
                                lessonProgress: true,
                                createdAt:true,
                                updatedAt:true,
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
        category:{
            ...course.category,
            createdAt: course.category.createdAt.toISOString(),
            updatedAt: course.category.updatedAt.toISOString(),
        },
        tags: course.tags.map(tag=>({
            ...tag,
            createdAt: tag.createdAt.toISOString(),
            updatedAt: tag.updatedAt.toISOString()
        })),
        chapters: course.chapters.map(chapter=>({
            ...chapter,
            createdAt: chapter.createdAt.toISOString(),
            updatedAt: chapter.updatedAt.toISOString(),
            lessons: chapter.lessons.map(lesson=>({
                ...lesson,
                description: lesson.description ?? '',
                thumbnailKey: lesson.thumbnailKey ?? '',
                videoKey: lesson.videoKey ?? '',
                createdAt: lesson.createdAt.toISOString(),
                updatedAt: lesson.updatedAt.toISOString(),
                lessonProgress: lesson.lessonProgress.map(lp => ({
                    ...lp,
                })),
            }))
        }))
    }))
    return {
        data: courses,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
