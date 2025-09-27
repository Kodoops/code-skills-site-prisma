// app/data/feature/get-all-features.ts
import { prisma } from "@/lib/db/db";

export async function getAllFeatures(current: number = 1, nbrPage: number ) {


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


    const features = data.map(item => ({
        ...item,
        color: item.color  || undefined,
        iconName: item.iconName  || undefined,
        iconLib: item.iconLib  || undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))

    return {
        data:features,
        total,
        page: current,
        perPage: nbrPage,
        totalPages: Math.ceil(total / nbrPage),
    };
}
