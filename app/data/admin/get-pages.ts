import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {PageType} from "@/lib/db/types";


export async function adminGetPages() : Promise<PageType []>{

    await requireAdmin();


    const data = await prisma.page.findMany({

        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            type: true,
            createdAt: true,
            updatedAt: true,
        }
    });


    return  data.map(item=>({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))
}

