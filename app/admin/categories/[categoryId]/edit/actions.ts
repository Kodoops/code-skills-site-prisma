"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponse} from "@/lib/types";
import {
    categorySchema,
    CategorySchema,
    chapterSchema,
    ChapterSchema,
    courseSchema,
    CourseSchema,
    lessonSchema,
    LessonSchema
} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";
import arcjet from "@/lib/arcjet";
import { fixedWindow, request} from "@arcjet/next";
import {revalidatePath} from "next/cache";

const aj = arcjet

    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateCategory(data: CategorySchema, categoryId: string): Promise<ApiResponse> {

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

        const result = categorySchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Category updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update Category"
        }
    }
}
