import { prisma } from "@/lib/db/db";

export async function getCompanySocialLinks() {

    const company = await prisma.company.findFirst({
        select: {
            id: true,
        }
    });

    if(!company) return null;

    const links = await prisma.company.findUnique({
        where: { id: company?.id },
        include: {
            companySocialLink: {
                include: {
                    socialLink: true // récupère le nom, icône, etc.
                }
            }
        }
    })

        if(!links) return null;

        return links.companySocialLink.map(link => ({
            ...link,
            createdAt: link.createdAt.toISOString(),
            updatedAt: link.updatedAt.toISOString(),
        }))  ?? []
    }
