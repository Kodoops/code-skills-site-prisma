import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { WorkshopType} from "@/lib/types";


export async function adminGetWorkshop(id: string) : Promise<WorkshopType | null> {

    await requireAdmin();

    if (!id) return null;

    const data = await prisma.workshop.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description:true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            createdAt:true,
            updatedAt:true,
            promotions: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            color: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            },
            statement: true,
            statementsStartFileKey: true,
            statementsStartFileUrl: true,
            statementVideoKey: true,
            solution: true,
            solutionFileKey: true,
            solutionFileUrl: true,
            solutionVideoKey: true,
            prerequisites: {
                select: {
                    prerequisite:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },
            objectives: {
                select: {
                    objective:{
                        select: {
                            id: true,
                            content: true,
                        }
                    }
                }
            },

        }
    });

    if (!data) {
        return notFound();
    }

    return {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
        tags: data.tags.map(tag=>({
            ...tag,
        })),
    };
}

