import { prisma } from "@/lib/db/db";
import {notFound} from "next/navigation";
import { getLevels } from "../get-levels";
import {CourseType} from "@/lib/db/types";

export async function getAllCourses({
                                        categorySlug,
                                        level,
                                        isFree,
                                        page = 1,
                                        perPage = 9,
                                    }: {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page?: number;
    perPage?: number;
}): Promise<{
    data: CourseType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    const levels = await getLevels();

    const where: any = {
        status: "Published",
        deletedAt: null,
    };

    if (categorySlug) {
        where.category = {
            //isNot: null,
            slug: categorySlug,
        };
    }

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
        prisma.course.findMany({
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
        prisma.course.count({ where }),
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
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage
    };
}

