import { auth } from '@/lib/auth';
import {headers} from "next/headers";
import {prisma} from "@/lib/db";

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

