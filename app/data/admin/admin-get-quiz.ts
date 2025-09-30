import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {QuizType} from "@/lib/db/types";

export async function adminGetAvailableQuiz( page: number=1, perPage: number=1 ): Promise<{
    data: QuizType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.quiz.findMany({
            where:{
              courseId:null,
              chapterId: null,
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                description:true,
                slug: true,
                courseId:true,
                chapterId:true,
                questions:true,
                createdAt:true,
                updatedAt:true,
            }
        }),
        prisma.quiz.count()
    ]);

    const quiz = data.map(q => ( {
        ...q,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
    }))
    return {
        data: quiz,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}

export async function adminGetAllQuiz( page: number=1, perPage: number=1 ): Promise<{
    data: QuizType[] | null,
    totalPages: number,
    currentPage: number,
    perPage: number,
}> {

    await requireAdmin();

    const [data, totalCount] = await Promise.all([
        await prisma.quiz.findMany({
            orderBy: {
                createdAt: "desc"
            },
            skip: (page - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                title: true,
                description:true,
                slug: true,
                courseId:true,
                chapterId:true,
                questions:true,
                createdAt:true,
                updatedAt:true,
            }
        }),
        prisma.quiz.count()
    ]);

    const quiz = data.map(q => ( {
        ...q,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
    }))
    return {
        data: quiz,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
