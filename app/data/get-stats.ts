import "server-only";

import {prisma} from "@/lib/db/db";

export async function getStats() {

        const [courses, lessons, quizzes] =
            await Promise.all([
                prisma.course.count({
                    where: {status: 'Published', deletedAt: null},
                }),
                prisma.lesson.count(),
                prisma.quiz.count(),
            ]);

        return {
            courses, lessons, quizzes
        };

}
