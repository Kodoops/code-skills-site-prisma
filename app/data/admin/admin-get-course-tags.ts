import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";

export async function adminGetCourseTags(courseId: string) {
    //to delete
   // await new Promise(resolve => setTimeout(resolve, 2000));

    await requireAdmin();

    const data = await prisma.tag.findMany({
        where:{
            
        },
        orderBy:{
            createdAt: "desc"
        },
        select:{
            id:true,
            title:true,
            color:true,
        }
    });

    return data;
}

export type AdminCourseTagType = Awaited <ReturnType<typeof adminGetCourseTags>>[0];
