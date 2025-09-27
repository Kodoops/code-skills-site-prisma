import "server-only";
import {isAuthenticated, requireUser} from "./require-user";
import {prisma} from "@/lib/db/db";


export async function getEnrolledLearningPaths(page: number = 1, perPage: number ) {
    const user = await requireUser();

    const [data, total] = await Promise.all([
        await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                learningPathId: {
                    not: null,
                },
                status: 'Active'
            },
            take: perPage,
            skip: (page - 1) * perPage,
            select: {
                learningPath: {
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
                        objectives:true,
                        prerequisites:true,
                        user:true,
                        progress:true,
                        resources:true,
                        tags: true,
                        contents: {
                            select: {
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }),
        prisma.enrollment.count({
            where: {
                userId: user.id,
                status: 'Active'
            },
        })
    ]);

    const paths = data.map(path => ({
        ...path.learningPath,
        createdAt: path.learningPath?.createdAt.toISOString(),
        updatedAt: path.learningPath?.updatedAt.toISOString(),
    }))

    return {
        data:paths,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage,
        total
    };

}


export async function getAllEnrolledLearningPathsByUser() {

    const authenticate = await isAuthenticated();
    if(!authenticate)
        return [];

    const user = await requireUser();

    const data = await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                learningPathId: {
                    not: null,
                },
                status: 'Active'
            },
            select: {
                learningPath: {
                    select: {
                        id: true,
                        smallDescription: true,
                        title: true,
                        fileKey: true,
                        level: true,
                        slug: true,
                        duration: true,
                        price: true,
                        description: true,
                        promotions: {
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
                    }
                }
            }
        });

    return data;

}
