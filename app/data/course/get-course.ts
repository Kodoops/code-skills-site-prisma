import "server-only";

import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";

export async function getCourse(slug: string) {

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            category: true,
            smallDescription: true,
            chapters: {
                orderBy:{
                  position: "asc",
                },
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            public: true,
                            duration:true,
                        },
                        orderBy:{
                            position:'asc',
                        }
                    }
                }
            },
            coursePromotion: {
                where: {
                    active: true,
                    startsAt: { lte: new Date() },
                    endsAt: { gte: new Date() },
                },
                orderBy: {
                    startsAt: "desc", // la plus récente
                },
                take: 1, // une seule promo par course
                select: {
                    id: true,
                    title: true,
                    description: true,
                    discount: true,
                    type: true,
                    startsAt: true,
                    endsAt: true,
                    active:true,
                    courseId:true
                },
            },
        }
    });

    if(!course) return notFound();

    return course;
}


export type CourseSingularType = Awaited<ReturnType<typeof getCourse>>;
