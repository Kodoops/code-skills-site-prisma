"use server";

import { prisma } from "@/lib/db/db";
import {ApiResponseType} from "@/lib/db/types";

export async function updatePlanOptions(planId: string, options: string[]) : Promise<ApiResponseType> {
    try {
        await prisma.subscriptionPlan.update({
            where: { id: planId },
            data: {
                options, // si c’est un champ JSON[] ou Text[] dans ton modèle Prisma
            },
        });

        return { status: "success", message: "Options mises à jour avec succès" };
    } catch (error: any) {
        return { status: "error", message: "Erreur lors de la mise à jour" };
    }
}
