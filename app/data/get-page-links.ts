import {prisma} from "@/lib/db/db";

export async function getPageLinks(type: string) {

    const data = await prisma.page.findMany({
        where: {
            type: type,
        }
    })

    const datamap = data.map(item => ({

        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
    }));

    return datamap;
}
