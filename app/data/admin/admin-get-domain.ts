import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {SimpleDomain} from "@/lib/db/models";


export async function adminGetDomain(id: string) : Promise<SimpleDomain | null>{

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.domain.findUnique({
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
            categories: true,
        }
    });

    if (!data) {
        return notFound();
    }

    return  {
        ...data,
        createdAt: data.createdAt.toString(),
        updatedAt: data.updatedAt.toString(),
    };
}

