"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import {
    ApiResponseType,
} from "@/lib/types";
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

export async function deleteResourcePermanently(resourceId: string) :Promise<ApiResponseType>{

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

        const resource = await prisma.resource.findUnique({
            where: {
                id: resourceId
            },
            select: {
                id: true,
                courseResources:true,
                lessonResources:true,
                workshopResources: true,
                learningPathResources: true,
                learningPathItems: true,
            }
        })

        if(resource && (resource?.learningPathItems.length > 0
            || resource?.learningPathResources.length > 0
            || resource?.workshopResources.length > 0
            || resource?.courseResources.length > 0
            || resource?.lessonResources.length > 0
        ) ){
            return {
                status: "error",
                message: "You can't delete a resource that is linked to one or more product items."
            }
        }

        await prisma.resource.delete({
            where: {
                id: resourceId
            },
        })

        revalidatePath(`/admin/resources`)

        return{
            status: "success",
            message: "Resource deleted successfully"
        }
    }catch {
        return{
            status: "error",
            message: "Failed to delete resource"
        }
    }

}
