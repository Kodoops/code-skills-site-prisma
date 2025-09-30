import "server-only";
import {QuizType} from "@/lib/db/types";
import {prisma} from "@/lib/db/db";


export async function adminGetChaptersQuiz(ids: string[]) : Promise<QuizType[]> {

    const quizzes = await prisma.quiz.findMany({
        where: {
            chapterId: { in: ids },
        },
        select:{
            id: true,
            title: true,
            description: true,
            slug: true,
            type: true,
            chapterId: true,
            courseId: true,
            questions: {
                select: {
                    id: true,
                    question: true,
                    type: true,
                    options: true
                }
            },
            createdAt: true,
            updatedAt: true,
            userId: true,
            user:true,
        }
    });


    return quizzes;
}


