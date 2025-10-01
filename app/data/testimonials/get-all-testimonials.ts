import { prisma } from "@/lib/db/db";
import {TestimonialWithUserType} from "@/lib/db/types";

export async function getAllTestimonials(current: number = 1, nbrPage: number ) {


    const [data, total] = await Promise.all([
        await prisma.testimonial.findMany({
            orderBy: {
                createdAt: "asc",
            },
            take: nbrPage,
            skip: (current - 1) * nbrPage,
        }),
        prisma.testimonial.count(),
    ]);

    // récupérer les userIds uniques
    const userIds = data.map((t) => t.userId);
    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true, image: true },
    });

    // mapper userId -> user
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const testimonials: TestimonialWithUserType[] = data.map((item) => ({
        userId: item.userId,
        text: item.text,
        rating: item.rating,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        user: userMap[item.userId] ?? null,
    }));

    return {
        data: testimonials,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}
