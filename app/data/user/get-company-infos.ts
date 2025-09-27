import {prisma} from "@/lib/db/db";
import {CompanyType} from "@/lib/db/types";

export async function getCompanyInfos() : Promise<CompanyType | null>{

    const company = await prisma.company.findFirst();

    if (!company) return null;

    return {
        ...company,
        createdAt: company.createdAt.toISOString(),
        updatedAt: company.updatedAt.toISOString(),
    };
}
