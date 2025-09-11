import "server-only";

import {prisma} from "@/lib/db";
import {SemanticColor} from "@/lib/types";

export async function getAllCategories() {
    //to delete
    // await new Promise(resolve => setTimeout(resolve, 2000));

    const data = await prisma.category.findMany({
        orderBy:{
            createdAt: "desc"
        },
        select:{
            id:true,
            title:true,
            slug:true,
            desc:true,
            color:true,
            iconName:true,
            iconLib:true,
        }
    });

    return data.map(category => ({
        ...category,
        color: (category.color ?? "muted") as SemanticColor,
        iconLib: category.iconLib ?? "lucide",
        iconName: category.iconName ?? undefined,
    }));;
}

export type CategoryType = Awaited <ReturnType<typeof getAllCategories>>[0];
