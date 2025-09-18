import "server-only";
import {isAuthenticated, requireUser} from "./require-user";
import {prisma} from "@/lib/db";


export async function getEnrolledCourses(page: number = 1, perPage: number ) {
    const user = await requireUser();

    const [data, total] = await Promise.all([
        await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                status: 'Active'
            },
            take: perPage,
            skip: (page - 1) * perPage,
            select: {
                course: {
                    select: {
                        id: true,
                        smallDescription: true,
                        title: true,
                        fileKey: true,
                        level: true,
                        slug: true,
                        duration: true,
                        category: true,
                        chapters: {
                            select: {
                                id: true,
                                lessons: {
                                    select: {
                                        id: true,
                                        lessonProgress: {
                                            where: {
                                                userId: user.id,
                                            },
                                            select: {
                                                id: true,
                                                completed: true,
                                                lessonId: true,
                                            }
                                        }
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

    return {
        data,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage,
        total
    };

}

export type EnrolledCoursesType = Awaited<ReturnType<typeof getEnrolledCourses>>['data'][0];

export async function getAllEnrolledCoursesByUser() {

    const authenticate = await isAuthenticated();
    if(!authenticate)
        return [];

    const user = await requireUser();

    const data = await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                status: 'Active'
            },
            select: {
                course: {
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
