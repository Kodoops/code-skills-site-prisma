import "server-only"
import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { LessonType} from "@/lib/types";

export async function getLessonContent(lessonId: string): Promise<LessonType & { courseId: string; course: { slug: string } }> {

    const session = await requireUser();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            position: true,
            thumbnailKey: true,
            videoKey: true,
            public: true,
            chapterId: true,
            duration: true,
            createdAt: true,
            updatedAt: true,
            lessonProgress: {
                where: {
                    userId: session.id,
                    lessonId: lessonId,
                },
                select: {
                    id: true,
                    completed: true,
                    lessonId: true,
                    userId: true,
                }
            },
            chapter: {
                select: {
                    courseId: true,
                    course: {
                        select: {
                            slug: true,
                        }
                    }
                }
            }
        }
    });

    if (!lesson) return notFound();

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: lesson.chapter.courseId
            }
        },
        select: {
            id: true,
            status: true,
        }
    });

    const data = {
        id: lesson.id,
        title: lesson.title,
        public: lesson.public,
        chapterId: lesson.chapterId,
        duration: lesson.duration,
        position: lesson.position,
        description: lesson.description ?? '',
        thumbnailKey: lesson.thumbnailKey ?? '',
        videoKey: lesson.videoKey ?? '',
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
        lessonProgress: lesson.lessonProgress.map(lp => ({
            ...lp,
        })),
    }

    if (lesson.public)
        return {
            ... data,
            courseId: lesson.chapter.courseId,
            course:{
                slug : lesson.chapter.course.slug,
            }

        };

    if (!enrollment || enrollment.status !== 'Active') return notFound();

    return {
        ... data,
        courseId: lesson.chapter.courseId,
        course:{
            slug : lesson.chapter.course.slug,
        }

    };
}

