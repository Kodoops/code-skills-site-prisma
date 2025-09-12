import "server-only";
import {requireUser} from "./require-user";
import {prisma} from "@/lib/db";


export async function getEnrolledCourses(page: number = 1, perPage: number = 9) {
    const user = await requireUser();

    const skip = (page - 1) * perPage;

    const [data, totalCount] = await Promise.all([
        await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                status: 'Active'
            },
            skip,
            take: perPage,
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
            },
        })
    ]);

    return {
        data,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}

export type EnrolledCoursesType = Awaited<ReturnType<typeof getEnrolledCourses>>['data'][0];
