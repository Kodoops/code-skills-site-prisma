"use server";

import { DomainSchema, domainSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";

const aj = arcjet

    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createDomain(values: DomainSchema): Promise<ApiResponseType> {

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

        const validation = domainSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        await prisma.domain.create({
            data: {
                ...validation.data,
            }
        });

        return {
            status: "success",
            message: "Domain created successfully"
        }
    } catch (e){
        console.log(e   )
        return {
            status: "error",
            message: "Failed to create domain"
        };
    }

}
