"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType, LearningPathItemType, ResourceType, WorkshopType} from "@/lib/types";
import {
    LearningPathItemSchema,

    learningPathItemSchema, learningPathSchema,
    LearningPathSchema,
    lessonSchema,
    LessonSchema
} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";
import arcjet from "@/lib/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {revalidatePath} from "next/cache";
import {SimpleCourse} from "@/lib/models";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateLearningPath(data: LearningPathSchema, id: string): Promise<ApiResponseType> {

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

        const result = learningPathSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.learningPath.update({
            where: {
                id: id,
                userId: session?.user.id as string,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Learning Path  updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update learning path"
        }
    }
}

export async function reorderLessons(courseId: string,
                                     chapterId: string,
                                     lessons: {
                                         id: string, position: number
                                     }[]
): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "Invalid request, No lessons provided for ordering."
            };
        }

        const updated = lessons.map((lesson) => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId,
            },
            data: {
                position: lesson.position,
            }
        }));

        await prisma.$transaction(updated);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to reorder lessons"
        }
    }
}

export async function reorderLearningPathItems(
    learningPathId: string,
    items: { id: string, position: number }[]): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        if (!items || items.length === 0) {
            return {
                status: "error",
                message: "Invalid request, No learning path items provided for ordering."
            };
        }
        ;

        const updated = items.map((item) => prisma.learningPathItem.update({
            where: {
                id: item.id,
                learningPathId: learningPathId,
            },
            data: {
                position: item.position,
            }
        }));
        await prisma.$transaction(updated);

        revalidatePath(`/admin/learning-paths/${learningPathId}/edit`);

        return {
            status: "success",
            message: "Learning Path Items reordered successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to reorder Learning Path Items"
        }
    }
}

export async function createLearningPathItem(values: LearningPathItemSchema): Promise<ApiResponseType> {

    console.log(
        "createLearningPathItem",
        values)

    await requireAdmin();

    try {
        const result = learningPathItemSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.learningPathItem.findFirst({
                where: {
                    learningPathId: result.data.learningPathId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                }
            });

            await tx.learningPathItem.create({
                data: {
                    type: result.data.type as 'Course' | 'Workshop' | 'Resource',
                    learningPathId: result.data.learningPathId,
                    position: (maxPos?.position ?? 0) + 1,
                    courseId: result.data.type === "Course" ? result.data.courseId : undefined,
                    workshopId: result.data.type === "Workshop" ? result.data.workshopId : undefined,
                    resourceId: result.data.type === "Resource" ? result.data.resourceId : undefined,
                }
            });
        });

        revalidatePath(`/admin/learning-paths/${result.data.learningPathId}/edit`);

        return {
            status: "success",
            message: "Learning Path Item created successfully"
        }
    } catch (e) {
        console.log(e)
        return {
            status: "error",
            message: "Failed to create Learning Path Item"
        }
    }
}

export async function deleteLearningPathItem(itemId: string, learningPathId: string): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const courseWithChapters = await prisma.learningPath.findUnique({
            where: {
                id: learningPathId,
            },
            select: {
                contents: {
                    orderBy: {
                        position: "asc"
                    },
                    select: {
                        id: true,
                        position: true,
                    }
                },
            }
        });

        if (!courseWithChapters) {
            return {
                status: "error",
                message: "Learning Path not found !"
            }
        }

        const items = courseWithChapters.contents;
        const itemToDelete = items.find(item => item.id === itemId);
        if (!itemToDelete) {
            return {
                status: "error",
                message: "Learning Path Item not found !"
            }
        }

        const remainingItems = items.filter(item => item.id !== itemId);

        await prisma.$transaction(async (tx) => {
            // 1) Supprimer le item
            await tx.learningPathItem.delete({where: {id: itemId}});

            // 2) Réordonner les items restants
            for (let i = 0; i < remainingItems.length; i++) {
                await tx.learningPathItem.update({
                    where: {id: remainingItems[i].id},
                    data: {position: i + 1},
                });
            }
        });

        revalidatePath(`/admin/learning-paths/${learningPathId}/edit`);

        return {
            status: "success",
            message: "Learning Path Item  deleted successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete learning path item"
        }
    }
}

export async function updateLearningPathTags(learningPathId: string, tagIds: string[]): Promise<ApiResponseType> {

    await requireAdmin();

    try {
        await prisma.$transaction([
            prisma.learningPathTag.deleteMany({
                where: {learningPathId}
            }),

            prisma.learningPathTag.createMany({
                data: tagIds.map(tagId => ({
                    learningPathId,
                    tagId
                })),
                skipDuplicates: true
            }),
        ]);
        revalidatePath(`/admin/learning-paths/${learningPathId}/edit`)

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


export async function adminGetCatalogue(page: number = 1, perPage: number = 1):
    Promise<{
        courses: { id: string, title: string }[],
        workshops: { id: string, title: string }[],
        resources: { id: string, title: string }[],
    }> {

    await requireAdmin();

    const [courses, workshops, resources] = await Promise.all([
        prisma.course.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
            }
        }),
        prisma.workshop.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
            }
        }),
        prisma.resource.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
            }
        }),

    ]);

    return {
        courses,
        workshops,
        resources
    };
}

