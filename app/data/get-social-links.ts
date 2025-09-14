import { prisma } from "@/lib/db";

export async function getSocialLinks() {

        return await prisma.socialLink.findMany({
            orderBy: {
                createdAt: "asc"
            }
        });
    }
