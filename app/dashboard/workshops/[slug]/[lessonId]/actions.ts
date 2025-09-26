"use server";

import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {ApiResponseType} from "@/lib/types";
import {revalidatePath} from "next/cache";

export async function markLessonComplete(lessonId: string, slug: string): Promise<ApiResponseType> {

    const session = await requireUser();

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: true,
            },
            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: true,
            }
        });

        revalidatePath(`/dashboard/${slug}`);

        return {
            status: 'success',
            message: 'Lesson marked complete.'
        }

    } catch {
        return {
            status: 'error',
            message: 'Something went wrong, Failed to mark lesson complete.'
        }
    }
}


export async function markLessonUnCompleted(lessonId: string, slug: string): Promise<ApiResponseType> {

    const session = await requireUser();

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: false,
            },
            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: false,
            }
        });

        revalidatePath(`/dashboard/${slug}`);

        return {
            status: 'success',
            message: 'Lesson marked uncompleted.'
        }

    } catch {
        return {
            status: 'error',
            message: 'Something went wrong, Failed to mark lesson uncompleted.'
        }
    }
}
