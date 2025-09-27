"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {ApiResponseType} from "@/lib/db/types";
import {
    companySchema,
    CompanySchema,
} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import arcjet from "@/lib/providers/arcjet";
import {fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createCompanyInfos(values: CompanySchema): Promise<ApiResponseType> {

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

        const result = companySchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const company = await prisma.company.findFirst();

        if(company){
            return {
                status: "error",
                message: "Company already exist !"
            }
        }
        await prisma.company.create({
            data: {
                ...result.data,
                email: result.data.email!,
            }
        })

        return {
            status: "success",
            message: "Company Information's updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update Company Information's"
        }
    }
}


export async function updateCompanyInfos(values: CompanySchema): Promise<ApiResponseType> {

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

        const result = companySchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const company = await prisma.company.findFirst();

        if(!company){
            return {
                status: "error",
                message: "Company not found !"
            }
        }
        await prisma.company.update({
            where: {
                id: company.id,
            },
            data: {
                ...result.data,
            }
        })

        return {
            status: "success",
            message: "Company Information's updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Fail to update Company Information's"
        }
    }
}
