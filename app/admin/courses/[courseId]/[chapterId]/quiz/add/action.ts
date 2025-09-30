"use server";

import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {AttachQuizFormToCourse} from "@/lib/db/zodSchemas";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {revalidatePath} from "next/cache";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function attachQuiz(values:AttachQuizFormToCourse): Promise<ApiResponseType> {

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

        await prisma.quiz.update({
            where: {
                id: values.quizId
            },
            data: {
                courseId: values.courseId,
                chapterId: values.chapterId,
            }
        })

        return {
            status: "success",
            message: "Quiz Attached successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update attach a quiz "
        }
    }
}

export async function detachQuizFromCourse( quizId:string, courseId:string): Promise<ApiResponseType> {

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

        await prisma.quiz.update({
            where: {
                id: quizId
            },
            data: {
                courseId: null
            }
        })

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Quiz Detached from Course  successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update detach a quiz from course"
        }
    }
}
