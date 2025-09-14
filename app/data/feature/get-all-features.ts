// app/data/feature/get-all-features.ts
import { prisma } from "@/lib/db";

export async function getAllFeatures(current: number = 1, nbrPage: number ) {

    //await new Promise(resolve => setTimeout(resolve, 2000));

    const [data, total] = await Promise.all([
    await prisma.feature.findMany({
        orderBy: {
            createdAt: "asc",
        },
        take: nbrPage,
        skip: (current - 1) * nbrPage,
    }),
        prisma.feature.count(),
    ]);

    return {
        data,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}
