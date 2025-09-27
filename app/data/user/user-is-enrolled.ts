import "server-only";

import { auth } from '@/lib/providers/auth';
import {headers} from "next/headers";
import {prisma} from "@/lib/db/db";

export async function checkIfCourseBought(courseId:string) : Promise<boolean> {

    const session = await auth.api.getSession({
        headers : await headers(),
        }
    );

    if(!session) {
        return false;
    }
    const enrollment = await prisma.enrollment.findUnique({
        where : {
            userId_courseId : {
                userId : session.user.id,
                courseId : courseId,
            }
        },
        select : {
            id : true,
            status : true,
        }
    });

    if(!enrollment) {
        return false;
    }

    return enrollment?.status === 'Active';
};



export async function checkIfLearningPathBought(learningPathId:string) : Promise<boolean> {

    const session = await auth.api.getSession({
            headers : await headers(),
        }
    );

    if(!session) {
        return false;
    }
    const enrollment = await prisma.enrollment.findUnique({
        where : {
            userId_learningPathId : {
                userId : session.user.id,
                learningPathId : learningPathId,
            }
        },
        select : {
            id : true,
            status : true,
        }
    });

    if(!enrollment) {
        return false;
    }

    return enrollment?.status === 'Active';
};



export async function checkIfWorkshopBought(workshopId:string) : Promise<boolean> {

    const session = await auth.api.getSession({
            headers : await headers(),
        }
    );

    if(!session) {
        return false;
    }
    const enrollment = await prisma.enrollment.findUnique({
        where : {
            userId_workshopId : {
                userId : session.user.id,
                workshopId : workshopId,
            }
        },
        select : {
            id : true,
            status : true,
        }
    });

    if(!enrollment) {
        return false;
    }

    return enrollment?.status === 'Active';
};

