import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {SimpleCategory} from "@/lib/db/models";


export async function adminGetCategory(id: string) : Promise<SimpleCategory | null>{

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.category.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            desc: true,
            iconLib:true,
            iconName: true,
            color: true,
            createdAt: true,
            updatedAt: true,
            domain: true,

        }
    });

    if (!data) {
        return notFound();
    }

    return  {
        ...data,
        createdAt: data.createdAt.toString(),
        updatedAt: data.updatedAt.toString(),
        domain: {
            ...data.domain,
            categories:[],
            createdAt: data.createdAt.toString(),
            updatedAt: data.updatedAt.toString(),
        },

    };
}

