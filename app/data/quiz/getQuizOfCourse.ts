import { QuizType} from "@/lib/db/types";
import {prisma} from "@/lib/db/db";

export async function getQuizOfCourse(courseId: string): Promise<QuizType> {

    const data = await prisma.quiz.findFirst({
        where: {
            courseId: courseId,
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
    })

    return  data
}
