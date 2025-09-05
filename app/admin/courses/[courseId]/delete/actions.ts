
"use server";

import {requireAdmin} from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import {ApiResponse} from "@/lib/types";
import {revalidatePath} from "next/cache";
import arcjet from "@/lib/arcjet";
import {detectBot, fixedWindow, request} from "@arcjet/next";

const aj = arcjet
    /*.withRule(
        detectBot({
            mode: "LIVE",
            allow: [],
        })
    )*/
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function deleteCourse(courseId: string) :Promise<ApiResponse>{

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

        await prisma.course.delete({
            where: {
                id: courseId
            },
        })

        revalidatePath(`/admin/courses`)

        return{
            status: "success",
            message: "Course deleted successfully"
        }
    }catch(e) {
        console.log(e)
        return{
            status: "error",
            message: "Failed to delete course"
        }
    }

}
