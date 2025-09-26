"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/types";
import {
    objectiveRequisiteSchema,
    ObjectiveRequisiteSchema,
    workshopSchema,
    WorkshopSchema, workshopSolutionSchema, WorkshopSolutionSchema, workshopStatementSchema, WorkshopStatementSchema
} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";
import arcjet from "@/lib/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {revalidatePath} from "next/cache";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function updateWorkshop(data: WorkshopSchema, workshopId: string): Promise<ApiResponseType> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            } else {
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const result = workshopSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.workshop.update({
            where: {
                id: workshopId,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Workshop updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update workshop"
        }
    }
}

export async function updateWorkshopStatement(data: WorkshopStatementSchema, workshopId: string): Promise<ApiResponseType> {
    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            } else {
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const result = workshopStatementSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }


        await prisma.workshop.update({
            where: {
                id: workshopId,
            },
            data: {
                ...result.data,
            },
        })

        return {
            status: "success",
            message: "Workshop Statement updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update workshop statement"
        }
    }
}

export async function updateWorkshopSolution(data: WorkshopSolutionSchema, workshopId: string): Promise<ApiResponseType> {
    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            } else {
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        const result = workshopSolutionSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.workshop.update({
            where: {
                id: workshopId,
            },
            data: {
                ...result.data,
            },
        })

        return {
            status: "success",
            message: "Workshop solution updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update workshop solution"
        }
    }
}


export async function updateWorkshopTags(workshopId: string, tagIds: string[]): Promise<ApiResponseType> {

    await requireAdmin();

    try {
        await prisma.$transaction([
             prisma.workshopTag.deleteMany({
                where: {workshopId}
            }),

             prisma.workshopTag.createMany({
                data: tagIds.map(tagId => ({
                    workshopId,
                    tagId
                })),
                skipDuplicates: true
            }),
        ]);
        revalidatePath(`/admin/workshops/${workshopId}/edit`)

        return {
            status: "success",
            message: "Tags updated successfully"
        }
    } catch {

        return {
            status: "error",
            message: "Failed to update tags"
        }
    }
}

export async function addObjectiveToWorkshop(workshopId: string, data:ObjectiveRequisiteSchema): Promise<ApiResponseType> {
    await requireAdmin();

    const parsed = objectiveRequisiteSchema.safeParse(data);
    if (!parsed.success) {
        return {
            status: "error",
            message: "Invalid form data"
        };
    }

    const { content } = parsed.data;

    try {
        await prisma.objective.create({
            data: {
                content,
                workshops: {
                    create: { workshopId },
                },
            },
            include: {
                workshops: {
                    include: { workshop: true },
                },
            },
        });

        revalidatePath(`/admin/workshops/${workshopId}/edit`);

        return {
            status: "success",
            message: "Objective added successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Failed to add Objective"
        }
    }
}

export async function addRequisiteToWorkshop(workshopId: string, data:ObjectiveRequisiteSchema): Promise<ApiResponseType> {
    await requireAdmin();

    const parsed = objectiveRequisiteSchema.safeParse(data);
    if (!parsed.success) {
        return {
            status: "error",
            message: "Invalid form data"
        };
    }

    const { content } = parsed.data;

    try {
        await prisma.prerequisite.create({
            data: {
                content,
                workshops: {
                    create: { workshopId },
                },
            },
            include: {
                workshops: {
                    include: { workshop: true },
                },
            },
        });

        revalidatePath(`/admin/workshops/${workshopId}/edit`);

        return {
            status: "success",
            message: "Requisite added successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            status: "error",
            message: "Failed to add Requisite"
        }
    }
}

export async function removeRequisite(id: string, workshopId:string) :Promise<ApiResponseType>{

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            }else{
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        await prisma.workshopPrerequisite.delete({
            where: {
                workshopId_prerequisiteId: {
                    workshopId: workshopId,
                    prerequisiteId: id,
                },
            },
        });

        // Supprimer aussi le requisite de la table
        await prisma.prerequisite.delete({
            where: {
                id: id
            },
        })

        revalidatePath(`/admin/workshops/${workshopId}/edit`)

        return{
            status: "success",
            message: "Requisite deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete requisite"
        }
    }

}

export async function removeObjective(id: string, workshopId:string) :Promise<ApiResponseType>{

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: session?.user.id as string});

        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return {
                    status: 'error',
                    message: "Looks like you are making too many requests. Please try again in a minute",
                }
            }else{
                return {
                    status: 'error',
                    message: "you are a bot! , if you are human please try again in a minute or contact support",
                }
            }
        }

        await prisma.workshopObjective.delete({
            where: {
                workshopId_objectiveId: {
                    workshopId: workshopId,
                    objectiveId: id,
                },
            },
        });

        // Supprimer aussi l'objectif de la table
        await prisma.objective.delete({
            where: {
                id: id
            },
        })

        revalidatePath(`/admin/workshops/${workshopId}/edit`)

        return{
            status: "success",
            message: "Objective deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete objective"
        }
    }

}
