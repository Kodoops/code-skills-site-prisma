
"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {revalidatePath} from "next/cache";
import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteQuiz(quizId: string) :Promise<ApiResponseType>{

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            }else{
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            select:{
                id: true,
                questions: true,
                courseId: true,
                chapterId: true,
            }
        })

        if (!quiz) {
            return {
                status: "error",
                message: "Quiz not found"
            }
        }

        if(quiz.courseId !== null){
            return {
                status:'error',
                message: "You can't delete a quiz that is part of a course"
            }
        }

        if(quiz.chapterId !== null){
            return {
                status:'error',
                message: "You can't delete a quiz that is part of a chapter"
            }
        }

        await prisma.quiz.delete({
            where: {
                id: quizId
            }
        })

        revalidatePath(`/admin/quiz`)

        return{
            status: "success",
            message: "Quiz deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete quiz"
        }
    }

}
