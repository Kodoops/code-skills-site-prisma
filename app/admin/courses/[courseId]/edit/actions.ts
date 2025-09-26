"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/types";
import {
    chapterSchema,
    ChapterSchema,
    courseSchema,
    CourseSchema,
    lessonSchema,
    LessonSchema, objectiveRequisiteSchema,
    ObjectiveRequisiteSchema
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

export async function updateCourse(data: CourseSchema, courseId: string): Promise<ApiResponseType> {

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

        const result = courseSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const category = await prisma.category.findUnique({
            where: {
                slug: result.data.category,
            },
            select: {id: true}
        });

        await prisma.course.update({
            where: {
                id: courseId,
                userId: session?.user.id as string,
            },
            data: {
                ...result.data,
                category: {
                    connect: {
                        id: category?.id,
                    }
                }
            }
        })

        return {
            status: "success",
            message: "Course updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update course"
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

export async function reorderChapters(
    courseId: string,
    chapters: { id: string, position: number }[]): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "Invalid request, No chapters provided for ordering."
            };
        }
        ;

        const updated = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId,
            },
            data: {
                position: chapter.position,
            }
        }));
        await prisma.$transaction(updated);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to reorder chapters"
        }
    }
}

export async function createChapter(values: ChapterSchema): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const result = chapterSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                }
            });

            await tx.chapter.create({
                data: {
                    title: result.data.title,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1
                }
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Chapter created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create chapter"
        }
    }
}

export async function createLesson(values: LessonSchema): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                }
            });

            await tx.lesson.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1
                }
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Lesson created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create lesson"
        }
    }
}

export async function deleteLesson(chapterId: string, courseId: string, lessonId: string): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            select: {
                lessons: {
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

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Invalid chapter"
            }
        }

        const lessons = chapterWithLessons.lessons;
        const lessonToDelete = lessons.find(lesson => lesson.id === lessonId);
        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found !"
            }
        }

        const remainingLessons = lessons.filter(lesson => lesson.id !== lessonId);
        const updatedLessons = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: {
                    id: lesson.id,
                    chapterId: chapterId,
                },
                data: {
                    position: index + 1,
                }
            });
        });

        await prisma.$transaction([
            ...updatedLessons,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId,
                }
            })
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson deleted successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete lesson"
        }
    }
}

export async function deleteChapter(chapterId: string, courseId: string): Promise<ApiResponseType> {
    await requireAdmin();

    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapters: {
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
                message: "Course not found !"
            }
        }

        const chapters = courseWithChapters.chapters;
        const chapterToDelete = chapters.find(chapter => chapter.id === chapterId);
        if (!chapterToDelete) {
            return {
                status: "error",
                message: "Chapter not found !"
            }
        }

        const remainingChapters = chapters.filter(chapter => chapter.id !== chapterId);

        await prisma.$transaction(async (tx) => {
            // 1) Supprimer les leçons du chapitre
            await tx.lesson.deleteMany({where: {chapterId}});

            // 2) Supprimer le chapitre
            await tx.chapter.delete({where: {id: chapterId}});

            // 3) Réordonner les chapitres restants
            for (let i = 0; i < remainingChapters.length; i++) {
                await tx.chapter.update({
                    where: {id: remainingChapters[i].id},
                    data: {position: i + 1},
                });
            }
        });

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapter deleted successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete chapter"
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


export async function addObjectiveToCourse(courseId: string, data:ObjectiveRequisiteSchema): Promise<ApiResponseType> {
    await requireAdmin();

    const parsed = objectiveRequisiteSchema.safeParse(data);
    if (!parsed.success) {
        return {
            status: "error",
            message: "Invalid form data"
        };
    }

    const { content } = parsed.data;

    try {
        await prisma.objective.create({
            data: {
                content,
                courses: {
                    create: { courseId },
                },
            },
            include: {
                courses: {
                    include: { course: true },
                },
            },
        });

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Objective added successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Failed to add Objective"
        }
    }
}

export async function addRequisiteToCourse(courseId: string, data:ObjectiveRequisiteSchema): Promise<ApiResponseType> {
    await requireAdmin();

    const parsed = objectiveRequisiteSchema.safeParse(data);
    if (!parsed.success) {
        return {
            status: "error",
            message: "Invalid form data"
        };
    }

    const { content } = parsed.data;

    try {
        await prisma.prerequisite.create({
            data: {
                content,
                courses: {
                    create: { courseId },
                },
            },
            include: {
                courses: {
                    include: { course: true },
                },
            },
        });

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Requisite added successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Failed to add Requisite"
        }
    }
}

export async function removeRequisite(id: string, courseId:string) :Promise<ApiResponseType>{

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

        await prisma.coursePrerequisite.delete({
            where: {
                courseId_prerequisiteId: {
                    courseId: courseId,
                    prerequisiteId: id,
                },
            },
        });

        // Supprimer aussi le requisite de la table
        await prisma.prerequisite.delete({
            where: {
                id: id
            },
        })

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return{
            status: "success",
            message: "Requisite deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete requisite"
        }
    }

}

export async function removeObjective(id: string, courseId:string) :Promise<ApiResponseType>{

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

        await prisma.courseObjective.delete({
            where: {
                courseId_objectiveId: {
                    courseId: courseId,
                    objectiveId: id,
                },
            },
        });

        // Supprimer aussi l'objectif de la table
        await prisma.objective.delete({
            where: {
                id: id
            },
        })

        revalidatePath(`/admin/courses/${courseId}/edit`)

        return{
            status: "success",
            message: "Objective deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete objective"
        }
    }

}
