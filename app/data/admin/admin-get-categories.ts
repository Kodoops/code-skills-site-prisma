import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {CategoryType} from "@/lib/types";

export async function adminGetCategories() : Promise<CategoryType[]> {

    await requireAdmin();

    const rawData = await prisma.category.findMany({
        orderBy:{
            createdAt: "desc"
        },
        select:{
            id:true,
            title:true,
            slug: true,
            desc:true,
            color:true,
            iconName:true,
            iconLib:true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return rawData.map(item => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            desc: item.desc,
            color: item.color,
            iconName: item.iconName,
            iconLib: item.iconLib,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        })
    );
}

