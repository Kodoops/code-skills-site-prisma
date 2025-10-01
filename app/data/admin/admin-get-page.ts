import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {PageType} from "@/lib/db/types";


export async function adminGetPage(id: string) : Promise<PageType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.page.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            content:true,
            slug: true,
            type: true,
            createdAt:true,
            updatedAt:true,
        }
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
    };
}

