import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {QuizType} from "@/lib/db/types";


export async function adminGetSingleQuiz(id: string) : Promise<QuizType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.quiz.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description:true,
            slug: true,
            createdAt:true,
            updatedAt:true,
            questions:{
                select:{
                    id: true,
                    question: true,
                    type: true,
                    options: {
                        select: {
                            id: true,
                            content: true,
                            isCorrect: true,
                        }
                    },
                }
            }
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

