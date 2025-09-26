import "server-only";
import {isAuthenticated, requireUser} from "./require-user";
import {prisma} from "@/lib/db";


export async function getEnrolledWorkshops(page: number = 1, perPage: number ) {
    const user = await requireUser();

    const [data, total] = await Promise.all([
        await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                workshopId:{
                    not: null,
                },
                status: 'Active'
            },
            take: perPage,
            skip: (page - 1) * perPage,
            select: {
                workshop: {
                    select: {
                        id: true,
                        title: true,
                        fileKey: true,
                        level: true,
                        slug: true,
                        duration: true,
                        statement:true,
                        statementsStartFileKey:true,
                        statementsStartFileUrl:true,
                        statementVideoKey:true,
                        solution:true,
                        solutionFileKey:true,
                        solutionFileUrl:true,
                        solutionVideoKey:true,
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

export async function getAllEnrolledWorkshopsByUser() {

    const authenticate = await isAuthenticated();
    if(!authenticate)
        return [];

    const user = await requireUser();

    const data = await prisma.enrollment.findMany({
            where: {
                userId: user.id,
                workshopId: {
                    not: null,
                },
                status: 'Active'
            },
            select: {
                workshop: {
                    select: {
                        id: true,
                        title: true,
                        fileKey: true,
                        level: true,
                        slug: true,
                        duration: true,
                        statement:true,
                        statementsStartFileKey:true,
                        statementsStartFileUrl:true,
                        statementVideoKey:true,
                        solution:true,
                        solutionFileKey:true,
                        solutionFileUrl:true,
                        solutionVideoKey:true,
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
