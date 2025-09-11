import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";


export async function adminGetCategory(id: string) {

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
            courses: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export type AdminCategorySingularType = Awaited<ReturnType<typeof adminGetCategory>>;
