import {prisma} from "@/lib/db";
import {CompanyType} from "@/lib/types";

export async function getCompanyInfos() : Promise<CompanyType | null>{

    const company = await prisma.company.findFirst();

    if (!company) return null;

    return {
        id: company.id,
        name: company.name,
        address: company.address,
        postalCode: company.postalCode,
        city: company.city,
        country: company.country,
        email: company.email,
        phone: company.phone,
        siret: company.siret,
        vatNumber: company.vatNumber,
        logoUrl: company.logoUrl,
        createdAt: company.createdAt.toISOString(),
    };
}
