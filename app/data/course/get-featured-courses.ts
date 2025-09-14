import "server-only";
import { prisma } from "@/lib/db";
import {CourseType} from "@/lib/types";

export async function getFeaturedCourses(nbrOfCourses: number = 6) : Promise<CourseType[]>{

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
        },
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
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: nbrOfCourses,
    });

    return data.map(course => ( {
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
}
