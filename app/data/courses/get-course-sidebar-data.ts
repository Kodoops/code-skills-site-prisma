import "server-only";

import {requireUser} from "../user/require-user";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import {CourseType, EnrollmentType} from "@/lib/types";

export const getCourseSidebarData = async (slug: string): Promise<{
    course: CourseType, enrollment : EnrollmentType | null}> => {

    const session = await requireUser();

    const courseData = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description:true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            createdAt:true,
            updatedAt:true,
            category:true,
            promotions: true,
            tags:true,
            chapters:{
                select:{
                    id: true,
                    title: true,
                    courseId: true,
                    position: true,
                    createdAt : true,
                    updatedAt : true,
                    lessons: {
                        select:{
                            id: true,
                            title: true,
                            description: true,
                            position: true,
                            thumbnailKey: true,
                            videoKey: true,
                            public: true,
                            chapterId: true,
                            duration: true,
                            lessonProgress: true,
                            createdAt:true,
                            updatedAt:true,
                        },
                        orderBy:{
                            createdAt :'asc'
                        }
                    }
                },
                orderBy:{
                    createdAt :'asc'
                }
            }
        }
    });

    if(!courseData) return notFound();

    const enrollmentData = await prisma.enrollment.findUnique({
        where:{
            userId_courseId:{
                userId: session.id,
                courseId : courseData.id
            }
        }
    });

    // if(!enrollmentData || enrollmentData.status !='Active') {
    //     return notFound();
    // }

    const course = {
        ...courseData,
        createdAt: courseData.createdAt.toISOString(),
        updatedAt: courseData.updatedAt.toISOString(),
        category:{
            ...courseData.category,
            createdAt: courseData.category.createdAt.toISOString(),
            updatedAt: courseData.category.updatedAt.toISOString(),
        },
        tags: courseData.tags.map(tag=>({
            ...tag,
        })),
        chapters: courseData.chapters.map(chapter=>({
            ...chapter,
            createdAt: chapter.createdAt.toISOString(),
            updatedAt: chapter.updatedAt.toISOString(),
            lessons: chapter.lessons.map(lesson=>({
                ...lesson,
                description: lesson.description ?? '',
                thumbnailKey: lesson.thumbnailKey ?? '',
                videoKey: lesson.videoKey ?? '',
                createdAt: lesson.createdAt.toISOString(),
                updatedAt: lesson.updatedAt.toISOString(),
                lessonProgress: lesson.lessonProgress.map(lp => ({
                    ...lp,
                })),
            }))
        }))
    };

    const enrollment = !enrollmentData ? null : {
        ... enrollmentData,
       id: enrollmentData?.id  ,
        userId: enrollmentData?.userId ,
        status: enrollmentData?.status ,
        amount: enrollmentData?.amount,
        courseId: enrollmentData?.courseId ,
        paymentId: enrollmentData?.paymentId ?? '' ,
        createdAt: enrollmentData?.createdAt.toISOString() ,
        updatedAt: enrollmentData?.updatedAt.toISOString() ,
    };

    return { course,
         enrollment
    };
}
