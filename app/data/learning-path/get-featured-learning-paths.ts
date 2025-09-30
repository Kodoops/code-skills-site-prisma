import "server-only";
import {prisma} from "@/lib/db/db";
import {LearningPathType} from "@/lib/db/types";

export async function getFeaturedLearningPaths(nbrOfPaths: number = 4): Promise<LearningPathType[]> {

    const data = await prisma.learningPath.findMany({
        where: {
            status: "Published",
            deletedAt: null
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            stripePriceId: true,
            createdAt: true,
            updatedAt: true,
            promotions: true,
            progress: true,
            user: true,
            tags: true,
            contents: true,
            prerequisites:true,
            objectives: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: nbrOfPaths,
    });

    return data.map(path => ({
        ...path,
        createdAt: path.createdAt.toISOString(),
        updatedAt: path.updatedAt.toISOString(),
    }))

}
