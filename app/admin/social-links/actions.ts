"use server";

import {prisma} from "@/lib/db";
import {ApiResponseType} from "@/lib/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import {fixedWindow, request} from "@arcjet/next";
import {companySocialLinkSchema, CompanySocialLinkSchema} from "@/lib/zodSchemas";
import {revalidatePath} from "next/cache";

const aj = arcjet

    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function addSocialLink(values: CompanySocialLinkSchema): Promise<ApiResponseType> {

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

        const validation = companySocialLinkSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const company = await prisma.company.findFirst();

        if(!company){
            return {
                status: "error",
                message: "Company not found"
            }
        }
        await prisma.companySocialLink.create({
            data: {
                companyId: company?.id,
                socialLinkId: validation.data.socialLinkId,
                url: validation.data.url as string,
            }
        });

        return {
            status: "success",
            message: "Social link attached to company successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to attach social link  to company"
        };
    }

}


export async function unlinkSocialNetwork(id:string): Promise<ApiResponseType> {

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


        const company = await prisma.company.findFirst();

        if(!company){
            return {
                status: "error",
                message: "Company not found"
            }
        }

        await prisma.companySocialLink.delete({
            where: {
                companyId_socialLinkId: {
                    companyId: company.id,
                    socialLinkId: id
                }
            }
        });

        revalidatePath('/admin/social-links')

        return {
            status: "success",
            message: "Social link removed from company successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to remove a social link from company"
        };
    }

}
