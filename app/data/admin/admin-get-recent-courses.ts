import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {SimpleCourse} from "@/lib/models";

export async function adminGetRecentCourses() : Promise<SimpleCourse []> {

    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take:2,
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
    });


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

    return courses;
}
