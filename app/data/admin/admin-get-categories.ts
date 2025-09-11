import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";

export async function adminGetCategories() {
    //to delete
   // await new Promise(resolve => setTimeout(resolve, 2000));

    await requireAdmin();

    const data = await prisma.category.findMany({
        orderBy:{
            createdAt: "desc"
        },
        select:{
            id:true,
            title:true,
            desc:true,
            color:true,
            iconName:true,
            iconLib:true,
        }
    });

    return data;
}

export type AdminCategoryType = Awaited <ReturnType<typeof adminGetCategories>>[0];
