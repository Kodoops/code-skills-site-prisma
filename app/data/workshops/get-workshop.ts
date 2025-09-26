import "server-only";

import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { WorkshopType} from "@/lib/types";

export async function getWorkshop(slug: string) : Promise<WorkshopType> {

    const workshop = await prisma.workshop.findUnique({
        where: {
            slug: slug,
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
            statement:true,
            statementVideoKey:true,
            statementsStartFileKey:true,
            statementsStartFileUrl:true,
            solution:true,
            solutionVideoKey:true,
            solutionFileKey:true,
            solutionFileUrl:true,
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


    if(!workshop) return notFound();

    return {
        ...workshop,
        createdAt: workshop.createdAt.toISOString(),
        updatedAt: workshop.updatedAt.toISOString(),

    };
}

