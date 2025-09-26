import "server-only";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";

export async function userGetDashboardStats() {
    const user = await requireUser();

    const [totalEnrollments, totalPathsEnrollments, totalCoursesEnrollments, totalWorkshopsEnrollments] =
        await Promise.all([
            prisma.enrollment.count({
                where: { userId: user.id },
            }),
            prisma.enrollment.count({
                where: {
                    userId: user.id,
                    learningPathId: { not: null },
                },
            }),
            prisma.enrollment.count({
                where: {
                    userId: user.id,
                    courseId: { not: null },
                },
            }),
            prisma.enrollment.count({
                where: {
                    userId: user.id,
                    workshopId: { not: null },
                },
            }),
        ]);

    return {
        totalEnrollments,
        totalPathsEnrollments,
        totalCoursesEnrollments,
        totalWorkshopsEnrollments,
    };
}
