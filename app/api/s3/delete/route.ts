import {NextResponse} from "next/server";
import {DeleteObjectCommand} from "@aws-sdk/client-s3";
import {S3} from "@/lib/S3Client";
import arcjet from "@/lib/arcjet";
import {detectBot, fixedWindow} from "@arcjet/next";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {requireAdmin} from "@/app/data/admin/require-admin";

const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function DELETE(request: Request) {

    const session = await requireAdmin();
    try {
        const decision = await aj.protect(request,{fingerprint: session?.user.id as string} );

        if(decision.isDenied()){
            return NextResponse.json(
                {error: "Too many requests. Please try again in a minute"},
                {status: 429}
            )
        }
        const body = await request.json();
        const key = body.key;

        if (!key) {
            return NextResponse.json(
                {error: "Missing or Invalid object Key"},
                {status: 400}
            );
        }
        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key
        });
        await S3.send(command);
        return NextResponse.json({message: "Object Deleted Successfully"}, {status: 200});
    } catch {
        return NextResponse.json(
            {error: "Missing or Invalid object Key"},
            {status: 400}
        );
    }
}
