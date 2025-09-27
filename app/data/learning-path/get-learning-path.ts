import "server-only";

import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import { LearningPathType} from "@/lib/db/types";

export async function getLearningPath(slug: string) : Promise<LearningPathType> {

    const learningPath = await prisma.learningPath.findUnique({
        where: {
           slug:slug
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
            createdAt:true,
            updatedAt:true,
            promotions: true,
            user:true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            color: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            },
            contents: {
                select: {
                    id: true,
                    type: true,
                    position: true,
                    courseId: true,
                    workshopId: true,
                    resourceId: true,
                    learningPathId: true,
                    course: true,
                    workshop: true,
                    resource: true,
                }
            },
            prerequisites: {
                select: {
                    prerequisite:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
            objectives: {
                select: {
                    objective:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
        }
    });


    if(!learningPath) return notFound();

    return {
        ...learningPath,
        createdAt: learningPath.createdAt.toISOString(),
        updatedAt: learningPath.updatedAt.toISOString(),

    };
}

