import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db/db";

export async function adminGetDashboardStats() {

    await requireAdmin();

    const [totalSignUps, totalCustomers, totalCourses, totalLessons, totalsLearningPaths] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                enrollment:{
                    some:{}
                }
            }}),
        prisma.course.count(),
        prisma.lesson.count(),
        prisma.learningPath.count(),
    ]);

    return {
        totalSignUps, totalCustomers, totalCourses, totalLessons, totalsLearningPaths,
    }
}
