import "server-only";

import {requireUser} from "../user/require-user";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { EnrollmentType, LearningPathType} from "@/lib/types";

export const getLearningPathSidebarData = async (slug: string): Promise<{
    learningPath: LearningPathType, enrollment : EnrollmentType | null}> => {

    const session = await requireUser();

    const pathData = await prisma.learningPath.findUnique({
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
            promotions: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            color: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            },
            prerequisites: {
                select: {
                    prerequisite:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
            objectives: {
                select: {
                    objective:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
            contents: {
                select: {
                    id: true,
                    type: true,
                    position: true,
                    courseId: true,
                    workshopId: true,
                    resourceId: true,
                    learningPathId: true,
                    course: {
                        where: {
                            deletedAt: null,
                            status: 'Published'
                        },
                        select: {
                            id: true,
                            title: true,
                            smallDescription: true,
                            fileKey: true,
                            price: true,
                            duration: true,
                            level: true,
                            status: true,
                            slug: true,
                        }
                    },
                    workshop: {
                        where: {
                            deletedAt: null,
                            status: 'Published'
                        },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            fileKey: true,
                            price: true,
                            duration: true,
                            level: true,
                            status: true,
                            slug: true,
                        }
                    },
                    resource: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            fileKey: true,
                            //slug: true,
                        }
                    },
                }
            },
        }
    });

    if(!pathData) return notFound();

    const enrollmentData = await prisma.enrollment.findUnique({
        where:{
            userId_learningPathId:{
                userId: session.id,
                learningPathId : pathData.id
            }
        }
    });

    if(!enrollmentData || enrollmentData.status !='Active') {
        return notFound();
    }

    const learningPath = {
        ...pathData,
        createdAt: pathData.createdAt.toISOString(),
        updatedAt: pathData.updatedAt.toISOString(),
    };

    const enrollment = !enrollmentData ? null : {
        ... enrollmentData,
       id: enrollmentData?.id  ,
        userId: enrollmentData?.userId ,
        status: enrollmentData?.status ,
        amount: enrollmentData?.amount,
        courseId: enrollmentData?.courseId ,
        learningPathId: enrollmentData?.learningPathId ,
        paymentId: enrollmentData?.paymentId ?? '' ,
        createdAt: enrollmentData?.createdAt.toISOString() ,
        updatedAt: enrollmentData?.updatedAt.toISOString() ,
    };

    return { learningPath,
         enrollment
    };
}
