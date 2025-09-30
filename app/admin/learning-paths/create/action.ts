"use server";

import {courseSchema, learningPathSchema, LearningPathSchema} from "@/lib/db/zodSchemas";
import {prisma} from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";
import {requireAdmin} from "@/app/data/admin/require-admin";
import arcjet from "@/lib/providers/arcjet";
import { fixedWindow, request} from "@arcjet/next";
import {stripe} from "@/lib/providers/stripe";
import {env} from "@/lib/env";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function createLearningPath(values: LearningPathSchema): Promise<ApiResponseType> {

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

        const validation = learningPathSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid form data"
            };
        }

        const data = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data:{
                currency: "eur",
                unit_amount: validation.data.price , // Price in Cents
            },
            images: validation.data.fileKey ? [`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${validation.data.fileKey}`] : undefined,
        })

        await prisma.learningPath.create({
            data: {
                title: validation.data.title,
                description: validation.data.description,
                fileKey: validation.data.fileKey,
                price: validation.data.price,
                duration: validation.data.duration,
                level:  validation.data.level,
                smallDescription: validation.data.smallDescription,
                slug: validation.data.slug,
                status: validation.data.status,
                user: {
                    connect: { id: session?.user.id as string }
                },
                stripePriceId: data.default_price as string,
            }
        });

        return {
            status: "success",
            message: "Learning Path created successfully"
        }
    } catch (e){
       // console.log(e)
        return {
            status: "error",
            message: "Failed to create learning path"
        };
    }

}
