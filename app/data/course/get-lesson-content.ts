import "server-only"
import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";

export async function getLessonContent(lessonId: string) {

    const session  =await requireUser();

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
            lessonProgress:{
                where:{
                    userId: session.id,
                    lessonId: lessonId,
                },
                select: {
                    id: true,
                    completed: true,
                    lessonId: true,
                }
            },
            Chapter: {
                select: {
                   courseId: true,
                    Course:{
                       select: {
                            slug: true,
                       }
                    }
                }
            }
        }
    });

    if(!lesson) return notFound();

    const enrollment = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId: session.id,
                courseId: lesson.Chapter.courseId
            }
        },
        select: {
            id: true,
            status: true,
        }
    });

    if (!enrollment || enrollment.status !== 'Active') return notFound();

    return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
