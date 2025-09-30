"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/db/types";
import {lessonSchema, LessonSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";

export async function updateLesson(values: LessonSchema, lessonId:string): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values)
        if (!result.success){
            return {
                status: "error",
                message: "Invalid form data"
            }
        }

        await prisma.lesson.update({
            where:{
                id: lessonId
            },
            data: {
                title :result.data.title,
                description: result.data.description,
                thumbnailKey: result.data.thumbnailKey,
                videoKey: result.data.videoKey,
                public: result.data.public,
            }
        });

        return {
            status: "success",
            message: "Lesson updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to update lesson"
        }
    }
}
