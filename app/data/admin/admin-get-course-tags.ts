import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {TagType} from "@/lib/db/types";

export async function adminGetCourseTags(courseId: string) : Promise<TagType[]>{

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
            slug:true,
            color:true,
            createdAt: true,
            updatedAt: true,
        }
    });

   return  data.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))

}

