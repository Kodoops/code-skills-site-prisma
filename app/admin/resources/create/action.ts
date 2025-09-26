"use server";

import {resourceSchema, ResourceSchema} from "@/lib/zodSchemas";
import {prisma} from "@/lib/db";
import {ApiResponseType} from "@/lib/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createResource(values: ResourceSchema): Promise<ApiResponseType> {

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

        const validation = resourceSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.resource.create({
            data: {
                title: validation.data.title,
                description: validation.data.description,
                fileKey: validation.data.fileKey,
                type: validation.data.type,
                url: validation.data.url,
                user: {
                    connect: { id: session?.user.id as string }
                },
            }
        });

        return {
            status: "success",
            message: "Resource created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create resource"
        };
    }

}
