import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {notFound} from "next/navigation";
import {FeaturedType} from "@/lib/db/types";


export async function adminGetFeature(id: string):Promise<FeaturedType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.feature.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            desc: true,
            iconLib:true,
            iconName: true,
            color: true,
        }
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        color:data.color ?? undefined,
        iconName:data.iconName ?? undefined,
        iconLib:data.iconLib ?? undefined,
    };
}

