"use server";

import {courseSchema, CourseSchema, quizSchema, QuizSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";
import {stripe} from "@/lib/providers/stripe";
import {env} from "@/lib/env";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createQuiz(values: QuizSchema): Promise<ApiResponseType> {

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

        const validation = quizSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.quiz.create({
            data: {
                title: validation.data.title,
                description: validation.data.description,
                slug: validation.data.slug,
                user: {
                    connect: { id: session?.user.id as string }
                },
            }
        });

        return {
            status: "success",
            message: "Quiz created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create quiz"
        };
    }

}
