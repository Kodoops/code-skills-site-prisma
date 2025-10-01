"use server";

import { prisma } from "@/lib/db/db";
import {PageType} from "@/lib/db/types";
import {notFound} from "next/navigation";

export async function getPage(id:string):Promise<PageType> {

    const data = await  prisma.page.findUnique(
        {where: {slug: id}}
    );

    if(!data) return notFound();

    return {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
    };
}
