"use server";

import {prisma} from "@/lib/db";
import {ApiResponse} from "@/lib/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { fixedWindow, request} from "@arcjet/next";
import {revalidatePath} from "next/cache";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteTag(id: string): Promise<ApiResponse> {

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

        await prisma.tag.delete({
            where: { id: id },
        });

        revalidatePath(`/admin/tags`);

        return {
            status: "success",
            message: "Tag deleted successfully"
        }
    } catch{
        return {
            status: "error",
            message: "Failed to delete tag"
        };
    }

}
