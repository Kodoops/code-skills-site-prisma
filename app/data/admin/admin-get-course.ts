import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import {CourseType} from "@/lib/types";


export async function adminGetCourse(id: string) : Promise<CourseType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.course.findUnique({
        where: {
            id: id,
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
            promotions: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            color: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            },
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
            },
            prerequisites: {
                select: {
                    prerequisite:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
            objectives: {
                select: {
                    objective:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
        }
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
        category:{
            ...data.category,
            createdAt: data.category.createdAt.toISOString(),
            updatedAt: data.category.updatedAt.toISOString(),
        },
        tags: data.tags.map(tag=>({
            ...tag,
        })),
        chapters: data.chapters.map(chapter=>({
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
    };
}

