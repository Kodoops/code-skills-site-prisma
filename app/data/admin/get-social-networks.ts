import "server-only"

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {SocialLinkType} from "@/lib/types";


export async function adminGetSocialNetworks() : Promise<SocialLinkType []>{

    await requireAdmin();


    const data = await prisma.socialLink.findMany({

        select: {
            id: true,
            name: true,
            iconLib:true,
            iconName: true,
            createdAt: true,
            updatedAt: true,
        }
    });


    return  data.map(item=>({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }))
}

