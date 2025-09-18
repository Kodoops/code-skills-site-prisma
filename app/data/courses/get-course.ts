import "server-only";

import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import {CourseTagType, CourseType, LearningPathTagType, WorkshopTagType} from "@/lib/types";

export async function getCourse(slug: string) : Promise<CourseType> {

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
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
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },
        }
    });

    console.log(course)

    if(!course) return notFound();

    return {
        ...course,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),

    };
}


export type CourseSingularType = Awaited<ReturnType<typeof getCourse>>;
