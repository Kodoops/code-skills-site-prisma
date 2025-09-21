
"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import {ApiResponseType} from "@/lib/types";
import {revalidatePath} from "next/cache";
import arcjet from "@/lib/arcjet";
import {fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteWorkshopSoftly(workshopId: string) :Promise<ApiResponseType>{

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


      await prisma.workshop.update({
            where: { id: workshopId },
            data: { deletedAt: new Date() },
        });

        revalidatePath(`/admin/workshops`)

        return{
            status: "success",
            message: "Workshop deleted successfully"
        }
    }catch {
        return{
            status: "error",
            message: "Failed to delete workshop"
        }
    }

}



export async function deleteWorkshopPermanently(workshopId: string) :Promise<ApiResponseType>{

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

        await prisma.workshop.delete({
            where: {
                id: workshopId
            },
        })

        revalidatePath(`/admin/workshops`)

        return{
            status: "success",
            message: "Workshop deleted successfully"
        }
    }catch {
        return{
            status: "error",
            message: "Failed to delete Workshop"
        }
    }

}
