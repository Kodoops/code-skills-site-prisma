import { prisma } from "@/lib/db";
import {courseLevels} from "@/lib/zodSchemas";
import {notFound} from "next/navigation";

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
}) {
    const where: any = {
        status: "Published",
    };

    if (categorySlug) {
        where.category = {
            isNot: null,
            slug: categorySlug,
        };
    }

    if (level && level !== "all") {
        where.level = level;
    }

    if (level && level !== "all" && !courseLevels.includes(level as any)) {
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
                price: true,
                smallDescription: true,
                description:true,
                slug: true,
                fileKey: true,
                level: true,
                duration: true,
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        desc: true,
                        color: true,
                        iconName: true,
                        iconLib: true,
                    },
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
            },
        }),
        prisma.course.count({ where }),
    ]);

    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>["data"][0];
