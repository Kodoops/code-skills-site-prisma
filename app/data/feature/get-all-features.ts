// app/data/feature/get-all-features.ts
import { prisma } from "@/lib/db";

export async function getAllFeatures() {

    await new Promise(resolve => setTimeout(resolve, 2000));

    return await prisma.feature.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
}
