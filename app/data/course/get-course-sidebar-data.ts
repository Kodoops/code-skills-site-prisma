import "server-only";
import {requireUser} from "../user/require-user";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";

export const getCourseSidebarData = async (slug: string) => {

    const session = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            category: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                            lessonProgress:{
                                where:{
                                    userId: session.id,
                                },
                                select:{
                                    completed:true,
                                    lessonId: true ,
                                    id:true,
                                }
                            }
                        },
                        orderBy:{
                            position:'asc'
                        },
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

    if(!course) return notFound();

    const enrollment = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId: session.id,
                courseId : course.id
            }
        }
    });

    if(!enrollment || enrollment.status !='Active') {
        return notFound();
    }

    return { course };
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>;
