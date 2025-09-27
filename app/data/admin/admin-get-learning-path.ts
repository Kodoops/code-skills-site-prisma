import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {CourseType, LearningPathType} from "@/lib/db/types";


export async function adminGetLearningPath(id: string) : Promise<LearningPathType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.learningPath.findUnique({
        where: {
            id: id,
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
            contents: {
                select: {
                    id: true,
                    type: true,
                    position: true,
                    courseId: true,
                    workshopId: true,
                    resourceId: true,
                    learningPathId: true,
                    course: {
                        where: {
                            deletedAt: null,
                            status: 'Published'
                        },
                        select: {
                            id: true,
                            title: true,
                            smallDescription: true,
                            fileKey: true,
                            price: true,
                            duration: true,
                            level: true,
                            status: true,
                            slug: true,
                        }
                    },
                    workshop: {
                        where: {
                            deletedAt: null,
                            status: 'Published'
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            fileKey: true,
                            price: true,
                            duration: true,
                            level: true,
                            status: true,
                            slug: true,
                        }
                    },
                    resource: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            fileKey: true,
                        }
                    },
                }
            },
        }
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),

    };
}

