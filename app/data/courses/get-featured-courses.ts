import "server-only";
import { prisma } from "@/lib/db/db";
import {SimpleCourse} from "@/lib/db/models";

export async function getFeaturedCourses(nbrOfCourses: number = 6) : Promise<SimpleCourse[]>{

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
            deletedAt:null,
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
            stripePriceId:true,
            createdAt:true,
            updatedAt:true,
            category:true,
            promotions:true

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

    }))

}
