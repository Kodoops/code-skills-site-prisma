"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/db/types";
import {
    quizOptionSchema,
    QuizOptionSchema,
    quizQuestionSchema,
    QuizQuestionSchema,
    quizSchema,
    QuizSchema
} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {revalidatePath} from "next/cache";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateQuiz(data: QuizSchema, quizId: string): Promise<ApiResponseType> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            } else {
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const result = quizSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }



        await prisma.quiz.update({
            where: {
                id: quizId,
                userId: session?.user.id as string,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Quiz updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update quiz"
        }
    }
}


export async function createQuizQuestion(values: QuizQuestionSchema): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const result = quizQuestionSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.quizQuestion.create({
            data: {
                question: result.data.question,
                quizId:result.data.quizId,
            }
        });

        revalidatePath(`/admin/quiz/${result.data.quizId}/edit`);

        return {
            status: "success",
            message: "Quiz Question  created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create quiz question"
        }
    }
}

export async function createQuizOption(values: QuizOptionSchema): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const result = quizOptionSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

       await prisma.quizOption.create({
           data: {
               content:result.data.content,
               questionId:result.data.questionId,
               isCorrect:result.data.isCorrect,
           }
       })

        revalidatePath(`/admin/quiz/${result.data.quizId}/edit`);

        return {
            status: "success",
            message: "Question Option created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create question option"
        }
    }
}

export async function deleteQuestionOption(questionId: string, quizId: string, optionId: string): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        await prisma.quizOption.delete({
            where: { id: optionId },
        });

        revalidatePath(`/admin/quiz/${quizId}/edit`);

        return {
            status: "success",
            message: "Question option deleted successfully"
        };
    } catch {
        return {
            status: "error",
            message: "Failed to delete  question option"
        };
    }
}

export async function deleteQuizQuestion(questionId: string, quizId: string): Promise<ApiResponseType> {
    await requireAdmin();

    try {

        await prisma.quizQuestion.delete({
            where: { id: questionId },
        })

        revalidatePath(`/admin/quiz/${quizId}/edit`);

        return {
            status: "success",
            message: "Quiz Question deleted successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete quiz question"
        }
    }
}

