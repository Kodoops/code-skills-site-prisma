import "server-only";
import { prisma } from "@/lib/db";
import { SemanticColor } from "@/lib/types";

export async function getFeaturedCourses(nbrOfCourses: number = 6) {
    // delay to delete
    //await new Promise(resolve => setTimeout(resolve, 2000));

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            description: true,
            slug: true,
            fileKey: true,
            id: true,
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
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: nbrOfCourses,
    });

    return data.map(course => ({
        ...course,
        category: {
            id: course.category?.id ?? "uncategorized",
            title: course.category?.title ?? "Non classée",
            slug: course.category?.slug ?? "uncategorized",
            desc: course.category?.desc ?? "Aucune description",
            color: (course.category?.color ?? "muted") as SemanticColor,
            iconName: course.category?.iconName ?? undefined,
            iconLib: course.category?.iconLib ?? undefined,
        }
    }));
}
