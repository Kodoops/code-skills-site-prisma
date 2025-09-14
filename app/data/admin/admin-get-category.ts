import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { CategoryWithCourses} from "@/lib/types";


export async function adminGetCategory(id: string) : Promise<CategoryWithCourses | null>{

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

    return  {
        ...data,
        createdAt: data.createdAt.toString(),
        updatedAt: data.updatedAt.toString()
    };
}

//export type AdminCategorySingularType = Awaited<ReturnType<typeof adminGetCategory>>;
