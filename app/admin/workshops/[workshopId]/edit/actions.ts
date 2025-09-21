"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/types";
import {
    chapterSchema,
    ChapterSchema,
    courseSchema,
    CourseSchema,
    lessonSchema,
    LessonSchema, workshopSchema,
    WorkshopSchema, workshopStatementSchema, WorkshopStatementSchema
} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";
import arcjet from "@/lib/arcjet";
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

export async function updateWorkshop(data: WorkshopSchema, workshopId: string): Promise<ApiResponseType> {

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

        const result = workshopSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.workshop.update({
            where: {
                id: workshopId,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Workshop updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update workshop"
        }
    }
}

export async function updateWorkshopStatement(data: WorkshopStatementSchema, workshopId: string): Promise<ApiResponseType> {
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

        const result = workshopStatementSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.workshop.update({
            where: {
                id: workshopId,
            },
            data: {
                ...result.data,
            },
        })

        return {
            status: "success",
            message: "Workshop Statement updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update workshop statement"
        }
    }
}




export async function updateCourseTags(courseId: string, tagIds: string[]): Promise<ApiResponseType> {

    await requireAdmin();

    try {
        await prisma.$transaction([
             prisma.courseTag.deleteMany({
                where: {courseId}
            }),

             prisma.courseTag.createMany({
                data: tagIds.map(tagId => ({
                    courseId,
                    tagId
                })),
                skipDuplicates: true
            }),
        ]);
        revalidatePath(`/admin/courses/${courseId}/edit`)

        return {
            status: "success",
            message: "Tags updated successfully"
        }
    } catch {

        return {
            status: "error",
            message: "Failed to update tags"
        }
    }
}
