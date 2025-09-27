import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";
import {DomainType} from "@/lib/db/types";

export async function adminGetDomains(): Promise<DomainType[]> {

    await requireAdmin();

    const rawData = await prisma.domain.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            slug: true,
            desc: true,
            color: true,
            iconName: true,
            iconLib: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return rawData.map(item => ({
          ...item,
            categories: [],
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        })
    );
}

