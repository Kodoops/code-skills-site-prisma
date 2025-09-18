import { prisma } from "@/lib/db";

export async function getSocialLinksNotLinkedYet() {

    const company = await prisma.company.findFirst({
        select: {
            id: true,
        }
    });

    if(!company) return null;

    const unlinkedSocialLinks = await prisma.socialLink.findMany({
        where: {
            companySocialLink: {
                none: {
                    companyId: company?.id, // L'ID de la société cible
                },
            },
        },
    });

        if(!unlinkedSocialLinks) return null;

        return unlinkedSocialLinks.map(link => ({
            ...link,
            createdAt: link.createdAt.toISOString(),
            updatedAt: link.updatedAt.toISOString(),
        }))
    }
